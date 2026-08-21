import express from 'express';
import cors from 'cors';
import desksRouter from './routes/desks.js';
import bookingsRouter from './routes/bookings.js';
import otpRouter from './routes/otp.js';
import adminRouter from './routes/admin.js';
import interestRouter from './routes/interest.js';
import { seedDesks } from './db/seed.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS_ORIGIN accepts one origin or a comma-separated list, e.g.
// "https://zoneinhub.com,https://www.zoneinhub.com,https://techage.vercel.app"
const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map(o => o.trim()).filter(Boolean);

app.use(cors({
  origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : '*',
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
app.use('/api/interest', interestRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
