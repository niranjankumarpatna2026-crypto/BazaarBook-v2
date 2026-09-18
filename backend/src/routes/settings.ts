import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { BadRequest } from '../utils/errors.js';

const router = Router();
router.use(requireAuth);

// ============ GET ALL SETTINGS ============
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    const [userRes, settingsRes] = await Promise.all([
      query(
        `SELECT owner_name, shop_name, mobile, email, business_type, city,
                address, state, pincode, gstin, logo_url
         FROM users WHERE id = $1`,
        [userId]
      ),
      query(
        `SELECT * FROM user_settings WHERE user_id = $1`,
        [userId]
      )
    ]);

    const user = userRes.rows[0] || {};
    const s = settingsRes.rows[0] || {};

    res.json({
      profile: {
        shopName: user.shop_name || '',
        ownerName: user.owner_name || '',
        mobile: user.mobile || '',
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        gstin: user.gstin || '',
        logoUrl: user.logo_url || '',
        businessType: user.business_type || 'Kirana'
      },
      bill: {
        prefix: s.bill_prefix || 'INV',
        startingNumber: s.bill_starting_number || 1,
        showLogo: s.bill_show_logo !== false,
        showQR: s.bill_show_qr || false,
        upiId: s.bill_upi_id || '',
        footerNote: s.bill_footer_note || 'Dhanyavaad! Phir aane ke liye shukriya',
        termsAndConditions: s.bill_terms || '',
        template: s.bill_template || 'classic',
        autoPrint: s.bill_auto_print || false
      },
      preferences: {
        language: s.language || 'hinglish',
        theme: s.theme || 'light',
        dateFormat: s.date_format || 'dd/mm/yyyy',
        numberFormat: s.number_format || 'indian'
      },
      notifications: {
        lowStockAlert: s.notify_low_stock !== false,
        udhaarReminder: s.notify_udhaar_reminder !== false,
        dailySummary: s.notify_daily_summary !== false,
        subscriptionExpiry: s.notify_subscription !== false,
        whatsappEnabled: s.notify_whatsapp !== false,
        smsEnabled: s.notify_sms || false,
        emailEnabled: s.notify_email || false,
        summaryTime: s.summary_time || '21:00'
      }
    });
  } catch (e) { next(e); }
});

