import dotenv from 'dotenv';
dotenv.config();

function req(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error('Missing env: ' + key);
  return v;
}
function opt(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const env = {
  nodeEnv: opt('NODE_ENV', 'development'),
  isProd: opt('NODE_ENV') === 'production',
  port: Number(opt('PORT', '5000')),
  frontendUrl: opt('FRONTEND_URL', 'http://localhost:5173'),
  databaseUrl: req('DATABASE_URL'),
  dbSsl: opt('DB_SSL', 'true') !== 'false',
  jwtSecret: req('JWT_SECRET'),
  jwtExpiresIn: opt('JWT_EXPIRES_IN', '7d'),
  adminJwtSecret: req('ADMIN_JWT_SECRET'),
  adminJwtExpiresIn: opt('ADMIN_JWT_EXPIRES_IN', '8h'),
  razorpayKeyId: opt('RAZORPAY_KEY_ID'),
  razorpayKeySecret: opt('RAZORPAY_KEY_SECRET'),
  razorpayWebhookSecret: opt('RAZORPAY_WEBHOOK_SECRET')
};
