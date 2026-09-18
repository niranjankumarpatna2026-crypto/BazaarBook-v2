import { Router } from 'express';
// import { z } from 'zod';
// import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { BadRequest, NotFound } from '../utils/errors.js';
import multer from 'multer';
import { parse } from 'csv-parse/sync';

import { query, withTransaction } from '../db.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

// CSV upload config — memory only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ============ SCHEMA ============
const productSchema = z.object({
  name: z.string().min(1).max(180),
  barcode: z.string().max(60).optional().nullable(),
  category: z.string().max(60).default('General'),
  brand: z.string().max(80).optional().nullable(),
  unit: z.string().max(20).default('pcs'),
  price: z.number().int().min(0),
  purchasePrice: z.number().int().min(0).default(0),
  stock: z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(5),
  taxRate: z.number().int().min(0).max(28).default(0)
});

// ============ BULK CSV UPLOAD ============
router.post('/bulk', upload.single('file'), async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    if (!req.file) throw BadRequest('CSV file nahi mili');

    // Parse CSV
    let records: any[] = [];
    try {
      records = parse(req.file.buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true
      });
    } catch (e: any) {
      throw BadRequest(`CSV padhne mein error: ${e.message}`);
    }

    if (records.length === 0) throw BadRequest('CSV khaali hai');
    if (records.length > 5000) throw BadRequest('Ek baar mein 5000 se zyada products nahi');

    const result = await withTransaction(async (client) => {
      let count = 0;
      const errors: any[] = [];

      for (let i = 0; i < records.length; i++) {
        const r = records[i];

        // Support multiple header names (Hindi + English)
        const name = String(r.name || r.Name || r.NAAM || r['Saman ka naam'] || r['नाम'] || '').trim();
        const price = parseInt(r.price || r.Price || r['Bikri keemat'] || r['बिक्री मूल्य'] || '0', 10);
        const purchasePrice = parseInt(r.purchasePrice || r.purchase_price || r['Khareed keemat'] || r['खरीद मूल्य'] || '0', 10);
        const stock = parseInt(r.stock || r.Stock || r['Stock'] || r['स्टॉक'] || '0', 10);
        const category = String(r.category || r.Category || r['Category'] || 'General').trim();
        const brand = String(r.brand || r.Brand || r['Brand'] || '').trim();
        const unit = String(r.unit || r.Unit || r['Unit'] || 'pcs').trim();
        const barcode = String(r.barcode || r.Barcode || r['Barcode'] || '').trim();
        const reorderLevel = parseInt(r.reorderLevel || r.reorder_level || '5', 10);

        // Validate
        if (!name || name.length < 2) {
          errors.push({ row: i + 2, error: 'Naam missing' });
          continue;
        }
        if (isNaN(price) || price <= 0) {
          errors.push({ row: i + 2, error: 'Bikri keemat galat' });
          continue;
        }
        if (!isNaN(purchasePrice) && purchasePrice > 0 && price < purchasePrice) {
          errors.push({ row: i + 2, error: `Bikri (${price}) khareed (${purchasePrice}) se kam` });
          continue;
        }

        try {
          await client.query(
            `INSERT INTO products
             (user_id, name, barcode, category, brand, unit, price, purchase_price, stock, reorder_level)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [
              userId,
              name,
              barcode || null,
              category || 'General',
              brand || null,
              unit || 'pcs',
              price,
              isNaN(purchasePrice) ? 0 : purchasePrice,
              isNaN(stock) ? 0 : stock,
              isNaN(reorderLevel) ? 5 : reorderLevel
            ]
          );
          count++;
        } catch (e: any) {
          errors.push({ row: i + 2, error: e.message });
        }
      }

      return { count, errors };
    });

    res.json({
      ok: true,
      inserted: result.count,
      total: records.length,
      errors: result.errors
    });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ SAMPLE PRODUCTS (for new users) ============
router.post('/samples', async (req, res, next) => {
  try {
    const userId = req.user!.userId;

    // Check karo ki user ke paas already products toh nahi hain
    const existing = await query(
      'SELECT COUNT(*)::int AS count FROM products WHERE user_id = $1',
      [userId]
    );

    if (existing.rows[0].count > 0) {
      throw BadRequest('Aapke paas pehle se products hain');
    }

    const SAMPLE_PRODUCTS = [
      { name: 'Tata Salt 1kg',        category: 'Grocery',    unit: 'pkt', price: 28,  purchasePrice: 22,  stock: 50, reorderLevel: 10 },
      { name: 'Parle-G 250g',         category: 'Biscuit',    unit: 'pkt', price: 20,  purchasePrice: 16,  stock: 40, reorderLevel: 10 },
      { name: 'Surf Excel 1kg',       category: 'Detergent',  unit: 'pkt', price: 95,  purchasePrice: 78,  stock: 20, reorderLevel: 5 },
      { name: 'Colgate 100g',         category: 'Toothpaste', unit: 'pcs', price: 55,  purchasePrice: 44,  stock: 30, reorderLevel: 5 },
      { name: 'Amul Butter 100g',     category: 'Dairy',      unit: 'pcs', price: 62,  purchasePrice: 54,  stock: 15, reorderLevel: 5 },
      { name: 'Aashirvaad Atta 5kg',  category: 'Grocery',    unit: 'pkt', price: 260, purchasePrice: 240, stock: 10, reorderLevel: 3 },
      { name: 'Fortune Oil 1L',       category: 'Oil',        unit: 'ltr', price: 150, purchasePrice: 130, stock: 15, reorderLevel: 5 },
      { name: 'Maggi 70g',            category: 'Snacks',     unit: 'pcs', price: 14,  purchasePrice: 12,  stock: 60, reorderLevel: 20 },
      { name: 'Lux Soap 100g',        category: 'Soap',       unit: 'pcs', price: 45,  purchasePrice: 36,  stock: 25, reorderLevel: 5 },
      { name: 'Colin Glass Cleaner',  category: 'General',    unit: 'pcs', price: 90,  purchasePrice: 75,  stock: 10, reorderLevel: 3 }
    ];

    await withTransaction(async (client) => {
      for (const p of SAMPLE_PRODUCTS) {
        await client.query(
          `INSERT INTO products
           (user_id, name, category, unit, price, purchase_price, stock, reorder_level)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [userId, p.name, p.category, p.unit, p.price, p.purchasePrice, p.stock, p.reorderLevel]
        );
      }
    });

    res.json({ ok: true, count: SAMPLE_PRODUCTS.length });
  } catch (e) {
    next(e);
  }
});

