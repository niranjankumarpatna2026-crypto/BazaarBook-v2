import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.js';
import { Unauthorized } from '../utils/errors.js';

declare global {
  namespace Express {
    interface Request { user?: { userId: string; mobile: string } }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return next(Unauthorized());
  try {
    req.user = verifyToken(h.slice(7));
    next();
  } catch {
    next(Unauthorized('Token invalid'));
  }
}
