import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import { limiter } from './middleware/rateLimit.middleware';
import { errorHandler } from './middleware/error.middleware';

// Routes imports
import authRoutes from './routes/auth.routes';
import investorRoutes from './routes/investor.routes';
import landRoutes from './routes/land.routes';
import cropRoutes from './routes/crop.routes';
import updateRoutes from './routes/update.routes';
import investmentRoutes from './routes/investment.routes';
import paymentRoutes from './routes/payment.routes';
import mediaRoutes from './routes/media.routes';
import documentRoutes from './routes/document.routes';
import inquiryRoutes from './routes/inquiry.routes';
import notificationRoutes from './routes/notification.routes';
import dashboardRoutes from './routes/dashboard.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows displaying local/Cloudinary images directly
}));

// CORS Configuration
const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads folder fallback)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root Route check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Arbor Vest Sandalwood Investments API — Online & Operational',
    timestamp: new Date(),
  });
});

// Mount Routes under /api/v1
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, limiter, authRoutes);
app.use(`${API_PREFIX}/investors`, investorRoutes);
app.use(`${API_PREFIX}/lands`, landRoutes);
app.use(`${API_PREFIX}/crops`, cropRoutes);
app.use(`${API_PREFIX}/updates`, updateRoutes);
app.use(`${API_PREFIX}/investments`, investmentRoutes);
app.use(`${API_PREFIX}/payments`, paymentRoutes);
app.use(`${API_PREFIX}/media`, mediaRoutes);
app.use(`${API_PREFIX}/documents`, documentRoutes);
app.use(`${API_PREFIX}/inquiries`, inquiryRoutes);
app.use(`${API_PREFIX}/notifications`, notificationRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/upload`, uploadRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
