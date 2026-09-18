import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Package, Search, X, Edit2, Trash2, Minus,
  AlertTriangle, CheckCircle2, XCircle, TrendingUp, Barcode
} from 'lucide-react';
import { toast } from 'sonner';
import { inr } from '@/lib/format';
import { api } from '@/lib/api';

import { Upload, Sparkles, } from 'lucide-react';
import { ImportCsvModal } from '@/features/inventory/ImportCsvModal';

import { BarcodeScanner } from '@/features/inventory/BarcodeScanner';

// ============ TYPES ============
type Product = {
  id: string;
  name: string;
  barcode?: string;
  category: string;
  brand?: string;
  unit: string;
  price: number;
  purchasePrice: number;
  stock: number;
  reorderLevel: number;
  taxRate: number;
};

type ProductDraft = Omit<Product, 'id'>;

const EMPTY: ProductDraft = {
  name: '',
  barcode: '',
  category: 'General',
  brand: '',
  unit: 'pcs',
  price: 0,
  purchasePrice: 0,
  stock: 0,
  reorderLevel: 5,
  taxRate: 0
};

const UNITS = [
  { v: 'pcs', l: 'पीस (pcs)' },
  { v: 'kg', l: 'किलो (kg)' },
  { v: 'gm', l: 'ग्राम (gm)' },
  { v: 'ltr', l: 'लीटर (ltr)' },
  { v: 'ml', l: 'मिली (ml)' },
  { v: 'pkt', l: 'पैकेट (pkt)' },
  { v: 'box', l: 'डिब्बा (box)' },
  { v: 'dozen', l: 'दर्जन (dozen)' }
];

const CATEGORIES = [
  'General', 'Grocery', 'Detergent', 'Dairy', 'Biscuit',
  'Snacks', 'Toothpaste', 'Soap', 'Oil', 'Rice', 'Masala', 'Beverages'
];

type StockStatus = 'out' | 'low' | 'ok' | 'high';

function getStatus(p: Product): StockStatus {
  if (p.stock <= 0) return 'out';
  if (p.stock <= p.reorderLevel) return 'low';
  if (p.stock > p.reorderLevel * 3) return 'high';
  return 'ok';
}

const STATUS_CONFIG: Record<
  StockStatus,
  { label: string; bg: string; text: string; icon: any }
