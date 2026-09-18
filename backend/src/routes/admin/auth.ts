import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../db.js';
import { comparePassword } from '../../utils/password.js';
import { signAdminToken } from '../../utils/adminJwt.js';
import { BadRequest, Unauthorized } from '../../utils/errors.js';
import { authLimiter } from '../../middleware/rateLimit.js';

const router = Router();

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = z.object({
      email: z.string().email(),
      password: z.string()
    }).parse(req.body);

    const { rows } = await query('SELECT * FROM admins WHERE email = $1 AND is_active = true', [email.toLowerCase()]);
    if (!rows.length) throw Unauthorized('Galat credentials');

    const ok = await comparePassword(password, rows[0].password_hash);
    if (!ok) throw Unauthorized('Galat credentials');

    await query('UPDATE admins SET last_login_at = NOW() WHERE id = $1', [rows[0].id]);

    const token = signAdminToken({ adminId: rows[0].id, email: rows[0].email, role: rows[0].role });
    res.json({ token, admin: { id: rows[0].id, email: rows[0].email, name: rows[0].name, role: rows[0].role } });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

export default router;
