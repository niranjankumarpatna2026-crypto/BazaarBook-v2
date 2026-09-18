import { Router } from 'express';
import { z } from 'zod';
import { query, withTransaction } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { BadRequest, NotFound } from '../utils/errors.js';

const router = Router();
router.use(requireAuth);

// ============ SCHEMA ============
const customerSchema = z.object({
  name: z.string().min(1).max(120),
  mobile: z.string().regex(/^\d{10}$/),
  address: z.string().max(255).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  group: z.enum(['regular', 'wholesale', 'vip']).default('regular'),
  notes: z.string().max(500).optional().nullable(),
  openingBalance: z.number().int().min(0).default(0)
});

// ============ LIST with filters ============
router.get('/', async (req, res, next) => {
  try {
    const { q, onlyDue, sort } = req.query;
    const userId = req.user!.userId;

    const params: any[] = [userId];
    let where = 'WHERE user_id = $1';

    if (q) {
      params.push('%' + String(q).toLowerCase() + '%');
      where += ` AND (LOWER(name) LIKE $${params.length} OR mobile LIKE $${params.length})`;
    }

    if (onlyDue === 'true') {
      where += ' AND balance > 0';
    }

    const orderBy =
      sort === 'name' ? 'name ASC'
      : sort === 'amount' ? 'total_billing DESC'
      : sort === 'recent' ? 'last_transaction_at DESC NULLS LAST'
      : 'balance DESC';

    const { rows } = await query(
      `SELECT * FROM customers ${where} ORDER BY ${orderBy} LIMIT 500`,
      params
    );

    // Summary
    const { rows: summaryRows } = await query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE balance > 0)::int AS pending_count,
         COALESCE(SUM(balance) FILTER (WHERE balance > 0), 0)::int AS pending_amount,
         COUNT(*) FILTER (WHERE balance <= 0)::int AS cleared_count
       FROM customers WHERE user_id = $1`,
      [userId]
    );

    const topDue = await query(
      `SELECT name, balance FROM customers
       WHERE user_id = $1 AND balance > 0
       ORDER BY balance DESC LIMIT 1`,
      [userId]
    );

    res.json({
      customers: rows.map(mapCustomer),
      summary: {
        ...summaryRows[0],
        topDue: topDue.rows[0] || null
      }
    });
  } catch (e) { next(e); }
});

// ============ GET ONE + Ledger ============
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM customers WHERE user_id = $1 AND id = $2',
      [req.user!.userId, req.params.id]
    );
    if (!rows.length) throw NotFound('Grahak nahi mila');

    const { rows: ledger } = await query(
      `SELECT * FROM ledger_entries
       WHERE user_id = $1 AND customer_id = $2
       ORDER BY created_at DESC LIMIT 200`,
      [req.user!.userId, req.params.id]
    );

    res.json({
      customer: mapCustomer(rows[0]),
      ledger: ledger.map(mapLedger)
    });
  } catch (e) { next(e); }
});

// ============ CREATE ============
router.post('/', async (req, res, next) => {
  try {
    const b = customerSchema.parse(req.body);
    const userId = req.user!.userId;

    const { rows } = await query(
      `INSERT INTO customers
       (user_id, name, mobile, address, city, group_type,
        balance, total_billing, total_paid, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$7,0,$8)
       RETURNING *`,
      [userId, b.name.trim(), b.mobile, b.address || null, b.city || null,
       b.group, b.openingBalance, b.notes || null]
    );

    // Add opening balance to ledger
    if (b.openingBalance > 0) {
      await query(
        `INSERT INTO ledger_entries
         (user_id, customer_id, type, amount, balance_after, note)
         VALUES ($1,$2,'adjustment',$3,$3,'Opening balance')`,
        [userId, rows[0].id, b.openingBalance]
      );
    }

    res.status(201).json({ customer: mapCustomer(rows[0]) });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message, e.errors[0].path[0] as string));
    next(e);
  }
});

// ============ UPDATE ============
router.patch('/:id', async (req, res, next) => {
  try {
    const b = customerSchema.partial().parse(req.body);
    const userId = req.user!.userId;

    const fields: string[] = [];
    const params: any[] = [userId, req.params.id];
    const fieldMap: Record<string, string> = {
      name: 'name', mobile: 'mobile', address: 'address',
      city: 'city', group: 'group_type', notes: 'notes'
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if ((b as any)[key] !== undefined) {
        params.push((b as any)[key]);
        fields.push(`${col} = $${params.length}`);
      }
    }

    if (!fields.length) throw BadRequest('Kuch badla nahi');

    const { rows } = await query(
      `UPDATE customers SET ${fields.join(', ')}, updated_at = NOW()
       WHERE user_id = $1 AND id = $2 RETURNING *`,
      params
    );
    if (!rows.length) throw NotFound('Grahak nahi mila');
    res.json({ customer: mapCustomer(rows[0]) });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ DELETE ============
router.delete('/:id', async (req, res, next) => {
  try {
    const r = await query(
      'DELETE FROM customers WHERE user_id = $1 AND id = $2',
      [req.user!.userId, req.params.id]
    );
    if (!r.rowCount) throw NotFound('Grahak nahi mila');
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ============ RECEIVE PAYMENT ============
router.post('/:id/payments', async (req, res, next) => {
  try {
    const { amount, mode, note } = z.object({
      amount: z.number().int().positive(),
      mode: z.enum(['cash', 'upi', 'card']),
      note: z.string().max(200).optional()
    }).parse(req.body);

    const userId = req.user!.userId;
    const customerId = req.params.id;

    const customer = await withTransaction(async (client) => {
      const { rows } = await client.query(
        'SELECT * FROM customers WHERE user_id = $1 AND id = $2 FOR UPDATE',
        [userId, customerId]
      );
      if (!rows.length) throw NotFound('Grahak nahi mila');

      const c = rows[0];
      if (amount > c.balance) throw BadRequest('Amount udhaar se zyada nahi');

      const newBalance = c.balance - amount;
      const newPaid = c.total_paid + amount;

      const { rows: updated } = await client.query(
        `UPDATE customers
         SET balance = $1, total_paid = $2, last_transaction_at = NOW(), updated_at = NOW()
         WHERE id = $3 RETURNING *`,
        [newBalance, newPaid, customerId]
      );

      await client.query(
        `INSERT INTO ledger_entries
         (user_id, customer_id, type, amount, balance_after, mode, note)
         VALUES ($1,$2,'payment',$3,$4,$5,$6)`,
        [userId, customerId, -amount, newBalance, mode, note || 'Payment received']
      );

      return updated[0];
    });

    res.json({ customer: mapCustomer(customer) });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ ADD UDHAAR ============
router.post('/:id/udhaar', async (req, res, next) => {
  try {
    const { amount, note } = z.object({
      amount: z.number().int().positive(),
      note: z.string().max(200).optional()
    }).parse(req.body);

    const userId = req.user!.userId;
    const customerId = req.params.id;

    const customer = await withTransaction(async (client) => {
      const { rows } = await client.query(
        'SELECT * FROM customers WHERE user_id = $1 AND id = $2 FOR UPDATE',
        [userId, customerId]
      );
      if (!rows.length) throw NotFound('Grahak nahi mila');

      const c = rows[0];
      const newBalance = c.balance + amount;
      const newBilling = c.total_billing + amount;

      const { rows: updated } = await client.query(
        `UPDATE customers
         SET balance = $1, total_billing = $2, last_transaction_at = NOW(), updated_at = NOW()
         WHERE id = $3 RETURNING *`,
        [newBalance, newBilling, customerId]
      );

      await client.query(
        `INSERT INTO ledger_entries
         (user_id, customer_id, type, amount, balance_after, note)
         VALUES ($1,$2,'adjustment',$3,$4,$5)`,
        [userId, customerId, amount, newBalance, note || 'Udhaar added']
      );

      return updated[0];
    });

    res.json({ customer: mapCustomer(customer) });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ MAPPER ============
function mapCustomer(c: any) {
  return {
    id: c.id,
    name: c.name,
    mobile: c.mobile,
    address: c.address,
    city: c.city,
    group: c.group_type,
    balance: c.balance,
    totalBilling: c.total_billing,
    totalPaid: c.total_paid,
    notes: c.notes,
    lastTransactionAt: c.last_transaction_at,
    createdAt: c.created_at
  };
}

function mapLedger(e: any) {
  return {
    id: e.id,
    type: e.type,
    amount: e.amount,
    balanceAfter: e.balance_after,
    mode: e.mode,
    note: e.note,
    billId: e.bill_id,
    createdAt: e.created_at
  };
}

export default router;