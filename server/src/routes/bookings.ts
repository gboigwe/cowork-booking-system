import { Router, type Request, type Response } from 'express';
import db from '../db/database.js';
import type { Booking } from '../types/index.js';
import crypto from 'crypto';

// Standard price is ₦4,000; temporarily testing ₦2,500. Switch back by
// swapping which line is active. Keep this in sync with
// src/context/BookingContext.tsx on the frontend.
// export const DAY_RATE_NGN = 4000;
export const DAY_RATE_NGN = 2500;

const router = Router();

function rowToBooking(r: any): Booking {
  return {
    id: r.id,
    deskId: r.desk_id,
    deskName: r.desk_name,
    deskDesc: r.desk_desc,
    date: r.date,
    holderName: r.holder_name,
    holderPhone: r.holder_phone,
    status: r.status,
    amount: r.amount,
    createdAt: r.created_at,
  };
}

// GET /api/bookings?phone= : phone is required; there is no route to list every
// customer's bookings without it (that would leak names/phone numbers to anyone).
// The admin overview route queries bookings directly instead of through here.
router.get('/', (req: Request, res: Response) => {
  const phone = req.query.phone as string | undefined;
  if (!phone) {
    res.status(400).json({ error: 'phone is required' });
    return;
  }

  const rows = db.prepare(`
    SELECT * FROM bookings WHERE holder_phone = ? ORDER BY date DESC, created_at DESC
  `).all(phone) as any[];

  res.json(rows.map(rowToBooking));
});

// POST /api/bookings
// No payment is taken here. The booking is created as 'pending' and the
// desk pass is reserved immediately; staff confirm it (via /api/admin) once
// the holder pays in person at the venue.
router.post('/', (req: Request, res: Response) => {
  const { deskId, date, holderName, holderPhone } = req.body as {
    deskId?: string; date?: string; holderName?: string; holderPhone?: string;
  };

  if (!deskId || !date || !holderName || !holderPhone) {
    res.status(400).json({ error: 'deskId, date, holderName, holderPhone are required' });
    return;
  }

  const desk = db.prepare('SELECT * FROM desks WHERE id = ?').get(deskId) as any;
  if (!desk) {
    res.status(404).json({ error: 'Desk not found' });
    return;
  }

  const taken = db.prepare(`
    SELECT 1 FROM bookings WHERE desk_id = ? AND date = ?
    UNION SELECT 1 FROM desk_blocks WHERE desk_id = ? AND date = ?
  `).get(deskId, date, deskId, date);

  if (taken) {
    res.status(409).json({ error: 'Desk is already booked for this date' });
    return;
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO bookings (id, desk_id, desk_name, desk_desc, date, holder_name, holder_phone, status, amount, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `).run(id, deskId, desk.id, desk.desc, date, holderName, holderPhone, DAY_RATE_NGN, createdAt);

  const booking: Booking = {
    id, deskId, deskName: desk.id, deskDesc: desk.desc, date,
    holderName, holderPhone, status: 'pending', amount: DAY_RATE_NGN, createdAt,
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

export default router;
