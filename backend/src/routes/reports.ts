// import { Router } from 'express';
// import { query } from '../db.js';
// import { requireAuth } from '../middleware/auth.js';

// const router = Router();
// router.use(requireAuth);

// router.get('/', async (req, res, next) => {
//   try {
//     const userId = req.user!.userId;
//     const from = req.query.from
//       ? String(req.query.from)
//       : new Date(Date.now() - 6 * 86400000).toISOString();
//     const to = req.query.to
//       ? String(req.query.to)
//       : new Date().toISOString();

//     const params = [userId, from, to];

//     // ============ 1. STATS ============
//     const { rows: statsRows } = await query(
//       `SELECT
//   COALESCE(SUM(total), 0)::int AS total_sales,
//   COALESCE(SUM(total_profit), 0)::int AS total_profit,  -- ← ADD
//   COUNT(*)::int AS total_bills,
//   COALESCE(AVG(total), 0)::int AS avg_bill
// FROM bills
// WHERE user_id = $1 AND created_at BETWEEN $2 AND $3`,
//       params
//     );
//     const stats = statsRows[0];
// const profit = stats.total_profit || 0;                // ✅ REAL  // ← Real profit from DB

//     // Previous period (for % change)
//     const fromMs = new Date(from).getTime();
//     const toMs = new Date(to).getTime();
//     const durationMs = toMs - fromMs;
//     const prevFrom = new Date(fromMs - durationMs - 1).toISOString();
//     const prevTo = new Date(fromMs - 1).toISOString();

//     const { rows: prevRows } = await query(
//       `SELECT
//      COALESCE(SUM(total), 0)::int AS prev_sales,
//      COALESCE(SUM(total_profit), 0)::int AS prev_profit,  -- ← ADD
//      COUNT(*)::int AS prev_bills
//    FROM bills
//    WHERE user_id = $1 AND created_at BETWEEN $2 AND $3`,
//       [userId, prevFrom, prevTo]
//     );
//     const prev = prevRows[0];

//     // ============ 2. TREND (day-wise) ============
//     const { rows: trendRows } = await query(
//       `SELECT
//          DATE_TRUNC('day', created_at)::date AS day,
//          COALESCE(SUM(total), 0)::int AS sales,
//          COALESCE(SUM(total_profit), 0)::int AS profit,
//          COUNT(*)::int AS bills
//        FROM bills
//        WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
//        GROUP BY day
//        ORDER BY day ASC`,
//       params
//     );

//     // ============ 3. PAYMENT BREAKDOWN ============
//     const { rows: payRows } = await query(
//       `SELECT
//          payment_mode AS mode,
//          COALESCE(SUM(total), 0)::int AS amount,
//          COUNT(*)::int AS count
//          COALESCE(SUM(total_profit), 0)::int AS profit,
//        FROM bills
//        WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
//        GROUP BY payment_mode`,
//       params
//     );

//     // ============ 4. TOP PRODUCTS ============
//     const { rows: topProducts } = await query(
//       `SELECT
//          item->>'productId' AS product_id,
//          item->>'name' AS name,
//          SUM((item->>'quantity')::int)::int AS quantity,
//          SUM((item->>'lineTotal')::int)::int AS revenue
//          COALESCE(SUM(total_profit), 0)::int AS profit,
//        FROM bills, jsonb_array_elements(items) AS item
//        WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
//        GROUP BY product_id, name
//        ORDER BY revenue DESC
//        LIMIT 10`,
//       params
//     );

//     // ============ 5. TOP CUSTOMERS ============
//     const { rows: topCustomers } = await query(
//       `SELECT
//          customer_id AS id,
//          customer_name AS name,
//          customer_mobile AS mobile,
//          COUNT(*)::int AS bills,
//          COALESCE(SUM(total), 0)::int AS business,
//          COALESCE(SUM(paid_amount), 0)::int AS paid,
//          COALESCE(SUM(total_profit), 0)::int AS profit,
//          COALESCE(SUM(due_amount), 0)::int AS pending
//        FROM bills
//        WHERE user_id = $1
//          AND customer_id IS NOT NULL
//          AND created_at BETWEEN $2 AND $3
//        GROUP BY customer_id, customer_name, customer_mobile
//        ORDER BY business DESC
//        LIMIT 10`,
//       params
//     );

//     // ============ 6. CATEGORY BREAKDOWN ============
//     // Build category map from products
//     const { rows: categoryRows } = await query(
//       `SELECT
//          p.category,
//          COALESCE(SUM((item->>'lineTotal')::int), 0)::int AS revenue,
//          SUM((item->>'quantity')::int)::int AS items
//        FROM bills b,
//             jsonb_array_elements(b.items) AS item
//        LEFT JOIN products p
//          ON p.id = (item->>'productId')::uuid
//        WHERE b.user_id = $1 AND b.created_at BETWEEN $2 AND $3
//        GROUP BY p.category
//        ORDER BY revenue DESC
//        LIMIT 8`,
//       params
//     );

