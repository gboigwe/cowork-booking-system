import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import db from '../db/database.js';
import type { InterestSignup } from '../types/index.js';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/interest
router.post('/', (req: Request, res: Response) => {
  const { name, email } = req.body as { name?: string; email?: string };

  if (!name?.trim() || !email?.trim()) {
    res.status(400).json({ error: 'name and email are required' });
    return;
  }
  if (!EMAIL_RE.test(email.trim())) {
    res.status(400).json({ error: 'That email doesn\'t look right' });
    return;
  }

  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO interest_signups (id, name, email, created_at) VALUES (?, ?, ?, ?)
  `).run(id, name.trim(), email.trim(), createdAt);

  const signup: InterestSignup = { id, name: name.trim(), email: email.trim(), createdAt };
  res.status(201).json(signup);
});

export default router;
