import { Router, type Request, type Response } from 'express';

// Placeholder OTP flow: no SMS provider is wired up yet. This mirrors the
// incoming design's own placeholder behavior ("enter any 4 digits to
// continue") but keeps the check server-side instead of hardcoded in the
// client bundle. Swap the two handlers below for a real provider later.
const router = Router();

router.post('/send', (req: Request, res: Response) => {
  const { phone } = req.body as { phone?: string };
  if (!phone) {
    res.status(400).json({ error: 'phone is required' });
    return;
  }
  res.json({ sent: true });
});

router.post('/verify', (req: Request, res: Response) => {
  const { phone, code } = req.body as { phone?: string; code?: string };
  if (!phone || !code) {
    res.status(400).json({ error: 'phone and code are required' });
    return;
  }
  if (!/^\d{4}$/.test(code)) {
    res.status(400).json({ error: 'code must be 4 digits' });
    return;
  }
  res.json({ verified: true });
});

export default router;
