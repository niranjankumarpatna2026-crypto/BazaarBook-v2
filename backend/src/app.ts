import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/error.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import customerRoutes from './routes/customers.js';
import billRoutes from './routes/bills.js';
import reportRoutes from './routes/reports.js';
import settingsRoutes from './routes/settings.js';
import subscriptionRoutes from './routes/subscription.js';
import webhookRoutes from './routes/webhooks.js';
import adminRoutes from './routes/admin/index.js';

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);

  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    // Allowed origins
    const allowed = [
      env.frontendUrl,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ];

    // Allow any *.vercel.app (production + preview)
    if (origin.endsWith('.vercel.app') || allowed.includes(origin)) {
      return callback(null, true);
    }

    console.log('❌ CORS blocked:', origin);
    callback(new Error('CORS not allowed'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

  app.use('/api/webhooks', webhookRoutes);
  app.use(express.json({ limit: '1mb' }));
  app.use('/api', apiLimiter);

  app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/customers', customerRoutes);
  app.use('/api/bills', billRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/subscription', subscriptionRoutes);
  app.use('/api/admin', adminRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
