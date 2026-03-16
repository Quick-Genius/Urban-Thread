import rateLimit from 'express-rate-limit';
import type Redis from 'ioredis';

const json = (message: string) => ({ success: false, message });

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many requests. Please try again after 15 minutes.'),
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: json('Too many authentication attempts. Please try again after 15 minutes.'),
});

export const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many payment requests. Please try again later.'),
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Upload limit reached. Please try again later.'),
});

export const upgradeToRedis = (redisClient: Redis): void => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { default: RedisStore } = require('rate-limit-redis');
  const makeStore = (prefix: string) =>
    new RedisStore({
      sendCommand: (...args: string[]) => redisClient.call(...(args as [string, ...string[]])),
      prefix: `rl:${prefix}:`,
    });

  apiLimiter.resetKey = undefined as never;
  (apiLimiter as unknown as { store: unknown }).store = makeStore('api');
  (authLimiter as unknown as { store: unknown }).store = makeStore('auth');
  (paymentLimiter as unknown as { store: unknown }).store = makeStore('pay');
  (uploadLimiter as unknown as { store: unknown }).store = makeStore('upload');
};
