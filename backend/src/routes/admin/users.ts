import { Router } from 'express';
import { query } from '../../db.js';
import { verifyAdminToken } from '../../utils/adminJwt.js';
import { Unauthorized } from '../../utils/errors.js';

const router = Router();

function requireAdmin(req: any, _res: any, next: any) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return next(Unauthorized());
  try { verifyAdminToken(h.slice(7)); next(); }
  catch { next(Unauthorized()); }
}

router.use(requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const { q, plan, status } = req.query;
    const params: any[] = [];
    const where: string[] = ['1=1'];

    if (q) {
      params.push('%' + String(q).toLowerCase() + '%');
      where.push(`(LOWER(owner_name) LIKE $${params.length} OR LOWER(shop_name) LIKE $${params.length} OR mobile LIKE $${params.length})`);
    }
    if (plan && plan !== 'all') { params.push(plan); where.push('plan_code = $' + params.length); }
    if (status && status !== 'all') { params.push(status); where.push('plan_status = $' + params.length); }

    const { rows } = await query(
      `SELECT * FROM users WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT 100`,
      params
    );
    res.json({ users: rows });
  } catch (e) { next(e); }
});

export default router;
