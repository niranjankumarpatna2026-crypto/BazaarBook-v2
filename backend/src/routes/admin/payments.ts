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

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*, u.shop_name, u.owner_name FROM payments p
       JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC LIMIT 100`
    );
    res.json({ payments: rows });
  } catch (e) { next(e); }
});

export default router;
