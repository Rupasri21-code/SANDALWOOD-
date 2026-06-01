import app from './app';
import { env } from './config/env';
import { db } from './config/database';

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    // Test Database connection
    console.log('🔄 Connecting to database...');
    await db.$connect();
    console.log('✅ Supabase PostgreSQL Database connected successfully!');

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database or start server:', error);
    process.exit(1);
  }
};

startServer();
