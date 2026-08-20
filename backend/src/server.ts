import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(express.json());

// ── Serverless-safe DB connection middleware ───────────────────────────────
// On Vercel each request may hit a cold-start. We connect once and reuse.
let isConnected = false;

app.use(async (_req, _res, next) => {
  if (isConnected) return next();
  const MONGO_URI = process.env.MONGODB_URI;
  if (!MONGO_URI) {
    console.error('MONGODB_URI is not set in environment variables!');
    return next(); // let the route handler fail with a proper JSON 500
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

// ── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/counselors', counselorsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/institution', institutionRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', db: mongoose.connection.readyState });
});

// ── Global JSON error handler (ensures Vercel never returns plain-text) ────
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Start server locally (skipped on Vercel serverless) ───────────────────
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
