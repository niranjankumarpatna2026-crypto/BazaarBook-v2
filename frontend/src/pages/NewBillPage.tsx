import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Minus, Trash2, Search, X, User,
  Save, ShoppingCart, Percent, Receipt, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { inr } from '@/lib/format';
import { ROUTES } from '@/lib/constants';
import { api } from '@/lib/api';
import { AlertTriangle } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  unit: string;
  price: number;
  purchasePrice: number;   // ← ADD
  stock: number;
  category: string;
  brand?: string;
};

type Customer = {
  id: string;
  name: string;
  mobile: string;
  balance: number;
};

type BillItem = {
  productId: string;
  name: string;
  unit: string;
  price: number;
  quantity: number;
  discount: number;
  taxRate: number;
  stock: number;
  purchasePrice: number;   // ← ADD
};

const PAYMENT_MODES = [
  { v: 'cash', label: 'Cash', emoji: '💵' },
  { v: 'upi', label: 'UPI', emoji: '📱' },
  { v: 'card', label: 'Card', emoji: '💳' },
  { v: 'udhaar', label: 'Udhaar', emoji: '📝' }
] as const;

export default function NewBillPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('bb_token');

  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountValue, setDiscountValue] = useState(0);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [gstRate, setGstRate] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card' | 'udhaar'>('cash');
  const [notes, setNotes] = useState('');

  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [customerPickerOpen, setCustomerPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ============ LOAD DATA ============
  useEffect(() => {
    (async () => {
      try {
        // const [pRes, cRes] = await Promise.all([
        //   fetch('/api/products', { headers: { Authorization: 'Bearer ' + token } }),
        //   fetch('/api/customers', { headers: { Authorization: 'Bearer ' + token } })
        // ]);
        // if (pRes.ok) setProducts((await pRes.json()).products || []);
        // if (cRes.ok) setCustomers((await cRes.json()).customers || []);

        const [pData, cData] = await Promise.all([
          api.get('/api/products'),
          api.get('/api/customers')
        ]);
        setProducts(pData.products || []);
        setCustomers(cData.customers || []);
      } catch (e) { console.error(e); }
    })();
  }, [token]);

  // ============ TOTALS ============
  const totals = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const itemDiscounts = items.reduce((s, i) => s + i.discount, 0);
    const afterItem = subtotal - itemDiscounts;

    const billDiscount = discountType === 'percent'
      ? Math.round((afterItem * Math.min(discountValue, 100)) / 100)
      : Math.min(discountValue, afterItem);

    const taxable = Math.max(0, afterItem - billDiscount);
    const gstAmount = gstEnabled ? Math.round((taxable * gstRate) / 100) : 0;
    const rawTotal = taxable + gstAmount;
    const rounded = Math.round(rawTotal);
    const roundOff = rounded - rawTotal;

    return { subtotal, itemDiscounts, billDiscount, taxable, gstAmount, rounded, roundOff };
  }, [items, discountType, discountValue, gstEnabled, gstRate]);

  // ============ ADD PRODUCT ============
  const addProduct = (p: Product) => {
    // Check if stock is available
    if (p.stock <= 0) {
      toast.error(`${p.name} khatam hai — pehle stock jodein`);
      return;
    }

    // Check current quantity in bill
    const existingItem = items.find((x) => x.productId === p.id);
    const currentQty = existingItem?.quantity || 0;

    // Warn if adding exceeds stock
    if (currentQty + 1 > p.stock) {
      toast.warning(
        `${p.name} ka stock sirf ${p.stock} hai, aap ${currentQty + 1} add kar rahe hain`,
        { duration: 4000 }
      );
    }

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.productId === p.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          unit: p.unit,
          price: p.price,
          quantity: 1,
          discount: 0,
          taxRate: 0,
          stock: p.stock,
          purchasePrice: p.purchasePrice || 0
        }
      ];
    });
    setProductPickerOpen(false);
    toast.success(`${p.name} jud gaya`);
  };

  const updateItem = (i: number, patch: Partial<BillItem>) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[i] = { ...updated[i], ...patch };
      return updated;
    });
  };

  const removeItem = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ============ PICK CUSTOMER ============
  const pickCustomer = (c: Customer) => {
    setCustomerId(c.id);
    setCustomerName(c.name);
    setCustomerMobile(c.mobile);
    setCustomerPickerOpen(false);
  };

  const walkIn = () => {
    setCustomerId('');
    setCustomerName('');
    setCustomerMobile('');
    setCustomerPickerOpen(false);
  };

  // ============ SAVE ============
  const handleSave = async () => {
    if (!items.length) return toast.error('Koi saman jodein');

    if (paymentMode === 'udhaar' && !customerId) {
      return toast.error('Udhaar ke liye grahak chunein');
    }

    setSaving(true);
    try {
      const payload = {
        customerId: customerId || null,
        customerName: customerName || 'Walk-in',
        customerMobile: customerMobile || null,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          unit: i.unit,
          price: i.price,
          quantity: i.quantity,
          discount: i.discount,
          taxRate: i.taxRate,
          lineTotal: i.price * i.quantity - i.discount,
          purchasePrice: i.purchasePrice || 0,
          profit: (i.price - (i.purchasePrice || 0)) * i.quantity - i.discount
        })),
        subtotal: totals.subtotal,
        itemDiscounts: totals.itemDiscounts,
        billDiscount: totals.billDiscount,
        discountType,
        discountValue,
        gstEnabled,
        gstRate,
        gstAmount: totals.gstAmount,
        roundOff: Math.round(totals.roundOff),
        total: totals.rounded,
        paymentMode,
        notes: notes || null
      };

      // const r = await fetch('/api/bills', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: 'Bearer ' + token
      //   },
      //   body: JSON.stringify(payload)
      // });

      // const data = await r.json();
      // if (!r.ok) throw new Error(data.error || 'Bill save nahi hua');

      const data = await api.post('/api/bills', payload);

      toast.success(`Bill ${data.bill.number} ban gaya — ${inr(data.bill.total)}`);
      navigate(ROUTES.dashboard);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-stone-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-extrabold">Naya Bill</h1>
          <p className="text-xs text-slate-500">
            {items.length > 0
              ? `${items.length} item • ${inr(totals.rounded)}`
              : 'Saman jodein aur bill banayein'}
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => { if (confirm('Poora bill hata dein?')) setItems([]); }}
            className="text-xs font-bold text-red-500 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Customer bar */}
      <button
        onClick={() => setCustomerPickerOpen(true)}
        className="card flex w-full items-center gap-3 p-4 text-left transition hover:shadow-lift"
      >
        <span
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white ${customerId ? 'bg-gradient-to-br from-brand-500 to-accent-500' : 'bg-slate-200 text-slate-500'
            }`}
        >
          {customerId ? (
            <span className="text-sm font-bold">
              {customerName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="h-5 w-5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900">
            {customerName || 'Grahak chunein'}
          </p>
          <p className="text-xs text-slate-500">
            {customerMobile || 'Walk-in ya naya grahak'}
          </p>
        </div>
        {customerId && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              setCustomerId('');
              setCustomerName('');
              setCustomerMobile('');
            }}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-stone-100 hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </span>
        )}
      </button>

      {/* Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">Bill khaali hai</h3>
            <p className="mt-1 text-sm text-slate-500">Pehla saman jodein</p>
            <button
              onClick={() => setProductPickerOpen(true)}
              className="btn-primary btn-md mt-5"
            >
              <Plus className="h-4 w-4" />
              Saman Jodein
            </button>
          </div>
        ) : (
          <>
            {items.map((item, i) => (
              <div key={item.productId} className="card p-3">
                {/* Header row */}
                <div className="flex items-start gap-2">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {inr(item.price)} × {item.unit}
                      <span className={`ml-2 font-bold ${item.stock <= 0 ? 'text-red-500' :
                          item.quantity > item.stock ? 'text-amber-600' :
                            item.stock <= 5 ? 'text-amber-600' :
                              'text-slate-400'
                        }`}>
                        Stock: {item.stock}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
{/* Stock warning — if quantity exceeds available stock */}
{item.quantity > item.stock && (
  <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 p-2 pl-8 ring-1 ring-amber-100">
    <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-600" />
    <p className="text-[10px] font-semibold text-amber-800">
      Stock sirf <strong>{item.stock}</strong> hai — aap <strong>{item.quantity}</strong> bhej rahe hain.
      Naya maal mangwana padega.
    </p>
  </div>
)}
                {/* Qty + Total */}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-stone-200 bg-stone-50 p-0.5">
                    <button
                      onClick={() => updateItem(i, { quantity: Math.max(1, item.quantity - 1) })}
                      disabled={item.quantity <= 1}
                      className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-white disabled:opacity-40"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-extrabold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(i, { quantity: item.quantity + 1 })}
                      className="grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:bg-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-400">×</span>

                  <input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => updateItem(i, { price: Number(e.target.value) || 0 })}
                    className="w-20 rounded-full border border-stone-200 px-3 py-1.5 text-sm font-semibold outline-none focus:border-brand-500"
                    placeholder="₹"
                  />

                  <span className="ml-auto shrink-0 font-display text-base font-extrabold text-slate-900">
                    {inr(item.price * item.quantity - item.discount)}
                  </span>
                </div>

                {/* Per-item discount */}
                <div className="mt-2 flex items-center gap-2 pl-8">
                  <Percent className="h-3 w-3 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500">Item discount:</span>
                  <input
                    type="number"
                    value={item.discount || ''}
                    onChange={(e) => updateItem(i, { discount: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-20 rounded-full border border-stone-200 px-2 py-1 text-xs outline-none focus:border-brand-500"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => setProductPickerOpen(true)}
              className="btn-outline btn-md w-full"
            >
              <Plus className="h-4 w-4" />
              Aur saman jodein
            </button>
          </>
        )}
      </div>

      {/* Bill Settings (discount, GST, notes) */}
      {items.length > 0 && (
        <div className="card space-y-4 p-4">
          {/* Bill discount */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Bill Discount
            </p>
            <div className="flex gap-2">
              {(['flat', 'percent'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setDiscountType(t); setDiscountValue(0); }}
                  className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold transition ${discountType === t
                      ? 'bg-brand-600 text-white'
                      : 'bg-stone-100 text-slate-600'
                    }`}
                >
                  {t === 'flat' ? '₹ Flat' : '% Percent'}
                </button>
              ))}
            </div>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                {discountType === 'flat' ? '₹' : '%'}
              </span>
              <input
                type="number"
                value={discountValue || ''}
                onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value) || 0))}
                className="input pl-7"
                placeholder="0"
              />
            </div>
          </div>

          {/* GST */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={gstEnabled}
                onChange={(e) => setGstEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-stone-300 text-brand-600"
              />
              GST lagayein
            </label>
            {gstEnabled && (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={gstRate || ''}
                  onChange={(e) => setGstRate(Math.max(0, Number(e.target.value) || 0))}
                  className="w-16 rounded-full border border-stone-200 px-2 py-1 text-center text-xs font-bold outline-none focus:border-brand-500"
                  placeholder="5"
                />
                <span className="text-xs font-bold text-slate-500">%</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Koi khaas baat…"
              className="input resize-none"
            />
          </div>
        </div>
      )}

      {/* Totals + Payment */}
      {items.length > 0 && (
        <div className="card overflow-hidden">
          {/* Totals */}
          <div className="space-y-2 p-4">
            <Row label={`Subtotal (${items.length} item)`} value={inr(totals.subtotal)} />
            {totals.itemDiscounts > 0 && (
              <Row label="Item discount" value={`− ${inr(totals.itemDiscounts)}`} tone="accent" />
            )}
            {totals.billDiscount > 0 && (
              <Row label="Bill discount" value={`− ${inr(totals.billDiscount)}`} tone="accent" />
            )}
            {gstEnabled && totals.gstAmount > 0 && (
              <Row label={`GST @ ${gstRate}%`} value={`+ ${inr(totals.gstAmount)}`} />
            )}
            {Math.abs(totals.roundOff) > 0.01 && (
              <Row label="Round off" value={inr(totals.roundOff)} tone="muted" />
            )}
            <div className="mt-3 border-t border-dashed border-stone-200 pt-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-display text-base font-bold text-slate-700">
                  <Receipt className="h-4 w-4 text-brand-600" />
                  Dena hai
                </span>
                <span className="font-display text-2xl font-extrabold text-slate-900">
                  {inr(totals.rounded)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment mode */}
          <div className="border-t border-stone-200 bg-stone-50/70 p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Payment ka tareeka
            </p>
            <div className="grid grid-cols-4 gap-2">
              {PAYMENT_MODES.map((m) => (
                <button
                  key={m.v}
                  onClick={() => setPaymentMode(m.v)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-[10px] font-bold transition ${paymentMode === m.v
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                      : 'border-stone-200 bg-white text-slate-600'
                    }`}
                >
                  <span className="text-lg">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky save bar */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-20 z-30 px-4 lg:bottom-6">
          <div className="mx-auto max-w-md rounded-3xl bg-white/95 p-2 shadow-lift backdrop-blur ring-1 ring-stone-200/70">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary btn-lg w-full"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Save ho raha…' : `Save Bill — ${inr(totals.rounded)}`}
            </button>
          </div>
        </div>
      )}

      {/* Product Picker */}
      {productPickerOpen && (
        <ProductPicker
          products={products}
          onClose={() => setProductPickerOpen(false)}
          onPick={addProduct}
        />
      )}

      {/* Customer Picker */}
      {customerPickerOpen && (
        <CustomerPicker
          customers={customers}
          onClose={() => setCustomerPickerOpen(false)}
          onPick={pickCustomer}
          onWalkIn={walkIn}
        />
      )}
    </div>
  );
}

// ============ ROW ============
function Row({ label, value, tone = 'default' }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`font-semibold ${tone === 'accent' ? 'text-accent-600' : tone === 'muted' ? 'text-slate-400' : 'text-slate-900'
        }`}>
        {value}
      </span>
    </div>
  );
}

// ============ PRODUCT PICKER ============
function ProductPicker({ products, onClose, onPick }: any) {
  const [q, setQ] = useState('');

  const filtered = products.filter((p: Product) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return (
      p.name.toLowerCase().includes(s) ||
      p.brand?.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-stone-200 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <h2 className="font-display text-lg font-bold">Saman chunein</h2>
          <button
            onClick={onClose}
            className="ml-auto grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-stone-200 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Naam ya brand se dhundhein…"
              className="input pl-11"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-slate-500">Kuch nahi mila</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {filtered.map((p: Product) => (
                <li key={p.id}>
                  <button
                    onClick={() => onPick(p)}
                    disabled={p.stock <= 0}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${p.stock <= 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-brand-50/40 active:bg-brand-50'
                      }`}
                  >
                    {/* Avatar */}
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-sm font-bold text-brand-700">
                      {p.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {p.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {p.brand && `${p.brand} • `}{p.category}
                      </p>
                      {/* Stock badge with smart color */}
                      <div className="mt-1 flex items-center gap-1.5">
                        {p.stock <= 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                            ❌ Khatam
                          </span>
                        ) : p.stock <= 5 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            ⚠️ Sirf {p.stock} bache
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-lime-100 px-2 py-0.5 text-[10px] font-bold text-lime-800">
                            ✓ {p.stock} stock
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-sm font-extrabold text-slate-900">
                        {inr(p.price)}
                      </p>
                      <p className="text-[10px] text-slate-500">/{p.unit}</p>
                    </div>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white ${p.stock <= 0 ? 'bg-slate-400' : 'bg-brand-600'
                        }`}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ CUSTOMER PICKER ============
function CustomerPicker({ customers, onClose, onPick, onWalkIn }: any) {
  const [q, setQ] = useState('');

  const filtered = customers.filter((c: Customer) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return c.name.toLowerCase().includes(s) || c.mobile.includes(s);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-stone-200 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-50 text-accent-600">
            <User className="h-5 w-5" />
          </div>
          <h2 className="font-display text-lg font-bold">Grahak chunein</h2>
          <button
            onClick={onClose}
            className="ml-auto grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Walk-in */}
        <button
          onClick={onWalkIn}
          className="flex items-center gap-3 border-b border-stone-100 px-4 py-3 text-left hover:bg-brand-50/40"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-100 text-slate-500">
            <User className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Walk-in Grahak</p>
            <p className="text-xs text-slate-500">Naam ke bina — direct bill</p>
          </div>
        </button>

        <div className="border-b border-stone-200 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Naam ya mobile…"
              className="input pl-11"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">Koi grahak nahi mila</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {filtered.map((c: Customer) => (
                <li key={c.id}>
                  <button
                    onClick={() => onPick(c)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-brand-50/40"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                      {c.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{c.name}</p>
                      <p className="truncate text-xs text-slate-500">{c.mobile}</p>
                    </div>
                    {c.balance > 0 && (
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Udhaar</p>
                        <p className="text-sm font-bold text-red-500">{inr(c.balance)}</p>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}