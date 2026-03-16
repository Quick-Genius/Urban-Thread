# UrbanThread E-Commerce Platform - Low-Level Design (Part 2)

## 7. Background Jobs

### 7.1 Message Queue Implementation

```javascript
// services/queueService.js
const amqp = require('amqplib');

class QueueService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queues = {
      ORDER_PROCESSING: 'order-processing',
      EMAIL_NOTIFICATIONS: 'email-notifications',
      INVENTORY_UPDATES: 'inventory-updates',
      ANALYTICS_EVENTS: 'analytics-events'
    };
  }

  async connect() {
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      // Declare queues
      for (const queue of Object.values(this.queues)) {
        await this.channel.assertQueue(queue, {
          durable: true,
          arguments: {
            'x-message-ttl': 86400000, // 24 hours
            'x-dead-letter-exchange': 'dlx',
            'x-dead-letter-routing-key': `${queue}.dlq`
          }
        });
      }

      console.log('✅ Connected to RabbitMQ');
    } catch (error) {
      console.error('❌ RabbitMQ connection error:', error);
      setTimeout(() => this.connect(), 5000); // Retry after 5s
    }
  }

  async publish(queue, message, options = {}) {
    try {
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          ...options
        }
      );
      return true;
    } catch (error) {
      console.error('Queue publish error:', error);
      return false;
    }
  }

  async consume(queue, handler, options = {}) {
    try {
      await this.channel.consume(
        queue,
        async (msg) => {
          if (msg) {
            try {
              const content = JSON.parse(msg.content.toString());
              await handler(content);
              this.channel.ack(msg);
            } catch (error) {
              console.error('Message processing error:', error);
              // Reject and requeue (max 3 times)
              const retryCount = (msg.properties.headers['x-retry-count'] || 0) + 1;
              if (retryCount < 3) {
                this.channel.nack(msg, false, true);
              } else {
                this.channel.nack(msg, false, false); // Send to DLQ
              }
            }
          }
        },
        {
          noAck: false,
          ...options
        }
      );
    } catch (error) {
      console.error('Queue consume error:', error);
    }
  }
}

module.exports = new QueueService();
```


### 7.2 Background Workers

```javascript
// workers/orderWorker.js
const queueService = require('../services/queueService');
const paymentService = require('../services/paymentService');
const emailService = require('../services/emailService');
const Order = require('../models/Order');

class OrderWorker {
  async start() {
    await queueService.consume(
      queueService.queues.ORDER_PROCESSING,
      this.processOrder.bind(this)
    );
    console.log('✅ Order worker started');
  }

  async processOrder(data) {
    const { orderId, userId, total, paymentMethod } = data;

    try {
      console.log(`Processing order: ${orderId}`);

      // If payment method is Razorpay, create payment order
      if (paymentMethod === 'razorpay') {
        await paymentService.createOrder(total, 'INR', orderId);
      }

      // Send order confirmation email
      await queueService.publish(
        queueService.queues.EMAIL_NOTIFICATIONS,
        {
          type: 'ORDER_CONFIRMATION',
          orderId,
          userId
        }
      );

      // Track analytics
      await queueService.publish(
        queueService.queues.ANALYTICS_EVENTS,
        {
          event: 'order_created',
          userId,
          orderId,
          total,
          timestamp: new Date()
        }
      );

      console.log(`✅ Order processed: ${orderId}`);
    } catch (error) {
      console.error(`❌ Order processing failed: ${orderId}`, error);
      throw error; // Will be retried
    }
  }
}

// workers/emailWorker.js
class EmailWorker {
  async start() {
    await queueService.consume(
      queueService.queues.EMAIL_NOTIFICATIONS,
      this.sendEmail.bind(this)
    );
    console.log('✅ Email worker started');
  }

  async sendEmail(data) {
    const { type, orderId, userId } = data;

    try {
      const user = await User.findById(userId);
      const order = await Order.findById(orderId).populate('items.product');

      switch (type) {
        case 'ORDER_CONFIRMATION':
          await emailService.sendOrderConfirmation(user.email, order);
          break;
        case 'ORDER_SHIPPED':
          await emailService.sendShippingNotification(user.email, order);
          break;
        case 'ORDER_DELIVERED':
          await emailService.sendDeliveryConfirmation(user.email, order);
          break;
        default:
          console.warn(`Unknown email type: ${type}`);
      }

      console.log(`✅ Email sent: ${type} to ${user.email}`);
    } catch (error) {
      console.error(`❌ Email sending failed:`, error);
      throw error;
    }
  }
}

// Start workers
if (require.main === module) {
  (async () => {
    await queueService.connect();
    
    const orderWorker = new OrderWorker();
    const emailWorker = new EmailWorker();
    
    await Promise.all([
      orderWorker.start(),
      emailWorker.start()
    ]);
  })();
}
```


