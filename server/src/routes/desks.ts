import { Router, type Request, type Response } from 'express';
import db from '../db/database.js';
import type { DeskAvailability } from '../types/index.js';

const router = Router();

// GET /api/desks?date=YYYY-MM-DD
router.get('/', (req: Request, res: Response) => {
  const date = (req.query.date as string) || new Date().toISOString().split('T')[0];

  const desks = db.prepare('SELECT * FROM desks ORDER BY position_index').all() as any[];

  // Get all bookings for this date
  const bookings = db.prepare(
    'SELECT desk_id FROM bookings WHERE date = ?'
  ).all(date) as { desk_id: string }[];

  const bookedDeskIds = new Set(bookings.map(b => b.desk_id));

  const result: DeskAvailability[] = desks.map(d => ({
    id: d.id,
    name: d.name,
    type: d.type,
    position_index: d.position_index,
    isAvailable: !bookedDeskIds.has(d.id),
  }));

  res.json(result);
});

// GET /api/desks/availability?date=&startTime=&endTime=
router.get('/availability', (req: Request, res: Response) => {
  const { date, startTime, endTime } = req.query as Record<string, string>;

  if (!date || !startTime || !endTime) {
    res.status(400).json({ error: 'date, startTime, and endTime are required' });
    return;
  }

  const desks = db.prepare('SELECT * FROM desks ORDER BY position_index').all() as any[];

  // Find overlapping bookings for the given date + time range
  const overlapping = db.prepare(`
    SELECT desk_id FROM bookings
    WHERE date = ? AND start_time < ? AND end_time > ?
  `).all(date, endTime, startTime) as { desk_id: string }[];

  const bookedDeskIds = new Set(overlapping.map(b => b.desk_id));

  const result: DeskAvailability[] = desks.map(d => ({
    id: d.id,
    name: d.name,
    type: d.type,
    position_index: d.position_index,
    isAvailable: !bookedDeskIds.has(d.id),
  }));

  res.json(result);
});

export default router;
