# UrbanThread E-Commerce Platform - Low-Level Design (LLD)

## Table of Contents
1. [API Specifications](#api-specifications)
2. [Database Schema](#database-schema)
3. [Caching Strategy](#caching-strategy)
4. [Authentication & Authorization](#authentication--authorization)
5. [Payment Processing](#payment-processing)
6. [File Upload & Storage](#file-upload--storage)
7. [Background Jobs](#background-jobs)
8. [Error Handling](#error-handling)
9. [Code Structure](#code-structure)
10. [Performance Optimizations](#performance-optimizations)

---

## 1. API Specifications

### 1.1 RESTful API Design Principles
- Use HTTP methods correctly (GET, POST, PUT, DELETE, PATCH)
- Versioned endpoints: `/api/v1/...`
- Consistent response format
- Proper HTTP status codes
- Pagination for list endpoints
- Filtering, sorting, searching capabilities

### 1.2 Standard Response Format
```javascript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```


### 1.3 Product API Endpoints (Detailed)

#### GET /api/v1/products
**Purpose**: List products with filtering, sorting, pagination
**Query Parameters**:
```javascript
{
  page: number,           // Default: 1
  limit: number,          // Default: 20, Max: 100
  category: string,       // men, women, kids, accessories
  minPrice: number,
  maxPrice: number,
  sizes: string[],        // ['S', 'M', 'L']
  rating: number,         // Minimum rating (0-5)
  search: string,         // Text search
  sort: string,           // price_asc, price_desc, rating, newest, popular
  inStock: boolean        // Only show in-stock items
}
```

**Response**:
```javascript
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Classic Cotton T-Shirt",
        "price": 599,
        "originalPrice": 999,
        "discount": 40,
        "category": "men",
        "images": ["url1", "url2"],
        "rating": 4.5,
        "numReviews": 128,
        "stock": 45,
        "sizes": ["S", "M", "L", "XL"],
        "isInStock": true
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

**Implementation**:
```javascript
// controllers/productController.js
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      sizes,
      rating,
      search,
      sort = 'newest',
      inStock
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (sizes) query.sizes = { $in: Array.isArray(sizes) ? sizes : [sizes] };
    if (rating) query.rating = { $gte: Number(rating) };
    if (inStock === 'true') query.stock = { $gt: 0 };
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort
    const sortOptions = {
      'price_asc': { price: 1 },
      'price_desc': { price: -1 },
      'rating': { rating: -1 },
      'newest': { createdAt: -1 },
      'popular': { sold: -1 }
    };
    const sortQuery = sortOptions[sort] || sortOptions.newest;

    // Check cache first
    const cacheKey = `products:${JSON.stringify(req.query)}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(Number(limit))
        .select('-__v')
        .lean(),
      Product.countDocuments(query)
    ]);

    const response = {
      success: true,
      data: { products },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    next(error);
  }
};
```


### 1.4 Order API Endpoints (Detailed)

#### POST /api/v1/orders
**Purpose**: Create new order
**Request Body**:
```javascript
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "size": "M"
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+91 9876543210",
    "addressLine1": "123 Main St",
    "addressLine2": "Apt 4B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pinCode": "400001"
  },
  "paymentMethod": "razorpay",
  "promoCode": "FIRST2024"
}
```

**Implementation**:
```javascript
// controllers/orderController.js
exports.createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, shippingAddress, paymentMethod, promoCode } = req.body;
    const userId = req.user._id;

    // Validate items and check stock
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).session(session);

    if (products.length !== items.length) {
      throw new Error('Some products not found');
    }

    // Build order items with product snapshots
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = products.find(p => p._id.toString() === item.product);
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        size: item.size,
        quantity: item.quantity
      });

      subtotal += product.price * item.quantity;

      // Update stock atomically
      await Product.findByIdAndUpdate(
        product._id,
        {
          $inc: { stock: -item.quantity, sold: item.quantity }
        },
        { session }
      );
    }

    // Calculate totals
    const shippingCost = subtotal > 999 ? 0 : 99;
    let discount = 0;

    // Apply promo code
    if (promoCode) {
      const promo = await validatePromoCode(promoCode, userId);
      if (promo) {
        discount = promo.discountAmount || (subtotal * promo.discountPercent / 100);
      }
    }

    const total = subtotal + shippingCost - discount;

    // Create order
    const order = await Order.create([{
      user: userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      discount,
      total,
      status: 'Processing',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
    }], { session });

    await session.commitTransaction();

    // Publish to message queue for async processing
    await publishToQueue('order-processing', {
      orderId: order[0]._id,
      userId,
      total,
      paymentMethod
    });

    // Clear user's cart cache
    await redis.del(`cart:${userId}`);

    res.status(201).json({
      success: true,
      data: { order: order[0] },
      message: 'Order created successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
```


## 2. Database Schema (Detailed)

### 2.1 Indexes Strategy

```javascript
// Product Collection Indexes
db.products.createIndex({ category: 1, price: 1 });
db.products.createIndex({ rating: -1, numReviews: -1 });
db.products.createIndex({ createdAt: -1 });
db.products.createIndex({ sold: -1 });
db.products.createIndex({ sku: 1 }, { unique: true });
db.products.createIndex({ name: "text", description: "text" });
db.products.createIndex({ seller: 1, isActive: 1 });

// Order Collection Indexes
db.orders.createIndex({ user: 1, createdAt: -1 });
db.orders.createIndex({ status: 1, createdAt: -1 });
db.orders.createIndex({ paymentStatus: 1 });
db.orders.createIndex({ "items.product": 1 });

// User Collection Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ googleId: 1 }, { unique: true, sparse: true });
db.users.createIndex({ role: 1, isActive: 1 });

// Review Collection Indexes
db.reviews.createIndex({ product: 1, createdAt: -1 });
db.reviews.createIndex({ user: 1, product: 1 }, { unique: true });
db.reviews.createIndex({ rating: -1 });

// Cart Collection Indexes
db.carts.createIndex({ user: 1 }, { unique: true });

// Address Collection Indexes
db.addresses.createIndex({ user: 1, isDefault: -1 });
```

### 2.2 Data Validation Rules

```javascript
// Product Schema with Validation
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return v > 0 && v < 1000000;
      },
      message: 'Price must be between 0 and 1,000,000'
    }
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Stock must be an integer'
    }
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v && v.length > 0 && v.length <= 10;
      },
      message: 'Product must have 1-10 images'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields
productSchema.virtual('isInStock').get(function() {
  return this.stock > 0;
});

productSchema.virtual('discount').get(function() {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Pre-save middleware
productSchema.pre('save', async function(next) {
  // Generate SKU if not provided
  if (!this.sku) {
    this.sku = `${this.category.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Post-save middleware (update cache)
productSchema.post('save', async function(doc) {
  await redis.del(`product:${doc._id}`);
  await redis.del('products:*'); // Clear all product list caches
});
```


## 3. Caching Strategy

### 3.1 Redis Cache Implementation

```javascript
// utils/cache.js
const redis = require('redis');
const { promisify } = require('util');

class CacheService {
  constructor() {
    this.client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      retry_strategy: (options) => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('Redis connection refused');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Redis retry time exhausted');
        }
        if (options.attempt > 10) {
          return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
      }
    });

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.existsAsync = promisify(this.client.exists).bind(this.client);
  }

  // Get from cache
  async get(key) {
    try {
      const data = await this.getAsync(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Set in cache with TTL
  async set(key, value, ttl = 3600) {
    try {
      await this.setAsync(key, JSON.stringify(value), 'EX', ttl);
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  // Delete from cache
  async del(key) {
    try {
      await this.delAsync(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  // Delete multiple keys by pattern
  async delPattern(pattern) {
    try {
      const keys = await this.keysAsync(pattern);
      if (keys.length > 0) {
        await this.delAsync(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache delete pattern error:', error);
      return false;
    }
  }

  // Cache middleware
  cacheMiddleware(ttl = 300) {
    return async (req, res, next) => {
      const key = `cache:${req.originalUrl}`;
      
      try {
        const cached = await this.get(key);
        if (cached) {
          return res.json(cached);
        }

        // Override res.json to cache response
        const originalJson = res.json.bind(res);
        res.json = (data) => {
          this.set(key, data, ttl);
          return originalJson(data);
        };

        next();
      } catch (error) {
        next();
      }
    };
  }
}

module.exports = new CacheService();
```

### 3.2 Cache Keys Convention

```javascript
// Cache key patterns
const CACHE_KEYS = {
  // Products
  PRODUCT_LIST: (query) => `products:list:${JSON.stringify(query)}`,
  PRODUCT_DETAIL: (id) => `product:${id}`,
  PRODUCT_REVIEWS: (id) => `product:${id}:reviews`,
  
  // User
  USER_PROFILE: (id) => `user:${id}`,
  USER_CART: (id) => `cart:${id}`,
  USER_WISHLIST: (id) => `wishlist:${id}`,
  USER_ADDRESSES: (id) => `addresses:${id}`,
  
  // Orders
  USER_ORDERS: (userId, page) => `orders:user:${userId}:page:${page}`,
  ORDER_DETAIL: (id) => `order:${id}`,
  
  // Session
  USER_SESSION: (token) => `session:${token}`,
  
  // Rate limiting
  RATE_LIMIT: (ip, endpoint) => `ratelimit:${ip}:${endpoint}`
};

// TTL values (in seconds)
const CACHE_TTL = {
  PRODUCT_LIST: 300,      // 5 minutes
  PRODUCT_DETAIL: 600,    // 10 minutes
  USER_PROFILE: 1800,     // 30 minutes
  USER_CART: 86400,       // 24 hours
  USER_SESSION: 604800,   // 7 days
  RATE_LIMIT: 60          // 1 minute
};
```


## 4. Authentication & Authorization

### 4.1 JWT Implementation

```javascript
// utils/jwt.js
const jwt = require('jsonwebtoken');

class JWTService {
  // Generate access token (short-lived)
  generateAccessToken(userId, role) {
    return jwt.sign(
      { id: userId, role, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
  }

  // Generate refresh token (long-lived)
  generateRefreshToken(userId) {
    return jwt.sign(
      { id: userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  // Generate token pair
  generateTokenPair(userId, role) {
    return {
      accessToken: this.generateAccessToken(userId, role),
      refreshToken: this.generateRefreshToken(userId)
    };
  }
}

module.exports = new JWTService();
```

### 4.2 Enhanced Auth Middleware

```javascript
// middleware/auth.js
const jwt = require('../utils/jwt');
const User = require('../models/User');
const cache = require('../utils/cache');

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Not authorized to access this route'
        }
      });
    }

    // Verify token
    const decoded = jwt.verifyAccessToken(token);

    // Check if token is blacklisted (logout)
    const isBlacklisted = await cache.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REVOKED',
          message: 'Token has been revoked'
        }
      });
    }

    // Check cache first
    let user = await cache.get(`user:${decoded.id}`);
    
    if (!user) {
      user = await User.findById(decoded.id).select('-password').lean();
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }
      // Cache user for 30 minutes
      await cache.set(`user:${decoded.id}`, user, 1800);
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_DISABLED',
          message: 'Account has been disabled'
        }
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: error.message
      }
    });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `User role '${req.user.role}' is not authorized`
        }
      });
    }
    next();
  };
};

// Refresh token endpoint
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REFRESH_TOKEN',
          message: 'Refresh token is required'
        }
      });
    }

    // Verify refresh token
    const decoded = jwt.verifyRefreshToken(refreshToken);

    // Check if refresh token is blacklisted
    const isBlacklisted = await cache.get(`blacklist:${refreshToken}`);
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_REVOKED',
          message: 'Refresh token has been revoked'
        }
      });
    }

    // Get user
    const user = await User.findById(decoded.id).select('role');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_USER',
          message: 'User not found or inactive'
        }
      });
    }

    // Generate new token pair
    const tokens = jwt.generateTokenPair(user._id, user.role);

    // Blacklist old refresh token
    await cache.set(`blacklist:${refreshToken}`, true, 604800); // 7 days

    res.json({
      success: true,
      data: tokens
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_REFRESH_TOKEN',
        message: error.message
      }
    });
  }
};
```


## 5. Payment Processing (Razorpay)

### 5.1 Payment Flow Implementation

```javascript
// services/paymentService.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

