import './env';
import { PrismaClient } from '@prisma/client';

if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

declare global {
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};

export const db = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = db;
}

// Test DB connection on startup and log result clearly
db.$connect()
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((err: Error) => {
    console.error('❌ Database connection FAILED:', err.message);
    console.error('👉 Check your DATABASE_URL in .env — Supabase project may be paused.');
    console.error('👉 Go to https://supabase.com → your project → restore if paused.');
  });