## 8. Error Handling

### 8.1 Custom Error Classes

```javascript
// utils/errors.js
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, 'CONFLICT');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError
};
```

### 8.2 Global Error Handler

```javascript
// middleware/errorHandler.js
const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user?._id
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = new AppError('Resource not found', 404, 'INVALID_ID');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error = new AppError(
      `${field} already exists`,
      409,
      'DUPLICATE_FIELD'
    );
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    error = new ValidationError('Validation failed', details);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token', 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expired', 401, 'TOKEN_EXPIRED');
  }

  // Send error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'Internal server error',
      ...(error.details && { details: error.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;
```


## 9. Code Structure

### 9.1 Recommended Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── redis.js
│   │   ├── queue.js
│   │   └── imagekit.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── ...
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── ...
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── ...
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── rateLimit.js
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── services/
│   │   ├── paymentService.js
│   │   ├── emailService.js
│   │   ├── uploadService.js
│   │   ├── cacheService.js
│   │   └── queueService.js
│   ├── workers/
│   │   ├── orderWorker.js
│   │   ├── emailWorker.js
│   │   └── analyticsWorker.js
│   ├── utils/
│   │   ├── errors.js
│   │   ├── jwt.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   └── app.js
├── .env
├── .env.example
├── package.json
├── Dockerfile
└── docker-compose.yml
```

### 9.2 Environment Configuration

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```


## 10. Performance Optimizations

### 10.1 Database Query Optimization

```javascript
// Bad: N+1 query problem
const orders = await Order.find({ user: userId });
for (const order of orders) {
  const product = await Product.findById(order.product); // N queries
}

// Good: Use populate
const orders = await Order.find({ user: userId })
  .populate('items.product', 'name price images')
  .lean();

// Better: Use aggregation for complex queries
const orderStats = await Order.aggregate([
  { $match: { user: mongoose.Types.ObjectId(userId) } },
  {
    $group: {
      _id: '$status',
      count: { $sum: 1 },
      total: { $sum: '$total' }
    }
  }
]);

// Best: Use indexes and projection
const products = await Product.find({ category: 'men' })
  .select('name price images rating')
  .sort({ rating: -1 })
  .limit(20)
  .lean(); // Returns plain JS objects (faster)
```

### 10.2 Rate Limiting Implementation

```javascript
// middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');

// General API rate limiter
const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:'
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message: 'Too many login attempts, please try again after 15 minutes'
    }
  }
});

// Payment limiter
const paymentLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:payment:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 payment attempts per hour
  message: {
    success: false,
    error: {
      code: 'PAYMENT_RATE_LIMIT',
      message: 'Too many payment attempts'
    }
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  paymentLimiter
};
```

### 10.3 Response Compression

```javascript
// app.js
const compression = require('compression');

// Compress all responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (0-9)
  threshold: 1024 // Only compress responses > 1KB
}));
```

### 10.4 Request Validation

```javascript
// middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    throw new ValidationError('Validation failed', details);
  }
  next();
};

// Product validation rules
const productValidation = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage('Name must be 3-200 characters'),
    body('price')
      .isFloat({ min: 0, max: 1000000 })
      .withMessage('Price must be between 0 and 1,000,000'),
    body('category')
      .isIn(['men', 'women', 'kids', 'accessories'])
      .withMessage('Invalid category'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a positive integer'),
    body('images')
      .isArray({ min: 1, max: 10 })
      .withMessage('Must provide 1-10 images'),
    validate
  ],
  
  update: [
    param('id').isMongoId().withMessage('Invalid product ID'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be positive'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Stock must be positive'),
    validate
  ]
};

// Order validation rules
const orderValidation = {
  create: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must have at least one item'),
    body('items.*.product')
      .isMongoId()
      .withMessage('Invalid product ID'),
    body('items.*.quantity')
      .isInt({ min: 1, max: 10 })
      .withMessage('Quantity must be 1-10'),
    body('shippingAddress.fullName')
      .trim()
      .notEmpty()
      .withMessage('Full name is required'),
    body('shippingAddress.phone')
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
      .withMessage('Invalid phone number'),
    body('shippingAddress.pinCode')
      .matches(/^[0-9]{6}$/)
      .withMessage('Invalid PIN code'),
    body('paymentMethod')
      .isIn(['razorpay', 'cod'])
      .withMessage('Invalid payment method'),
    validate
  ]
};

module.exports = {
  validate,
  productValidation,
  orderValidation
};
```