// ============ LIST with search, filter, summary ============
router.get('/', async (req, res, next) => {
  try {
    const { q, category, lowStock } = req.query;
    const userId = req.user!.userId;

    const params: any[] = [userId];
    let where = 'WHERE user_id = $1 AND is_active = true';

    if (q) {
      params.push('%' + String(q).toLowerCase() + '%');
      where += ` AND (
        LOWER(name) LIKE $${params.length}
        OR LOWER(barcode) LIKE $${params.length}
        OR LOWER(brand) LIKE $${params.length}
      )`;
    }

    if (category && category !== 'all') {
      params.push(category);
      where += ` AND category = $${params.length}`;
    }

    if (lowStock === 'true') {
      where += ' AND stock <= reorder_level';
    }

    const { rows } = await query(
      `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT 500`,
      params
    );

    // Summary
    const summary = {
      total: rows.length,
      lowStock: rows.filter(r => r.stock > 0 && r.stock <= r.reorder_level).length,
      outOfStock: rows.filter(r => r.stock === 0).length,
      totalValue: rows.reduce((s, r) => s + (r.purchase_price * r.stock), 0)
    };

    res.json({ products: rows.map(map), summary });
  } catch (e) { next(e); }
});

// ============ GET BY BARCODE ============
router.get('/barcode/:code', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM products WHERE user_id = $1 AND barcode = $2 AND is_active = true LIMIT 1',
      [req.user!.userId, req.params.code]
    );
    if (!rows.length) return res.json({ product: null }); // Naya product hai
    res.json({ product: map(rows[0]) });
  } catch (e) { next(e); }
});

// ============ GET ONE ============
router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT * FROM products WHERE user_id = $1 AND id = $2 AND is_active = true',
      [req.user!.userId, req.params.id]
    );
    if (!rows.length) throw NotFound('Saman nahi mila');
    res.json({ product: map(rows[0]) });
  } catch (e) { next(e); }
});

