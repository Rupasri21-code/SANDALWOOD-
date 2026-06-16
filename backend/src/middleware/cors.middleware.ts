import cors from 'cors';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

// Split allowed origins and trim whitespace
const allowedOrigins = env.ALLOWED_ORIGINS
  ? env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim().toLowerCase())
  : [];

/**
 * Professional CORS middleware configuration.
 * Handles origin verification dynamically, supports subdomain wildcards (e.g. *.example.com),
 * and handles preflight requests cleanly.
 */
export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().toLowerCase();

    // Check if the origin matches any allowed origins
    const isAllowed = allowedOrigins.some((allowedOrigin) => {
      // Direct match
      if (allowedOrigin === normalizedOrigin) return true;
      
      // Support subdomain wildcards (e.g., *.example.com)
      if (allowedOrigin.startsWith('*.')) {
        const domain = allowedOrigin.slice(2);
        return normalizedOrigin.endsWith(domain) && normalizedOrigin.split('.').length >= domain.split('.').length;
      }
      
      return false;
    });

    if (isAllowed || env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new ApiError(403, `Origin ${origin} blocked by CORS policy`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Request-Headers',
    'Access-Control-Request-Method',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400, // Cache preflight requests for 24 hours
  optionsSuccessStatus: 204,
});
