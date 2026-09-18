import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signToken } from '../utils/jwt.js';
import { BadRequest, Conflict, Unauthorized } from '../utils/errors.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

const regSchema = z.object({
  ownerName: z.string().min(3),
  shopName: z.string().min(3),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6),
  acceptTerms: z.boolean()
});

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const b = regSchema.parse(req.body);
    const exists = await query('SELECT id FROM users WHERE mobile = $1', [b.mobile]);
    if (exists.rowCount) throw Conflict('Mobile pehle se registered', 'mobile');

    const hash = await hashPassword(b.password);
    const { rows } = await query(
      `INSERT INTO users (mobile, email, password_hash, owner_name, shop_name, plan_code, plan_status)
       VALUES ($1,$2,$3,$4,$5,'free','active') RETURNING *`,
      [b.mobile, b.email || null, hash, b.ownerName, b.shopName]
    );
    const user = rows[0];

    await query(`INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [user.id]);
    await query(
      `INSERT INTO subscriptions (user_id, plan_code, billing_cycle, status, expires_at)
       VALUES ($1,'free','monthly','active', NOW() + INTERVAL '30 days')`,
      [user.id]
    );

    const token = signToken({ userId: user.id, mobile: user.mobile });
    res.status(201).json({ token, user: toUser(user) });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const b = z.object({ identifier: z.string(), password: z.string() }).parse(req.body);
    const isEmail = b.identifier.includes('@');
    const { rows } = await query(
      `SELECT * FROM users WHERE ${isEmail ? 'email' : 'mobile'} = $1`,
      [isEmail ? b.identifier.toLowerCase() : b.identifier]
    );
    if (!rows.length) throw Unauthorized('Galat credentials');
    const ok = await comparePassword(b.password, rows[0].password_hash);
    if (!ok) throw Unauthorized('Galat credentials');
    const token = signToken({ userId: rows[0].id, mobile: rows[0].mobile });
    res.json({ token, user: toUser(rows[0]) });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const { rows } = await query('SELECT * FROM users WHERE id = $1', [req.user!.userId]);
    if (!rows.length) throw Unauthorized();
    res.json({ user: toUser(rows[0]) });
  } catch (e) { next(e); }
});

function toUser(u: any) {
  return {
    id: u.id, mobile: u.mobile, email: u.email,
    ownerName: u.owner_name, shopName: u.shop_name,
    businessType: u.business_type, city: u.city,
    plan: u.plan_code, planStatus: u.plan_status,
    planExpiry: u.plan_expires_at, createdAt: u.created_at
  };
}

export default router;
