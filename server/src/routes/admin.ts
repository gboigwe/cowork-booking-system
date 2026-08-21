import { Router, type Request, type Response, type NextFunction } from 'express';
import crypto from 'crypto';
import db from '../db/database.js';
import type { AdminOverview, Booking, DeskAvailability, InterestSignup } from '../types/index.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== 'production' ? 'zonein2026' : undefined);
if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD must be set in production');
}

// In-memory session store: single-process deployment, no auth infra needed
// for a one-location staff panel. Sessions are lost on server restart.
const sessions = new Set<string>();

const router = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length) : undefined;
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  next();
}

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

router.post('/login', (req: Request, res: Response) => {
  const { password } = req.body as { password?: string };
  if (password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Incorrect password' });
    return;
  }
  const token = crypto.randomUUID();
  sessions.add(token);
  res.json({ token });
});

router.get('/overview', requireAdmin, (_req: Request, res: Response) => {
  const date = todayString();
  const desks = db.prepare('SELECT * FROM desks ORDER BY side DESC, position').all() as any[];
  const booked = db.prepare('SELECT desk_id FROM bookings WHERE date = ?').all(date) as { desk_id: string }[];
  const blocked = db.prepare('SELECT desk_id FROM desk_blocks WHERE date = ?').all(date) as { desk_id: string }[];
  const unavailableIds = new Set([...booked.map(b => b.desk_id), ...blocked.map(b => b.desk_id)]);

  const deskList: DeskAvailability[] = desks.map(d => ({
    id: d.id, side: d.side, desc: d.desc, position: d.position,
    isAvailable: !unavailableIds.has(d.id),
  }));

  const todaysRows = db.prepare('SELECT * FROM bookings WHERE date = ? ORDER BY created_at DESC').all(date) as any[];
  const todaysBookings: Booking[] = todaysRows.map(r => ({
    id: r.id, deskId: r.desk_id, deskName: r.desk_name, deskDesc: r.desk_desc, date: r.date,
    holderName: r.holder_name, holderPhone: r.holder_phone, status: r.status,
    amount: r.amount, createdAt: r.created_at,
  }));

  const stats = db.prepare('SELECT COUNT(*) as cnt, COALESCE(SUM(amount), 0) as revenue FROM bookings').get() as { cnt: number; revenue: number };

  const overview: AdminOverview = {
    desks: deskList,
    todaysBookings,
    totalBookings: stats.cnt,
    totalRevenue: stats.revenue,
  };

  res.json(overview);
});

router.patch('/bookings/:id/confirm', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const result = db.prepare("UPDATE bookings SET status = 'confirmed' WHERE id = ? AND status = 'pending'").run(id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Pending booking not found' });
    return;
  }
  res.json({ success: true });
});

router.patch('/desks/:id/block', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const date = todayString();

  const desk = db.prepare('SELECT id FROM desks WHERE id = ?').get(id);
  if (!desk) {
    res.status(404).json({ error: 'Desk not found' });
    return;
  }

  const existing = db.prepare('SELECT 1 FROM desk_blocks WHERE desk_id = ? AND date = ?').get(id, date);
  if (existing) {
    db.prepare('DELETE FROM desk_blocks WHERE desk_id = ? AND date = ?').run(id, date);
  } else {
    const alreadyBooked = db.prepare('SELECT 1 FROM bookings WHERE desk_id = ? AND date = ?').get(id, date);
    if (alreadyBooked) {
      res.status(409).json({ error: 'Desk already has a booking today' });
      return;
    }
    db.prepare('INSERT INTO desk_blocks (desk_id, date) VALUES (?, ?)').run(id, date);
  }

  res.json({ success: true });
});

router.get('/interest', requireAdmin, (_req: Request, res: Response) => {
  const rows = db.prepare('SELECT * FROM interest_signups ORDER BY created_at DESC').all() as any[];
  const signups: InterestSignup[] = rows.map(r => ({
    id: r.id, name: r.name, email: r.email, createdAt: r.created_at,
  }));
  res.json(signups);
});

export default router;
