import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction) => {
  err.statusCode = err.statusCode || 500;

  if (err.statusCode >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      userId: req.user?.id,
    });
  } else if (process.env.NODE_ENV !== 'production') {
    logger.warn({ message: err.message, path: req.originalUrl });
  }

  // Prisma unique constraint violation
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }

  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Token expired' });
  }

  if (process.env.NODE_ENV === 'production' && !err.isOperational) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