> = {
  out: { label: 'Khatam', bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
  low: { label: 'Kam', bg: 'bg-amber-100', text: 'text-amber-800', icon: AlertTriangle },
  ok: { label: 'Theek', bg: 'bg-lime-100', text: 'text-lime-800', icon: CheckCircle2 },
  high: { label: 'Bharpur', bg: 'bg-brand-100', text: 'text-brand-700', icon: TrendingUp }
};

// ============ MAIN COMPONENT ============
export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [onlyLow, setOnlyLow] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const [importOpen, setImportOpen] = useState(false);
  const [sampleLoading, setSampleLoading] = useState(false);

  // ============ LOAD ============
  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (category !== 'all') params.set('category', category);
      if (onlyLow) params.set('lowStock', 'true');

      const data = await api.get<{ products: Product[] }>(
        `/api/products?${params.toString()}`
      );
      setProducts(data.products || []);
    } catch (err: any) {
      console.error('Load products failed:', err);
      toast.error(err.message || 'Saman load nahi hua');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [q, category, onlyLow]);

  // ============ SUMMARY ============
  const summary = useMemo(
    () => ({
      total: products.length,
      low: products.filter((p) => getStatus(p) === 'low').length,
      out: products.filter((p) => getStatus(p) === 'out').length,
      value: products.reduce((s, p) => s + p.purchasePrice * p.stock, 0)
    }),
    [products]
  );

  // ============ FORM OPEN ============
  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setFormOpen(true);
  };

  // ============ SAVE ============
  const handleSave = async (draft: ProductDraft) => {
    const isEdit = !!editing;
    const path = isEdit ? `/api/products/${editing!.id}` : '/api/products';
    const method = isEdit ? 'patch' : 'post';

    const data = await (method === 'patch'
      ? api.patch<{ product: Product; merged?: boolean; message?: string }>(
        path,
        draft
      )
      : api.post<{ product: Product; merged?: boolean; message?: string }>(
        path,
        draft
      ));

    if (data.merged) {
      toast.success(data.message || 'Stock badha diya');
    } else {
      toast.success(isEdit ? 'Saman update ho gaya' : 'Naya saman jud gaya');
    }

    await load();
  };

  // ============ STOCK ADJUST ============
  const adjustStock = async (p: Product, delta: number) => {
    try {
      const data = await api.post<{ product: Product }>(
        `/api/products/${p.id}/stock`,
        { delta }
      );
      setProducts((prev) =>
        prev.map((x) => (x.id === p.id ? data.product : x))
      );
    } catch (err: any) {
      toast.error(err.message || 'Stock update nahi hua');
    }
  };

  // ============ DELETE ============
  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete(`/api/products/${deleting.id}`);
      toast.success('Saman delete ho gaya');
      setDeleting(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Delete nahi hua');
    }
  };

  const handleAddSamples = async () => {
    if (products.length > 0) {
      toast.error('Aapke paas pehle se products hain');
      return;
    }
    setSampleLoading(true);
    try {
      const data = await api.post<{ count: number }>('/api/products/samples', {});
      toast.success(`${data.count} sample products jud gaye!`);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSampleLoading(false);
    }
  };

  // ============ RENDER ============
  return (
    <div className="space-y-4 pb-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Saman
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Dukaan ka poora stock ek jagah
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setImportOpen(true)}
            className="btn-outline btn-md"
            title="Excel/CSV Import"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import</span>
          </button>
          <button onClick={openNew} className="btn-primary btn-md">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Naya Saman</span>
            <span className="sm:hidden">Naya</span>
          </button>
        </div>
      </div>

      {/* Summary */}
      {!loading && products.length > 0 && (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          <Mini icon={<Package className="h-5 w-5" />} label="Total Saman" value={String(summary.total)} tone="brand" />
          <Mini icon={<AlertTriangle className="h-5 w-5" />} label="Kam Stock" value={String(summary.low)} tone="warning" />
          <Mini icon={<XCircle className="h-5 w-5" />} label="Khatam" value={String(summary.out)} tone="danger" />
          <Mini icon={<TrendingUp className="h-5 w-5" />} label="Stock Value" value={inr(summary.value)} tone="success" />
        </div>
      )}

      {/* Filters */}
      {!loading && products.length > 0 && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Naam, brand ya barcode…"
              className="input pl-11 pr-10"
            />
            {q && (
              <button
                onClick={() => setQ('')}
                className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-stone-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            <Chip active={category === 'all'} onClick={() => setCategory('all')}>
              Sab
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </Chip>
            ))}
            <div className="mx-1 h-8 w-px shrink-0 bg-stone-200" />
            <Chip active={onlyLow} onClick={() => setOnlyLow(!onlyLow)} tone="danger">
              <AlertTriangle className="h-3 w-3" />
              Kam stock
            </Chip>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card h-40 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="card p-8 sm:p-10 text-center">
          {q || category !== 'all' || onlyLow ? (
            <>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
                <X className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">Kuch nahi mila</h3>
              <p className="mt-1 text-sm text-slate-500">Filters badal kar dekhein</p>
              <button
                onClick={() => { setQ(''); setCategory('all'); setOnlyLow(false); }}
                className="btn-primary btn-md mt-5"
              >
                <X className="h-4 w-4" /> Filters hatao
              </button>
            </>
          ) : (
            <>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg">
                <Package className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                Apni dukaan shuru karein
              </h3>
              <p className="mt-1 max-w-md mx-auto text-sm text-slate-500">
                Pehle saman jodein — 3 tarike se kar sakte hain
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3 text-left">
                {/* Manual */}
                <button
                  onClick={openNew}
                  className="group rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-lift text-left"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-900">Ek-Ek Jodein</p>
                  <p className="mt-1 text-xs text-slate-500">Kam products ke liye</p>
                </button>

                {/* CSV */}
                <button
                  onClick={() => setImportOpen(true)}
                  className="group rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-lift text-left"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-lime-50 text-lime-600">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-900">Excel Se Import</p>
                  <p className="mt-1 text-xs text-slate-500">1000+ products ke liye</p>
                </button>

                {/* Sample */}
                <button
                  onClick={handleAddSamples}
                  disabled={sampleLoading}
                  className="group rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-lift text-left disabled:opacity-50"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-accent-50 text-accent-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-sm font-bold text-slate-900">
                    {sampleLoading ? 'Jod rahe…' : '10 Sample Jodein'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Turant shuru karein</p>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((p) => {
            const status = getStatus(p);
            const cfg = STATUS_CONFIG[status];
            const Icon = cfg.icon;
            const margin = p.purchasePrice > 0
              ? Math.round(((p.price - p.purchasePrice) / p.purchasePrice) * 100)
              : 0;

            return (
              <div key={p.id} className="card overflow-hidden transition hover:shadow-lift flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-3 p-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-base font-extrabold text-white">
                    {p.name[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {p.name}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {p.brand && `${p.brand} • `}{p.category}
                    </p>
                    {p.barcode && (
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] font-mono text-slate-400">
                        <Barcode className="h-3 w-3" />{p.barcode}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => openEdit(p)}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Price + Margin */}
                <div className="flex items-center justify-between gap-2 px-4 pb-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Bikri
                    </p>
                    <p className="font-display text-lg font-extrabold text-slate-900">
                      {inr(p.price)}
                      <span className="ml-1 text-xs font-semibold text-slate-400">/{p.unit}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Margin
                    </p>
                    <p className={`text-sm font-extrabold ${margin > 0 ? 'text-lime-700' : margin < 0 ? 'text-red-500' : 'text-slate-600'
                      }`}>
                      {margin > 0 ? '+' : ''}{margin}%
                    </p>
                  </div>
                </div>

                {/* Stock row */}
                <div className="mt-auto border-t border-stone-100 bg-stone-50/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </span>

                    <div className="flex items-center gap-1 rounded-full border border-stone-200 bg-white p-0.5">
                      <button
                        onClick={() => adjustStock(p, -1)}
                        disabled={p.stock <= 0}
                        className="grid h-7 w-7 place-items-center rounded-full text-slate-600 hover:bg-stone-100 active:scale-90 disabled:opacity-40"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[2.5rem] text-center text-sm font-extrabold text-slate-900 tabular-nums">
                        {p.stock}
                      </span>
                      <button
                        onClick={() => adjustStock(p, 1)}
                        className="grid h-7 w-7 place-items-center rounded-full text-brand-700 hover:bg-brand-50 active:scale-90"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => setDeleting(p)}
                      className="text-[10px] font-bold text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3 inline mr-0.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && products.length > 0 && (
        <p className="text-center text-xs text-slate-400">
          {products.length} saman {onlyLow && 'kam stock wale'}
        </p>
      )}

      {/* Form Modal */}
      {formOpen && (
        <ProductForm
          editing={editing}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
          existingNames={products.map((p) => p.name.toLowerCase())}
        />
      )}

      {/* Delete Confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleting(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Delete karein?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              "{deleting.name}" ko delete kar dein? Ye wapas nahi aayega.
            </p>
            <div className="mt-5 flex gap-2">
              <button onClick={() => setDeleting(null)} className="btn-ghost btn-md flex-1">
                Cancel
              </button>
              <button onClick={handleDelete} className="btn-danger btn-md flex-1">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      <ImportCsvModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={load}
      />
    </div>
  );
}

// ============ MINI ============
function Mini({ icon, label, value, tone }: any) {
  const tones: any = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    warning: 'bg-amber-50 text-amber-600 ring-amber-100',
    danger: 'bg-red-50 text-red-500 ring-red-100',
    success: 'bg-lime-50 text-lime-600 ring-lime-100'
  };
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="font-display text-lg font-extrabold text-slate-900 truncate">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ CHIP ============
function Chip({ active, onClick, children, tone }: any) {
  return (
    <button
      onClick={onClick}
      className={
        'inline-flex shrink-0 items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ' +
        (active
          ? tone === 'danger'
            ? 'border-red-400 bg-red-50 text-red-700'
            : 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-stone-200 bg-white text-slate-600 hover:border-stone-300')
      }
    >
      {children}
    </button>
  );
}

// ============ PRODUCT FORM ============
function ProductForm({ editing, onClose, onSave, existingNames }: any) {
  const [draft, setDraft] = useState<ProductDraft>(() => {
    if (editing) {
      const { id, ...rest } = editing;
      return rest;
    }
    return { ...EMPTY };
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [scannerOpen, setScannerOpen] = useState(false);

  const update = (p: Partial<ProductDraft>) =>
    setDraft((d) => ({ ...d, ...p }));

  const validate = () => {
    const e: any = {};
    if (!draft.name.trim()) e.name = 'Naam zaroori';
    if (draft.price <= 0) e.price = 'Bikri keemat 0 se zyada';
    if (draft.stock < 0) e.stock = 'Stock negative nahi';

    // 🚨 Real-world validation: Selling price >= Purchase price
    if (draft.purchasePrice > 0 && draft.price < draft.purchasePrice) {
      e.price = `Bikri keemat khareed se kam nahi ho sakti (₹${draft.purchasePrice} se zyada)`;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        ...draft,
        name: draft.name.trim(),
        brand: draft.brand?.trim() || '',
        barcode: draft.barcode?.trim() || ''
      });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const margin =
    draft.price > 0
      ? Math.round(((draft.price - draft.purchasePrice) / draft.price) * 100)
      : 0;

  const isDuplicate =
    !editing &&
    draft.name.trim() &&
    existingNames.includes(draft.name.trim().toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {scannerOpen && (
        <BarcodeScanner
  onScan={async (barcode) => {
    update({ barcode }); // Pehle barcode field mein daal do
    setScannerOpen(false);
    
    // Ab API se poocho ki yeh product pehle se hai kya?
    try {
      toast.loading('Product dhundh rahe hain...', { id: 'scan-search' });
      const data = await api.get<{ product: Product | null }>(
        `/api/products/barcode/${barcode}`
      );
      toast.dismiss('scan-search');

      if (data.product) {
        // Product mil gaya! Saari details form mein bhar do
        update({
          name: data.product.name,
          barcode: data.product.barcode || barcode,
          category: data.product.category,
          brand: data.product.brand || '',
          unit: data.product.unit,
          price: data.product.price,
          purchasePrice: data.product.purchasePrice,
          stock: data.product.stock,
          reorderLevel: data.product.reorderLevel,
          taxRate: data.product.taxRate
        });
        toast.success(`${data.product.name} mil gaya! Details bhar di gayi hain.`);
      } else {
        // Naya product hai, sirf barcode rakho
        toast.info('Naya product hai — details bharein');
      }
    } catch (err: any) {
      toast.dismiss('scan-search');
      toast.error('Barcode search fail hua');
    }
  }}
  onClose={() => setScannerOpen(false)}
/>
      )}


      <form
        onSubmit={submit}
        className="relative w-full max-w-lg max-h-[92vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl flex flex-col"
      >
        <div className="flex items-center gap-3 border-b border-stone-200 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Package className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold">
              {editing ? 'Saman Edit Karein' : 'Naya Saman Jodein'}
            </h2>
            <p className="text-xs text-slate-500">
              {editing ? 'Jaankari badlein' : 'Dukaan ka naya item'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {isDuplicate && (
            <div className="flex items-start gap-2 rounded-2xl bg-amber-50 p-3 ring-1 ring-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <p className="text-xs text-amber-800">
                <strong>"{draft.name}"</strong> pehle se hai! Save karne par
                naya nahi banega — <strong>purane wale mein hi stock badhega</strong>.
              </p>
            </div>
          )}

          <Field label="Saman ka naam" required error={errors.name}>
            <input
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="जैसे: Surf Excel 1kg"
              className={`input ${errors.name ? 'border-red-300' : ''}`}
              autoFocus
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select
                value={draft.category}
                onChange={(e) => update({ category: e.target.value })}
                className="input"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Brand">
              <input
                value={draft.brand || ''}
                onChange={(e) => update({ brand: e.target.value })}
                placeholder="Optional"
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Barcode">
              <div className="flex gap-2">
                <input
                  value={draft.barcode || ''}
                  onChange={(e) => update({ barcode: e.target.value })}
                  placeholder="8901…"
                  className="input flex-1 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setScannerOpen(true)}
                  className="btn-outline btn-md shrink-0 px-3"
                  title="Scan karein"
                >
                  <Barcode className="h-4 w-4" />
                </button>
              </div>
            </Field>
            <Field label="Unit">
              <select
                value={draft.unit}
                onChange={(e) => update({ unit: e.target.value })}
                className="input"
              >
                {UNITS.map((u) => (
                  <option key={u.v} value={u.v}>{u.l}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Khareed Keemat">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">₹</span>
                <input
                  type="number"
                  value={draft.purchasePrice || ''}
                  onChange={(e) => update({ purchasePrice: Number(e.target.value) || 0 })}
                  className="input pl-7"
                  placeholder="0"
                />
              </div>
            </Field>
            <Field label="Bikri Keemat" required error={errors.price}>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">₹</span>
                <input
                  type="number"
                  value={draft.price || ''}
                  onChange={(e) => update({ price: Number(e.target.value) || 0 })}
                  className={`input pl-7 ${errors.price ? 'border-red-300' : ''}`}
                  placeholder="0"
                />
              </div>
            </Field>
          </div>

          {draft.price > 0 && draft.purchasePrice > 0 && (
            <div className="rounded-2xl bg-lime-50 p-3 text-xs ring-1 ring-lime-100">
              <span className="font-bold text-lime-800">
                💰 Profit margin: {margin}%
              </span>
              <span className="ml-2 text-lime-700">
                ({inr(draft.price - draft.purchasePrice)} प्रति {draft.unit})
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Field label={editing ? 'Stock' : 'Stock (jodna hai)'} required error={errors.stock}>
              <input
                type="number"
                value={draft.stock || ''}
                onChange={(e) => update({ stock: Number(e.target.value) || 0 })}
                className="input"
                placeholder="0"
              />
            </Field>
            <Field label="Kam hone par alert">
              <input
                type="number"
                value={draft.reorderLevel || ''}
                onChange={(e) => update({ reorderLevel: Number(e.target.value) || 0 })}
                className="input"
                placeholder="5"
              />
            </Field>
          </div>

          <Field label="GST %">
            <input
              type="number"
              value={draft.taxRate || ''}
              onChange={(e) => update({ taxRate: Number(e.target.value) || 0 })}
              className="input"
              placeholder="0, 5, 12, 18"
            />
          </Field>
        </div>

        <div className="flex gap-2 border-t border-stone-200 p-4">
          <button type="button" onClick={onClose} className="btn-ghost btn-md">
            Cancel
          </button>
          {!editing && (
            <button
              type="button"
              disabled={saving}
              onClick={async (ev) => {
                ev.preventDefault();
                if (!validate()) return;
                setSaving(true);
                try {
                  await onSave({
                    ...draft,
                    name: draft.name.trim(),
                    brand: draft.brand?.trim() || '',
                    barcode: draft.barcode?.trim() || ''
                  });
                  // Reset for next product (keep category + unit)
                  setDraft({
                    ...EMPTY,
                    category: draft.category,
                    unit: draft.unit
                  });
                  setErrors({});
                  toast.success('Save ho gaya — agla jodein');
                } catch (e: any) {
                  toast.error(e.message);
                } finally {
                  setSaving(false);
                }
              }}
              className="btn-outline btn-md flex-1 whitespace-nowrap"
            >
              Save & Agla
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary btn-md flex-1"
          >
            {saving ? 'Save…' : editing ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, error, children }: any) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>}
    </div>
  );
}