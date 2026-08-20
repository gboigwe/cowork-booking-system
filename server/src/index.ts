import express from 'express';
import cors from 'cors';
import desksRouter from './routes/desks.js';
import bookingsRouter from './routes/bookings.js';
import otpRouter from './routes/otp.js';
import adminRouter from './routes/admin.js';
import { seedDesks } from './db/seed.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json());

// Seed initial data
seedDesks();

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/desks', desksRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/otp', otpRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
