import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? [{ emit: 'event', level: 'query' }, 'error', 'warn']
      : ['error'],
});

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => logger.debug(`Query: ${e.query} (${e.duration}ms)`));
}

export default prisma;
