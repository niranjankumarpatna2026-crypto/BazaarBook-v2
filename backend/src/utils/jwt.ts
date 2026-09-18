import jwt from 'jsonwebtoken';
import { env } from '../env.js';
export type JwtPayload = { userId: string; mobile: string };
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as any });
}
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}
