import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { query, withTransaction } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { env } from '../env.js';
import { BadRequest, NotFound } from '../utils/errors.js';

const router = Router();
router.use(requireAuth);

// ============ PLANS DEFINITION ============
const PLANS = {
  free:     { code: 'free',     name: 'Free',     monthly: 0,     yearly: 0,      bills: 20,   products: 50,  customers: 25,  duration: 30 },
  starter:  { code: 'starter',  name: 'Starter',  monthly: 9900,  yearly: 95000,  bills: 200,  products: 500, customers: 200, duration: 30 },
  pro:      { code: 'pro',      name: 'Pro',      monthly: 24900, yearly: 239000, bills: -1,   products: -1,  customers: -1,  duration: 30 },
  business: { code: 'business', name: 'Business', monthly: 59900, yearly: 575000, bills: -1,   products: -1,  customers: -1,  duration: 30 }
} as const;

function getRazorpay() {
  if (!env.razorpayKeyId || !env.razorpayKeySecret) return null;
  return new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret
  });
}

// ============ CURRENT SUBSCRIPTION ============
router.get('/current', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    // Active subscription
    const { rows: subs } = await query(
      `SELECT * FROM subscriptions
       WHERE user_id = $1
       ORDER BY expires_at DESC
       LIMIT 1`,
      [userId]
    );
    const sub = subs[0];

    // Usage counts
    const [billsRes, productsRes, customersRes] = await Promise.all([
      query(
        `SELECT COUNT(*)::int AS c FROM bills
         WHERE user_id = $1
           AND created_at >= date_trunc('month', NOW())`,
        [userId]
      ),
      query(
        `SELECT COUNT(*)::int AS c FROM products
         WHERE user_id = $1 AND is_active = true`,
        [userId]
      ),
      query(
        `SELECT COUNT(*)::int AS c FROM customers WHERE user_id = $1`,
        [userId]
      )
    ]);

    // Payment history
    const { rows: payments } = await query(
      `SELECT * FROM payments
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [userId]
    );

    // Days remaining
    let daysRemaining = 0;
    if (sub) {
      daysRemaining = Math.max(0, Math.ceil(
        (new Date(sub.expires_at).getTime() - Date.now()) / 86400000
      ));
    }
// Fetch auto_renew from users table
const { rows: userRows } = await query(
  `SELECT auto_renew FROM users WHERE id = $1`,
  [userId]
);
const autoRenew = userRows[0]?.auto_renew || false;

    res.json({
      subscription: sub ? {
        id: sub.id,
        planCode: sub.plan_code,
        planName: PLANS[sub.plan_code as keyof typeof PLANS]?.name || sub.plan_code,
        status: sub.status,
        billingCycle: sub.billing_cycle,
        startedAt: sub.started_at,
        expiresAt: sub.expires_at,
        daysRemaining,
        autoRenew: false
      } : null,
      usage: {
        bills: billsRes.rows[0].c,
        products: productsRes.rows[0].c,
        customers: customersRes.rows[0].c
      },
      limits: sub ? PLANS[sub.plan_code as keyof typeof PLANS] : PLANS.free,
      payments: payments.map((p) => ({
        id: p.id,
        razorpayOrderId: p.razorpay_order_id,
        razorpayPaymentId: p.razorpay_payment_id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        planCode: p.plan_code,
        billingCycle: p.billing_cycle,
        createdAt: p.created_at
      }))
    });
  } catch (e) { next(e); }
});

// ============ CREATE ORDER (Razorpay) ============
router.post('/create-order', async (req, res, next) => {
  try {
    const razorpay = getRazorpay();
    if (!razorpay) {
      throw BadRequest('Payment system abhi available nahi hai — Razorpay keys missing');
    }

    const { planCode, billingCycle } = z.object({
      planCode: z.enum(['starter', 'pro', 'business']),
      billingCycle: z.enum(['monthly', 'yearly'])
    }).parse(req.body);

    const userId = req.user!.userId;
    const plan = PLANS[planCode];
    const amount = billingCycle === 'yearly' ? plan.yearly : plan.monthly;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `bb_${userId.slice(0, 8)}_${Date.now()}`,
      notes: { userId, planCode, billingCycle }
    });

    // Save payment record
    await query(
      `INSERT INTO payments
       (user_id, razorpay_order_id, amount, plan_code, billing_cycle, status)
       VALUES ($1, $2, $3, $4, $5, 'created')`,
      [userId, order.id, amount, planCode, billingCycle]
    );

    res.json({
      orderId: order.id,
      amount,
      currency: 'INR',
      keyId: env.razorpayKeyId
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ VERIFY PAYMENT ============
router.post('/verify', async (req, res, next) => {
  try {
    const body = z.object({
      razorpay_order_id: z.string(),
      razorpay_payment_id: z.string(),
      razorpay_signature: z.string(),
      planCode: z.enum(['starter', 'pro', 'business']),
      billingCycle: z.enum(['monthly', 'yearly'])
    }).parse(req.body);

    const userId = req.user!.userId;

    // Verify signature
    if (!env.razorpayKeySecret) {
      throw BadRequest('Razorpay not configured');
    }
    const expected = crypto
      .createHmac('sha256', env.razorpayKeySecret)
      .update(`${body.razorpay_order_id}|${body.razorpay_payment_id}`)
      .digest('hex');

    if (expected !== body.razorpay_signature) {
      throw BadRequest('Payment signature invalid — verification fail');
    }

    // Process in transaction
    const result = await withTransaction(async (client) => {
      const { rows } = await client.query(
        `SELECT * FROM payments WHERE razorpay_order_id = $1 AND user_id = $2 FOR UPDATE`,
        [body.razorpay_order_id, userId]
      );
      if (!rows.length) throw NotFound('Payment record nahi mila');

      const payment = rows[0];

      // Idempotency
      if (payment.status === 'paid') {
        return { alreadyProcessed: true };
      }

      // Update payment
      await client.query(
        `UPDATE payments
         SET status = 'paid', razorpay_payment_id = $1, updated_at = NOW()
         WHERE id = $2`,
        [body.razorpay_payment_id, payment.id]
      );

      // Calculate expiry (extend if active)
      const { rows: subRows } = await client.query(
        `SELECT expires_at FROM subscriptions
         WHERE user_id = $1 AND status = 'active'
         ORDER BY expires_at DESC LIMIT 1`,
        [userId]
      );

      const base = subRows.length > 0 && new Date(subRows[0].expires_at) > new Date()
        ? new Date(subRows[0].expires_at)
        : new Date();

      const days = body.billingCycle === 'yearly' ? 365 : 30;
      const expiresAt = new Date(base.getTime() + days * 86400000);

      // New subscription
      await client.query(
        `INSERT INTO subscriptions
         (user_id, plan_code, billing_cycle, status, expires_at,
          razorpay_payment_id, razorpay_order_id)
         VALUES ($1, $2, $3, 'active', $4, $5, $6)`,
        [userId, body.planCode, body.billingCycle, expiresAt,
         body.razorpay_payment_id, body.razorpay_order_id]
      );

      // Update user
      await client.query(
        `UPDATE users
         SET plan_code = $1, plan_status = 'active', plan_expires_at = $2, updated_at = NOW()
         WHERE id = $3`,
        [body.planCode, expiresAt, userId]
      );

      return { expiresAt, planCode: body.planCode };
    });

    res.json({
      ok: true,
      alreadyProcessed: result.alreadyProcessed || false,
      expiresAt: (result as any).expiresAt,
      planCode: (result as any).planCode
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ AUTO-RENEW TOGGLE ============
router.patch('/auto-renew', async (req, res, next) => {
  try {
    const { autoRenew } = z.object({ autoRenew: z.boolean() }).parse(req.body);
    await query(
      'UPDATE users SET auto_renew = $1, updated_at = NOW() WHERE id = $2',
      [autoRenew, req.user!.userId]
    );
    res.json({ ok: true, autoRenew });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

export default router;