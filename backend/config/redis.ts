import Redis from 'ioredis';
import logger from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let connected = false;

const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  retryStrategy(times: number) {
    if (times > 5) {
      logger.warn('Redis: max reconnect attempts reached — running without cache');
      return null;
    }
    return Math.min(times * 500, 3000);
  },
  lazyConnect: true,
});

redis.on('connect', () => {
  connected = true;
  logger.info('Redis connected');
});
redis.on('close', () => { connected = false; });
redis.on('error', () => { connected = false; });

const cache = {
  async get<T = unknown>(key: string): Promise<T | null> {
    if (!connected) return null;
    try {
      const data = await redis.get(key);
      return data ? (JSON.parse(data) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!connected) return;
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      // ignore
    }
  },

  async del(...keys: string[]): Promise<void> {
    if (!connected) return;
    try {
      if (keys.length) await redis.del(...keys);
    } catch {
      // ignore
    }
  },

  async delPattern(pattern: string): Promise<void> {
    if (!connected) return;
    try {
      let cursor = '0';
      do {
        const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length) await redis.del(...keys);
      } while (cursor !== '0');
    } catch {
      // ignore
    }
  },

  async tryConnect(): Promise<void> {
    try {
      await redis.connect();
    } catch {
      logger.warn('Redis not available — running without cache (degraded mode)');
    }
  },

  client: redis,

  get isConnected() { return connected; },
};

export default cache;
