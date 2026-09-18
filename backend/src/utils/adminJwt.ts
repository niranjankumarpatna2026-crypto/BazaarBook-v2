import jwt from 'jsonwebtoken';
import { env } from '../env.js';
export type AdminJwtPayload = { adminId: string; email: string; role: string };
export function signAdminToken(payload: AdminJwtPayload): string {
  return jwt.sign(payload, env.adminJwtSecret, { expiresIn: env.adminJwtExpiresIn as any });
}
export function verifyAdminToken(token: string): AdminJwtPayload {
  return jwt.verify(token, env.adminJwtSecret) as AdminJwtPayload;
}