//     // ============ 7. RECENT BILLS COUNT ============
//     const { rows: recentRows } = await query(
//       `SELECT COUNT(*)::int AS count FROM bills
//        WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'`,
//       [userId]
//     );

//     // ============ COMPUTE CHANGES ============
//     const salesChange = prev.prev_sales > 0
//       ? ((stats.total_sales - prev.prev_sales) / prev.prev_sales) * 100
//       : 0;
//     const billsChange = prev.prev_bills > 0
//       ? ((stats.total_bills - prev.prev_bills) / prev.prev_bills) * 100
//       : 0;

//     // ============ RESPONSE ============
//     res.json({
//       stats: {
//         totalSales: stats.total_sales,
//         totalProfit: profit,
//         totalBills: stats.total_bills,
//         avgBill: stats.avg_bill,
//         prevSales: prev.prev_sales,
//         prevProfit: prev.prev_profit || 0,   // ✅ REAL,
//         prevBills: prev.prev_bills,
//         salesChange: Number(salesChange.toFixed(1)),
//         billsChange: Number(billsChange.toFixed(1))
//       },
//       trend: trendRows.map((r) => ({
//   date: r.day,
//   label: new Date(r.day).toLocaleDateString('en-IN', { weekday: 'short' }),
//   fullLabel: new Date(r.day).toLocaleDateString('en-IN', {
//     day: 'numeric', month: 'short'
//   }),
//   sales: r.sales,
//   profit: r.profit || 0,                 // ✅ REAL
//   bills: r.bills
// })),
//       payments: payRows.map((p) => ({
//         mode: p.mode,
//         amount: p.amount,
//         count: p.count
//       })),
//       // topProducts: topProducts.map((p) => ({
//       //   id: p.product_id,
//       //   name: p.name,
//       //   quantity: p.quantity,
//       //   revenue: p.revenue,
//       //   profit: Math.round(p.revenue * 0.25)
//       // })),
//       topProducts: topProducts.map((p) => ({
//   id: p.product_id,
//   name: p.name,
//   quantity: p.quantity,
//   revenue: p.revenue,
//   profit: p.profit || 0                   // ✅ REAL (DB se)
// })),
//       topCustomers: topCustomers.map((c) => ({
//         id: c.id,
//         name: c.name,
//         mobile: c.mobile,
//         bills: c.bills,
//         business: c.business,
//         paid: c.paid,
//         pending: c.pending
//       })),
//       // categories: categoryRows.map((c) => ({
//       //   category: c.category || 'Other',
//       //   revenue: c.revenue,
//       //   items: c.items,
//       //   profit: Math.round(c.revenue * 0.25)
//       // })),
//       categories: categoryRows.map((c) => ({
//   category: c.category || 'Other',
//   revenue: c.revenue,
//   items: c.items,
//   profit: c.profit || 0                   // ✅ REAL
// })),
//       days: trendRows.map((r) => ({
//   date: r.day,
//   label: new Date(r.day).toLocaleDateString('en-IN', {
//     weekday: 'short', day: 'numeric', month: 'short'
//   }),
//   sales: r.sales,
//   profit: r.profit || 0,                 // ✅ REAL
//   bills: r.bills
// })),
//       recentBills: recentRows[0].count
//     });
//   } catch (e) { next(e); }
// });

// export default router;







