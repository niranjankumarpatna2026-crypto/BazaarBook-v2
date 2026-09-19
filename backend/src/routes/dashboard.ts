// backend/src/routes/dashboard.ts
import { Router } from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// ============ DASHBOARD STATS ============
router.get('/stats', async (req, res, next) => {
  try {
    const userId = (req as any).user.userId;

    // -------- Date helpers --------
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOf7Days = new Date(startOfToday);
    startOf7Days.setDate(startOf7Days.getDate() - 6);

    // -------- 1. Today's stats --------
    const todayRes = await query(
      `SELECT
         COALESCE(SUM(total), 0)::int          AS today_sales,
         COUNT(*)::int                         AS today_bills,
         COALESCE(SUM(total_profit), 0)::int   AS today_profit
       FROM bills
       WHERE user_id = $1 AND created_at >= $2`,
      [userId, startOfToday.toISOString()]
    );

    // -------- 2. Yesterday's sales (for % change) --------
    const yestRes = await query(
      `SELECT COALESCE(SUM(total), 0)::int AS yesterday_sales
       FROM bills
       WHERE user_id = $1 AND created_at >= $2 AND created_at < $3`,
      [userId, startOfYesterday.toISOString(), startOfToday.toISOString()]
    );

    // -------- 3. New customers today --------
    const newCustRes = await query(
      `SELECT COUNT(*)::int AS new_customers
       FROM customers
       WHERE user_id = $1 AND created_at >= $2`,
      [userId, startOfToday.toISOString()]
    );

    // -------- 4. Pending udhaar --------
    const udhaarRes = await query(
      `SELECT
         COALESCE(SUM(balance), 0)::int AS pending_udhaar,
         COUNT(*)::int                  AS pending_udhaar_count
       FROM customers
       WHERE user_id = $1 AND balance > 0`,
      [userId]
    );

    // -------- 5. Last 7 days sales (chart) --------
    const sales7dRes = await query(
      `SELECT
         DATE(created_at) AS date,
         COALESCE(SUM(total), 0)::int AS total,
         COUNT(*)::int AS bills
       FROM bills
       WHERE user_id = $1 AND created_at >= $2
       GROUP BY DATE(created_at)
       ORDER BY DATE(created_at) ASC`,
      [userId, startOf7Days.toISOString()]
    );

    // -------- 6. Top 5 selling products (last 7 days) --------
    const topProductsRes = await query(
      `SELECT
         item->>'productId'  AS id,
         item->>'name'       AS name,
         SUM((item->>'quantity')::int)::int AS quantity,
         SUM((item->>'lineTotal')::int)::int AS revenue
       FROM bills,
            jsonb_array_elements(items) AS item
       WHERE user_id = $1 AND created_at >= $2
       GROUP BY item->>'productId', item->>'name'
       ORDER BY revenue DESC
       LIMIT 5`,
      [userId, startOf7Days.toISOString()]
    );

    // -------- 7. Recent 5 bills --------
    const recentBillsRes = await query(
      `SELECT
         id, bill_number, customer_name, total,
         payment_mode, payment_status, created_at
       FROM bills
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    // -------- 8. Udhaar alerts (top 3) --------
    const udhaarAlertsRes = await query(
      `SELECT
         id AS customer_id, name AS customer_name, mobile,
         balance, last_transaction_at AS last_payment_date
       FROM customers
       WHERE user_id = $1 AND balance > 0
       ORDER BY balance DESC
       LIMIT 3`,
      [userId]
    );

    // -------- 9. Low stock items (top 5) --------
    const lowStockRes = await query(
      `SELECT id, name, stock, unit, reorder_level
       FROM products
       WHERE user_id = $1 AND stock <= reorder_level
       ORDER BY stock ASC
       LIMIT 5`,
      [userId]
    );

    // -------- Build day labels (Mon, Tue, ...) --------
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sales7d = sales7dRes.rows.map((r: any) => {
      const d = new Date(r.date);
      return {
        date: d.toISOString().slice(0, 10),
        label: dayNames[d.getDay()],
        total: r.total,
        bills: r.bills,
      };
    });

    // -------- Response --------
    res.json({
      stats: {
        todaySales: todayRes.rows[0].today_sales,
        todayBills: todayRes.rows[0].today_bills,
        todayProfit: todayRes.rows[0].today_profit,
        yesterdaySales: yestRes.rows[0].yesterday_sales,
        newCustomers: newCustRes.rows[0].new_customers,
        pendingUdhaar: udhaarRes.rows[0].pending_udhaar,
        pendingUdhaarCount: udhaarRes.rows[0].pending_udhaar_count,
      },
      sales7d,
      topProducts: topProductsRes.rows.map((p: any) => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        revenue: p.revenue,
      })),
      recentBills: recentBillsRes.rows.map((b: any) => ({
        id: b.id,
        number: b.bill_number,
        customerName: b.customer_name,
        total: b.total,
        paymentMode: b.payment_mode,
        status: b.payment_status,
        createdAt: b.created_at,
      })),
      udhaarAlerts: udhaarAlertsRes.rows.map((c: any) => ({
        customerId: c.customer_id,
        customerName: c.customer_name,
        mobile: c.mobile,
        balance: c.balance,
        lastPaymentDate: c.last_payment_date,
      })),
      lowStock: lowStockRes.rows.map((p: any) => ({
        id: p.id,
        name: p.name,
        stock: p.stock,
        unit: p.unit,
        reorderLevel: p.reorder_level,
      })),
    });
  } catch (e) {
    next(e);
  }
});

export default router;