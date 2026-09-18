// import { Router } from 'express';
// import { query } from '../../db.js';
// import { verifyAdminToken } from '../../utils/adminJwt.js';
// import { Unauthorized } from '../../utils/errors.js';

// const router = Router();

// function requireAdmin(req: any, _res: any, next: any) {
//   const h = req.headers.authorization;
//   if (!h?.startsWith('Bearer ')) return next(Unauthorized());
//   try { verifyAdminToken(h.slice(7)); next(); }
//   catch { next(Unauthorized()); }
// }

// router.use(requireAdmin);

// router.get('/stats', async (_req, res, next) => {
//   try {
//     const [u, p, mrr, rev, signups] = await Promise.all([
//       query('SELECT COUNT(*)::int AS c FROM users'),
//       query(`SELECT COUNT(DISTINCT user_id)::int AS c FROM subscriptions WHERE status = 'active' AND plan_code <> 'free'`),
//       query(`SELECT COALESCE(SUM(CASE
//         WHEN billing_cycle = 'yearly' THEN
//           CASE plan_code WHEN 'starter' THEN 95000 WHEN 'pro' THEN 239000 WHEN 'business' THEN 575000 ELSE 0 END/12
//         ELSE
//           CASE plan_code WHEN 'starter' THEN 9900 WHEN 'pro' THEN 24900 WHEN 'business' THEN 59900 ELSE 0 END
//       END), 0)::int AS mrr FROM subscriptions WHERE status = 'active' AND plan_code <> 'free'`),
//       query(`SELECT COALESCE(SUM(amount), 0)::int AS t FROM payments WHERE status = 'paid' AND created_at >= date_trunc('month', NOW())`),
//       query(`SELECT
//         COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE)::int AS today,
//         COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '6 days')::int AS week,
//         COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::int AS month
//         FROM users`)
//     ]);

//     const totalUsers = u.rows[0].c;
//     const paidUsers = p.rows[0].c;

//     res.json({
//       totalUsers, paidUsers, freeUsers: totalUsers - paidUsers,
//       mrr: mrr.rows[0].mrr, arr: mrr.rows[0].mrr * 12,
//       revenueThisMonth: rev.rows[0].t,
//       newSignupsToday: signups.rows[0].today,
//       newSignupsThisWeek: signups.rows[0].week,
//       newSignupsThisMonth: signups.rows[0].month,
//       conversionRatePct: totalUsers > 0 ? Number(((paidUsers / totalUsers) * 100).toFixed(1)) : 0
//     });
//   } catch (e) { next(e); }
// });

// router.get('/revenue', async (_req, res, next) => {
//   try {
//     const { rows } = await query(
//       `SELECT d.day::date AS date, COALESCE(SUM(p.amount), 0)::int AS revenue
//        FROM generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, INTERVAL '1 day') d(day)
//        LEFT JOIN payments p ON p.created_at::date = d.day AND p.status = 'paid'
//        GROUP BY d.day ORDER BY d.day`
//     );
//     res.json({ points: rows.map(r => ({ date: r.date, revenue: r.revenue / 100, newUsers: 0, paidUsers: 0 })) });
//   } catch (e) { next(e); }
// });

// export default router;






import { Router } from 'express';
import { query } from '../../db.js';
import { verifyAdminToken } from '../../utils/adminJwt.js';
import { Unauthorized } from '../../utils/errors.js';

const router = Router();

// Auth middleware
function requireAdmin(req: any, _res: any, next: any) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return next(Unauthorized());
  try {
    verifyAdminToken(h.slice(7));
    next();
  } catch {
    next(Unauthorized());
  }
}

router.use(requireAdmin);

