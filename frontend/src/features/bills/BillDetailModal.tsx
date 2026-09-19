import { useEffect, useState, useCallback } from 'react';
import {
  X, Wallet, Printer, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { inr } from '@/lib/format';
import { useQueryParam } from '@/lib/hooks/useQueryParam';


const MODE_EMOJI: Record<string, string> = {
  cash: '💵', upi: '📱', card: '💳', udhaar: '📝', split: '🔀'
};

type Props = {
  id: string | null;
  onClose: () => void;
  onRefresh?: () => void;
  onDelete?: (bill: any) => void;
};

export function BillDetailModal({ id, onClose, onRefresh, onDelete }: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [payOpen, setPayOpen] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const d = await api.get(`/api/bills/${id}`);
      setData(d);
    } catch (err: any) {
      toast.error(err.message || 'Bill load nahi hua');
      onClose();
    } finally {
      setLoading(false);
    }
  }, [id, onClose]);

  useEffect(() => {
    if (id) {
      load();
    } else {
      setData(null);
    }
  }, [id, load]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (!id) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [id]);

  // ESC key to close
  useEffect(() => {
    if (!id) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [id, onClose]);

  const receivePayment = async (amount: number, mode: string) => {
    if (!id) return;
    try {
      await api.post(`/api/bills/${id}/payment`, { amount, mode });
      toast.success(`${inr(amount)} received!`);
      setPayOpen(false);
      await load();
      onRefresh?.();
    } catch (err: any) {
      toast.error(err.message || 'Payment nahi hua');
    }
  };

  const handleDelete = async () => {
    if (!data?.bill || !confirm('Ye bill delete karein? Stock wapas jud jayega.')) return;
    try {
      await api.delete(`/api/bills/${id}`);
      toast.success('Bill delete ho gayi');
      onDelete?.(data.bill);
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Delete nahi hua');
    }
  };

  const handlePrint = () => {
    if (!data?.bill) return;
    const bill = data.bill;
    const shop = data.shop || {};
    const settings = data.settings || {};

    const upiUrl = settings.showQR && settings.upiId && bill.dueAmount > 0
      ? `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(shop.name || '')}&am=${bill.dueAmount}&cu=INR&tn=${encodeURIComponent('Bill ' + bill.number)}`
      : null;

    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      toast.error('Popup blocked — kripya popups allow karein');
      return;
    }

    // ... print HTML same as before
    const billHTML = buildPrintHTML(bill, shop, settings, upiUrl);
    printWindow.document.write(billHTML);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => printWindow.print(), 200);
    };
  };

  if (!id) return null;

  const bill = data?.bill;
  const shop = data?.shop || {};
  const settings = data?.settings || {};

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95">
        {loading || !bill ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="mt-4 text-sm text-slate-500">Load ho raha…</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  {settings.showLogo !== false && shop.logoUrl ? (
                    <img
                      src={shop.logoUrl}
                      alt="Logo"
                      className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-2 ring-white/30"
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold backdrop-blur ring-2 ring-white/30">
                      {(shop.name || 'B').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-extrabold">
                      {shop.name || 'BazaarBook'}
                    </p>
                    {shop.owner && <p className="truncate text-xs text-white/80">{shop.owner}</p>}
                    {shop.mobile && <p className="truncate text-[11px] text-white/70">📞 {shop.mobile}</p>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Bill</p>
                  <p className="font-display text-lg font-extrabold">{bill.number}</p>
                  <p className="mt-0.5 text-[10px] text-white/70">
                    {new Date(bill.createdAt).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                  bill.paymentStatus === 'paid' ? 'bg-lime-400/90 text-lime-950'
                  : bill.paymentStatus === 'partial' ? 'bg-amber-400/90 text-amber-950'
                  : 'bg-red-400/90 text-red-950'
                }`}>
                  {bill.paymentStatus === 'paid' ? 'PAID' : bill.paymentStatus === 'partial' ? 'PARTIAL' : 'PENDING'}
                </span>
                <span className="text-xs text-white/90">
                  {MODE_EMOJI[bill.paymentMode]} {bill.paymentMode?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="border-b border-stone-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Grahak</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {bill.customerName || 'Walk-in Customer'}
                </p>
                {bill.customerMobile && (
                  <p className="font-mono text-xs text-slate-500">{bill.customerMobile}</p>
                )}
              </div>

              <ul className="divide-y divide-stone-100">
                {bill.items.map((it: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 px-4 py-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{it.name}</p>
                      <p className="text-xs text-slate-500">
                        {inr(it.price)} × {it.quantity} {it.unit}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
                      {inr(it.lineTotal || it.price * it.quantity - it.discount)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 border-t border-stone-100 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">{inr(bill.subtotal)}</span>
                </div>
                {bill.itemDiscounts > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Item Discount</span>
                    <span className="font-semibold text-accent-600">− {inr(bill.itemDiscounts)}</span>
                  </div>
                )}
                {bill.billDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Bill Discount</span>
                    <span className="font-semibold text-accent-600">− {inr(bill.billDiscount)}</span>
                  </div>
                )}
                {bill.gstAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">GST @ {bill.gstRate}%</span>
                    <span className="font-semibold">+ {inr(bill.gstAmount)}</span>
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between border-t border-dashed border-stone-200 pt-3">
                  <span className="font-display text-base font-bold text-slate-700">Total</span>
                  <span className="font-display text-2xl font-extrabold text-slate-900">
                    {inr(bill.total)}
                  </span>
                </div>
                {bill.paymentStatus !== 'paid' && (
                  <div className="mt-2 space-y-1.5 rounded-2xl bg-red-50 p-3 ring-1 ring-red-100">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-700">Paid</span>
                      <span className="font-bold text-red-900">{inr(bill.paidAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t border-red-200 pt-1.5">
                      <span className="font-bold text-red-700">Baki</span>
                      <span className="font-display text-base font-extrabold text-red-900">
                        {inr(bill.dueAmount)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 border-t border-stone-200 p-4">
              {bill.dueAmount > 0 && (
                <button
                  onClick={() => setPayOpen(true)}
                  className="btn btn-md bg-lime-600 text-white hover:bg-lime-700"
                >
                  <Wallet className="h-4 w-4" /> Payment
                </button>
              )}
              <button onClick={handlePrint} className="btn-outline btn-md">
                <Printer className="h-4 w-4" /> Print
              </button>
              <button
                onClick={handleDelete}
                className={`btn-outline btn-md text-red-600 ${bill.dueAmount <= 0 ? 'col-span-1' : ''}`}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </>
        )}
      </div>

      {payOpen && bill && (
        <PaymentModal
          amount={bill.dueAmount}
          onClose={() => setPayOpen(false)}
          onSubmit={receivePayment}
        />
      )}
    </div>
  );
}

// Print HTML builder
function buildPrintHTML(bill: any, shop: any, settings: any, upiUrl: string | null) {
  // ... same print HTML template as before
  return `...`;
}