## 11. Monitoring & Logging

### 11.1 Request Logging

```javascript
// middleware/logger.js
const winston = require('winston');
const morgan = require('morgan');

// Winston logger configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'urbanthread-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Morgan HTTP request logger
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  }
);

// Request context logger
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?._id
    });
  });
  
  next();
};

module.exports = {
  logger,
  morganMiddleware,
  requestLogger
};
```

### 11.2 Performance Monitoring

```javascript
// middleware/metrics.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new prometheus.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  activeConnections.inc();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      duration
    );
    
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode
    });
    
    activeConnections.dec();
  });

  next();
};

// Metrics endpoint
const metricsEndpoint = async (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(await prometheus.register.metrics());
};

module.exports = {
  metricsMiddleware,
  metricsEndpoint
};
```

## 12. Security Best Practices

### 12.1 Security Headers

```javascript
// middleware/security.js
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const securityMiddleware = (app) => {
  // Set security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "checkout.razorpay.com"],
        imgSrc: ["'self'", "data:", "https://ik.imagekit.io"],
        connectSrc: ["'self'", "https://api.razorpay.com"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));

  // Sanitize data against NoSQL injection
  app.use(mongoSanitize());

  // Prevent XSS attacks
  app.use(xss());

  // Prevent HTTP parameter pollution
  app.use(hpp({
    whitelist: ['price', 'rating', 'sizes']
  }));
};

module.exports = securityMiddleware;
```

## 13. Testing Strategy

### 13.1 Unit Tests Example

```javascript
// tests/unit/productService.test.js
const { expect } = require('chai');
const sinon = require('sinon');
const Product = require('../../models/Product');
const productService = require('../../services/productService');

describe('Product Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', price: 100 },
        { _id: '2', name: 'Product 2', price: 200 }
      ];

      sinon.stub(Product, 'find').returns({
        sort: sinon.stub().returnsThis(),
        skip: sinon.stub().returnsThis(),
        limit: sinon.stub().returnsThis(),
        select: sinon.stub().returnsThis(),
        lean: sinon.stub().resolves(mockProducts)
      });

      sinon.stub(Product, 'countDocuments').resolves(2);

      const result = await productService.getProducts({ page: 1, limit: 20 });

      expect(result.products).to.have.lengthOf(2);
      expect(result.pagination.total).to.equal(2);
    });
  });
});
```

### 13.2 Load Testing Script

```javascript
// tests/load/loadTest.js
const autocannon = require('autocannon');

const runLoadTest = () => {
  const instance = autocannon({
    url: 'http://localhost:5001',
    connections: 100, // Concurrent connections
    duration: 60, // Test duration in seconds
    pipelining: 10,
    requests: [
      {
        method: 'GET',
        path: '/api/v1/products?page=1&limit=20'
      },
      {
        method: 'GET',
        path: '/api/v1/products/507f1f77bcf86cd799439011'
      }
    ]
  }, (err, result) => {
    if (err) {
      console.error('Load test failed:', err);
      return;
    }
    console.log('Load test results:', result);
  });

  autocannon.track(instance);
};

runLoadTest();
```

## 14. Deployment Configuration

### 14.1 Dockerfile

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Production image
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy from builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 5001

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node healthcheck.js

CMD ["node", "server.js"]
```

### 14.2 Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - REDIS_HOST=redis
      - RABBITMQ_URL=amqp://rabbitmq:5672
    depends_on:
      - redis
      - rabbitmq
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    restart: unless-stopped

  rabbitmq:
    image: rabbitmq:3-management-alpine
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=admin
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    restart: unless-stopped

volumes:
  redis-data:
  rabbitmq-data:
```

---

## Summary

This LLD provides detailed implementation guidelines for:
- API design with validation and error handling
- Database optimization with indexes and caching
- Authentication with JWT and refresh tokens
- Payment processing with Razorpay
- Background job processing with message queues
- Performance optimizations and monitoring
- Security best practices
- Testing and deployment strategies

Follow these patterns to build a production-ready, scalable e-commerce platform.
