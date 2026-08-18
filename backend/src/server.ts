import { env } from './config/env';
import app from './app';
import { db } from './config/database';
import { initializeCronJobs } from './config/cron';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await db.$connect();
    console.log('✅ Supabase PostgreSQL Database connected successfully!');
    initializeCronJobs();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${PORT} is already in use by another running backend process.`);
        console.error(`💡 Tip: Stop the existing backend process or port ${PORT} listener before running npm start.`);
        process.exit(1);
      } else {
        console.error('❌ Server error:', error);
      }
    });
  } catch (error: any) {
    console.error('❌ Database connection error:', error?.message || error);
    console.error('\n🛠️  SUPABASE DATABASE TROUBLESHOOTING FOR NEW LAPTOP / ENVIRONMENT:');
    console.error('1. Make sure the `.env` file was copied into the `backend/` directory on the new laptop.');
    console.error('2. If port 6543 is blocked on the network/Wi-Fi, change `:6543` to `:5432` in `DATABASE_URL` inside `backend/.env`.');
    console.error('3. Run `npx prisma generate` in the `backend/` directory on the new laptop.\n');
  }
};

startServer();

export default app;
