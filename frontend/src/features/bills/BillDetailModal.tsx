import { useEffect, useState, useCallback } from 'react';
import { X, Wallet, Printer, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { inr } from '@/lib/format';

const MODE_EMOJI: Record<string, string> = {
  cash: '💵', upi: '📱', card: '💳', udhaar: '📝', split: '🔀'
};

type Props = {
  id: string | null;
  onClose: () => void;
  onRefresh?: () => void;
};

export function BillDetailModal({ id, onClose, onRefresh }: Props) {
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
    if (id) load();
    else setData(null);
  }, [id, load]);

  // ESC to close
  useEffect(() => {
    if (!id) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [id, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (!id) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [id]);

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
    if (!data?.bill) return;
    if (!confirm('Ye bill delete karein? Stock wapas jud jayega.')) return;
    try {
      await api.delete(`/api/bills/${id}`);
      toast.success('Bill delete ho gayi');
      onClose();
      onRefresh?.();
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

    const billHTML = `
<!DOCTYPE html>
<html lang="hi">
<head>
<meta charset="UTF-8">
<title>Bill ${bill.number}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', -apple-system, system-ui, sans-serif; font-size: 12px; line-height: 1.4; color: #000; background: #fff; padding: 10mm; max-width: 210mm; margin: 0 auto; }
.page { border: 2px solid #000; padding: 12mm 10mm; min-height: calc(100vh - 20mm); position: relative; }
.watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 90px; font-weight: 900; color: #000; opacity: 0.05; letter-spacing: 4px; pointer-events: none; z-index: -1; white-space: nowrap; }
.shop-header { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 12px; }
.shop-logo { width: 60px; height: 60px; border-radius: 8px; object-fit: cover; border: 1px solid #ddd; flex-shrink: 0; }
.shop-info { flex: 1; min-width: 0; }
.shop-name { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
.shop-detail { font-size: 11px; color: #333; margin: 1px 0; }
.bill-meta { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #000; }
.bill-number { font-size: 16px; font-weight: 700; }
.bill-date { font-size: 10px; color: #666; }
.status-badge { display: inline-block; padding: 3px 8px; font-size: 10px; font-weight: 700; border: 1px solid #000; border-radius: 12px; margin-top: 4px; }
.customer { margin-bottom: 12px; }
.customer-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #666; margin-bottom: 2px; }
.customer-name { font-weight: 700; font-size: 13px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
th { text-align: left; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 0; border-bottom: 1px solid #000; }
th.right, td.right { text-align: right; }
td { padding: 7px 0; font-size: 12px; border-bottom: 1px solid #e5e5e5; }
.item-name { font-weight: 600; }
.item-sub { font-size: 10px; color: #666; }
.totals { margin-left: auto; width: 100%; max-width: 280px; }
.total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
.total-divider { border-top: 2px solid #000; margin-top: 6px; padding-top: 6px; font-size: 16px; font-weight: 800; }
.due-box { margin-top: 8px; padding: 6px; border: 1px dashed #000; font-size: 11px; }
.qr-section { margin-top: 16px; padding: 12px; border: 1px dashed #000; background: #f9f9f9; }
.qr-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.qr-content { display: flex; align-items: center; gap: 16px; }
.qr-img { width: 120px; height: 120px; border: 1px solid #ddd; background: #fff; padding: 4px; }
.qr-info { flex: 1; }
.qr-amount { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
.qr-upi-label { font-size: 9px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
.qr-upi-id { font-family: 'Courier New', monospace; font-size: 12px; font-weight: 700; margin-top: 2px; }
.qr-hint { font-size: 9px; color: #666; margin-top: 6px; }
.terms { margin-top: 12px; font-size: 10px; color: #444; }
.terms-title { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.footer { margin-top: 24px; padding-top: 12px; border-top: 1px dashed #000; text-align: center; font-size: 11px; }
.footer-sub { font-size: 9px; color: #666; margin-top: 4px; }
.notes { margin-top: 12px; padding: 8px; background: #f5f5f5; font-size: 11px; font-style: italic; }
@media print { @page { size: A4 portrait; margin: 10mm; } body { padding: 0; } }
</style>
</head>
<body>
<div class="watermark">BazaarBook</div>
<div class="page">
  <div class="shop-header">
    ${settings.showLogo !== false && shop.logoUrl ? `<img src="${shop.logoUrl}" alt="Logo" class="shop-logo" onerror="this.style.display='none'" />` : ''}
    <div class="shop-info">
      <div class="shop-name">${shop.name || 'BazaarBook'}</div>
      ${shop.owner ? `<div class="shop-detail">${shop.owner}</div>` : ''}
      ${shop.mobile ? `<div class="shop-detail">📞 ${shop.mobile}</div>` : ''}
      ${(shop.address || shop.city) ? `<div class="shop-detail">📍 ${shop.address || ''}${shop.address && shop.city ? ', ' : ''}${shop.city || ''}${shop.state ? ', ' + shop.state : ''}</div>` : ''}
      ${shop.gstin ? `<div class="shop-detail"><strong>GSTIN:</strong> ${shop.gstin}</div>` : ''}
    </div>
  </div>

  <div class="bill-meta">
    <div>
      <div class="bill-number">Bill: ${bill.number}</div>
      <div class="bill-date">${new Date(bill.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
    </div>
    <div style="text-align: right;">
      <div class="status-badge">${bill.paymentStatus === 'paid' ? '✓ PAID' : bill.paymentStatus === 'partial' ? 'PARTIAL' : 'PENDING'}</div>
      <div class="bill-date" style="margin-top: 4px;">${bill.paymentMode?.toUpperCase() || 'CASH'}</div>
    </div>
  </div>

  <div class="customer">
    <div class="customer-label">Grahak</div>
    <div class="customer-name">${bill.customerName || 'Walk-in Customer'}</div>
    ${bill.customerMobile ? `<div class="shop-detail">📱 ${bill.customerMobile}</div>` : ''}
  </div>

  <table>
    <thead><tr><th>Item</th><th class="right">Qty</th><th class="right">Rate</th><th class="right">Total</th></tr></thead>
    <tbody>
      ${bill.items.map((it: any) => `
        <tr>
          <td>
            <div class="item-name">${it.name}</div>
            ${it.discount > 0 ? `<div class="item-sub">Discount: −₹${it.discount}</div>` : ''}
          </td>
          <td class="right">${it.quantity} ${it.unit || ''}</td>
          <td class="right">₹${it.price}</td>
          <td class="right"><strong>₹${it.lineTotal || (it.price * it.quantity - (it.discount || 0))}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row"><span>Subtotal</span><span>₹${bill.subtotal}</span></div>
    ${bill.itemDiscounts > 0 ? `<div class="total-row"><span>Item Discount</span><span>− ₹${bill.itemDiscounts}</span></div>` : ''}
    ${bill.billDiscount > 0 ? `<div class="total-row"><span>Bill Discount</span><span>− ₹${bill.billDiscount}</span></div>` : ''}
    ${bill.gstAmount > 0 ? `<div class="total-row"><span>GST @ ${bill.gstRate}%</span><span>+ ₹${bill.gstAmount}</span></div>` : ''}
    <div class="total-row total-divider"><span>TOTAL</span><span>₹${bill.total}</span></div>
    ${bill.paymentStatus !== 'paid' ? `<div class="due-box"><div style="display:flex; justify-content:space-between;"><span>Paid</span><span>₹${bill.paidAmount}</span></div><div style="display:flex; justify-content:space-between; font-weight:700; margin-top:4px;"><span>Baki</span><span>₹${bill.dueAmount}</span></div></div>` : ''}
  </div>

  ${upiUrl ? `<div class="qr-section"><div class="qr-title">💳 UPI se Pay Karein</div><div class="qr-content"><img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}&margin=10" alt="UPI QR" class="qr-img" /><div class="qr-info"><div class="qr-amount">Amount: ₹${bill.dueAmount}</div><div class="qr-upi-label">UPI ID:</div><div class="qr-upi-id">${settings.upiId}</div><div class="qr-hint">Scan karein — GPay, PhonePe, Paytm</div></div></div></div>` : ''}

  ${bill.notes ? `<div class="notes">"${bill.notes}"</div>` : ''}
  ${settings.terms ? `<div class="terms"><div class="terms-title">Terms & Conditions</div><div>${settings.terms}</div></div>` : ''}

  <div class="footer">
    <div>${settings.footerNote || 'Dhanyavaad! Phir aane ke liye shukriya 🙏'}</div>
    <div class="footer-sub">— BazaarBook se banaya gaya —</div>
  </div>
</div>
</body>
</html>`;

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
        {loading || !bill ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="mt-4 text-sm text-slate-500">Load ho raha…</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold backdrop-blur ring-2 ring-white/30">
                    {(shop.name || 'B').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-extrabold">{shop.name || 'BazaarBook'}</p>
                    {shop.owner && <p className="truncate text-xs text-white/80">{shop.owner}</p>}
                    {shop.mobile && <p className="truncate text-[11px] text-white/70">📞 {shop.mobile}</p>}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Bill</p>
                  <p className="font-display text-lg font-extrabold">{bill.number}</p>
                  <p className="mt-0.5 text-[10px] text-white/70">
                    {new Date(bill.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25" aria-label="Close">
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

            <div className="flex-1 overflow-y-auto">
              <div className="border-b border-stone-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Grahak</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">{bill.customerName || 'Walk-in Customer'}</p>
                {bill.customerMobile && <p className="font-mono text-xs text-slate-500">{bill.customerMobile}</p>}
              </div>

              <ul className="divide-y divide-stone-100">
                {bill.items.map((it: any, i: number) => (
                  <li key={i} className="flex items-start gap-3 px-4 py-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">{it.name}</p>
                      <p className="text-xs text-slate-500">{inr(it.price)} × {it.quantity} {it.unit}</p>
                    </div>
                    <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
                      {inr(it.lineTotal || (it.price * it.quantity - it.discount))}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 border-t border-stone-100 p-4">
                <div className="flex justify-between text-sm"><span className="text-slate-600">Subtotal</span><span className="font-semibold">{inr(bill.subtotal)}</span></div>
                {bill.itemDiscounts > 0 && <div className="flex justify-between text-sm"><span className="text-slate-600">Item Discount</span><span className="font-semibold text-accent-600">− {inr(bill.itemDiscounts)}</span></div>}
                {bill.billDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-slate-600">Bill Discount</span><span className="font-semibold text-accent-600">− {inr(bill.billDiscount)}</span></div>}
                {bill.gstAmount > 0 && <div className="flex justify-between text-sm"><span className="text-slate-600">GST @ {bill.gstRate}%</span><span className="font-semibold">+ {inr(bill.gstAmount)}</span></div>}
                <div className="mt-3 flex items-center justify-between border-t border-dashed border-stone-200 pt-3">
                  <span className="font-display text-base font-bold text-slate-700">Total</span>
                  <span className="font-display text-2xl font-extrabold text-slate-900">{inr(bill.total)}</span>
                </div>
                {bill.paymentStatus !== 'paid' && (
                  <div className="mt-2 space-y-1.5 rounded-2xl bg-red-50 p-3 ring-1 ring-red-100">
                    <div className="flex justify-between text-sm"><span className="text-red-700">Paid</span><span className="font-bold text-red-900">{inr(bill.paidAmount)}</span></div>
                    <div className="flex justify-between border-t border-red-200 pt-1.5">
                      <span className="font-bold text-red-700">Baki</span>
                      <span className="font-display text-base font-extrabold text-red-900">{inr(bill.dueAmount)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-stone-200 p-4">
              {bill.dueAmount > 0 && (
                <button onClick={() => setPayOpen(true)} className="btn btn-md bg-lime-600 text-white hover:bg-lime-700">
                  <Wallet className="h-4 w-4" /> Payment
                </button>
              )}
              <button onClick={handlePrint} className="btn-outline btn-md">
                <Printer className="h-4 w-4" /> Print
              </button>
              <button onClick={handleDelete} className={`btn-outline btn-md text-red-600 ${bill.dueAmount <= 0 ? 'col-span-1' : ''}`}>
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          </>
        )}
      </div>

      {payOpen && bill && (
        <PaymentMini
          amount={bill.dueAmount}
          onClose={() => setPayOpen(false)}
          onSubmit={receivePayment}
        />
      )}
    </div>
  );
}

// Simple payment modal
function PaymentMini({ amount, onClose, onSubmit }: any) {
  const [amt, setAmt] = useState(amount);
  const [mode, setMode] = useState('cash');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (amt <= 0 || amt > amount) return toast.error('Sahi amount daalein');
    setSaving(true);
    try {
      await onSubmit(amt, mode);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-5 text-white">
          <h3 className="font-display text-lg font-extrabold">Payment Receive</h3>
          <p className="mt-2 font-display text-3xl font-extrabold">{inr(amount)}</p>
        </div>
        <div className="p-5 space-y-4">
          <input
            type="number"
            value={amt || ''}
            onChange={(e) => setAmt(Number(e.target.value) || 0)}
            className="input text-lg font-extrabold"
            placeholder="0"
            autoFocus
          />
          <div className="grid grid-cols-3 gap-2">
            {['cash', 'upi', 'card'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-2xl border p-3 text-xs font-bold ${
                  mode === m ? 'border-lime-500 bg-lime-50 text-lime-800' : 'border-stone-200'
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 border-t border-stone-200 p-4">
          <button onClick={onClose} className="btn-ghost btn-md flex-1">Cancel</button>
          <button
            onClick={submit}
            disabled={saving}
            className="btn btn-md flex-[2] bg-lime-600 text-white"
          >
            {saving ? 'Saving…' : `Receive ${inr(amt)}`}
          </button>
        </div>
      </div>
    </div>
  );
}