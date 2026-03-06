import { Router, type Request, type Response } from 'express';
import db from '../db/database.js';
import type { Booking, MembershipTier, DeskType } from '../types/index.js';
import crypto from 'crypto';

const router = Router();

const PRICING: Record<MembershipTier, number> = { basic: 10, premium: 15, executive: 20 };
const TEAM_RATE = 25;

function calculateHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh + em / 60) - (sh + sm / 60);
}

// GET /api/bookings
router.get('/', (_req: Request, res: Response) => {
  const rows = db.prepare(`
    SELECT id, desk_id, desk_name, desk_type, membership_tier,
           date, start_time, end_time, hours, total_cost, created_at
    FROM bookings ORDER BY created_at DESC
  `).all() as any[];

  const bookings: Booking[] = rows.map(r => ({
    id: r.id,
    deskId: r.desk_id,
    deskName: r.desk_name,
    deskType: r.desk_type,
    membershipTier: r.membership_tier,
    date: r.date,
    startTime: r.start_time,
    endTime: r.end_time,
    hours: r.hours,
    totalCost: r.total_cost,
    createdAt: r.created_at,
  }));

  res.json(bookings);
});

// POST /api/bookings
router.post('/', (req: Request, res: Response) => {
  const { deskId, date, startTime, endTime, membershipTier } = req.body;

  if (!deskId || !date || !startTime || !endTime) {
    res.status(400).json({ error: 'deskId, date, startTime, endTime are required' });
    return;
  }

  const hours = calculateHours(startTime, endTime);
  if (hours <= 0) {
    res.status(400).json({ error: 'endTime must be after startTime' });
    return;
  }

  // Get desk info
  const desk = db.prepare('SELECT * FROM desks WHERE id = ?').get(deskId) as any;
  if (!desk) {
    res.status(404).json({ error: 'Desk not found' });
    return;
  }

  // Check for overlapping bookings
  const overlap = db.prepare(`
    SELECT id FROM bookings
    WHERE desk_id = ? AND date = ? AND start_time < ? AND end_time > ?
  `).get(deskId, date, endTime, startTime);

  if (overlap) {
    res.status(409).json({ error: 'Desk is already booked for this time slot' });
    return;
  }

  const deskType = desk.type as DeskType;
  const tier = (deskType === 'individual' ? membershipTier : null) as MembershipTier | null;
  const hourlyRate = deskType === 'team' ? TEAM_RATE : PRICING[tier || 'basic'];
  const totalCost = hourlyRate * hours;

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO bookings (id, desk_id, desk_name, desk_type, membership_tier, date, start_time, end_time, hours, total_cost, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, deskId, desk.name, deskType, tier, date, startTime, endTime, hours, totalCost, createdAt);

  const booking: Booking = {
    id,
    deskId,
    deskName: desk.name,
    deskType,
    membershipTier: tier,
    date,
    startTime,
    endTime,
    hours,
    totalCost,
    createdAt,
  };

  res.status(201).json(booking);
});

// DELETE /api/bookings/:id
router.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Booking not found' });
    return;
  }
  res.json({ success: true });
});

// GET /api/analytics
router.get('/analytics', (_req: Request, res: Response) => {
  const stats = db.prepare(`
    SELECT
      COUNT(*) as totalBookings,
      COALESCE(SUM(total_cost), 0) as totalRevenue,
      COALESCE(AVG(hours), 0) as averageHours
    FROM bookings
  `).get() as any;

  const popular = db.prepare(`
    SELECT desk_name, COUNT(*) as cnt FROM bookings
    GROUP BY desk_name ORDER BY cnt DESC LIMIT 1
  `).get() as any;

  const tiers = db.prepare(`
    SELECT COALESCE(membership_tier, 'team') as tier, COUNT(*) as cnt
    FROM bookings GROUP BY tier
  `).all() as { tier: string; cnt: number }[];

  const daily = db.prepare(`
    SELECT date, COUNT(*) as count FROM bookings
    GROUP BY date ORDER BY date DESC LIMIT 30
  `).all() as { date: string; count: number }[];

  const tierBreakdown: Record<string, number> = {};
  for (const t of tiers) tierBreakdown[t.tier] = t.cnt;

  res.json({
    totalBookings: stats.totalBookings,
    totalRevenue: stats.totalRevenue,
    averageHours: stats.averageHours,
    popularDesk: popular?.desk_name || '',
    tierBreakdown,
    dailyBookings: daily,
  });
});

export default router;
