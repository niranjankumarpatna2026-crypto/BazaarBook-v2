import rateLimit from 'express-rate-limit';
import { env } from '../env.js';
const skip = () => env.nodeEnv === 'development';
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  message: { error: 'Bahut zyada attempts' }, skip
});
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, max: 500,
  message: { error: 'Bahut zyada requests' }, skip
});