class PaymentService {
  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // Create Razorpay order
  async createOrder(amount, currency = 'INR', orderId) {
    try {
      const options = {
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: `order_${orderId}`,
        notes: {
          orderId: orderId.toString()
        }
      };

      const razorpayOrder = await this.razorpay.orders.create(options);
      
      // Store razorpay order ID in database
      await Order.findByIdAndUpdate(orderId, {
        'paymentDetails.razorpay_order_id': razorpayOrder.id
      });

      return razorpayOrder;
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      throw new Error('Failed to create payment order');
    }
  }

  // Verify payment signature
  verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    return razorpaySignature === expectedSign;
  }

  // Process payment verification
  async verifyPayment(orderId, paymentData) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    // Verify signature
    const isValid = this.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      throw new Error('Invalid payment signature');
    }

    // Fetch payment details from Razorpay
    const payment = await this.razorpay.payments.fetch(razorpay_payment_id);

    // Update order
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: 'paid',
        'paymentDetails.razorpay_payment_id': razorpay_payment_id,
        'paymentDetails.razorpay_signature': razorpay_signature,
        'paymentDetails.paidAt': new Date(),
        'paymentDetails.transactionId': payment.id,
        status: 'Confirmed'
      },
      { new: true }
    );

    // Publish to queue for post-payment processing
    await publishToQueue('payment-success', {
      orderId: order._id,
      userId: order.user,
      amount: order.total,
      paymentId: razorpay_payment_id
    });

    return order;
  }

  // Handle payment failure
  async handlePaymentFailure(orderId, errorData) {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'failed',
      'paymentDetails.error': errorData
    });

    // Restore inventory
    const order = await Order.findById(orderId).populate('items.product');
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: item.quantity, sold: -item.quantity }
      });
    }
  }

  // Initiate refund
  async initiateRefund(orderId, amount, reason) {
    const order = await Order.findById(orderId);
    
    if (order.paymentStatus !== 'paid') {
      throw new Error('Order payment not completed');
    }

    const refund = await this.razorpay.payments.refund(
      order.paymentDetails.razorpay_payment_id,
      {
        amount: Math.round(amount * 100),
        notes: {
          orderId: orderId.toString(),
          reason
        }
      }
    );

    // Update order
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'refunded',
      'paymentDetails.refundId': refund.id,
      'paymentDetails.refundedAt': new Date(),
      'paymentDetails.refundAmount': amount,
      status: 'Cancelled'
    });

    return refund;
  }
}

module.exports = new PaymentService();
```
