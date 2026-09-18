import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: 'Route nahi mila' });
}

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message, code: err.code, field: err.field });
  }
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Server error' });
}
