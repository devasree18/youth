import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

import { envConfig } from './config/env';
import assessmentRoutes from './routes/assessment';
import communityRoutes from './routes/community';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import moodRoutes from './routes/mood';
import resourcesRoutes from './routes/resources';
import counselorsRoutes from './routes/counselors';
import aiRoutes from './routes/ai';
import subscriptionsRoutes from './routes/subscriptions';
import adminRoutes from './routes/admin';
import institutionRoutes from './routes/institution';
import wellbeingRoutes from './routes/wellbeing';
import crisisRoutes from './routes/crisis';
import appointmentRoutes from './routes/appointments';
import gamesRoutes from './routes/games';
import { errorHandler } from './middleware/errors';

const app = express();
const PORT = envConfig.PORT || 5000;

// ── Startup Security & Environment Validation ────────────────────────────────
if (envConfig.NODE_ENV === 'production' && !envConfig.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET environment variable is missing!');
  process.exit(1);
}

// ── Request ID & Logging Middleware ─────────────────────────────────────────
app.use((req: any, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

// ── CORS & Security Middleware ──────────────────────────────────────────────
const allowedOrigins = envConfig.ALLOWED_ORIGINS 
  ? envConfig.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || envConfig.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: Origin ${origin} not permitted`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID']
}));

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// ── Rate Limiting Middleware ────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again after 15 minutes.'
    }
  }
});
app.use(globalLimiter);

// ── Serverless-Safe DB Connection Middleware ────────────────────────────────
let isConnected = false;

app.use(async (_req, _res, next) => {
  if (isConnected || envConfig.NODE_ENV === 'test' || process.env.NODE_ENV === 'test') return next();
  const MONGO_URI = envConfig.MONGODB_URI;
  if (!MONGO_URI) {
    console.error('MONGODB_URI is not set in environment variables!');
    return next();
  }
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
  next();
});

// ── Health Check Endpoint ────────────────────────────────────────────────────
app.get(['/api/v1/health', '/api/health'], (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    }
  });
});

// ── Versioned API Routes (/api/v1/) ──────────────────────────────────────────
const v1Router = express.Router();
v1Router.use('/auth', authRoutes);
v1Router.use('/user', userRoutes);
v1Router.use('/assessment', assessmentRoutes);
v1Router.use('/community', communityRoutes);
v1Router.use('/mood', moodRoutes);
v1Router.use('/resources', resourcesRoutes);
v1Router.use('/counselors', counselorsRoutes);
v1Router.use('/ai', aiRoutes);
v1Router.use('/subscriptions', subscriptionsRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/institution', institutionRoutes);
v1Router.use('/wellbeing', wellbeingRoutes);
v1Router.use('/crisis', crisisRoutes);
v1Router.use('/appointments', appointmentRoutes);
v1Router.use('/games', gamesRoutes);

app.use('/api/v1', v1Router);

// ── Backward-Compatible Legacy Routes (/api/) ───────────────────────────────
app.use('/api', v1Router);

// ── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

// ── Local Development Server Startup ───────────────────────────────────────
if (!process.env.VERCEL && envConfig.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