// ============ CREATE (with duplicate merge) ============
router.post('/', async (req, res, next) => {
  try {
    const b = productSchema.parse(req.body);
    const userId = req.user!.userId;

    // Check same-name existing product
    const existing = await query(
      `SELECT id, name, stock FROM products
       WHERE user_id = $1 AND LOWER(name) = LOWER($2) AND is_active = true`,
      [userId, b.name.trim()]
    );

    if (existing.rowCount && existing.rowCount > 0) {
      // Merge: increase stock of existing product
      const { rows } = await query(
        `UPDATE products
         SET stock = stock + $1,
             price = CASE WHEN $2 > 0 THEN $2 ELSE price END,
             purchase_price = CASE WHEN $3 > 0 THEN $3 ELSE purchase_price END,
             updated_at = NOW()
         WHERE id = $4 RETURNING *`,
        [b.stock, b.price, b.purchasePrice, existing.rows[0].id]
      );
      return res.status(200).json({
        product: map(rows[0]),
        merged: true,
        message: `${b.name} pehle se tha — stock ${b.stock} badha diya`
      });
    }

    // Create new
    const { rows } = await query(
      `INSERT INTO products
       (user_id, name, barcode, category, brand, unit, price, purchase_price, stock, reorder_level, tax_rate)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [userId, b.name.trim(), b.barcode || null, b.category, b.brand || null,
       b.unit, b.price, b.purchasePrice, b.stock, b.reorderLevel, b.taxRate]
    );

    res.status(201).json({ product: map(rows[0]), merged: false });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message, e.errors[0].path[0] as string));
    next(e);
  }
});

// ============ UPDATE ============
router.patch('/:id', async (req, res, next) => {
  try {
    const b = productSchema.partial().parse(req.body);
    const userId = req.user!.userId;

    const fields: string[] = [];
    const params: any[] = [userId, req.params.id];
    const fieldMap: Record<string, string> = {
      name: 'name', barcode: 'barcode', category: 'category', brand: 'brand',
      unit: 'unit', price: 'price', purchasePrice: 'purchase_price',
      stock: 'stock', reorderLevel: 'reorder_level', taxRate: 'tax_rate'
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if ((b as any)[key] !== undefined) {
        params.push((b as any)[key]);
        fields.push(`${col} = $${params.length}`);
      }
    }

    if (!fields.length) throw BadRequest('Kuch badla nahi');

    const { rows } = await query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = NOW()
       WHERE user_id = $1 AND id = $2 RETURNING *`,
      params
    );
    if (!rows.length) throw NotFound('Saman nahi mila');
    res.json({ product: map(rows[0]) });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ QUICK STOCK ADJUST ============
router.post('/:id/stock', async (req, res, next) => {
  try {
    const { delta } = z.object({ delta: z.number().int() }).parse(req.body);
    const { rows } = await query(
      `UPDATE products SET stock = GREATEST(0, stock + $1), updated_at = NOW()
       WHERE user_id = $2 AND id = $3 RETURNING *`,
      [delta, req.user!.userId, req.params.id]
    );
    if (!rows.length) throw NotFound('Saman nahi mila');
    res.json({ product: map(rows[0]) });
  } catch (e: any) {
    if (e instanceof z.ZodError) return next(BadRequest(e.errors[0].message));
    next(e);
  }
});

// ============ DELETE (soft) ============
router.delete('/:id', async (req, res, next) => {
  try {
    const r = await query(
      'UPDATE products SET is_active = false WHERE user_id = $1 AND id = $2',
      [req.user!.userId, req.params.id]
    );
    if (!r.rowCount) throw NotFound('Saman nahi mila');
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ============ MAPPER ============
function map(p: any) {
  return {
    id: p.id,
    name: p.name,
    barcode: p.barcode,
    category: p.category,
    brand: p.brand,
    unit: p.unit,
    price: p.price,
    purchasePrice: p.purchase_price,
    stock: p.stock,
    reorderLevel: p.reorder_level,
    taxRate: p.tax_rate,
    createdAt: p.created_at,
    updatedAt: p.updated_at
  };
}

export default router;