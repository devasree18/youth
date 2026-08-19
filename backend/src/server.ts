import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import assessmentRoutes from './routes/assessment';
import communityRoutes from './routes/community';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/assessment', assessmentRoutes);
app.use('/api/community', communityRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Database and Server Start
if (process.env.NODE_ENV !== 'test') {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/youth_app';
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

export default app;
