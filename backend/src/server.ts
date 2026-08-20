import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

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

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Database connection function for serverless
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youth_app';
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Connect immediately (works for both local and serverless)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Only start the Express server if NOT running on Vercel
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
