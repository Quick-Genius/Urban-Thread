import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { clerkMiddleware } from '@clerk/express';

import logger from './utils/logger';
import prisma from './config/prisma';
import errorHandler from './middleware/errorHandler';
import { apiLimiter, upgradeToRedis } from './middleware/rateLimiter';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import reviewRoutes from './routes/reviewRoutes';
import addressRoutes from './routes/addressRoutes';
import adminRoutes from './routes/adminRoutes';
import uploadRoutes from './routes/uploadRoutes';
import paymentRoutes from './routes/paymentRoutes';

const app = express();

app.set('trust proxy', 1);

// Health check (before Clerk so it always responds)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: 'postgresql',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use(clerkMiddleware());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  }),
);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (origin === 'https://checkout.razorpay.com' || origin === 'https://api.razorpay.com') return callback(null, true);
      if (allowedOrigins.some((allowed) => origin === allowed || origin.startsWith(allowed))) {
        return callback(null, true);
      }
      logger.warn(`CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 86400,
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(compression());

if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: { write: (msg: string) => logger.info(msg.trim()) },
      skip: (req) => req.path === '/api/health',
    }),
  );
}

app.use('/api/', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: `Route ${_req.originalUrl} not found` });
});

app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5001', 10);

const startServer = async () => {
  if (!process.env.DATABASE_URL) {
    logger.error('DATABASE_URL is not set — cannot start server');
    process.exit(1);
  }

  await prisma.$connect();
  logger.info('PostgreSQL (Neon DB) connected via Prisma');

  const redisCache = await import('./config/redis');
  await redisCache.default.tryConnect();

  if (redisCache.default.isConnected) {
    try {
      upgradeToRedis(redisCache.default.client);
      logger.info('Rate limiters upgraded to Redis store');
    } catch (err) {
      logger.warn(`Rate limiter Redis upgrade failed: ${(err as Error).message} — using in-memory`);
    }
  }

  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await prisma.$disconnect();
      await redisCache.default.client.quit().catch(() => {});
      logger.info('Prisma + Redis disconnected');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after 10 s timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
    process.exit(1);
  });
};

startServer();
