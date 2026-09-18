import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { BadRequest, NotFound } from '../utils/errors.js';

const router = Router();
router.use(requireAuth);

// ============ SCHEMA ============
const itemSchema = z.object({
  purchasePrice: z.number().int().min(0).default(0),  // ← ADD
  profit: z.number().int().default(0),                 // ← ADD
  productId: z.string(),
  name: z.string(),
  unit: z.string(),
  price: z.number().int().min(0),
  quantity: z.number().int().min(1),
  discount: z.number().int().min(0).default(0),
  taxRate: z.number().int().min(0).default(0),
  lineTotal: z.number().int().min(0),
  
});

const billSchema = z.object({
  customerId: z.string().uuid().optional().nullable(),
  customerName: z.string().max(120).optional().nullable(),
  customerMobile: z.string().max(15).optional().nullable(),
  items: z.array(itemSchema).min(1),
  subtotal: z.number().int().min(0),
  itemDiscounts: z.number().int().min(0).default(0),
  billDiscount: z.number().int().min(0).default(0),
  discountType: z.enum(['flat', 'percent']).default('flat'),
  discountValue: z.number().int().min(0).default(0),
  gstEnabled: z.boolean().default(false),
  gstRate: z.number().int().min(0).default(0),
  gstAmount: z.number().int().min(0).default(0),
  roundOff: z.number().int().default(0),
  total: z.number().int().min(0),
  paymentMode: z.enum(['cash', 'upi', 'card', 'udhaar', 'split']),
  notes: z.string().max(500).optional().nullable()
});

// ============ LIST with filters ============
router.get('/', async (req, res, next) => {
  try {
    const { from, to, q, status, mode, sort } = req.query;
    const userId = req.user!.userId;

    const params: any[] = [userId];
    let where = 'WHERE user_id = $1';

    if (from) { params.push(from); where += ` AND created_at >= $${params.length}`; }
    if (to)   { params.push(to);   where += ` AND created_at <= $${params.length}`; }
    if (status && status !== 'all') { params.push(status); where += ` AND payment_status = $${params.length}`; }
    if (mode && mode !== 'all')     { params.push(mode);   where += ` AND payment_mode = $${params.length}`; }

    if (q) {
      params.push('%' + String(q).toLowerCase() + '%');
      where += ` AND (
        LOWER(bill_number) LIKE $${params.length}
        OR LOWER(customer_name) LIKE $${params.length}
        OR customer_mobile LIKE $${params.length}
      )`;
    }

    const orderBy =
      sort === 'amount_desc' ? 'total DESC'
      : sort === 'amount_asc' ? 'total ASC'
      : sort === 'customer' ? 'customer_name ASC'
      : 'created_at DESC';

    const { rows } = await query(
      `SELECT
         id, bill_number, customer_id, customer_name, customer_mobile,
         jsonb_array_length(items) AS item_count,
         total, paid_amount, due_amount,
         payment_mode, payment_status, created_at
       FROM bills ${where} ORDER BY ${orderBy} LIMIT 500`,
      params
    );

    // Summary for the current filter
    const { rows: summaryRows } = await query(
      `SELECT
         COUNT(*)::int AS total_bills,
         COALESCE(SUM(total), 0)::int AS total_amount,
         COALESCE(SUM(paid_amount), 0)::int AS total_paid,
         COALESCE(SUM(due_amount), 0)::int AS total_due
       FROM bills ${where}`,
      params
    );

    res.json({
      bills: rows.map(mapBill),
      summary: summaryRows[0]
    });
  } catch (e) { next(e); }
});

// ============ GET ONE (with shop info) ============
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    // Fetch bill
    const { rows } = await query(
      'SELECT * FROM bills WHERE user_id = $1 AND id = $2',
      [userId, req.params.id]
    );
    if (!rows.length) throw NotFound('Bill nahi mila');

    const b = rows[0];

    // Fetch shop info + settings
    const [userRes, settingsRes] = await Promise.all([
      query(
        `SELECT shop_name, owner_name, mobile, email, address, city, state, pincode, gstin, logo_url
         FROM users WHERE id = $1`,
        [userId]
      ),
      query(
        `SELECT bill_show_logo, bill_show_qr, bill_upi_id, bill_footer_note,
                bill_terms, bill_template
         FROM user_settings WHERE user_id = $1`,
        [userId]
      )
    ]);

    const user = userRes.rows[0] || {};
    const settings = settingsRes.rows[0] || {};

    res.json({
      bill: {
        id: b.id,
        number: b.bill_number,
        customerId: b.customer_id,
        customerName: b.customer_name,
        customerMobile: b.customer_mobile,
        items: b.items,
        subtotal: b.subtotal,
        itemDiscounts: b.item_discounts,
        billDiscount: b.bill_discount,
        discountType: b.discount_type,
        discountValue: b.discount_value,
        gstEnabled: b.gst_enabled,
        gstRate: b.gst_rate,
        gstAmount: b.gst_amount,
        roundOff: b.round_off,
        total: b.total,
        paymentMode: b.payment_mode,
        paymentStatus: b.payment_status,
        paidAmount: b.paid_amount,
        dueAmount: b.due_amount,
        notes: b.notes,
        createdAt: b.created_at
      },
      shop: {
        name: user.shop_name,
        owner: user.owner_name,
        mobile: user.mobile,
        email: user.email,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        gstin: user.gstin,
        logoUrl: user.logo_url
      },
      settings: {
        showLogo: settings.bill_show_logo !== false,
        showQR: settings.bill_show_qr || false,
        upiId: settings.bill_upi_id || '',
        footerNote: settings.bill_footer_note || 'Dhanyavaad! Phir aane ke liye shukriya',
        terms: settings.bill_terms || '',
        template: settings.bill_template || 'classic'
      }
    });
  } catch (e) { next(e); }
});