// ============================================
// STATS — All KPIs
// ============================================
router.get('/stats', async (_req, res, next) => {
  try {
    const [
      usersRes,
      paidRes,
      mrrRes,
      revThisRes,
      revLastRes,
      signupsRes,
      billsRes,
      productsRes,
      subsBreakdown
    ] = await Promise.all([
      // Total users
      query(`SELECT COUNT(*)::int AS c FROM users`),

      // Paid users (active paid subscription)
      query(
        `SELECT COUNT(DISTINCT user_id)::int AS c
         FROM subscriptions
         WHERE status = 'active' AND plan_code <> 'free'`
      ),

      // MRR — sum of monthly-equivalent for active paid subs
      query(
        `SELECT COALESCE(SUM(
           CASE
             WHEN billing_cycle = 'yearly' THEN
               CASE plan_code
                 WHEN 'starter' THEN 95000
                 WHEN 'pro' THEN 239000
                 WHEN 'business' THEN 575000
                 ELSE 0
               END / 12
             ELSE
               CASE plan_code
                 WHEN 'starter' THEN 9900
                 WHEN 'pro' THEN 24900
                 WHEN 'business' THEN 59900
                 ELSE 0
               END
           END
         ), 0)::int AS mrr
         FROM subscriptions
         WHERE status = 'active' AND plan_code <> 'free'`
      ),

      // Revenue this month
      query(
        `SELECT COALESCE(SUM(amount), 0)::int AS total
         FROM payments
         WHERE status = 'paid'
           AND created_at >= date_trunc('month', NOW())`
      ),

      // Revenue last month
      query(
        `SELECT COALESCE(SUM(amount), 0)::int AS total
         FROM payments
         WHERE status = 'paid'
           AND created_at >= date_trunc('month', NOW()) - INTERVAL '1 month'
           AND created_at < date_trunc('month', NOW())`
      ),

      // Signups
      query(
        `SELECT
           COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE)::int AS today,
           COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '6 days')::int AS week,
           COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW()))::int AS month
         FROM users`
      ),

      // Total bills
      query(`SELECT COUNT(*)::int AS c FROM bills`),

      // Products
      query(`SELECT COUNT(*)::int AS c FROM products WHERE is_active = true`),

      // Subscription plan breakdown
      query(
        `SELECT
           plan_code,
           COUNT(*)::int AS count
         FROM subscriptions
         WHERE status = 'active'
         GROUP BY plan_code`
      )
    ]);

    const totalUsers = usersRes.rows[0].c;
    const paidUsers = paidRes.rows[0].c;
    const mrr = mrrRes.rows[0].mrr;
    const revThis = revThisRes.rows[0].total;
    const revLast = revLastRes.rows[0].total;
    const growth = revLast > 0 ? ((revThis - revLast) / revLast) * 100 : 0;
    const conversion = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

    // Plan breakdown map
    const planMap: Record<string, number> = {
      free: 0, starter: 0, pro: 0, business: 0
    };
    subsBreakdown.rows.forEach((r) => {
      planMap[r.plan_code] = r.count;
    });

    res.json({
      totalUsers,
      activeUsers: totalUsers,
      totalShops: totalUsers,
      paidUsers,
      freeUsers: totalUsers - paidUsers,

      mrr,
      arr: mrr * 12,
      revenueThisMonth: revThis,
      revenueLastMonth: revLast,
      revenueGrowthPct: Number(growth.toFixed(1)),

      newSignupsToday: signupsRes.rows[0].today,
      newSignupsThisWeek: signupsRes.rows[0].week,
      newSignupsThisMonth: signupsRes.rows[0].month,

      churnRatePct: 0,
      conversionRatePct: Number(conversion.toFixed(1)),

      totalBills: billsRes.rows[0].c,
      totalProductsTracked: productsRes.rows[0].c,
      totalRevenueProcessed: 0,

      planBreakdown: planMap
    });
  } catch (e) {
    next(e);
  }
});

