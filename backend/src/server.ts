import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Remove trailing slash from FRONTEND_URL if present
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');

app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Raitakarya API is running' });
});

// Import routes when created
try {
  const authRoutes = require('./routes/auth.routes').default;
  const userRoutes = require('./routes/user.routes').default;
  const jobRoutes = require('./routes/job.routes').default;
  const applicationRoutes = require('./routes/application.routes').default;
  const paymentRoutes = require('./routes/payment.routes').default;
  const ratingRoutes = require('./routes/rating.routes').default;
  
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/ratings', ratingRoutes);
} catch (e) {}

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Raitakarya API running on port ${PORT}`);
});
