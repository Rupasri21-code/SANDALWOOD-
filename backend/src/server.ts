import app from './app';
import { env } from './config/env';
import { db } from './config/database';
import { initializeCronJobs } from './config/cron';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await db.$connect();
    console.log('✅ Supabase PostgreSQL Database connected successfully!');
    initializeCronJobs();

    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
};

startServer();

export default app;