import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;
    const from = req.query.from
      ? String(req.query.from)
      : new Date(Date.now() - 6 * 86400000).toISOString();
    const to = req.query.to
      ? String(req.query.to)
      : new Date().toISOString();

    const params = [userId, from, to];

    // ============ 1. STATS ============
    const { rows: statsRows } = await query(
      `SELECT
         COALESCE(SUM(total), 0)::int AS total_sales,
         COALESCE(SUM(total_profit), 0)::int AS total_profit,
         COUNT(*)::int AS total_bills,
         COALESCE(AVG(total), 0)::int AS avg_bill
       FROM bills
       WHERE user_id = $1 AND created_at BETWEEN $2 AND $3`,
      params
    );
    const stats = statsRows[0];

    // ============ 2. PREVIOUS PERIOD ============
    const fromMs = new Date(from).getTime();
    const toMs = new Date(to).getTime();
    const durationMs = toMs - fromMs;
    const prevFrom = new Date(fromMs - durationMs - 1).toISOString();
    const prevTo = new Date(fromMs - 1).toISOString();

    const { rows: prevRows } = await query(
      `SELECT
         COALESCE(SUM(total), 0)::int AS prev_sales,
         COALESCE(SUM(total_profit), 0)::int AS prev_profit,
         COUNT(*)::int AS prev_bills
       FROM bills
       WHERE user_id = $1 AND created_at BETWEEN $2 AND $3`,
      [userId, prevFrom, prevTo]
    );
    const prev = prevRows[0];

    // ============ 3. TREND ============
    const { rows: trendRows } = await query(
      `SELECT
         DATE_TRUNC('day', created_at)::date AS day,
         COALESCE(SUM(total), 0)::int AS sales,
         COALESCE(SUM(total_profit), 0)::int AS profit,
         COUNT(*)::int AS bills
       FROM bills
       WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
       GROUP BY DATE_TRUNC('day', created_at)::date
       ORDER BY day ASC`,
      params
    );

    // ============ 4. PAYMENT BREAKDOWN ============
    const { rows: payRows } = await query(
      `SELECT
         payment_mode AS mode,
         COALESCE(SUM(total), 0)::int AS amount,
         COUNT(*)::int AS count
       FROM bills
       WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
       GROUP BY payment_mode`,
      params
    );

    // ============ 5. TOP PRODUCTS ============
    const { rows: topProducts } = await query(
      `SELECT
         item->>'productId' AS product_id,
         item->>'name' AS name,
         SUM(COALESCE((item->>'quantity')::int, 0))::int AS quantity,
         SUM(COALESCE((item->>'lineTotal')::int, 0))::int AS revenue,
         SUM(COALESCE((item->>'profit')::int, 0))::int AS profit
       FROM bills,
            jsonb_array_elements(items) AS item
       WHERE user_id = $1 AND created_at BETWEEN $2 AND $3
       GROUP BY item->>'productId', item->>'name'
       ORDER BY revenue DESC
       LIMIT 10`,
      params
    );

    // ============ 6. TOP CUSTOMERS ============
    const { rows: topCustomers } = await query(
      `SELECT
         customer_id AS id,
         customer_name AS name,
         customer_mobile AS mobile,
         COUNT(*)::int AS bills,
         COALESCE(SUM(total), 0)::int AS business,
         COALESCE(SUM(paid_amount), 0)::int AS paid,
         COALESCE(SUM(due_amount), 0)::int AS pending
       FROM bills
       WHERE user_id = $1
         AND customer_id IS NOT NULL
         AND created_at BETWEEN $2 AND $3
       GROUP BY customer_id, customer_name, customer_mobile
       ORDER BY business DESC
       LIMIT 10`,
      params
    );

    // ============ 7. CATEGORY ============
    const { rows: categoryRows } = await query(
      `SELECT
         p.category AS category,
         COALESCE(SUM((item->>'lineTotal')::int), 0)::int AS revenue,
         SUM((item->>'quantity')::int)::int AS items,
         COALESCE(SUM(COALESCE((item->>'profit')::int, 0)), 0)::int AS profit
       FROM bills b,
            jsonb_array_elements(b.items) AS item
       LEFT JOIN products p ON p.id = (item->>'productId')::uuid
       WHERE b.user_id = $1 AND b.created_at BETWEEN $2 AND $3
       GROUP BY p.category
       ORDER BY revenue DESC
       LIMIT 8`,
      params
    );

    // ============ 8. RECENT BILLS ============
    const { rows: recentRows } = await query(
      `SELECT COUNT(*)::int AS count FROM bills
       WHERE user_id = $1 AND created_at >= NOW() - INTERVAL '24 hours'`,
      [userId]
    );

    // ============ COMPUTE CHANGES ============
    const salesChange = prev.prev_sales > 0
      ? ((stats.total_sales - prev.prev_sales) / prev.prev_sales) * 100
      : 0;
    const billsChange = prev.prev_bills > 0
      ? ((stats.total_bills - prev.prev_bills) / prev.prev_bills) * 100
      : 0;

    // ============ RESPONSE ============
    res.json({
      stats: {
        totalSales: stats.total_sales,
        totalProfit: stats.total_profit,
        totalBills: stats.total_bills,
        avgBill: stats.avg_bill,
        prevSales: prev.prev_sales,
        prevProfit: prev.prev_profit,
        prevBills: prev.prev_bills,
        salesChange: Number(salesChange.toFixed(1)),
        billsChange: Number(billsChange.toFixed(1))
      },
      trend: trendRows.map((r) => ({
        date: r.day,
        label: new Date(r.day).toLocaleDateString('en-IN', { weekday: 'short' }),
        fullLabel: new Date(r.day).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short'
        }),
        sales: r.sales,
        profit: r.profit,
        bills: r.bills
      })),
      payments: payRows.map((p) => ({
        mode: p.mode,
        amount: p.amount,
        count: p.count
      })),
      topProducts: topProducts.map((p) => ({
        id: p.product_id,
        name: p.name,
        quantity: p.quantity,
        revenue: p.revenue,
        profit: p.profit
      })),
      topCustomers: topCustomers.map((c) => ({
        id: c.id,
        name: c.name,
        mobile: c.mobile,
        bills: c.bills,
        business: c.business,
        paid: c.paid,
        pending: c.pending
      })),
      categories: categoryRows.map((c) => ({
        category: c.category || 'Other',
        revenue: c.revenue,
        items: c.items,
        profit: c.profit
      })),
      days: trendRows.map((r) => ({
        date: r.day,
        label: new Date(r.day).toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        }),
        sales: r.sales,
        profit: r.profit,
        bills: r.bills
      })),
      recentBills: recentRows[0].count
    });
  } catch (e: any) {
    console.error('Reports error:', e.message);
    next(e);
  }
});

export default router;