// ============ CREATE ============
router.post('/', async (req, res, next) => {
  try {
    const b = billSchema.parse(req.body);
    const userId = req.user!.userId;

    const bill = await withTransaction(async (client) => {
      // 1. Bill number
      const { rows: s } = await client.query(
        `SELECT bill_prefix, bill_next_number FROM user_settings
         WHERE user_id = $1 FOR UPDATE`,
        [userId]
      );
      const prefix = s[0]?.bill_prefix || 'INV';
      const num = s[0]?.bill_next_number || 1;
      const billNumber = `${prefix}-${String(num).padStart(3, '0')}`;

  // 2. Payment status
const isUdhaar = b.paymentMode === 'udhaar';
const paid = isUdhaar ? 0 : b.total;
const due = b.total - paid;
const status = due <= 0 ? 'paid' : paid > 0 ? 'partial' : 'pending';

// // Total profit calculate — REAL profit
// const totalProfit = b.items.reduce((sum, item) => {
//   const itemProfit =
//     (item.price - (item.purchasePrice || 0)) * item.quantity - item.discount;
//   return sum + itemProfit;
// }, 0);

// // 3. Insert bill
// const { rows: billRows } = await client.query(
//   `INSERT INTO bills
//    (user_id, bill_number, customer_id, customer_name, customer_mobile,
//     items, subtotal, item_discounts, bill_discount, discount_type, discount_value,
//     gst_enabled, gst_rate, gst_amount, round_off, total, total_profit,
//     payment_mode, payment_status, paid_amount, due_amount, notes)
//    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
//    RETURNING *`,
//   [
//     userId,
//     billNumber,
//     b.customerId || null,
//     b.customerName || 'Walk-in',
//     b.customerMobile || null,
//     JSON.stringify(b.items),
//     b.subtotal,
//     b.itemDiscounts,
//     b.billDiscount,
//     b.discountType,
//     b.discountValue,
//     b.gstEnabled,
//     b.gstRate,
//     b.gstAmount,
//     b.roundOff,
//     b.total,
//     totalProfit,           // ← YE ADD KARO
//     b.paymentMode,
//     status,
//     paid,
//     due,
//     b.notes || null
//   ]
// );

// Real profit: Sum of item profits MINUS bill-level discount
const itemProfitSum = b.items.reduce((sum, item) => {
  const itemProfit =
    (item.price - (item.purchasePrice || 0)) * item.quantity - item.discount;
  return sum + itemProfit;
}, 0);

// Bill-level discount bhi profit se minus karo
const totalProfit = itemProfitSum - (b.billDiscount || 0);


// Insert bill
const { rows: billRows } = await client.query(
  `INSERT INTO bills
   (user_id, bill_number, customer_id, customer_name, customer_mobile,
    items, subtotal, item_discounts, bill_discount, discount_type, discount_value,
    gst_enabled, gst_rate, gst_amount, round_off, total, total_profit,
    payment_mode, payment_status, paid_amount, due_amount, notes)
   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
   RETURNING *`,
  [
    userId,
    billNumber,
    b.customerId || null,
    b.customerName || 'Walk-in',
    b.customerMobile || null,
    JSON.stringify(b.items),
    b.subtotal,
    b.itemDiscounts,
    b.billDiscount,
    b.discountType,
    b.discountValue,
    b.gstEnabled,
    b.gstRate,
    b.gstAmount,
    b.roundOff,
    b.total,
    totalProfit,          // ← YE ADD KARO (position 17)
    b.paymentMode,
    status,
    paid,
    due,
    b.notes || null
  ]
);

const bill = billRows[0];

      // 4. Next bill number
      await client.query(
        'UPDATE user_settings SET bill_next_number = bill_next_number + 1 WHERE user_id = $1',
        [userId]
      );

      // 5. Decrease stock
      for (const item of b.items) {
        await client.query(
          `UPDATE products SET stock = GREATEST(0, stock - $1), updated_at = NOW()
           WHERE user_id = $2 AND id = $3`,
          [item.quantity, userId, item.productId]
        );
      }

      // 6. Update customer + ledger if udhaar
      if (b.customerId && isUdhaar) {
        await client.query(
          `UPDATE customers
           SET balance = balance + $1, total_billing = total_billing + $1,
               last_transaction_at = NOW(), updated_at = NOW()
           WHERE user_id = $2 AND id = $3`,
          [b.total, userId, b.customerId]
        );

        // Get updated balance for ledger
        const { rows: cust } = await client.query(
          'SELECT balance FROM customers WHERE id = $1',
          [b.customerId]
        );

        await client.query(
          `INSERT INTO ledger_entries
           (user_id, customer_id, bill_id, type, amount, balance_after, mode, note)
           VALUES ($1,$2,$3,'bill',$4,$5,'bill',$6)`,
          [userId, b.customerId, bill.id, b.total, cust[0].balance, `Bill ${billNumber}`]
        );
      } else if (b.customerId) {
        await client.query(
          `UPDATE customers
           SET total_billing = total_billing + $1, total_paid = total_paid + $1,
               last_transaction_at = NOW(), updated_at = NOW()
           WHERE user_id = $2 AND id = $3`,
          [b.total, userId, b.customerId]
        );
      }

      return bill;
    });

    res.status(201).json({
      bill: {
        id: bill.id,
        number: bill.bill_number,
        total: bill.total,
        paymentStatus: bill.payment_status,
        createdAt: bill.created_at
      }
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message, e.errors[0].path[0] as string));
    next(e);
  }
});