// ============================================
// REVENUE CHART — Last 30 days
// ============================================
router.get('/revenue', async (req, res, next) => {
  try {
    const days = Math.min(Number(req.query.days) || 30, 90);

    const { rows } = await query(
      `SELECT
         d.day::date AS date,
         COALESCE(SUM(p.amount), 0)::int AS revenue,
         (SELECT COUNT(*)::int FROM users u
          WHERE u.created_at::date = d.day) AS new_users,
         (SELECT COUNT(*)::int FROM subscriptions s
          WHERE s.status = 'active'
            AND s.plan_code <> 'free'
            AND s.created_at::date = d.day) AS paid_users
       FROM generate_series(
         CURRENT_DATE - ($1::int - 1) * INTERVAL '1 day',
         CURRENT_DATE,
         INTERVAL '1 day'
       ) d(day)
       LEFT JOIN payments p
         ON p.created_at::date = d.day AND p.status = 'paid'
       GROUP BY d.day
       ORDER BY d.day`,
      [days]
    );

    res.json({
      points: rows.map((r) => ({
        date: r.date,
        revenue: r.revenue / 100, // paise → rupees
        newUsers: r.new_users,
        paidUsers: r.paid_users
      }))
    });
  } catch (e) {
    next(e);
  }
});

// ============================================
// RECENT USERS — Last 10
// ============================================
router.get('/recent-users', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         id, shop_name, owner_name, mobile, email,
         plan_code, plan_status, city, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT 10`
    );

    res.json({
      users: rows.map((u) => ({
        id: u.id,
        shopName: u.shop_name,
        ownerName: u.owner_name,
        mobile: u.mobile,
        email: u.email,
        planCode: u.plan_code,
        planStatus: u.plan_status,
        city: u.city,
        createdAt: u.created_at
      }))
    });
  } catch (e) {
    next(e);
  }
});

// ============================================
// RECENT PAYMENTS — Last 10
// ============================================
router.get('/recent-payments', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         p.id, p.amount, p.status, p.plan_code, p.billing_cycle,
         p.razorpay_payment_id, p.created_at,
         u.shop_name, u.owner_name
       FROM payments p
       JOIN users u ON u.id = p.user_id
       WHERE p.status = 'paid'
       ORDER BY p.created_at DESC
       LIMIT 10`
    );

    res.json({
      payments: rows.map((p) => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        planCode: p.plan_code,
        billingCycle: p.billing_cycle,
        razorpayPaymentId: p.razorpay_payment_id,
        shopName: p.shop_name,
        ownerName: p.owner_name,
        createdAt: p.created_at
      }))
    });
  } catch (e) {
    next(e);
  }
});

// ============================================
// TOP SHOPS — Highest paying
// ============================================
router.get('/top-shops', async (_req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT
         u.id, u.shop_name, u.owner_name, u.mobile, u.city,
         u.plan_code,
         COALESCE(SUM(p.amount), 0)::int AS lifetime_value,
         COUNT(p.id)::int AS payment_count
       FROM users u
       LEFT JOIN payments p ON p.user_id = u.id AND p.status = 'paid'
       GROUP BY u.id, u.shop_name, u.owner_name, u.mobile, u.city, u.plan_code
       ORDER BY lifetime_value DESC
       LIMIT 10`
    );

    res.json({
      shops: rows.map((s) => ({
        id: s.id,
        shopName: s.shop_name,
        ownerName: s.owner_name,
        mobile: s.mobile,
        city: s.city,
        planCode: s.plan_code,
        lifetimeValue: s.lifetime_value,
        paymentCount: s.payment_count
      }))
    });
  } catch (e) {
    next(e);
  }
});

// ============================================
// SYSTEM HEALTH
// ============================================
router.get('/health', async (_req, res, next) => {
  try {
    const start = Date.now();
    await query('SELECT 1');
    const dbLatency = Date.now() - start;

    const { rows: counts } = await query(
      `SELECT
         (SELECT COUNT(*)::int FROM users) AS users,
         (SELECT COUNT(*)::int FROM bills) AS bills,
         (SELECT COUNT(*)::int FROM products WHERE is_active = true) AS products,
         (SELECT COUNT(*)::int FROM subscriptions WHERE status = 'active') AS active_subs`
    );

    res.json({
      status: 'ok',
      dbLatencyMs: dbLatency,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      counts: counts[0]
    });
  } catch (e) {
    next(e);
  }
});

export default router;