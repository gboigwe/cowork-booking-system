import express from 'express';
import cors from 'cors';
import desksRouter from './routes/desks.js';
import bookingsRouter from './routes/bookings.js';
import { seedDesks } from './db/seed.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Seed initial data
seedDesks();

// Routes
app.get('/api/analytics', (req, res, next) => {
  // Forward to bookings analytics handler
  req.url = '/analytics';
  bookingsRouter(req, res, next);
});
app.use('/api/desks', desksRouter);
app.use('/api/bookings', bookingsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