// ============ RECEIVE PAYMENT ============
router.post('/:id/payment', async (req, res, next) => {
  try {
    const { amount, mode } = z.object({
      amount: z.number().int().positive(),
      mode: z.enum(['cash', 'upi', 'card'])
    }).parse(req.body);

    const userId = req.user!.userId;
    const billId = req.params.id;

    const updated = await withTransaction(async (client) => {
      const { rows } = await client.query(
        'SELECT * FROM bills WHERE user_id = $1 AND id = $2 FOR UPDATE',
        [userId, billId]
      );
      if (!rows.length) throw NotFound('Bill nahi mila');

      const bill = rows[0];
      if (amount > bill.due_amount) throw BadRequest('Amount baki se zyada nahi');

      const newPaid = bill.paid_amount + amount;
      const newDue = bill.total - newPaid;
      const newStatus = newDue <= 0 ? 'paid' : 'partial';

      const { rows: updatedRows } = await client.query(
        `UPDATE bills SET paid_amount = $1, due_amount = $2, payment_status = $3
         WHERE id = $4 RETURNING *`,
        [newPaid, newDue, newStatus, billId]
      );

      // Update customer ledger if linked
      if (bill.customer_id) {
        await client.query(
          `UPDATE customers
           SET balance = GREATEST(0, balance - $1),
               total_paid = total_paid + $1,
               updated_at = NOW()
           WHERE user_id = $2 AND id = $3`,
          [amount, userId, bill.customer_id]
        );

        const { rows: cust } = await client.query(
          'SELECT balance FROM customers WHERE id = $1',
          [bill.customer_id]
        );

        await client.query(
          `INSERT INTO ledger_entries
           (user_id, customer_id, bill_id, type, amount, balance_after, mode, note)
           VALUES ($1,$2,$3,'payment',$4,$5,$6,$7)`,
          [userId, bill.customer_id, billId, -amount, cust[0].balance, mode, `Bill ${bill.bill_number}`]
        );
      }

      return updatedRows[0];
    });

    res.json({
      bill: {
        id: updated.id,
        paidAmount: updated.paid_amount,
        dueAmount: updated.due_amount,
        paymentStatus: updated.payment_status
      }
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ DELETE (restore stock + reverse udhaar) ============
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    await withTransaction(async (client) => {
      const { rows } = await client.query(
        'SELECT * FROM bills WHERE user_id = $1 AND id = $2',
        [userId, req.params.id]
      );
      if (!rows.length) throw NotFound('Bill nahi mila');

      const bill = rows[0];

      // Restore stock
      for (const item of bill.items as any[]) {
        await client.query(
          'UPDATE products SET stock = stock + $1 WHERE user_id = $2 AND id = $3',
          [item.quantity, userId, item.productId]
        );
      }

      // Reverse udhaar
      if (bill.customer_id && bill.due_amount > 0) {
        await client.query(
          `UPDATE customers
           SET balance = GREATEST(0, balance - $1), updated_at = NOW()
           WHERE user_id = $2 AND id = $3`,
          [bill.due_amount, userId, bill.customer_id]
        );
      }

      await client.query('DELETE FROM bills WHERE id = $1', [req.params.id]);
    });

    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ============ MAPPER ============
function mapBill(b: any) {
  return {
    id: b.id,
    number: b.bill_number,
    customerId: b.customer_id,
    customerName: b.customer_name,
    customerMobile: b.customer_mobile,
    itemCount: b.item_count,
    total: b.total,
    paidAmount: b.paid_amount,
    dueAmount: b.due_amount,
    paymentMode: b.payment_mode,
    paymentStatus: b.payment_status,
    createdAt: b.created_at
  };
}

export default router;