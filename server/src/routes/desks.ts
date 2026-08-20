import { Router, type Request, type Response } from 'express';
import db from '../db/database.js';
import type { DeskAvailability } from '../types/index.js';

const router = Router();

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

// GET /api/desks?date=YYYY-MM-DD
router.get('/', (req: Request, res: Response) => {
  const date = (req.query.date as string) || todayString();

  const desks = db.prepare('SELECT * FROM desks ORDER BY side DESC, position').all() as any[];

  const booked = db.prepare('SELECT desk_id FROM bookings WHERE date = ?').all(date) as { desk_id: string }[];
  const blocked = db.prepare('SELECT desk_id FROM desk_blocks WHERE date = ?').all(date) as { desk_id: string }[];
  const unavailableIds = new Set([...booked.map(b => b.desk_id), ...blocked.map(b => b.desk_id)]);

  const result: DeskAvailability[] = desks.map(d => ({
    id: d.id,
    side: d.side,
    desc: d.desc,
    position: d.position,
    isAvailable: !unavailableIds.has(d.id),
  }));

  res.json(result);
});

export default router;
