import bcrypt from 'bcryptjs';
const COST = 12;
export const hashPassword = (p: string) => bcrypt.hash(p, COST);
export const comparePassword = (p: string, h: string) => bcrypt.compare(p, h);