// ============ UPDATE PROFILE ============
router.patch('/profile', async (req, res, next) => {
  try {
    const b = z.object({
      shopName: z.string().min(2).max(180),
      ownerName: z.string().min(2).max(120),
      mobile: z.string().regex(/^[6-9]\d{9}$/),
      email: z.string().email().optional().or(z.literal('')),
      address: z.string().max(255).optional().or(z.literal('')),
      city: z.string().max(80).optional().or(z.literal('')),
      state: z.string().max(80).optional().or(z.literal('')),
      pincode: z.string().max(10).optional().or(z.literal('')),
      gstin: z.string().max(20).optional().or(z.literal('')),
      logoUrl: z.string().optional().or(z.literal('')),
      businessType: z.string().max(60).optional().or(z.literal(''))
    }).parse(req.body);

    await query(
      `UPDATE users SET
         shop_name = $1, owner_name = $2, mobile = $3, email = $4,
         address = $5, city = $6, state = $7, pincode = $8,
         gstin = $9, logo_url = $10, business_type = $11,
         updated_at = NOW()
       WHERE id = $12`,
      [
        b.shopName.trim(), b.ownerName.trim(), b.mobile,
        b.email || null, b.address || null, b.city || null,
        b.state || null, b.pincode || null, b.gstin || null,
        b.logoUrl || null, b.businessType || 'Kirana',
        req.user!.userId
      ]
    );

    // Also ensure user_settings row exists
    await query(
      `INSERT INTO user_settings (user_id) VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [req.user!.userId]
    );

    res.json({ ok: true });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message, e.errors[0].path[0] as string));
    next(e);
  }
});

// ============ UPDATE BILL SETTINGS ============
router.patch('/bill', async (req, res, next) => {
  try {
    const b = z.object({
      prefix: z.string().min(1).max(10),
      startingNumber: z.number().int().min(1),
      showLogo: z.boolean(),
      showQR: z.boolean(),
      upiId: z.string().max(120).optional().or(z.literal('')),
      footerNote: z.string().max(200).optional().or(z.literal('')),
      termsAndConditions: z.string().max(500).optional().or(z.literal('')),
      template: z.enum(['classic', 'modern', 'minimal']),
      autoPrint: z.boolean()
    }).parse(req.body);

    await query(
      `INSERT INTO user_settings (user_id) VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [req.user!.userId]
    );

    await query(
      `UPDATE user_settings SET
         bill_prefix = $1, bill_starting_number = $2,
         bill_show_logo = $3, bill_show_qr = $4, bill_upi_id = $5,
         bill_footer_note = $6, bill_terms = $7,
         bill_template = $8, bill_auto_print = $9,
         updated_at = NOW()
       WHERE user_id = $10`,
      [
        b.prefix.toUpperCase(), b.startingNumber,
        b.showLogo, b.showQR, b.upiId || null,
        b.footerNote || null, b.termsAndConditions || null,
        b.template, b.autoPrint,
        req.user!.userId
      ]
    );

    res.json({ ok: true });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ UPDATE PREFERENCES ============
router.patch('/preferences', async (req, res, next) => {
  try {
    const b = z.object({
      language: z.enum(['hi', 'en', 'hinglish']),
      theme: z.enum(['light', 'dark', 'system']),
      dateFormat: z.enum(['dd/mm/yyyy', 'mm/dd/yyyy', 'dd-mmm-yy']),
      numberFormat: z.enum(['indian', 'international'])
    }).parse(req.body);

    await query(
      `INSERT INTO user_settings (user_id) VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [req.user!.userId]
    );

    await query(
      `UPDATE user_settings SET
         language = $1, theme = $2, date_format = $3, number_format = $4,
         updated_at = NOW()
       WHERE user_id = $5`,
      [b.language, b.theme, b.dateFormat, b.numberFormat, req.user!.userId]
    );

    res.json({ ok: true });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ UPDATE NOTIFICATIONS ============
router.patch('/notifications', async (req, res, next) => {
  try {
    const b = z.object({
      lowStockAlert: z.boolean(),
      udhaarReminder: z.boolean(),
      dailySummary: z.boolean(),
      subscriptionExpiry: z.boolean(),
      whatsappEnabled: z.boolean(),
      smsEnabled: z.boolean(),
      emailEnabled: z.boolean(),
      summaryTime: z.string().regex(/^\d{2}:\d{2}$/)
    }).parse(req.body);

    await query(
      `INSERT INTO user_settings (user_id) VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [req.user!.userId]
    );

    await query(
      `UPDATE user_settings SET
         notify_low_stock = $1, notify_udhaar_reminder = $2,
         notify_daily_summary = $3, notify_subscription = $4,
         notify_whatsapp = $5, notify_sms = $6, notify_email = $7,
         summary_time = $8, updated_at = NOW()
       WHERE user_id = $9`,
      [
        b.lowStockAlert, b.udhaarReminder, b.dailySummary,
        b.subscriptionExpiry, b.whatsappEnabled, b.smsEnabled,
        b.emailEnabled, b.summaryTime, req.user!.userId
      ]
    );

    res.json({ ok: true });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ DATA EXPORT ============
router.get('/export/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const userId = req.user!.userId;
    let csv = '';
    let filename = '';

    if (type === 'products') {
      const { rows } = await query(
        `SELECT id, name, category, brand, unit, price, purchase_price, stock, reorder_level
         FROM products WHERE user_id = $1 AND is_active = true
         ORDER BY name`,
        [userId]
      );
      csv = 'ID,Name,Category,Brand,Unit,Price,Purchase Price,Stock,Reorder Level\n' +
        rows.map(r => [
          r.id, `"${r.name}"`, r.category, r.brand || '', r.unit,
          r.price, r.purchase_price, r.stock, r.reorder_level
        ].join(',')).join('\n');
      filename = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (type === 'customers') {
      const { rows } = await query(
        `SELECT id, name, mobile, address, city, balance, total_billing, total_paid
         FROM customers WHERE user_id = $1 ORDER BY name`,
        [userId]
      );
      csv = 'ID,Name,Mobile,Address,City,Balance,Total Billing,Total Paid\n' +
        rows.map(r => [
          r.id, `"${r.name}"`, r.mobile, `"${r.address || ''}"`, r.city || '',
          r.balance, r.total_billing, r.total_paid
        ].join(',')).join('\n');
      filename = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
    } else if (type === 'bills') {
      const { rows } = await query(
        `SELECT bill_number, customer_name, customer_mobile, total, paid_amount, due_amount, payment_mode, payment_status, created_at
         FROM bills WHERE user_id = $1 ORDER BY created_at DESC`,
        [userId]
      );
      csv = 'Bill No,Customer,Mobile,Total,Paid,Due,Mode,Status,Date\n' +
        rows.map(r => [
          r.bill_number, `"${r.customer_name}"`, r.customer_mobile || '',
          r.total, r.paid_amount, r.due_amount, r.payment_mode, r.payment_status,
          new Date(r.created_at).toLocaleDateString('en-IN')
        ].join(',')).join('\n');
      filename = `bills-${new Date().toISOString().slice(0, 10)}.csv`;
    } else {
      throw BadRequest('Invalid export type');
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv);
  } catch (e) { next(e); }
});

// ============ CHANGE PASSWORD ============
router.post('/change-password', async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = z.object({
      currentPassword: z.string().min(1),
      newPassword: z.string().min(6)
    }).parse(req.body);

    const { comparePassword, hashPassword } = await import('../utils/password.js');

    const { rows } = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user!.userId]
    );

    const ok = await comparePassword(currentPassword, rows[0].password_hash);
    if (!ok) throw BadRequest('Current password galat hai', 'currentPassword');

    const hash = await hashPassword(newPassword);
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [hash, req.user!.userId]
    );

    res.json({ ok: true });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

export default router;