// // // import { useEffect, useMemo, useState } from 'react';
// // // import { Link } from 'react-router-dom';
// // // import {
// // //   Plus, Receipt, Search, X, Calendar, Download, ChevronRight,
// // //   Phone, MessageCircle, CheckCircle2, AlertCircle, Clock,
// // //   IndianRupee, Wallet, TrendingDown, Trash2, Printer
// // // } from 'lucide-react';
// // // import { toast } from 'sonner';
// // // import { inr, timeAgo } from '@/lib/format';
// // // import { ROUTES } from '@/lib/constants';

// // // type Bill = {
// // //   id: string;
// // //   number: string;
// // //   customerId?: string;
// // //   customerName: string;
// // //   customerMobile?: string;
// // //   itemCount: number;
// // //   total: number;
// // //   paidAmount: number;
// // //   dueAmount: number;
// // //   paymentMode: string;
// // //   paymentStatus: 'paid' | 'partial' | 'pending';
// // //   createdAt: string;
// // // };

// // // type BillDetail = Bill & {
// // //   items: any[];
// // //   subtotal: number;
// // //   itemDiscounts: number;
// // //   billDiscount: number;
// // //   discountType: string;
// // //   discountValue: number;
// // //   gstEnabled: boolean;
// // //   gstRate: number;
// // //   gstAmount: number;
// // //   roundOff: number;
// // //   notes?: string;
// // // };

// // // type RangeKey = 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all';

// // // const RANGES: { k: RangeKey; l: string }[] = [
// // //   { k: 'today', l: 'Aaj' },
// // //   { k: 'yesterday', l: 'Kal' },
// // //   { k: '7d', l: '7 Din' },
// // //   { k: '30d', l: '30 Din' },
// // //   { k: 'month', l: 'Is Mahine' },
// // //   { k: 'all', l: 'Sab' }
// // // ];

// // // const MODE_EMOJI: any = {
// // //   cash: '💵', upi: '📱', card: '💳', udhaar: '📝', split: '🔀'
// // // };

// // // const STATUS_CONFIG: any = {
// // //   paid:    { label: 'Paid',  bg: 'bg-lime-100',  text: 'text-lime-800',  icon: CheckCircle2 },
// // //   partial: { label: 'Aadha', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
// // //   pending: { label: 'Baki',  bg: 'bg-red-100',   text: 'text-red-700',   icon: AlertCircle }
// // // };

// // // function rangeToDates(range: RangeKey): { from?: string; to?: string } {
// // //   const now = new Date();
// // //   const startOf = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
// // //   const endOf = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };

// // //   if (range === 'today') return { from: startOf(now).toISOString(), to: endOf(now).toISOString() };
// // //   if (range === 'yesterday') {
// // //     const y = new Date(now); y.setDate(y.getDate() - 1);
// // //     return { from: startOf(y).toISOString(), to: endOf(y).toISOString() };
// // //   }
// // //   if (range === '7d') {
// // //     const f = new Date(now); f.setDate(f.getDate() - 6);
// // //     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
// // //   }
// // //   if (range === '30d') {
// // //     const f = new Date(now); f.setDate(f.getDate() - 29);
// // //     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
// // //   }
// // //   if (range === 'month') {
// // //     const f = new Date(now.getFullYear(), now.getMonth(), 1);
// // //     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
// // //   }
// // //   return {};
// // // }

// // // export default function BillsPage() {
// // //   const token = localStorage.getItem('bb_token');

// // //   const [bills, setBills] = useState<Bill[]>([]);
// // //   const [summary, setSummary] = useState({ total_bills: 0, total_amount: 0, total_paid: 0, total_due: 0 });
// // //   const [loading, setLoading] = useState(true);

// // //   const [range, setRange] = useState<RangeKey>('7d');
// // //   const [q, setQ] = useState('');
// // //   const [status, setStatus] = useState('all');
// // //   const [mode, setMode] = useState('all');
// // //   const [sort, setSort] = useState('recent');
// // //   const [advanced, setAdvanced] = useState(false);

// // //   const [detailId, setDetailId] = useState<string | null>(null);
// // //   const [deleting, setDeleting] = useState<Bill | null>(null);

// // //   // ============ LOAD ============
// // //   const load = async () => {
// // //     try {
// // //       setLoading(true);
// // //       const params = new URLSearchParams();
// // //       const dates = rangeToDates(range);
// // //       if (dates.from) params.set('from', dates.from);
// // //       if (dates.to) params.set('to', dates.to);
// // //       if (q) params.set('q', q);
// // //       if (status !== 'all') params.set('status', status);
// // //       if (mode !== 'all') params.set('mode', mode);
// // //       params.set('sort', sort);

// // //       const r = await fetch('/api/bills?' + params.toString(), {
// // //         headers: { Authorization: 'Bearer ' + token }
// // //       });
// // //       if (r.ok) {
// // //         const d = await r.json();
// // //         setBills(d.bills || []);
// // //         setSummary(d.summary || { total_bills: 0, total_amount: 0, total_paid: 0, total_due: 0 });
// // //       }
// // //     } catch (e) { console.error(e); }
// // //     finally { setLoading(false); }
// // //   };

// // //   useEffect(() => { load(); }, [range, q, status, mode, sort]);

// // //   // ============ GROUP BY DAY ============
// // //   const grouped = useMemo(() => {
// // //     const map = new Map<string, Bill[]>();
// // //     bills.forEach((b) => {
// // //       const key = b.createdAt.slice(0, 10);
// // //       if (!map.has(key)) map.set(key, []);
// // //       map.get(key)!.push(b);
// // //     });
// // //     return Array.from(map.entries());
// // //   }, [bills]);

// // //   // ============ EXPORT CSV ============
// // //   const handleExport = () => {
// // //     if (bills.length === 0) return toast.error('Kuch bills nahi');
// // //     const rows = [
// // //       ['Bill No', 'Date', 'Customer', 'Mobile', 'Items', 'Total', 'Paid', 'Baki', 'Mode', 'Status'],
// // //       ...bills.map((b) => [
// // //         b.number,
// // //         new Date(b.createdAt).toLocaleDateString('en-IN'),
// // //         b.customerName,
// // //         b.customerMobile || '',
// // //         b.itemCount,
// // //         b.total,
// // //         b.paidAmount,
// // //         b.dueAmount,
// // //         b.paymentMode,
// // //         b.paymentStatus
// // //       ])
// // //     ];
// // //     const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
// // //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// // //     const url = URL.createObjectURL(blob);
// // //     const a = document.createElement('a');
// // //     a.href = url;
// // //     a.download = `bills-${new Date().toISOString().slice(0, 10)}.csv`;
// // //     a.click();
// // //     URL.revokeObjectURL(url);
// // //     toast.success('Bills export ho gayi');
// // //   };

// // //   // ============ DELETE ============
// // //   const handleDelete = async () => {
// // //     if (!deleting) return;
// // //     const r = await fetch(`/api/bills/${deleting.id}`, {
// // //       method: 'DELETE',
// // //       headers: { Authorization: 'Bearer ' + token }
// // //     });
// // //     if (r.ok) {
// // //       toast.success('Bill delete ho gayi');
// // //       setDeleting(null);
// // //       await load();
// // //     }
// // //   };

// // //   return (
// // //     <div className="space-y-4 pb-6">
// // //       {/* Header */}
// // //       <div className="flex flex-wrap items-start justify-between gap-3">
// // //         <div>
// // //           <h1 className="font-display text-2xl font-extrabold text-slate-900">
// // //             Purane Bills
// // //           </h1>
// // //           <p className="mt-0.5 text-sm text-slate-500">
// // //             Sabhi bills ek jagah
// // //           </p>
// // //         </div>
// // //         <div className="flex gap-2">
// // //           {bills.length > 0 && (
// // //             <button onClick={handleExport} className="btn-outline btn-md">
// // //               <Download className="h-4 w-4" />
// // //               CSV
// // //             </button>
// // //           )}
// // //           <Link to={ROUTES.newBill} className="btn-primary btn-md">
// // //             <Plus className="h-4 w-4" />
// // //             Naya
// // //           </Link>
// // //         </div>
// // //       </div>

// // //       {/* Summary cards */}
// // //       {!loading && bills.length > 0 && (
// // //         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
// // //           <Mini icon={<Receipt className="h-5 w-5" />} label="Total Bills" value={String(summary.total_bills)} tone="brand" />
// // //           <Mini icon={<IndianRupee className="h-5 w-5" />} label="Total Amount" value={inr(summary.total_amount)} tone="accent" />
// // //           <Mini icon={<Wallet className="h-5 w-5" />} label="Mila" value={inr(summary.total_paid)} tone="success" />
// // //           <Mini icon={<TrendingDown className="h-5 w-5" />} label="Baki" value={inr(summary.total_due)} tone="danger" />
// // //         </div>
// // //       )}

// // //       {/* Filters */}
// // //       <div className="space-y-3">
// // //         {/* Search + Advanced */}
// // //         <div className="flex gap-2">
// // //           <div className="relative flex-1">
// // //             <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// // //             <input
// // //               value={q}
// // //               onChange={(e) => setQ(e.target.value)}
// // //               placeholder="Bill no, grahak, mobile…"
// // //               className="input pl-11 pr-10"
// // //             />
// // //             {q && (
// // //               <button
// // //                 onClick={() => setQ('')}
// // //                 className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-stone-100"
// // //               >
// // //                 <X className="h-3.5 w-3.5" />
// // //               </button>
// // //             )}
// // //           </div>
// // //           <button
// // //             onClick={() => setAdvanced(!advanced)}
// // //             className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition ${
// // //               advanced
// // //                 ? 'border-brand-500 bg-brand-50 text-brand-700'
// // //                 : 'border-stone-200 bg-white text-slate-600'
// // //             }`}
// // //             title="Filters"
// // //           >
// // //             <Calendar className="h-4 w-4" />
// // //           </button>
// // //         </div>

// // //         {/* Range chips */}
// // //         <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
// // //           {RANGES.map((r) => (
// // //             <button
// // //               key={r.k}
// // //               onClick={() => setRange(r.k)}
// // //               className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
// // //                 range === r.k
// // //                   ? 'border-brand-500 bg-brand-50 text-brand-700'
// // //                   : 'border-stone-200 bg-white text-slate-600'
// // //               }`}
// // //             >
// // //               {r.l}
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* Advanced filters */}
// // //         {advanced && (
// // //           <div className="card space-y-4 p-4">
// // //             <div>
// // //               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //                 Payment Status
// // //               </p>
// // //               <div className="grid grid-cols-4 gap-2">
// // //                 {[
// // //                   { k: 'all', l: 'Sab', e: '📋' },
// // //                   { k: 'paid', l: 'Paid', e: '✅' },
// // //                   { k: 'partial', l: 'Aadha', e: '⚡' },
// // //                   { k: 'pending', l: 'Baki', e: '⚠️' }
// // //                 ].map((s) => (
// // //                   <button
// // //                     key={s.k}
// // //                     onClick={() => setStatus(s.k)}
// // //                     className={`flex flex-col items-center gap-0.5 rounded-2xl border px-2 py-2 text-[10px] font-bold transition ${
// // //                       status === s.k
// // //                         ? 'border-brand-500 bg-brand-50 text-brand-700'
// // //                         : 'border-stone-200 bg-white text-slate-600'
// // //                     }`}
// // //                   >
// // //                     <span className="text-sm">{s.e}</span>
// // //                     {s.l}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             <div>
// // //               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //                 Payment Mode
// // //               </p>
// // //               <div className="grid grid-cols-5 gap-2">
// // //                 {[
// // //                   { k: 'all', l: 'Sab', e: '📋' },
// // //                   { k: 'cash', l: 'Cash', e: '💵' },
// // //                   { k: 'upi', l: 'UPI', e: '📱' },
// // //                   { k: 'card', l: 'Card', e: '💳' },
// // //                   { k: 'udhaar', l: 'Udhaar', e: '📝' }
// // //                 ].map((m) => (
// // //                   <button
// // //                     key={m.k}
// // //                     onClick={() => setMode(m.k)}
// // //                     className={`flex flex-col items-center gap-0.5 rounded-2xl border px-1 py-2 text-[10px] font-bold transition ${
// // //                       mode === m.k
// // //                         ? 'border-brand-500 bg-brand-50 text-brand-700'
// // //                         : 'border-stone-200 bg-white text-slate-600'
// // //                     }`}
// // //                   >
// // //                     <span className="text-sm">{m.e}</span>
// // //                     {m.l}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             <div>
// // //               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //                 Sort
// // //               </p>
// // //               <div className="grid grid-cols-2 gap-2">
// // //                 {[
// // //                   { k: 'recent', l: 'Naye pehle' },
// // //                   { k: 'amount_desc', l: 'Zyada amount' },
// // //                   { k: 'amount_asc', l: 'Kam amount' },
// // //                   { k: 'customer', l: 'Naam A–Z' }
// // //                 ].map((s) => (
// // //                   <button
// // //                     key={s.k}
// // //                     onClick={() => setSort(s.k)}
// // //                     className={`rounded-2xl border px-3 py-2 text-xs font-bold transition ${
// // //                       sort === s.k
// // //                         ? 'border-brand-500 bg-brand-50 text-brand-700'
// // //                         : 'border-stone-200 bg-white text-slate-600'
// // //                     }`}
// // //                   >
// // //                     {s.l}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             <button
// // //               onClick={() => {
// // //                 setQ('');
// // //                 setStatus('all');
// // //                 setMode('all');
// // //                 setSort('recent');
// // //               }}
// // //               className="btn-ghost btn-sm w-full"
// // //             >
// // //               <X className="h-3.5 w-3.5" />
// // //               Filters reset karein
// // //             </button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Content */}
// // //       {loading ? (
// // //         <div className="card divide-y divide-stone-100 overflow-hidden">
// // //           {[1, 2, 3, 4, 5].map((i) => (
// // //             <div key={i} className="flex items-center gap-3 p-4">
// // //               <div className="h-11 w-11 animate-pulse rounded-full bg-stone-100" />
// // //               <div className="flex-1 space-y-2">
// // //                 <div className="h-3 w-40 animate-pulse rounded-full bg-stone-200" />
// // //                 <div className="h-2.5 w-24 animate-pulse rounded-full bg-stone-100" />
// // //               </div>
// // //               <div className="h-4 w-20 animate-pulse rounded-full bg-stone-200" />
// // //             </div>
// // //           ))}
// // //         </div>
// // //       ) : bills.length === 0 ? (
// // //         <div className="card p-10 text-center">
// // //           <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
// // //             <Receipt className="h-7 w-7" />
// // //           </div>
// // //           <h3 className="mt-4 font-display text-lg font-bold">
// // //             {q || status !== 'all' || mode !== 'all'
// // //               ? 'Kuch nahi mila'
// // //               : 'Is period mein koi bill nahi'}
// // //           </h3>
// // //           <p className="mt-1 text-sm text-slate-500">
// // //             {q || status !== 'all' || mode !== 'all'
// // //               ? 'Filters badal kar dekhein'
// // //               : 'Pehla bill banayein — 30 second mein ready'}
// // //           </p>
// // //           <button
// // //             onClick={q || status !== 'all' || mode !== 'all'
// // //               ? () => { setQ(''); setStatus('all'); setMode('all'); }
// // //               : undefined}
// // //             className="btn-primary btn-md mt-5"
// // //             as-child
// // //           >
// // //             {q || status !== 'all' || mode !== 'all' ? (
// // //               <><X className="h-4 w-4" /> Filters hatao</>
// // //             ) : (
// // //               <Link to={ROUTES.newBill}>
// // //                 <Plus className="h-4 w-4" /> Naya Bill Banayein
// // //               </Link>
// // //             )}
// // //           </button>
// // //         </div>
// // //       ) : (
// // //         <div className="card overflow-hidden">
// // //           {grouped.map(([day, dayBills]) => {
// // //             const dayTotal = dayBills.reduce((s, b) => s + b.total, 0);
// // //             return (
// // //               <div key={day}>
// // //                 {/* Day header */}
// // //                 <div className="flex items-center justify-between gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2">
// // //                   <div className="flex items-center gap-2">
// // //                     <span className="text-xs font-bold text-slate-700">
// // //                       {dayLabel(dayBills[0].createdAt)}
// // //                     </span>
// // //                     <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
// // //                       {dayBills.length} {dayBills.length === 1 ? 'bill' : 'bills'}
// // //                     </span>
// // //                   </div>
// // //                   <span className="text-xs font-extrabold text-slate-900 tabular-nums">
// // //                     {inr(dayTotal)}
// // //                   </span>
// // //                 </div>

// // //                 {/* Bills */}
// // //                 <ul className="divide-y divide-stone-100">
// // //                   {dayBills.map((b) => (
// // //                     <BillRow
// // //                       key={b.id}
// // //                       bill={b}
// // //                       onOpen={() => setDetailId(b.id)}
// // //                       onDelete={() => setDeleting(b)}
// // //                     />
// // //                   ))}
// // //                 </ul>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       )}

// // //       {!loading && bills.length > 0 && (
// // //         <p className="text-center text-xs text-slate-400">
// // //           {bills.length} bill {status !== 'all' && `(${status})`}
// // //         </p>
// // //       )}

// // //       {/* Detail Modal */}
// // //       {detailId && (
// // //         <BillDetailModal
// // //           id={detailId}
// // //           onClose={() => setDetailId(null)}
// // //           onRefresh={load}
// // //           onDelete={(b) => { setDetailId(null); setDeleting(b); }}
// // //         />
// // //       )}

// // //       {/* Delete Confirm */}
// // //       {deleting && (
// // //         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
// // //           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleting(null)} />
// // //           <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
// // //             <h3 className="font-display text-lg font-bold text-slate-900">
// // //               Bill delete karein?
// // //             </h3>
// // //             <p className="mt-2 text-sm text-slate-600">
// // //               Bill <strong>{deleting.number}</strong> ko delete kar dein?
// // //               Stock wapas jud jayega aur udhaar reverse ho jayega.
// // //             </p>
// // //             <div className="mt-5 flex gap-2">
// // //               <button onClick={() => setDeleting(null)} className="btn-ghost btn-md flex-1">
// // //                 Cancel
// // //               </button>
// // //               <button onClick={handleDelete} className="btn-danger btn-md flex-1">
// // //                 Delete
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // ===================== DAY LABEL =====================
// // // function dayLabel(dateStr: string): string {
// // //   const d = new Date(dateStr);
// // //   const today = new Date(); today.setHours(0, 0, 0, 0);
// // //   const yest = new Date(today); yest.setDate(yest.getDate() - 1);
// // //   const tgt = new Date(d); tgt.setHours(0, 0, 0, 0);

// // //   if (tgt.getTime() === today.getTime()) return 'Aaj';
// // //   if (tgt.getTime() === yest.getTime()) return 'Kal';
// // //   return d.toLocaleDateString('en-IN', {
// // //     weekday: 'long', day: 'numeric', month: 'short',
// // //     year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
// // //   });
// // // }

// // // // ===================== MINI =====================
// // // function Mini({ icon, label, value, tone }: any) {
// // //   const tones: any = {
// // //     brand: 'bg-brand-50 text-brand-600 ring-brand-100',
// // //     accent: 'bg-accent-50 text-accent-600 ring-accent-100',
// // //     success: 'bg-lime-50 text-lime-600 ring-lime-100',
// // //     danger: 'bg-red-50 text-red-500 ring-red-100'
// // //   };
// // //   return (
// // //     <div className="card p-4">
// // //       <div className="flex items-center gap-3">
// // //         <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
// // //           {icon}
// // //         </div>
// // //         <div className="min-w-0">
// // //           <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //             {label}
// // //           </p>
// // //           <p className="font-display text-lg font-extrabold text-slate-900 truncate">
// // //             {value}
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // // ===================== BILL ROW =====================
// // // function BillRow({ bill, onOpen, onDelete }: any) {
// // //   const cfg = STATUS_CONFIG[bill.paymentStatus];
// // //   const Icon = cfg.icon;

// // //   return (
// // //     <li>
// // //       <button
// // //         onClick={onOpen}
// // //         className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-stone-50 active:bg-stone-100"
// // //       >
// // //         {/* Avatar */}
// // //         <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white shadow-sm ${
// // //           bill.paymentStatus === 'paid'
// // //             ? 'bg-gradient-to-br from-brand-500 to-accent-500'
// // //             : bill.paymentStatus === 'partial'
// // //             ? 'bg-gradient-to-br from-amber-400 to-amber-600'
// // //             : 'bg-gradient-to-br from-red-400 to-red-600'
// // //         }`}>
// // //           {(bill.customerName || 'W').charAt(0).toUpperCase()}
// // //         </span>

// // //         {/* Info */}
// // //         <div className="min-w-0 flex-1">
// // //           <div className="flex items-center gap-2">
// // //             <p className="truncate text-sm font-bold text-slate-900">
// // //               {bill.customerName || 'Walk-in'}
// // //             </p>
// // //             <span className="shrink-0 font-mono text-[11px] text-slate-400">
// // //               {bill.number}
// // //             </span>
// // //           </div>

// // //           <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
// // //             <span>{MODE_EMOJI[bill.paymentMode] || '💵'}</span>
// // //             <span className="capitalize">{bill.paymentMode}</span>
// // //             <span>•</span>
// // //             <span>{bill.itemCount} item</span>
// // //             <span>•</span>
// // //             <span>{timeAgo(bill.createdAt)}</span>
// // //           </div>

// // //           {/* Mobile quick actions */}
// // //           {bill.customerMobile && (
// // //             <div className="mt-2 flex items-center gap-2 lg:hidden">
// // //               <a
// // //                 href={`tel:${bill.customerMobile}`}
// // //                 onClick={(e) => e.stopPropagation()}
// // //                 className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-slate-600 active:scale-90"
// // //               >
// // //                 <Phone className="h-3 w-3" />
// // //               </a>
// // //               <a
// // //                 href={`https://wa.me/91${bill.customerMobile}?text=${encodeURIComponent(
// // //                   `Namaste 🙏\nBill ${bill.number} ka amount: ₹${bill.total}${bill.dueAmount > 0 ? `\nBaki: ₹${bill.dueAmount}` : '\n✅ Paid'}`
// // //                 )}`}
// // //                 target="_blank"
// // //                 rel="noopener noreferrer"
// // //                 onClick={(e) => e.stopPropagation()}
// // //                 className="grid h-7 w-7 place-items-center rounded-full bg-lime-100 text-lime-700 active:scale-90"
// // //               >
// // //                 <MessageCircle className="h-3 w-3" />
// // //               </a>
// // //               <button
// // //                 onClick={(e) => { e.stopPropagation(); onDelete(); }}
// // //                 className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-slate-400 hover:bg-red-50 hover:text-red-500"
// // //               >
// // //                 <Trash2 className="h-3 w-3" />
// // //               </button>
// // //             </div>
// // //           )}
// // //         </div>

// // //         {/* Amount + status */}
// // //         <div className="shrink-0 text-right">
// // //           <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
// // //             {inr(bill.total)}
// // //           </p>
// // //           <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
// // //             <Icon className="h-3 w-3" />
// // //             {cfg.label}
// // //           </span>
// // //           {bill.dueAmount > 0 && (
// // //             <p className="mt-0.5 text-[10px] font-bold text-red-500">
// // //               Baki {inr(bill.dueAmount)}
// // //             </p>
// // //           )}
// // //         </div>

// // //         <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
// // //       </button>
// // //     </li>
// // //   );
// // // }

// // // // ===================== BILL DETAIL MODAL =====================
// // // function BillDetailModal({ id, onClose, onRefresh, onDelete }: any) {
// // //   const token = localStorage.getItem('bb_token');
// // //   const [data, setData] = useState<any>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [payOpen, setPayOpen] = useState(false);

// // //   const load = async () => {
// // //     try {
// // //       const r = await fetch(`/api/bills/${id}`, {
// // //         headers: { Authorization: 'Bearer ' + token }
// // //       });
// // //       if (r.ok) setData(await r.json());
// // //     } catch (e) { console.error(e); }
// // //     finally { setLoading(false); }
// // //   };

// // //   useEffect(() => { load(); }, [id]);

// // //   const receivePayment = async (amount: number, mode: string) => {
// // //     const r = await fetch(`/api/bills/${id}/payment`, {
// // //       method: 'POST',
// // //       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
// // //       body: JSON.stringify({ amount, mode })
// // //     });
// // //     if (r.ok) {
// // //       toast.success(`${inr(amount)} received!`);
// // //       setPayOpen(false);
// // //       await load();
// // //       onRefresh();
// // //     } else {
// // //       toast.error((await r.json()).error);
// // //     }
// // //   };

// // //   const bill = data?.bill;
// // //   const shop = data?.shop || {};
// // //   const settings = data?.settings || {};

// // //   // UPI URL for QR
// // //   const upiUrl = settings.showQR && settings.upiId && bill?.dueAmount > 0
// // //     ? `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(shop.name || '')}&am=${bill.dueAmount}&cu=INR&tn=${encodeURIComponent('Bill ' + bill.number)}`
// // //     : null;

// // //   return (
// // //     <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
// // //       <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

// // //       <div className="bill-print-area relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
// // //         {loading || !bill ? (
// // //           <div className="p-10 text-center">
// // //             <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
// // //             <p className="mt-4 text-sm text-slate-500">Load ho raha…</p>
// // //           </div>
// // //         ) : (
// // //           <>
// // //             {/* Header — with shop info */}
// // //             <div className="bill-header bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
// // //               <div className="flex items-start justify-between gap-3">
// // //                 {/* Shop logo + name */}
// // //                 <div className="flex items-start gap-3 min-w-0">
// // //                   {settings.showLogo !== false && shop.logoUrl ? (
// // //                     <img
// // //                       src={shop.logoUrl}
// // //                       alt="Logo"
// // //                       className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-2 ring-white/30"
// // //                       onError={(e: any) => { e.target.style.display = 'none'; }}
// // //                     />
// // //                   ) : (
// // //                     <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold backdrop-blur ring-2 ring-white/30">
// // //                       {(shop.name || 'B').charAt(0).toUpperCase()}
// // //                     </div>
// // //                   )}
// // //                   <div className="min-w-0">
// // //                     <p className="truncate font-display text-lg font-extrabold">
// // //                       {shop.name || 'BazaarBook'}
// // //                     </p>
// // //                     {shop.owner && (
// // //                       <p className="truncate text-xs text-white/80">{shop.owner}</p>
// // //                     )}
// // //                     {shop.mobile && (
// // //                       <p className="truncate text-[11px] text-white/70">
// // //                         📞 {shop.mobile}
// // //                       </p>
// // //                     )}
// // //                     {(shop.city || shop.address) && (
// // //                       <p className="truncate text-[11px] text-white/70">
// // //                         📍 {shop.address ? `${shop.address}, ` : ''}{shop.city}
// // //                         {shop.state ? `, ${shop.state}` : ''}
// // //                       </p>
// // //                     )}
// // //                     {shop.gstin && (
// // //                       <p className="truncate font-mono text-[10px] text-white/60">
// // //                         GSTIN: {shop.gstin}
// // //                       </p>
// // //                     )}
// // //                   </div>
// // //                 </div>

// // //                 {/* Bill info */}
// // //                 <div className="shrink-0 text-right">
// // //                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
// // //                     Bill
// // //                   </p>
// // //                   <p className="font-display text-lg font-extrabold">{bill.number}</p>
// // //                   <p className="mt-0.5 text-[10px] text-white/70">
// // //                     {new Date(bill.createdAt).toLocaleString('en-IN', {
// // //                       day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
// // //                     })}
// // //                   </p>
// // //                 </div>
// // //               </div>

// // //               {/* Status badges */}
// // //               <div className="mt-3 flex items-center gap-2 flex-wrap">
// // //                 <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
// // //                   bill.paymentStatus === 'paid' ? 'bg-lime-400/90 text-lime-950'
// // //                   : bill.paymentStatus === 'partial' ? 'bg-amber-400/90 text-amber-950'
// // //                   : 'bg-red-400/90 text-red-950'
// // //                 }`}>
// // //                   {STATUS_CONFIG[bill.paymentStatus].label}
// // //                 </span>
// // //                 <span className="text-xs text-white/90">
// // //                   {MODE_EMOJI[bill.paymentMode]} {bill.paymentMode.toUpperCase()}
// // //                 </span>
// // //               </div>
// // //             </div>

// // //             {/* Scrollable body */}
// // //             <div className="flex-1 overflow-y-auto">
// // //               {/* Customer */}
// // //               <div className="border-b border-stone-100 p-4">
// // //                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //                   Grahak
// // //                 </p>
// // //                 <p className="mt-0.5 text-sm font-bold text-slate-900">
// // //                   {bill.customerName || 'Walk-in Customer'}
// // //                 </p>
// // //                 {bill.customerMobile && (
// // //                   <p className="font-mono text-xs text-slate-500">{bill.customerMobile}</p>
// // //                 )}
// // //               </div>

// // //               {/* Items */}
// // //               <div className="border-b border-stone-100 bg-stone-50/50 px-4 py-2">
// // //                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //                   Saman ({bill.items.length})
// // //                 </p>
// // //               </div>
// // //               <ul className="divide-y divide-stone-100">
// // //                 {bill.items.map((it: any, i: number) => (
// // //                   <li key={i} className="flex items-start gap-3 px-4 py-3">
// // //                     <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700">
// // //                       {i + 1}
// // //                     </span>
// // //                     <div className="min-w-0 flex-1">
// // //                       <p className="text-sm font-semibold text-slate-900">{it.name}</p>
// // //                       <p className="text-xs text-slate-500">
// // //                         {inr(it.price)} × {it.quantity} {it.unit}
// // //                         {it.discount > 0 && (
// // //                           <span className="ml-2 text-accent-600">− {inr(it.discount)}</span>
// // //                         )}
// // //                       </p>
// // //                     </div>
// // //                     <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
// // //                       {inr(it.lineTotal || (it.price * it.quantity - it.discount))}
// // //                     </p>
// // //                   </li>
// // //                 ))}
// // //               </ul>

// // //               {/* Totals */}
// // //               <div className="space-y-2 border-t border-stone-100 p-4">
// // //                 <Row label="Subtotal" value={inr(bill.subtotal)} />
// // //                 {bill.itemDiscounts > 0 && (
// // //                   <Row label="Item Discount" value={`− ${inr(bill.itemDiscounts)}`} tone="accent" />
// // //                 )}
// // //                 {bill.billDiscount > 0 && (
// // //                   <Row label="Bill Discount" value={`− ${inr(bill.billDiscount)}`} tone="accent" />
// // //                 )}
// // //                 {bill.gstAmount > 0 && (
// // //                   <Row label={`GST @ ${bill.gstRate}%`} value={`+ ${inr(bill.gstAmount)}`} />
// // //                 )}
// // //                 {Math.abs(bill.roundOff) > 0.01 && (
// // //                   <Row label="Round off" value={inr(bill.roundOff)} tone="muted" />
// // //                 )}

// // //                 <div className="mt-3 border-t border-dashed border-stone-200 pt-3">
// // //                   <div className="flex items-center justify-between">
// // //                     <span className="font-display text-base font-bold text-slate-700">Total</span>
// // //                     <span className="font-display text-2xl font-extrabold text-slate-900">
// // //                       {inr(bill.total)}
// // //                     </span>
// // //                   </div>
// // //                 </div>

// // //                 {bill.paymentStatus !== 'paid' && (
// // //                   <div className="mt-2 space-y-1.5 rounded-2xl bg-red-50 p-3 ring-1 ring-red-100">
// // //                     <div className="flex justify-between text-sm">
// // //                       <span className="text-red-700">Paid</span>
// // //                       <span className="font-bold text-red-900">{inr(bill.paidAmount)}</span>
// // //                     </div>
// // //                     <div className="flex justify-between border-t border-red-200 pt-1.5">
// // //                       <span className="font-bold text-red-700">Baki</span>
// // //                       <span className="font-display text-base font-extrabold text-red-900">
// // //                         {inr(bill.dueAmount)}
// // //                       </span>
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               {/* UPI QR (if udhaar + showQR) */}
// // //               {upiUrl && (
// // //                 <div className="border-t border-stone-100 bg-lime-50/50 p-4">
// // //                   <p className="text-[10px] font-bold uppercase tracking-wider text-lime-800">
// // //                     💳 UPI se pay karein
// // //                   </p>
// // //                   <div className="mt-3 flex items-center gap-4">
// // //                     <img
// // //                       src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiUrl)}&margin=8`}
// // //                       alt="UPI QR"
// // //                       className="h-32 w-32 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-lime-200"
// // //                     />
// // //                     <div>
// // //                       <p className="text-xs font-bold text-slate-700">Amount: {inr(bill.dueAmount)}</p>
// // //                       <p className="mt-1 text-[10px] text-slate-500">UPI ID:</p>
// // //                       <p className="font-mono text-xs font-bold text-lime-800">{settings.upiId}</p>
// // //                       <p className="mt-2 text-[10px] text-lime-700">Scan karein — GPay, PhonePe, Paytm</p>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {/* Notes */}
// // //               {bill.notes && (
// // //                 <div className="border-t border-stone-100 p-4">
// // //                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Note</p>
// // //                   <p className="mt-1 text-xs italic text-slate-600">"{bill.notes}"</p>
// // //                 </div>
// // //               )}

// // //               {/* Terms */}
// // //               {settings.terms && (
// // //                 <div className="border-t border-stone-100 bg-stone-50 p-4">
// // //                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //                     Terms & Conditions
// // //                   </p>
// // //                   <p className="mt-1 text-[11px] text-slate-600">{settings.terms}</p>
// // //                 </div>
// // //               )}

// // //               {/* Footer note */}
// // //               <div className="border-t border-dashed border-stone-200 bg-stone-50/80 p-4 text-center">
// // //                 <p className="text-xs font-semibold text-slate-700">
// // //                   {settings.footerNote || 'Dhanyavaad! Phir aane ke liye shukriya 🙏'}
// // //                 </p>
// // //                 <p className="mt-1 text-[10px] text-slate-400">
// // //                   — BazaarBook se banaya gaya —
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             {/* Actions */}
// // //             <div className="no-print grid grid-cols-2 gap-2 border-t border-stone-200 p-4">
// // //               {bill.dueAmount > 0 && (
// // //                 <button
// // //                   onClick={() => setPayOpen(true)}
// // //                   className="btn btn-md bg-lime-600 text-white hover:bg-lime-700"
// // //                 >
// // //                   <Wallet className="h-4 w-4" />
// // //                   Receive {inr(bill.dueAmount)}
// // //                 </button>
// // //               )}
// // //               <button
// // //                 onClick={() => window.print()}
// // //                 className="btn-outline btn-md"
// // //               >
// // //                 <Printer className="h-4 w-4" />
// // //                 Print
// // //               </button>
// // //               <button
// // //                 onClick={() => onDelete(bill)}
// // //                 className={`btn-outline btn-md text-red-600 ${bill.dueAmount <= 0 ? 'col-span-1' : ''}`}
// // //               >
// // //                 <Trash2 className="h-4 w-4" />
// // //                 Delete
// // //               </button>
// // //             </div>
// // //           </>
// // //         )}
// // //       </div>

// // //       {/* Payment Modal */}
// // //       {payOpen && bill && (
// // //         <PaymentModal
// // //           amount={bill.dueAmount}
// // //           onClose={() => setPayOpen(false)}
// // //           onSubmit={receivePayment}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // ===================== ROW =====================
// // // function Row({ label, value, tone = 'default' }: any) {
// // //   return (
// // //     <div className="flex items-center justify-between text-sm">
// // //       <span className="text-slate-600">{label}</span>
// // //       <span className={`font-semibold ${
// // //         tone === 'accent' ? 'text-accent-600' :
// // //         tone === 'muted' ? 'text-slate-400' :
// // //         'text-slate-900'
// // //       }`}>
// // //         {value}
// // //       </span>
// // //     </div>
// // //   );
// // // }

// // // // ===================== PAYMENT MODAL =====================
// // // function PaymentModal({ amount, onClose, onSubmit }: any) {
// // //   const [amt, setAmt] = useState(amount);
// // //   const [mode, setMode] = useState('cash');
// // //   const [saving, setSaving] = useState(false);

// // //   const submit = async () => {
// // //     if (amt <= 0 || amt > amount) return toast.error('Sahi amount daalein');
// // //     setSaving(true);
// // //     try {
// // //       await onSubmit(amt, mode);
// // //     } finally { setSaving(false); }
// // //   };

// // //   return (
// // //     <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center">
// // //       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

// // //       <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
// // //         <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-5 text-white">
// // //           <div className="flex items-center justify-between">
// // //             <h3 className="font-display text-lg font-extrabold">Payment Receive</h3>
// // //             <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30">
// // //               <X className="h-4 w-4" />
// // //             </button>
// // //           </div>
// // //           <p className="mt-2 font-display text-3xl font-extrabold">{inr(amount)}</p>
// // //           <p className="text-xs text-white/85">Bill ka baki</p>
// // //         </div>

// // //         <div className="space-y-4 p-5">
// // //           <div>
// // //             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //               Kitna mila?
// // //             </label>
// // //             <div className="relative">
// // //               <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">₹</span>
// // //               <input
// // //                 type="number"
// // //                 value={amt || ''}
// // //                 onChange={(e) => setAmt(Number(e.target.value) || 0)}
// // //                 className="input pl-10 text-lg font-extrabold"
// // //                 placeholder="0"
// // //                 autoFocus
// // //               />
// // //             </div>
// // //             <div className="mt-2 flex gap-2">
// // //               {[100, 500, 1000].filter(q => q <= amount).map(q => (
// // //                 <button
// // //                   key={q}
// // //                   onClick={() => setAmt(q)}
// // //                   className="flex-1 rounded-full border border-stone-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-300 hover:bg-brand-50"
// // //                 >
// // //                   ₹{q}
// // //                 </button>
// // //               ))}
// // //               <button
// // //                 onClick={() => setAmt(amount)}
// // //                 className="flex-1 rounded-full border border-brand-300 bg-brand-50 px-2 py-1.5 text-xs font-bold text-brand-700"
// // //               >
// // //                 Full
// // //               </button>
// // //             </div>
// // //           </div>

// // //           <div>
// // //             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
// // //               Payment mode
// // //             </label>
// // //             <div className="grid grid-cols-3 gap-2">
// // //               {[
// // //                 { v: 'cash', l: 'Cash', e: '💵' },
// // //                 { v: 'upi', l: 'UPI', e: '📱' },
// // //                 { v: 'card', l: 'Card', e: '💳' }
// // //               ].map((m) => (
// // //                 <button
// // //                   key={m.v}
// // //                   onClick={() => setMode(m.v)}
// // //                   className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold transition ${
// // //                     mode === m.v
// // //                       ? 'border-lime-500 bg-lime-50 text-lime-800 ring-2 ring-lime-500/20'
// // //                       : 'border-stone-200 bg-white text-slate-600'
// // //                   }`}
// // //                 >
// // //                   <span className="text-lg">{m.e}</span>
// // //                   {m.l}
// // //                 </button>
// // //               ))}
// // //             </div>
// // //           </div>

// // //           <div className="rounded-2xl bg-stone-50 p-3">
// // //             <div className="flex justify-between text-sm">
// // //               <span className="text-slate-600">Payment</span>
// // //               <span className="font-bold text-slate-900">− {inr(amt)}</span>
// // //             </div>
// // //             <div className="mt-1 flex justify-between border-t border-dashed border-stone-300 pt-1">
// // //               <span className="text-slate-600">Baki rahega</span>
// // //               <span className={`font-display text-base font-extrabold ${amount - amt > 0 ? 'text-red-600' : 'text-lime-600'}`}>
// // //                 {inr(Math.max(0, amount - amt))}
// // //               </span>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="flex gap-2 border-t border-stone-200 p-4">
// // //           <button onClick={onClose} className="btn-ghost btn-md flex-1">Cancel</button>
// // //           <button
// // //             onClick={submit}
// // //             disabled={saving || amt <= 0 || amt > amount}
// // //             className="btn btn-md flex-[2] bg-lime-600 text-white hover:bg-lime-700 disabled:opacity-50"
// // //           >
// // //             {saving ? 'Save…' : `Receive ${inr(amt)}`}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import { useEffect, useMemo, useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import {
// //   Plus, Receipt, Search, X, Calendar, Download, ChevronRight,
// //   Phone, MessageCircle, CheckCircle2, AlertCircle, Clock,
// //   IndianRupee, Wallet, TrendingDown, Trash2, Printer
// // } from 'lucide-react';
// // import { toast } from 'sonner';
// // import { inr, timeAgo } from '@/lib/format';
// // import { ROUTES } from '@/lib/constants';

// // type Bill = {
// //   id: string;
// //   number: string;
// //   customerId?: string;
// //   customerName: string;
// //   customerMobile?: string;
// //   itemCount: number;
// //   total: number;
// //   paidAmount: number;
// //   dueAmount: number;
// //   paymentMode: string;
// //   paymentStatus: 'paid' | 'partial' | 'pending';
// //   createdAt: string;
// // };

// // type BillDetail = Bill & {
// //   items: any[];
// //   subtotal: number;
// //   itemDiscounts: number;
// //   billDiscount: number;
// //   discountType: string;
// //   discountValue: number;
// //   gstEnabled: boolean;
// //   gstRate: number;
// //   gstAmount: number;
// //   roundOff: number;
// //   notes?: string;
// // };

// // type RangeKey = 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all';

// // const RANGES: { k: RangeKey; l: string }[] = [
// //   { k: 'today', l: 'Aaj' },
// //   { k: 'yesterday', l: 'Kal' },
// //   { k: '7d', l: '7 Din' },
// //   { k: '30d', l: '30 Din' },
// //   { k: 'month', l: 'Is Mahine' },
// //   { k: 'all', l: 'Sab' }
// // ];

// // const MODE_EMOJI: any = {
// //   cash: '💵', upi: '📱', card: '💳', udhaar: '📝', split: '🔀'
// // };

// // const STATUS_CONFIG: any = {
// //   paid:    { label: 'Paid',  bg: 'bg-lime-100',  text: 'text-lime-800',  icon: CheckCircle2 },
// //   partial: { label: 'Aadha', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
// //   pending: { label: 'Baki',  bg: 'bg-red-100',   text: 'text-red-700',   icon: AlertCircle }
// // };

// // function rangeToDates(range: RangeKey): { from?: string; to?: string } {
// //   const now = new Date();
// //   const startOf = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
// //   const endOf = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };

// //   if (range === 'today') return { from: startOf(now).toISOString(), to: endOf(now).toISOString() };
// //   if (range === 'yesterday') {
// //     const y = new Date(now); y.setDate(y.getDate() - 1);
// //     return { from: startOf(y).toISOString(), to: endOf(y).toISOString() };
// //   }
// //   if (range === '7d') {
// //     const f = new Date(now); f.setDate(f.getDate() - 6);
// //     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
// //   }
// //   if (range === '30d') {
// //     const f = new Date(now); f.setDate(f.getDate() - 29);
// //     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
// //   }
// //   if (range === 'month') {
// //     const f = new Date(now.getFullYear(), now.getMonth(), 1);
// //     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
// //   }
// //   return {};
// // }

// // export default function BillsPage() {
// //   const token = localStorage.getItem('bb_token');

// //   const [bills, setBills] = useState<Bill[]>([]);
// //   const [summary, setSummary] = useState({ total_bills: 0, total_amount: 0, total_paid: 0, total_due: 0 });
// //   const [loading, setLoading] = useState(true);

// //   const [range, setRange] = useState<RangeKey>('7d');
// //   const [q, setQ] = useState('');
// //   const [status, setStatus] = useState('all');
// //   const [mode, setMode] = useState('all');
// //   const [sort, setSort] = useState('recent');
// //   const [advanced, setAdvanced] = useState(false);

// //   const [detailId, setDetailId] = useState<string | null>(null);
// //   const [deleting, setDeleting] = useState<Bill | null>(null);

// //   const load = async () => {
// //     try {
// //       setLoading(true);
// //       const params = new URLSearchParams();
// //       const dates = rangeToDates(range);
// //       if (dates.from) params.set('from', dates.from);
// //       if (dates.to) params.set('to', dates.to);
// //       if (q) params.set('q', q);
// //       if (status !== 'all') params.set('status', status);
// //       if (mode !== 'all') params.set('mode', mode);
// //       params.set('sort', sort);

// //       const r = await fetch('/api/bills?' + params.toString(), {
// //         headers: { Authorization: 'Bearer ' + token }
// //       });
// //       if (r.ok) {
// //         const d = await r.json();
// //         setBills(d.bills || []);
// //         setSummary(d.summary || { total_bills: 0, total_amount: 0, total_paid: 0, total_due: 0 });
// //       }
// //     } catch (e) { console.error(e); }
// //     finally { setLoading(false); }
// //   };

// //   useEffect(() => { load(); }, [range, q, status, mode, sort]);

// //   const grouped = useMemo(() => {
// //     const map = new Map<string, Bill[]>();
// //     bills.forEach((b) => {
// //       const key = b.createdAt.slice(0, 10);
// //       if (!map.has(key)) map.set(key, []);
// //       map.get(key)!.push(b);
// //     });
// //     return Array.from(map.entries());
// //   }, [bills]);

// //   const handleExport = () => {
// //     if (bills.length === 0) return toast.error('Kuch bills nahi');
// //     const rows = [
// //       ['Bill No', 'Date', 'Customer', 'Mobile', 'Items', 'Total', 'Paid', 'Baki', 'Mode', 'Status'],
// //       ...bills.map((b) => [
// //         b.number,
// //         new Date(b.createdAt).toLocaleDateString('en-IN'),
// //         b.customerName,
// //         b.customerMobile || '',
// //         b.itemCount,
// //         b.total,
// //         b.paidAmount,
// //         b.dueAmount,
// //         b.paymentMode,
// //         b.paymentStatus
// //       ])
// //     ];
// //     const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
// //     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
// //     const url = URL.createObjectURL(blob);
// //     const a = document.createElement('a');
// //     a.href = url;
// //     a.download = `bills-${new Date().toISOString().slice(0, 10)}.csv`;
// //     a.click();
// //     URL.revokeObjectURL(url);
// //     toast.success('Bills export ho gayi');
// //   };

// //   const handleDelete = async () => {
// //     if (!deleting) return;
// //     const r = await fetch(`/api/bills/${deleting.id}`, {
// //       method: 'DELETE',
// //       headers: { Authorization: 'Bearer ' + token }
// //     });
// //     if (r.ok) {
// //       toast.success('Bill delete ho gayi');
// //       setDeleting(null);
// //       await load();
// //     }
// //   };

// //   return (
// //     <div className="space-y-4 pb-6">
// //       {/* Header */}
// //       <div className="flex flex-wrap items-start justify-between gap-3">
// //         <div>
// //           <h1 className="font-display text-2xl font-extrabold text-slate-900">
// //             Purane Bills
// //           </h1>
// //           <p className="mt-0.5 text-sm text-slate-500">
// //             Sabhi bills ek jagah
// //           </p>
// //         </div>
// //         <div className="flex gap-2">
// //           {bills.length > 0 && (
// //             <button onClick={handleExport} className="btn-outline btn-md">
// //               <Download className="h-4 w-4" />
// //               CSV
// //             </button>
// //           )}
// //           <Link to={ROUTES.newBill} className="btn-primary btn-md">
// //             <Plus className="h-4 w-4" />
// //             Naya
// //           </Link>
// //         </div>
// //       </div>

// //       {/* Summary cards */}
// //       {!loading && bills.length > 0 && (
// //         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
// //           <Mini icon={<Receipt className="h-5 w-5" />} label="Total Bills" value={String(summary.total_bills)} tone="brand" />
// //           <Mini icon={<IndianRupee className="h-5 w-5" />} label="Total Amount" value={inr(summary.total_amount)} tone="accent" />
// //           <Mini icon={<Wallet className="h-5 w-5" />} label="Mila" value={inr(summary.total_paid)} tone="success" />
// //           <Mini icon={<TrendingDown className="h-5 w-5" />} label="Baki" value={inr(summary.total_due)} tone="danger" />
// //         </div>
// //       )}

// //       {/* Filters */}
// //       <div className="space-y-3">
// //         <div className="flex gap-2">
// //           <div className="relative flex-1">
// //             <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //             <input
// //               value={q}
// //               onChange={(e) => setQ(e.target.value)}
// //               placeholder="Bill no, grahak, mobile…"
// //               className="input pl-11 pr-10"
// //             />
// //             {q && (
// //               <button
// //                 onClick={() => setQ('')}
// //                 className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-stone-100"
// //               >
// //                 <X className="h-3.5 w-3.5" />
// //               </button>
// //             )}
// //           </div>
// //           <button
// //             onClick={() => setAdvanced(!advanced)}
// //             className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition ${
// //               advanced
// //                 ? 'border-brand-500 bg-brand-50 text-brand-700'
// //                 : 'border-stone-200 bg-white text-slate-600'
// //             }`}
// //             title="Filters"
// //           >
// //             <Calendar className="h-4 w-4" />
// //           </button>
// //         </div>

// //         <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
// //           {RANGES.map((r) => (
// //             <button
// //               key={r.k}
// //               onClick={() => setRange(r.k)}
// //               className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
// //                 range === r.k
// //                   ? 'border-brand-500 bg-brand-50 text-brand-700'
// //                   : 'border-stone-200 bg-white text-slate-600'
// //               }`}
// //             >
// //               {r.l}
// //             </button>
// //           ))}
// //         </div>

// //         {advanced && (
// //           <div className="card space-y-4 p-4">
// //             <div>
// //               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                 Payment Status
// //               </p>
// //               <div className="grid grid-cols-4 gap-2">
// //                 {[
// //                   { k: 'all', l: 'Sab', e: '📋' },
// //                   { k: 'paid', l: 'Paid', e: '✅' },
// //                   { k: 'partial', l: 'Aadha', e: '⚡' },
// //                   { k: 'pending', l: 'Baki', e: '⚠️' }
// //                 ].map((s) => (
// //                   <button
// //                     key={s.k}
// //                     onClick={() => setStatus(s.k)}
// //                     className={`flex flex-col items-center gap-0.5 rounded-2xl border px-2 py-2 text-[10px] font-bold transition ${
// //                       status === s.k
// //                         ? 'border-brand-500 bg-brand-50 text-brand-700'
// //                         : 'border-stone-200 bg-white text-slate-600'
// //                     }`}
// //                   >
// //                     <span className="text-sm">{s.e}</span>
// //                     {s.l}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <div>
// //               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                 Payment Mode
// //               </p>
// //               <div className="grid grid-cols-5 gap-2">
// //                 {[
// //                   { k: 'all', l: 'Sab', e: '📋' },
// //                   { k: 'cash', l: 'Cash', e: '💵' },
// //                   { k: 'upi', l: 'UPI', e: '📱' },
// //                   { k: 'card', l: 'Card', e: '💳' },
// //                   { k: 'udhaar', l: 'Udhaar', e: '📝' }
// //                 ].map((m) => (
// //                   <button
// //                     key={m.k}
// //                     onClick={() => setMode(m.k)}
// //                     className={`flex flex-col items-center gap-0.5 rounded-2xl border px-1 py-2 text-[10px] font-bold transition ${
// //                       mode === m.k
// //                         ? 'border-brand-500 bg-brand-50 text-brand-700'
// //                         : 'border-stone-200 bg-white text-slate-600'
// //                     }`}
// //                   >
// //                     <span className="text-sm">{m.e}</span>
// //                     {m.l}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <div>
// //               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                 Sort
// //               </p>
// //               <div className="grid grid-cols-2 gap-2">
// //                 {[
// //                   { k: 'recent', l: 'Naye pehle' },
// //                   { k: 'amount_desc', l: 'Zyada amount' },
// //                   { k: 'amount_asc', l: 'Kam amount' },
// //                   { k: 'customer', l: 'Naam A–Z' }
// //                 ].map((s) => (
// //                   <button
// //                     key={s.k}
// //                     onClick={() => setSort(s.k)}
// //                     className={`rounded-2xl border px-3 py-2 text-xs font-bold transition ${
// //                       sort === s.k
// //                         ? 'border-brand-500 bg-brand-50 text-brand-700'
// //                         : 'border-stone-200 bg-white text-slate-600'
// //                     }`}
// //                   >
// //                     {s.l}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <button
// //               onClick={() => {
// //                 setQ('');
// //                 setStatus('all');
// //                 setMode('all');
// //                 setSort('recent');
// //               }}
// //               className="btn-ghost btn-sm w-full"
// //             >
// //               <X className="h-3.5 w-3.5" />
// //               Filters reset karein
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Content */}
// //       {loading ? (
// //         <div className="card divide-y divide-stone-100 overflow-hidden">
// //           {[1, 2, 3, 4, 5].map((i) => (
// //             <div key={i} className="flex items-center gap-3 p-4">
// //               <div className="h-11 w-11 animate-pulse rounded-full bg-stone-100" />
// //               <div className="flex-1 space-y-2">
// //                 <div className="h-3 w-40 animate-pulse rounded-full bg-stone-200" />
// //                 <div className="h-2.5 w-24 animate-pulse rounded-full bg-stone-100" />
// //               </div>
// //               <div className="h-4 w-20 animate-pulse rounded-full bg-stone-200" />
// //             </div>
// //           ))}
// //         </div>
// //       ) : bills.length === 0 ? (
// //         <div className="card p-10 text-center">
// //           <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
// //             <Receipt className="h-7 w-7" />
// //           </div>
// //           <h3 className="mt-4 font-display text-lg font-bold">
// //             {q || status !== 'all' || mode !== 'all'
// //               ? 'Kuch nahi mila'
// //               : 'Is period mein koi bill nahi'}
// //           </h3>
// //           <p className="mt-1 text-sm text-slate-500">
// //             {q || status !== 'all' || mode !== 'all'
// //               ? 'Filters badal kar dekhein'
// //               : 'Pehla bill banayein — 30 second mein ready'}
// //           </p>
// //           <button
// //             onClick={q || status !== 'all' || mode !== 'all'
// //               ? () => { setQ(''); setStatus('all'); setMode('all'); }
// //               : undefined}
// //             className="btn-primary btn-md mt-5"
// //           >
// //             {q || status !== 'all' || mode !== 'all' ? (
// //               <><X className="h-4 w-4" /> Filters hatao</>
// //             ) : (
// //               <Link to={ROUTES.newBill}>
// //                 <Plus className="h-4 w-4" /> Naya Bill Banayein
// //               </Link>
// //             )}
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="card overflow-hidden">
// //           {grouped.map(([day, dayBills]) => {
// //             const dayTotal = dayBills.reduce((s, b) => s + b.total, 0);
// //             return (
// //               <div key={day}>
// //                 <div className="flex items-center justify-between gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2">
// //                   <div className="flex items-center gap-2">
// //                     <span className="text-xs font-bold text-slate-700">
// //                       {dayLabel(dayBills[0].createdAt)}
// //                     </span>
// //                     <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
// //                       {dayBills.length} {dayBills.length === 1 ? 'bill' : 'bills'}
// //                     </span>
// //                   </div>
// //                   <span className="text-xs font-extrabold text-slate-900 tabular-nums">
// //                     {inr(dayTotal)}
// //                   </span>
// //                 </div>

// //                 <ul className="divide-y divide-stone-100">
// //                   {dayBills.map((b) => (
// //                     <BillRow
// //                       key={b.id}
// //                       bill={b}
// //                       onOpen={() => setDetailId(b.id)}
// //                       onDelete={() => setDeleting(b)}
// //                     />
// //                   ))}
// //                 </ul>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}

// //       {!loading && bills.length > 0 && (
// //         <p className="text-center text-xs text-slate-400">
// //           {bills.length} bill {status !== 'all' && `(${status})`}
// //         </p>
// //       )}

// //       {/* Detail Modal */}
// //       {detailId && (
// //         <BillDetailModal
// //           id={detailId}
// //           onClose={() => setDetailId(null)}
// //           onRefresh={load}
// //           onDelete={(b: any) => { setDetailId(null); setDeleting(b); }}
// //         />
// //       )}

// //       {/* Delete Confirm */}
// //       {deleting && (
// //         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
// //           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleting(null)} />
// //           <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
// //             <h3 className="font-display text-lg font-bold text-slate-900">
// //               Bill delete karein?
// //             </h3>
// //             <p className="mt-2 text-sm text-slate-600">
// //               Bill <strong>{deleting.number}</strong> ko delete kar dein?
// //               Stock wapas jud jayega aur udhaar reverse ho jayega.
// //             </p>
// //             <div className="mt-5 flex gap-2">
// //               <button onClick={() => setDeleting(null)} className="btn-ghost btn-md flex-1">
// //                 Cancel
// //               </button>
// //               <button onClick={handleDelete} className="btn-danger btn-md flex-1">
// //                 Delete
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function dayLabel(dateStr: string): string {
// //   const d = new Date(dateStr);
// //   const today = new Date(); today.setHours(0, 0, 0, 0);
// //   const yest = new Date(today); yest.setDate(yest.getDate() - 1);
// //   const tgt = new Date(d); tgt.setHours(0, 0, 0, 0);

// //   if (tgt.getTime() === today.getTime()) return 'Aaj';
// //   if (tgt.getTime() === yest.getTime()) return 'Kal';
// //   return d.toLocaleDateString('en-IN', {
// //     weekday: 'long', day: 'numeric', month: 'short',
// //     year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
// //   });
// // }

// // function Mini({ icon, label, value, tone }: any) {
// //   const tones: any = {
// //     brand: 'bg-brand-50 text-brand-600 ring-brand-100',
// //     accent: 'bg-accent-50 text-accent-600 ring-accent-100',
// //     success: 'bg-lime-50 text-lime-600 ring-lime-100',
// //     danger: 'bg-red-50 text-red-500 ring-red-100'
// //   };
// //   return (
// //     <div className="card p-4">
// //       <div className="flex items-center gap-3">
// //         <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
// //           {icon}
// //         </div>
// //         <div className="min-w-0">
// //           <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //             {label}
// //           </p>
// //           <p className="font-display text-lg font-extrabold text-slate-900 truncate">
// //             {value}
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // function BillRow({ bill, onOpen, onDelete }: any) {
// //   const cfg = STATUS_CONFIG[bill.paymentStatus];
// //   const Icon = cfg.icon;

// //   return (
// //     <li>
// //       <button
// //         onClick={onOpen}
// //         className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-stone-50 active:bg-stone-100"
// //       >
// //         <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white shadow-sm ${
// //           bill.paymentStatus === 'paid'
// //             ? 'bg-gradient-to-br from-brand-500 to-accent-500'
// //             : bill.paymentStatus === 'partial'
// //             ? 'bg-gradient-to-br from-amber-400 to-amber-600'
// //             : 'bg-gradient-to-br from-red-400 to-red-600'
// //         }`}>
// //           {(bill.customerName || 'W').charAt(0).toUpperCase()}
// //         </span>

// //         <div className="min-w-0 flex-1">
// //           <div className="flex items-center gap-2">
// //             <p className="truncate text-sm font-bold text-slate-900">
// //               {bill.customerName || 'Walk-in'}
// //             </p>
// //             <span className="shrink-0 font-mono text-[11px] text-slate-400">
// //               {bill.number}
// //             </span>
// //           </div>

// //           <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
// //             <span>{MODE_EMOJI[bill.paymentMode] || '💵'}</span>
// //             <span className="capitalize">{bill.paymentMode}</span>
// //             <span>•</span>
// //             <span>{bill.itemCount} item</span>
// //             <span>•</span>
// //             <span>{timeAgo(bill.createdAt)}</span>
// //           </div>
// //         </div>

// //         <div className="shrink-0 text-right">
// //           <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
// //             {inr(bill.total)}
// //           </p>
// //           <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
// //             <Icon className="h-3 w-3" />
// //             {cfg.label}
// //           </span>
// //           {bill.dueAmount > 0 && (
// //             <p className="mt-0.5 text-[10px] font-bold text-red-500">
// //               Baki {inr(bill.dueAmount)}
// //             </p>
// //           )}
// //         </div>

// //         <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
// //       </button>
// //     </li>
// //   );
// // }

// // /* ===================== BILL DETAIL MODAL ===================== */
// // function BillDetailModal({ id, onClose, onRefresh, onDelete }: any) {
// //   const token = localStorage.getItem('bb_token');
// //   const [data, setData] = useState<any>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [payOpen, setPayOpen] = useState(false);

// //   const load = async () => {
// //     try {
// //       const r = await fetch(`/api/bills/${id}`, {
// //         headers: { Authorization: 'Bearer ' + token }
// //       });
// //       if (r.ok) setData(await r.json());
// //     } catch (e) { console.error(e); }
// //     finally { setLoading(false); }
// //   };

// //   useEffect(() => { load(); }, [id]);

// //   const receivePayment = async (amount: number, mode: string) => {
// //     const r = await fetch(`/api/bills/${id}/payment`, {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
// //       body: JSON.stringify({ amount, mode })
// //     });
// //     if (r.ok) {
// //       toast.success(`${inr(amount)} received!`);
// //       setPayOpen(false);
// //       await load();
// //       onRefresh();
// //     } else {
// //       toast.error((await r.json()).error);
// //     }
// //   };

// //   const bill = data?.bill;
// //   const shop = data?.shop || {};
// //   const settings = data?.settings || {};

// //   const upiUrl = settings.showQR && settings.upiId && bill?.dueAmount > 0
// //     ? `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(shop.name || '')}&am=${bill.dueAmount}&cu=INR&tn=${encodeURIComponent('Bill ' + bill.number)}`
// //     : null;

// //   const handlePrint = () => {
// //   // Create a separate print window
// //   const printWindow = window.open('', '_blank', 'width=900,height=700');
// //   if (!printWindow) {
// //     toast.error('Popup blocked — kripya popups allow karein');
// //     return;
// //   }

// //   // Build the bill HTML
// //   const billHTML = `
// // <!DOCTYPE html>
// // <html lang="hi">
// // <head>
// //   <meta charset="UTF-8">
// //   <title>Bill ${bill.number}</title>
// //   <style>
// //     * { margin: 0; padding: 0; box-sizing: border-box; }
// //     body {
// //       font-family: 'Inter', -apple-system, system-ui, sans-serif;
// //       font-size: 12px;
// //       line-height: 1.4;
// //       color: #000;
// //       background: #fff;
// //       padding: 15mm 12mm;
// //       max-width: 210mm;
// //       margin: 0 auto;
// //     }
// //     .header {
// //       border-bottom: 2px solid #000;
// //       padding-bottom: 10px;
// //       margin-bottom: 12px;
// //     }
// //     .shop-name {
// //       font-size: 20px;
// //       font-weight: 800;
// //       margin-bottom: 4px;
// //     }
// //     .shop-detail {
// //       font-size: 11px;
// //       color: #333;
// //       margin: 1px 0;
// //     }
// //     .bill-meta {
// //       display: flex;
// //       justify-content: space-between;
// //       align-items: flex-start;
// //       margin-bottom: 12px;
// //       padding-bottom: 10px;
// //       border-bottom: 1px dashed #000;
// //     }
// //     .bill-number {
// //       font-size: 16px;
// //       font-weight: 700;
// //     }
// //     .bill-date {
// //       font-size: 10px;
// //       color: #666;
// //     }
// //     .status-badge {
// //       display: inline-block;
// //       padding: 3px 8px;
// //       font-size: 10px;
// //       font-weight: 700;
// //       border: 1px solid #000;
// //       border-radius: 12px;
// //       margin-top: 4px;
// //     }
// //     .customer {
// //       margin-bottom: 12px;
// //     }
// //     .customer-label {
// //       font-size: 9px;
// //       font-weight: 700;
// //       text-transform: uppercase;
// //       letter-spacing: 0.5px;
// //       color: #666;
// //       margin-bottom: 2px;
// //     }
// //     .customer-name {
// //       font-weight: 700;
// //       font-size: 13px;
// //     }
// //     table {
// //       width: 100%;
// //       border-collapse: collapse;
// //       margin-bottom: 12px;
// //     }
// //     th {
// //       text-align: left;
// //       font-size: 9px;
// //       font-weight: 700;
// //       text-transform: uppercase;
// //       letter-spacing: 0.5px;
// //       padding: 6px 0;
// //       border-bottom: 1px solid #000;
// //     }
// //     th.right, td.right { text-align: right; }
// //     td {
// //       padding: 7px 0;
// //       font-size: 12px;
// //       border-bottom: 1px solid #e5e5e5;
// //     }
// //     .item-name { font-weight: 600; }
// //     .item-sub { font-size: 10px; color: #666; }
// //     .totals {
// //       margin-left: auto;
// //       width: 100%;
// //       max-width: 280px;
// //     }
// //     .total-row {
// //       display: flex;
// //       justify-content: space-between;
// //       padding: 4px 0;
// //       font-size: 12px;
// //     }
// //     .total-divider {
// //       border-top: 2px solid #000;
// //       margin-top: 6px;
// //       padding-top: 6px;
// //       font-size: 16px;
// //       font-weight: 800;
// //     }
// //     .due-box {
// //       margin-top: 8px;
// //       padding: 6px;
// //       border: 1px dashed #000;
// //       font-size: 11px;
// //     }
// //     .footer {
// //       margin-top: 24px;
// //       padding-top: 12px;
// //       border-top: 1px dashed #000;
// //       text-align: center;
// //       font-size: 11px;
// //     }
// //     .footer-sub {
// //       font-size: 9px;
// //       color: #666;
// //       margin-top: 4px;
// //     }
// //     .notes {
// //       margin-top: 12px;
// //       padding: 8px;
// //       background: #f5f5f5;
// //       font-size: 11px;
// //       font-style: italic;
// //     }
// //     .terms {
// //       margin-top: 12px;
// //       font-size: 10px;
// //       color: #444;
// //     }
// //     .terms-title {
// //       font-size: 9px;
// //       font-weight: 700;
// //       text-transform: uppercase;
// //       letter-spacing: 0.5px;
// //       margin-bottom: 4px;
// //     }
// //     @media print {
// //       @page { size: A4 portrait; margin: 10mm; }
// //       body { padding: 0; }
// //     }
// //   </style>
// // </head>
// // <body>
// //   <!-- HEADER -->
// //   <div class="header">
// //     <div class="shop-name">${shop.name || 'BazaarBook'}</div>
// //     ${shop.owner ? `<div class="shop-detail">${shop.owner}</div>` : ''}
// //     ${shop.mobile ? `<div class="shop-detail">📞 ${shop.mobile}</div>` : ''}
// //     ${(shop.address || shop.city) ? `<div class="shop-detail">📍 ${shop.address || ''}${shop.address && shop.city ? ', ' : ''}${shop.city || ''}${shop.state ? ', ' + shop.state : ''}${shop.pincode ? ' - ' + shop.pincode : ''}</div>` : ''}
// //     ${shop.gstin ? `<div class="shop-detail"><strong>GSTIN:</strong> ${shop.gstin}</div>` : ''}
// //   </div>

// //   <!-- BILL META -->
// //   <div class="bill-meta">
// //     <div>
// //       <div class="bill-number">Bill: ${bill.number}</div>
// //       <div class="bill-date">${new Date(bill.createdAt).toLocaleString('en-IN', {
// //         day: 'numeric', month: 'short', year: 'numeric',
// //         hour: '2-digit', minute: '2-digit'
// //       })}</div>
// //     </div>
// //     <div style="text-align: right;">
// //       <div class="status-badge">
// //         ${bill.paymentStatus === 'paid' ? '✓ PAID' : bill.paymentStatus === 'partial' ? 'PARTIAL' : 'PENDING'}
// //       </div>
// //       <div class="bill-date" style="margin-top: 4px;">
// //         ${bill.paymentMode?.toUpperCase() || 'CASH'}
// //       </div>
// //     </div>
// //   </div>

// //   <!-- CUSTOMER -->
// //   <div class="customer">
// //     <div class="customer-label">Grahak</div>
// //     <div class="customer-name">${bill.customerName || 'Walk-in Customer'}</div>
// //     ${bill.customerMobile ? `<div class="shop-detail">📱 ${bill.customerMobile}</div>` : ''}
// //   </div>

// //   <!-- ITEMS -->
// //   <table>
// //     <thead>
// //       <tr>
// //         <th>Item</th>
// //         <th class="right">Qty</th>
// //         <th class="right">Rate</th>
// //         <th class="right">Total</th>
// //       </tr>
// //     </thead>
// //     <tbody>
// //       ${bill.items.map((it: any) => `
// //         <tr>
// //           <td>
// //             <div class="item-name">${it.name}</div>
// //             ${it.discount > 0 ? `<div class="item-sub">Discount: −₹${it.discount}</div>` : ''}
// //           </td>
// //           <td class="right">${it.quantity} ${it.unit || ''}</td>
// //           <td class="right">₹${it.price}</td>
// //           <td class="right"><strong>₹${it.lineTotal || (it.price * it.quantity - (it.discount || 0))}</strong></td>
// //         </tr>
// //       `).join('')}
// //     </tbody>
// //   </table>

// //   <!-- TOTALS -->
// //   <div class="totals">
// //     <div class="total-row">
// //       <span>Subtotal</span>
// //       <span>₹${bill.subtotal}</span>
// //     </div>
// //     ${bill.itemDiscounts > 0 ? `
// //       <div class="total-row">
// //         <span>Item Discount</span>
// //         <span>− ₹${bill.itemDiscounts}</span>
// //       </div>
// //     ` : ''}
// //     ${bill.billDiscount > 0 ? `
// //       <div class="total-row">
// //         <span>Bill Discount</span>
// //         <span>− ₹${bill.billDiscount}</span>
// //       </div>
// //     ` : ''}
// //     ${bill.gstAmount > 0 ? `
// //       <div class="total-row">
// //         <span>GST @ ${bill.gstRate}%</span>
// //         <span>+ ₹${bill.gstAmount}</span>
// //       </div>
// //     ` : ''}
// //     ${Math.abs(bill.roundOff || 0) > 0.01 ? `
// //       <div class="total-row">
// //         <span>Round Off</span>
// //         <span>${bill.roundOff > 0 ? '+' : ''}₹${bill.roundOff}</span>
// //       </div>
// //     ` : ''}
// //     <div class="total-row total-divider">
// //       <span>TOTAL</span>
// //       <span>₹${bill.total}</span>
// //     </div>
// //     ${bill.paymentStatus !== 'paid' ? `
// //       <div class="due-box">
// //         <div style="display:flex; justify-content:space-between;">
// //           <span>Paid</span><span>₹${bill.paidAmount}</span>
// //         </div>
// //         <div style="display:flex; justify-content:space-between; font-weight:700; margin-top:4px;">
// //           <span>Baki</span><span>₹${bill.dueAmount}</span>
// //         </div>
// //       </div>
// //     ` : ''}
// //   </div>

// //   ${bill.notes ? `<div class="notes">"${bill.notes}"</div>` : ''}

// //   ${settings.terms ? `
// //     <div class="terms">
// //       <div class="terms-title">Terms & Conditions</div>
// //       <div>${settings.terms}</div>
// //     </div>
// //   ` : ''}

// //   <!-- FOOTER -->
// //   <div class="footer">
// //     <div>${settings.footerNote || 'Dhanyavaad! Phir aane ke liye shukriya 🙏'}</div>
// //     <div class="footer-sub">— BazaarBook se banaya gaya —</div>
// //   </div>
// // </body>
// // </html>
// //   `;

// //   printWindow.document.write(billHTML);
// //   printWindow.document.close();

// //   // Wait for content to fully render, then print
// //   printWindow.onload = () => {
// //     printWindow.focus();
// //     setTimeout(() => {
// //       printWindow.print();
// //     }, 200);
// //   };

// //   // Fallback in case onload doesn't fire
// //   setTimeout(() => {
// //     if (!printWindow.closed) {
// //       printWindow.focus();
// //       printWindow.print();
// //     }
// //   }, 600);
// // };

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
// //       <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

// //       <div className="bill-print-area relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
// //         {loading || !bill ? (
// //           <div className="p-10 text-center">
// //             <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
// //             <p className="mt-4 text-sm text-slate-500">Load ho raha…</p>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Header */}
// //             <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
// //               <div className="flex items-start justify-between gap-3">
// //                 <div className="flex items-start gap-3 min-w-0">
// //                   {settings.showLogo !== false && shop.logoUrl ? (
// //                     <img
// //                       src={shop.logoUrl}
// //                       alt="Logo"
// //                       className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-2 ring-white/30"
// //                       onError={(e: any) => { e.target.style.display = 'none'; }}
// //                     />
// //                   ) : (
// //                     <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold backdrop-blur ring-2 ring-white/30">
// //                       {(shop.name || 'B').charAt(0).toUpperCase()}
// //                     </div>
// //                   )}
// //                   <div className="min-w-0">
// //                     <p className="truncate font-display text-lg font-extrabold">
// //                       {shop.name || 'BazaarBook'}
// //                     </p>
// //                     {shop.owner && <p className="truncate text-xs text-white/80">{shop.owner}</p>}
// //                     {shop.mobile && <p className="truncate text-[11px] text-white/70">📞 {shop.mobile}</p>}
// //                     {(shop.city || shop.address) && (
// //                       <p className="truncate text-[11px] text-white/70">
// //                         📍 {shop.address ? `${shop.address}, ` : ''}{shop.city}
// //                         {shop.state ? `, ${shop.state}` : ''}
// //                       </p>
// //                     )}
// //                     {shop.gstin && (
// //                       <p className="truncate font-mono text-[10px] text-white/60">
// //                         GSTIN: {shop.gstin}
// //                       </p>
// //                     )}
// //                   </div>
// //                 </div>
// //                 <div className="shrink-0 text-right">
// //                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
// //                     Bill
// //                   </p>
// //                   <p className="font-display text-lg font-extrabold">{bill.number}</p>
// //                   <p className="mt-0.5 text-[10px] text-white/70">
// //                     {new Date(bill.createdAt).toLocaleString('en-IN', {
// //                       day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
// //                     })}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="mt-3 flex items-center gap-2 flex-wrap">
// //                 <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
// //                   bill.paymentStatus === 'paid' ? 'bg-lime-400/90 text-lime-950'
// //                   : bill.paymentStatus === 'partial' ? 'bg-amber-400/90 text-amber-950'
// //                   : 'bg-red-400/90 text-red-950'
// //                 }`}>
// //                   {bill.paymentStatus === 'paid' ? 'PAID' : bill.paymentStatus === 'partial' ? 'PARTIAL' : 'PENDING'}
// //                 </span>
// //                 <span className="text-xs text-white/90">
// //                   {MODE_EMOJI[bill.paymentMode]} {bill.paymentMode?.toUpperCase()}
// //                 </span>
// //               </div>
// //             </div>

// //             {/* Body */}
// //             <div className="flex-1 overflow-y-auto">
// //               <div className="border-b border-stone-100 p-4">
// //                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                   Grahak
// //                 </p>
// //                 <p className="mt-0.5 text-sm font-bold text-slate-900">
// //                   {bill.customerName || 'Walk-in Customer'}
// //                 </p>
// //                 {bill.customerMobile && (
// //                   <p className="font-mono text-xs text-slate-500">{bill.customerMobile}</p>
// //                 )}
// //               </div>

// //               <div className="border-b border-stone-100 bg-stone-50/50 px-4 py-2">
// //                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                   Saman ({bill.items.length})
// //                 </p>
// //               </div>
// //               <ul className="divide-y divide-stone-100">
// //                 {bill.items.map((it: any, i: number) => (
// //                   <li key={i} className="flex items-start gap-3 px-4 py-3">
// //                     <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700">
// //                       {i + 1}
// //                     </span>
// //                     <div className="min-w-0 flex-1">
// //                       <p className="text-sm font-semibold text-slate-900">{it.name}</p>
// //                       <p className="text-xs text-slate-500">
// //                         {inr(it.price)} × {it.quantity} {it.unit}
// //                         {it.discount > 0 && (
// //                           <span className="ml-2 text-accent-600">− {inr(it.discount)}</span>
// //                         )}
// //                       </p>
// //                     </div>
// //                     <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
// //                       {inr(it.lineTotal || (it.price * it.quantity - it.discount))}
// //                     </p>
// //                   </li>
// //                 ))}
// //               </ul>

// //               <div className="space-y-2 border-t border-stone-100 p-4">
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm text-slate-600">Subtotal</span>
// //                   <span className="text-sm font-semibold text-slate-900">{inr(bill.subtotal)}</span>
// //                 </div>
// //                 {bill.itemDiscounts > 0 && (
// //                   <div className="flex items-center justify-between">
// //                     <span className="text-sm text-slate-600">Item Discount</span>
// //                     <span className="text-sm font-semibold text-accent-600">− {inr(bill.itemDiscounts)}</span>
// //                   </div>
// //                 )}
// //                 {bill.billDiscount > 0 && (
// //                   <div className="flex items-center justify-between">
// //                     <span className="text-sm text-slate-600">Bill Discount</span>
// //                     <span className="text-sm font-semibold text-accent-600">− {inr(bill.billDiscount)}</span>
// //                   </div>
// //                 )}
// //                 {bill.gstAmount > 0 && (
// //                   <div className="flex items-center justify-between">
// //                     <span className="text-sm text-slate-600">GST @ {bill.gstRate}%</span>
// //                     <span className="text-sm font-semibold text-slate-900">+ {inr(bill.gstAmount)}</span>
// //                   </div>
// //                 )}

// //                 <div className="mt-3 flex items-center justify-between border-t border-dashed border-stone-200 pt-3">
// //                   <span className="font-display text-base font-bold text-slate-700">Total</span>
// //                   <span className="font-display text-2xl font-extrabold text-slate-900">{inr(bill.total)}</span>
// //                 </div>

// //                 {bill.paymentStatus !== 'paid' && (
// //                   <div className="mt-2 space-y-1.5 rounded-2xl bg-red-50 p-3 ring-1 ring-red-100">
// //                     <div className="flex justify-between text-sm">
// //                       <span className="text-red-700">Paid</span>
// //                       <span className="font-bold text-red-900">{inr(bill.paidAmount)}</span>
// //                     </div>
// //                     <div className="flex justify-between border-t border-red-200 pt-1.5">
// //                       <span className="font-bold text-red-700">Baki</span>
// //                       <span className="font-display text-base font-extrabold text-red-900">
// //                         {inr(bill.dueAmount)}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               {upiUrl && (
// //                 <div className="border-t border-stone-100 bg-lime-50/50 p-4">
// //                   <p className="text-[10px] font-bold uppercase tracking-wider text-lime-800">
// //                     💳 UPI se pay karein
// //                   </p>
// //                   <div className="mt-3 flex items-center gap-4">
// //                     <img
// //                       src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiUrl)}&margin=8`}
// //                       alt="UPI QR"
// //                       className="h-32 w-32 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-lime-200"
// //                     />
// //                     <div>
// //                       <p className="text-xs font-bold text-slate-700">Amount: {inr(bill.dueAmount)}</p>
// //                       <p className="mt-1 text-[10px] text-slate-500">UPI ID:</p>
// //                       <p className="font-mono text-xs font-bold text-lime-800">{settings.upiId}</p>
// //                       <p className="mt-2 text-[10px] text-lime-700">Scan karein — GPay, PhonePe, Paytm</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {bill.notes && (
// //                 <div className="border-t border-stone-100 p-4">
// //                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Note</p>
// //                   <p className="mt-1 text-xs italic text-slate-600">"{bill.notes}"</p>
// //                 </div>
// //               )}

// //               {settings.terms && (
// //                 <div className="border-t border-stone-100 bg-stone-50 p-4">
// //                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                     Terms & Conditions
// //                   </p>
// //                   <p className="mt-1 text-[11px] text-slate-600">{settings.terms}</p>
// //                 </div>
// //               )}

// //               <div className="border-t border-dashed border-stone-200 bg-stone-50/80 p-4 text-center">
// //                 <p className="text-xs font-semibold text-slate-700">
// //                   {settings.footerNote || 'Dhanyavaad! Phir aane ke liye shukriya 🙏'}
// //                 </p>
// //                 <p className="mt-1 text-[10px] text-slate-400">
// //                   — BazaarBook se banaya gaya —
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Actions — no-print so they don't appear in print */}
// //             <div className="no-print grid grid-cols-2 gap-2 border-t border-stone-200 p-4">
// //               {bill.dueAmount > 0 && (
// //                 <button
// //                   onClick={() => setPayOpen(true)}
// //                   className="btn btn-md bg-lime-600 text-white hover:bg-lime-700"
// //                 >
// //                   <Wallet className="h-4 w-4" />
// //                   Receive {inr(bill.dueAmount)}
// //                 </button>
// //               )}
// //               <button
// //                 onClick={handlePrint}
// //                 className="btn-outline btn-md"
// //               >
// //                 <Printer className="h-4 w-4" />
// //                 Print
// //               </button>
// //               <button
// //                 onClick={() => onDelete(bill)}
// //                 className={`btn-outline btn-md text-red-600 ${bill.dueAmount <= 0 ? 'col-span-1' : ''}`}
// //               >
// //                 <Trash2 className="h-4 w-4" />
// //                 Delete
// //               </button>
// //             </div>
// //           </>
// //         )}
// //       </div>

// //       {payOpen && bill && (
// //         <PaymentModal
// //           amount={bill.dueAmount}
// //           onClose={() => setPayOpen(false)}
// //           onSubmit={receivePayment}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // /* ===================== PAYMENT MODAL ===================== */
// // function PaymentModal({ amount, onClose, onSubmit }: any) {
// //   const [amt, setAmt] = useState(amount);
// //   const [mode, setMode] = useState('cash');
// //   const [saving, setSaving] = useState(false);

// //   const submit = async () => {
// //     if (amt <= 0 || amt > amount) return toast.error('Sahi amount daalein');
// //     setSaving(true);
// //     try {
// //       await onSubmit(amt, mode);
// //     } finally { setSaving(false); }
// //   };

// //   return (
// //     <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center">
// //       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

// //       <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
// //         <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-5 text-white">
// //           <div className="flex items-center justify-between">
// //             <h3 className="font-display text-lg font-extrabold">Payment Receive</h3>
// //             <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30">
// //               <X className="h-4 w-4" />
// //             </button>
// //           </div>
// //           <p className="mt-2 font-display text-3xl font-extrabold">{inr(amount)}</p>
// //           <p className="text-xs text-white/85">Bill ka baki</p>
// //         </div>

// //         <div className="space-y-4 p-5">
// //           <div>
// //             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //               Kitna mila?
// //             </label>
// //             <div className="relative">
// //               <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">₹</span>
// //               <input
// //                 type="number"
// //                 value={amt || ''}
// //                 onChange={(e) => setAmt(Number(e.target.value) || 0)}
// //                 className="input pl-10 text-lg font-extrabold"
// //                 placeholder="0"
// //                 autoFocus
// //               />
// //             </div>
// //             <div className="mt-2 flex gap-2">
// //               {[100, 500, 1000].filter(q => q <= amount).map(q => (
// //                 <button
// //                   key={q}
// //                   onClick={() => setAmt(q)}
// //                   className="flex-1 rounded-full border border-stone-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-300 hover:bg-brand-50"
// //                 >
// //                   ₹{q}
// //                 </button>
// //               ))}
// //               <button
// //                 onClick={() => setAmt(amount)}
// //                 className="flex-1 rounded-full border border-brand-300 bg-brand-50 px-2 py-1.5 text-xs font-bold text-brand-700"
// //               >
// //                 Full
// //               </button>
// //             </div>
// //           </div>

// //           <div>
// //             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //               Payment mode
// //             </label>
// //             <div className="grid grid-cols-3 gap-2">
// //               {[
// //                 { v: 'cash', l: 'Cash', e: '💵' },
// //                 { v: 'upi', l: 'UPI', e: '📱' },
// //                 { v: 'card', l: 'Card', e: '💳' }
// //               ].map((m) => (
// //                 <button
// //                   key={m.v}
// //                   onClick={() => setMode(m.v)}
// //                   className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold transition ${
// //                     mode === m.v
// //                       ? 'border-lime-500 bg-lime-50 text-lime-800 ring-2 ring-lime-500/20'
// //                       : 'border-stone-200 bg-white text-slate-600'
// //                   }`}
// //                 >
// //                   <span className="text-lg">{m.e}</span>
// //                   {m.l}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="rounded-2xl bg-stone-50 p-3">
// //             <div className="flex justify-between text-sm">
// //               <span className="text-slate-600">Payment</span>
// //               <span className="font-bold text-slate-900">− {inr(amt)}</span>
// //             </div>
// //             <div className="mt-1 flex justify-between border-t border-dashed border-stone-300 pt-1">
// //               <span className="text-slate-600">Baki rahega</span>
// //               <span className={`font-display text-base font-extrabold ${amount - amt > 0 ? 'text-red-600' : 'text-lime-600'}`}>
// //                 {inr(Math.max(0, amount - amt))}
// //               </span>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="flex gap-2 border-t border-stone-200 p-4">
// //           <button onClick={onClose} className="btn-ghost btn-md flex-1">Cancel</button>
// //           <button
// //             onClick={submit}
// //             disabled={saving || amt <= 0 || amt > amount}
// //             className="btn btn-md flex-[2] bg-lime-600 text-white hover:bg-lime-700 disabled:opacity-50"
// //           >
// //             {saving ? 'Save…' : `Receive ${inr(amt)}`}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useMemo, useState } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   Plus, Receipt, Search, X, Calendar, Download, ChevronRight,
//   Phone, MessageCircle, CheckCircle2, AlertCircle, Clock,
//   IndianRupee, Wallet, TrendingDown, Trash2, Printer
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { inr, timeAgo } from '@/lib/format';
// import { ROUTES } from '@/lib/constants';

// type Bill = {
//   id: string;
//   number: string;
//   customerId?: string;
//   customerName: string;
//   customerMobile?: string;
//   itemCount: number;
//   total: number;
//   paidAmount: number;
//   dueAmount: number;
//   paymentMode: string;
//   paymentStatus: 'paid' | 'partial' | 'pending';
//   createdAt: string;
// };

// type BillDetail = Bill & {
//   items: any[];
//   subtotal: number;
//   itemDiscounts: number;
//   billDiscount: number;
//   discountType: string;
//   discountValue: number;
//   gstEnabled: boolean;
//   gstRate: number;
//   gstAmount: number;
//   roundOff: number;
//   notes?: string;
// };

// type RangeKey = 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all';

// const RANGES: { k: RangeKey; l: string }[] = [
//   { k: 'today', l: 'Aaj' },
//   { k: 'yesterday', l: 'Kal' },
//   { k: '7d', l: '7 Din' },
//   { k: '30d', l: '30 Din' },
//   { k: 'month', l: 'Is Mahine' },
//   { k: 'all', l: 'Sab' }
// ];

// const MODE_EMOJI: any = {
//   cash: '💵', upi: '📱', card: '💳', udhaar: '📝', split: '🔀'
// };

// const STATUS_CONFIG: any = {
//   paid:    { label: 'Paid',  bg: 'bg-lime-100',  text: 'text-lime-800',  icon: CheckCircle2 },
//   partial: { label: 'Aadha', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
//   pending: { label: 'Baki',  bg: 'bg-red-100',   text: 'text-red-700',   icon: AlertCircle }
// };

// function rangeToDates(range: RangeKey): { from?: string; to?: string } {
//   const now = new Date();
//   const startOf = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
//   const endOf = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };

//   if (range === 'today') return { from: startOf(now).toISOString(), to: endOf(now).toISOString() };
//   if (range === 'yesterday') {
//     const y = new Date(now); y.setDate(y.getDate() - 1);
//     return { from: startOf(y).toISOString(), to: endOf(y).toISOString() };
//   }
//   if (range === '7d') {
//     const f = new Date(now); f.setDate(f.getDate() - 6);
//     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
//   }
//   if (range === '30d') {
//     const f = new Date(now); f.setDate(f.getDate() - 29);
//     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
//   }
//   if (range === 'month') {
//     const f = new Date(now.getFullYear(), now.getMonth(), 1);
//     return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
//   }
//   return {};
// }

// export default function BillsPage() {
//   const token = localStorage.getItem('bb_token');

//   const [bills, setBills] = useState<Bill[]>([]);
//   const [summary, setSummary] = useState({ total_bills: 0, total_amount: 0, total_paid: 0, total_due: 0 });
//   const [loading, setLoading] = useState(true);

//   const [range, setRange] = useState<RangeKey>('7d');
//   const [q, setQ] = useState('');
//   const [status, setStatus] = useState('all');
//   const [mode, setMode] = useState('all');
//   const [sort, setSort] = useState('recent');
//   const [advanced, setAdvanced] = useState(false);

//   const [detailId, setDetailId] = useState<string | null>(null);
//   const [deleting, setDeleting] = useState<Bill | null>(null);

//   const load = async () => {
//     try {
//       setLoading(true);
//       const params = new URLSearchParams();
//       const dates = rangeToDates(range);
//       if (dates.from) params.set('from', dates.from);
//       if (dates.to) params.set('to', dates.to);
//       if (q) params.set('q', q);
//       if (status !== 'all') params.set('status', status);
//       if (mode !== 'all') params.set('mode', mode);
//       params.set('sort', sort);

//       const r = await fetch('/api/bills?' + params.toString(), {
//         headers: { Authorization: 'Bearer ' + token }
//       });
//       if (r.ok) {
//         const d = await r.json();
//         setBills(d.bills || []);
//         setSummary(d.summary || { total_bills: 0, total_amount: 0, total_paid: 0, total_due: 0 });
//       }
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, [range, q, status, mode, sort]);

//   const grouped = useMemo(() => {
//     const map = new Map<string, Bill[]>();
//     bills.forEach((b) => {
//       const key = b.createdAt.slice(0, 10);
//       if (!map.has(key)) map.set(key, []);
//       map.get(key)!.push(b);
//     });
//     return Array.from(map.entries());
//   }, [bills]);

//   const handleExport = () => {
//     if (bills.length === 0) return toast.error('Kuch bills nahi');
//     const rows = [
//       ['Bill No', 'Date', 'Customer', 'Mobile', 'Items', 'Total', 'Paid', 'Baki', 'Mode', 'Status'],
//       ...bills.map((b) => [
//         b.number,
//         new Date(b.createdAt).toLocaleDateString('en-IN'),
//         b.customerName,
//         b.customerMobile || '',
//         b.itemCount,
//         b.total,
//         b.paidAmount,
//         b.dueAmount,
//         b.paymentMode,
//         b.paymentStatus
//       ])
//     ];
//     const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `bills-${new Date().toISOString().slice(0, 10)}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     toast.success('Bills export ho gayi');
//   };

//   const handleDelete = async () => {
//     if (!deleting) return;
//     const r = await fetch(`/api/bills/${deleting.id}`, {
//       method: 'DELETE',
//       headers: { Authorization: 'Bearer ' + token }
//     });
//     if (r.ok) {
//       toast.success('Bill delete ho gayi');
//       setDeleting(null);
//       await load();
//     }
//   };

//   return (
//     <div className="space-y-4 pb-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-extrabold text-slate-900">
//             Purane Bills
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Sabhi bills ek jagah
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {bills.length > 0 && (
//             <button onClick={handleExport} className="btn-outline btn-md">
//               <Download className="h-4 w-4" />
//               CSV
//             </button>
//           )}
//           <Link to={ROUTES.newBill} className="btn-primary btn-md">
//             <Plus className="h-4 w-4" />
//             Naya
//           </Link>
//         </div>
//       </div>

//       {/* Summary cards */}
//       {!loading && bills.length > 0 && (
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           <Mini icon={<Receipt className="h-5 w-5" />} label="Total Bills" value={String(summary.total_bills)} tone="brand" />
//           <Mini icon={<IndianRupee className="h-5 w-5" />} label="Total Amount" value={inr(summary.total_amount)} tone="accent" />
//           <Mini icon={<Wallet className="h-5 w-5" />} label="Mila" value={inr(summary.total_paid)} tone="success" />
//           <Mini icon={<TrendingDown className="h-5 w-5" />} label="Baki" value={inr(summary.total_due)} tone="danger" />
//         </div>
//       )}

//       {/* Filters */}
//       <div className="space-y-3">
//         <div className="flex gap-2">
//           <div className="relative flex-1">
//             <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//             <input
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder="Bill no, grahak, mobile…"
//               className="input pl-11 pr-10"
//             />
//             {q && (
//               <button
//                 onClick={() => setQ('')}
//                 className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-stone-100"
//               >
//                 <X className="h-3.5 w-3.5" />
//               </button>
//             )}
//           </div>
//           <button
//             onClick={() => setAdvanced(!advanced)}
//             className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition ${
//               advanced
//                 ? 'border-brand-500 bg-brand-50 text-brand-700'
//                 : 'border-stone-200 bg-white text-slate-600'
//             }`}
//             title="Filters"
//           >
//             <Calendar className="h-4 w-4" />
//           </button>
//         </div>

//         <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
//           {RANGES.map((r) => (
//             <button
//               key={r.k}
//               onClick={() => setRange(r.k)}
//               className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
//                 range === r.k
//                   ? 'border-brand-500 bg-brand-50 text-brand-700'
//                   : 'border-stone-200 bg-white text-slate-600'
//               }`}
//             >
//               {r.l}
//             </button>
//           ))}
//         </div>

//         {advanced && (
//           <div className="card space-y-4 p-4">
//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                 Payment Status
//               </p>
//               <div className="grid grid-cols-4 gap-2">
//                 {[
//                   { k: 'all', l: 'Sab', e: '📋' },
//                   { k: 'paid', l: 'Paid', e: '✅' },
//                   { k: 'partial', l: 'Aadha', e: '⚡' },
//                   { k: 'pending', l: 'Baki', e: '⚠️' }
//                 ].map((s) => (
//                   <button
//                     key={s.k}
//                     onClick={() => setStatus(s.k)}
//                     className={`flex flex-col items-center gap-0.5 rounded-2xl border px-2 py-2 text-[10px] font-bold transition ${
//                       status === s.k
//                         ? 'border-brand-500 bg-brand-50 text-brand-700'
//                         : 'border-stone-200 bg-white text-slate-600'
//                     }`}
//                   >
//                     <span className="text-sm">{s.e}</span>
//                     {s.l}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                 Payment Mode
//               </p>
//               <div className="grid grid-cols-5 gap-2">
//                 {[
//                   { k: 'all', l: 'Sab', e: '📋' },
//                   { k: 'cash', l: 'Cash', e: '💵' },
//                   { k: 'upi', l: 'UPI', e: '📱' },
//                   { k: 'card', l: 'Card', e: '💳' },
//                   { k: 'udhaar', l: 'Udhaar', e: '📝' }
//                 ].map((m) => (
//                   <button
//                     key={m.k}
//                     onClick={() => setMode(m.k)}
//                     className={`flex flex-col items-center gap-0.5 rounded-2xl border px-1 py-2 text-[10px] font-bold transition ${
//                       mode === m.k
//                         ? 'border-brand-500 bg-brand-50 text-brand-700'
//                         : 'border-stone-200 bg-white text-slate-600'
//                     }`}
//                   >
//                     <span className="text-sm">{m.e}</span>
//                     {m.l}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                 Sort
//               </p>
//               <div className="grid grid-cols-2 gap-2">
//                 {[
//                   { k: 'recent', l: 'Naye pehle' },
//                   { k: 'amount_desc', l: 'Zyada amount' },
//                   { k: 'amount_asc', l: 'Kam amount' },
//                   { k: 'customer', l: 'Naam A–Z' }
//                 ].map((s) => (
//                   <button
//                     key={s.k}
//                     onClick={() => setSort(s.k)}
//                     className={`rounded-2xl border px-3 py-2 text-xs font-bold transition ${
//                       sort === s.k
//                         ? 'border-brand-500 bg-brand-50 text-brand-700'
//                         : 'border-stone-200 bg-white text-slate-600'
//                     }`}
//                   >
//                     {s.l}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <button
//               onClick={() => {
//                 setQ('');
//                 setStatus('all');
//                 setMode('all');
//                 setSort('recent');
//               }}
//               className="btn-ghost btn-sm w-full"
//             >
//               <X className="h-3.5 w-3.5" />
//               Filters reset karein
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Content */}
//       {loading ? (
//         <div className="card divide-y divide-stone-100 overflow-hidden">
//           {[1, 2, 3, 4, 5].map((i) => (
//             <div key={i} className="flex items-center gap-3 p-4">
//               <div className="h-11 w-11 animate-pulse rounded-full bg-stone-100" />
//               <div className="flex-1 space-y-2">
//                 <div className="h-3 w-40 animate-pulse rounded-full bg-stone-200" />
//                 <div className="h-2.5 w-24 animate-pulse rounded-full bg-stone-100" />
//               </div>
//               <div className="h-4 w-20 animate-pulse rounded-full bg-stone-200" />
//             </div>
//           ))}
//         </div>
//       ) : bills.length === 0 ? (
//         <div className="card p-10 text-center">
//           <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
//             <Receipt className="h-7 w-7" />
//           </div>
//           <h3 className="mt-4 font-display text-lg font-bold">
//             {q || status !== 'all' || mode !== 'all'
//               ? 'Kuch nahi mila'
//               : 'Is period mein koi bill nahi'}
//           </h3>
//           <p className="mt-1 text-sm text-slate-500">
//             {q || status !== 'all' || mode !== 'all'
//               ? 'Filters badal kar dekhein'
//               : 'Pehla bill banayein — 30 second mein ready'}
//           </p>
//           {q || status !== 'all' || mode !== 'all' ? (
//             <button
//               onClick={() => { setQ(''); setStatus('all'); setMode('all'); }}
//               className="btn-primary btn-md mt-5"
//             >
//               <X className="h-4 w-4" /> Filters hatao
//             </button>
//           ) : (
//             <Link to={ROUTES.newBill} className="btn-primary btn-md mt-5 inline-flex">
//               <Plus className="h-4 w-4" /> Naya Bill Banayein
//             </Link>
//           )}
//         </div>
//       ) : (
//         <div className="card overflow-hidden">
//           {grouped.map(([day, dayBills]) => {
//             const dayTotal = dayBills.reduce((s, b) => s + b.total, 0);
//             return (
//               <div key={day}>
//                 <div className="flex items-center justify-between gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2">
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-bold text-slate-700">
//                       {dayLabel(dayBills[0].createdAt)}
//                     </span>
//                     <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
//                       {dayBills.length} {dayBills.length === 1 ? 'bill' : 'bills'}
//                     </span>
//                   </div>
//                   <span className="text-xs font-extrabold text-slate-900 tabular-nums">
//                     {inr(dayTotal)}
//                   </span>
//                 </div>

//                 <ul className="divide-y divide-stone-100">
//                   {dayBills.map((b) => (
//                     <BillRow
//                       key={b.id}
//                       bill={b}
//                       onOpen={() => setDetailId(b.id)}
//                       onDelete={() => setDeleting(b)}
//                     />
//                   ))}
//                 </ul>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {!loading && bills.length > 0 && (
//         <p className="text-center text-xs text-slate-400">
//           {bills.length} bill {status !== 'all' && `(${status})`}
//         </p>
//       )}

//       {/* Detail Modal */}
//       {detailId && (
//         <BillDetailModal
//           id={detailId}
//           onClose={() => setDetailId(null)}
//           onRefresh={load}
//           onDelete={(b: any) => { setDetailId(null); setDeleting(b); }}
//         />
//       )}

//       {/* Delete Confirm */}
//       {deleting && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleting(null)} />
//           <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
//             <h3 className="font-display text-lg font-bold text-slate-900">
//               Bill delete karein?
//             </h3>
//             <p className="mt-2 text-sm text-slate-600">
//               Bill <strong>{deleting.number}</strong> ko delete kar dein?
//               Stock wapas jud jayega aur udhaar reverse ho jayega.
//             </p>
//             <div className="mt-5 flex gap-2">
//               <button onClick={() => setDeleting(null)} className="btn-ghost btn-md flex-1">
//                 Cancel
//               </button>
//               <button onClick={handleDelete} className="btn-danger btn-md flex-1">
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function dayLabel(dateStr: string): string {
//   const d = new Date(dateStr);
//   const today = new Date(); today.setHours(0, 0, 0, 0);
//   const yest = new Date(today); yest.setDate(yest.getDate() - 1);
//   const tgt = new Date(d); tgt.setHours(0, 0, 0, 0);

//   if (tgt.getTime() === today.getTime()) return 'Aaj';
//   if (tgt.getTime() === yest.getTime()) return 'Kal';
//   return d.toLocaleDateString('en-IN', {
//     weekday: 'long', day: 'numeric', month: 'short',
//     year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
//   });
// }

// function Mini({ icon, label, value, tone }: any) {
//   const tones: any = {
//     brand: 'bg-brand-50 text-brand-600 ring-brand-100',
//     accent: 'bg-accent-50 text-accent-600 ring-accent-100',
//     success: 'bg-lime-50 text-lime-600 ring-lime-100',
//     danger: 'bg-red-50 text-red-500 ring-red-100'
//   };
//   return (
//     <div className="card p-4">
//       <div className="flex items-center gap-3">
//         <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 ${tones[tone]}`}>
//           {icon}
//         </div>
//         <div className="min-w-0">
//           <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//             {label}
//           </p>
//           <p className="font-display text-lg font-extrabold text-slate-900 truncate">
//             {value}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function BillRow({ bill, onOpen, onDelete }: any) {
//   const cfg = STATUS_CONFIG[bill.paymentStatus];
//   const Icon = cfg.icon;

//   return (
//     <li>
//       <button
//         onClick={onOpen}
//         className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-stone-50 active:bg-stone-100"
//       >
//         <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white shadow-sm ${
//           bill.paymentStatus === 'paid'
//             ? 'bg-gradient-to-br from-brand-500 to-accent-500'
//             : bill.paymentStatus === 'partial'
//             ? 'bg-gradient-to-br from-amber-400 to-amber-600'
//             : 'bg-gradient-to-br from-red-400 to-red-600'
//         }`}>
//           {(bill.customerName || 'W').charAt(0).toUpperCase()}
//         </span>

//         <div className="min-w-0 flex-1">
//           <div className="flex items-center gap-2">
//             <p className="truncate text-sm font-bold text-slate-900">
//               {bill.customerName || 'Walk-in'}
//             </p>
//             <span className="shrink-0 font-mono text-[11px] text-slate-400">
//               {bill.number}
//             </span>
//           </div>

//           <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
//             <span>{MODE_EMOJI[bill.paymentMode] || '💵'}</span>
//             <span className="capitalize">{bill.paymentMode}</span>
//             <span>•</span>
//             <span>{bill.itemCount} item</span>
//             <span>•</span>
//             <span>{timeAgo(bill.createdAt)}</span>
//           </div>
//         </div>

//         <div className="shrink-0 text-right">
//           <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
//             {inr(bill.total)}
//           </p>
//           <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
//             <Icon className="h-3 w-3" />
//             {cfg.label}
//           </span>
//           {bill.dueAmount > 0 && (
//             <p className="mt-0.5 text-[10px] font-bold text-red-500">
//               Baki {inr(bill.dueAmount)}
//             </p>
//           )}
//         </div>

//         <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
//       </button>
//     </li>
//   );
// }

// /* ===================== BILL DETAIL MODAL ===================== */
// function BillDetailModal({ id, onClose, onRefresh, onDelete }: any) {
//   const token = localStorage.getItem('bb_token');
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [payOpen, setPayOpen] = useState(false);

//   const load = async () => {
//     try {
//       const r = await fetch(`/api/bills/${id}`, {
//         headers: { Authorization: 'Bearer ' + token }
//       });
//       if (r.ok) setData(await r.json());
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, [id]);

//   const receivePayment = async (amount: number, mode: string) => {
//     const r = await fetch(`/api/bills/${id}/payment`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//       body: JSON.stringify({ amount, mode })
//     });
//     if (r.ok) {
//       toast.success(`${inr(amount)} received!`);
//       setPayOpen(false);
//       await load();
//       onRefresh();
//     } else {
//       toast.error((await r.json()).error);
//     }
//   };

//   const bill = data?.bill;
//   const shop = data?.shop || {};
//   const settings = data?.settings || {};

//   const upiUrl = settings.showQR && settings.upiId && bill?.dueAmount > 0
//     ? `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(shop.name || '')}&am=${bill.dueAmount}&cu=INR&tn=${encodeURIComponent('Bill ' + bill.number)}`
//     : null;

//   const handlePrint = () => {
//     const printWindow = window.open('', '_blank', 'width=900,height=700');
//     if (!printWindow) {
//       toast.error('Popup blocked — kripya popups allow karein');
//       return;
//     }

//     const billHTML = `
// <!DOCTYPE html>
// <html lang="hi">
// <head>
//   <meta charset="UTF-8">
//   <title>Bill ${bill.number}</title>
//   <style>
//     * { margin: 0; padding: 0; box-sizing: border-box; }
//     body {
//       font-family: 'Inter', -apple-system, system-ui, sans-serif;
//       font-size: 12px;
//       line-height: 1.4;
//       color: #000;
//       background: #fff;
//       padding: 10mm;
//       max-width: 210mm;
//       margin: 0 auto;
//     }
//     .page {
//       border: 2px solid #000;
//       padding: 12mm 10mm;
//       min-height: calc(100vh - 20mm);
//       position: relative;
//     }
//     .header {
//       border-bottom: 2px solid #000;
//       padding-bottom: 10px;
//       margin-bottom: 12px;
//     }
//           .shop-header {
//       display: flex;
//       align-items: center;
//       gap: 14px;
//     }
//     .shop-logo {
//       width: 60px;
//       height: 60px;
//       border-radius: 8px;
//       object-fit: cover;
//       border: 1px solid #ddd;
//       flex-shrink: 0;
//     }
//     .shop-info {
//       flex: 1;
//       min-width: 0;
//     }
//     .shop-name {
//       font-size: 20px;
//       font-weight: 800;
//       margin-bottom: 4px;
//     }
//     .shop-detail {
//       font-size: 11px;
//       color: #333;
//       margin: 1px 0;
//     }
//     .bill-meta {
//       display: flex;
//       justify-content: space-between;
//       align-items: flex-start;
//       margin-bottom: 12px;
//       padding-bottom: 10px;
//       border-bottom: 1px dashed #000;
//     }
//     .bill-number {
//       font-size: 16px;
//       font-weight: 700;
//     }
//     .bill-date {
//       font-size: 10px;
//       color: #666;
//     }
//     .status-badge {
//       display: inline-block;
//       padding: 3px 8px;
//       font-size: 10px;
//       font-weight: 700;
//       border: 1px solid #000;
//       border-radius: 12px;
//       margin-top: 4px;
//     }
//     .customer {
//       margin-bottom: 12px;
//     }
//     .customer-label {
//       font-size: 9px;
//       font-weight: 700;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       color: #666;
//       margin-bottom: 2px;
//     }
//     .customer-name {
//       font-weight: 700;
//       font-size: 13px;
//     }
//     table {
//       width: 100%;
//       border-collapse: collapse;
//       margin-bottom: 12px;
//     }
//     th {
//       text-align: left;
//       font-size: 9px;
//       font-weight: 700;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       padding: 6px 0;
//       border-bottom: 1px solid #000;
//     }
//     th.right, td.right { text-align: right; }
//     td {
//       padding: 7px 0;
//       font-size: 12px;
//       border-bottom: 1px solid #e5e5e5;
//     }
//     .item-name { font-weight: 600; }
//     .item-sub { font-size: 10px; color: #666; }
//     .totals {
//       margin-left: auto;
//       width: 100%;
//       max-width: 280px;
//     }
//     .total-row {
//       display: flex;
//       justify-content: space-between;
//       padding: 4px 0;
//       font-size: 12px;
//     }
//     .total-divider {
//       border-top: 2px solid #000;
//       margin-top: 6px;
//       padding-top: 6px;
//       font-size: 16px;
//       font-weight: 800;
//     }
//     .due-box {
//       margin-top: 8px;
//       padding: 6px;
//       border: 1px dashed #000;
//       font-size: 11px;
//     }
//     .footer {
//       margin-top: 24px;
//       padding-top: 12px;
//       border-top: 1px dashed #000;
//       text-align: center;
//       font-size: 11px;
//     }
//     .footer-sub {
//       font-size: 9px;
//       color: #666;
//       margin-top: 4px;
//     }
//     .notes {
//       margin-top: 12px;
//       padding: 8px;
//       background: #f5f5f5;
//       font-size: 11px;
//       font-style: italic;
//     }
//           /* Watermark */
//     .watermark {
//       position: fixed;
//       top: 50%;
//       left: 50%;
//       transform: translate(-50%, -50%) rotate(-45deg);
//       font-size: 90px;
//       font-weight: 900;
//       color: #000;
//       opacity: 0.05;
//       letter-spacing: 4px;
//       pointer-events: none;
//       z-index: -1;
//       user-select: none;
//       white-space: nowrap;
//     }
//           .qr-section {
//       margin-top: 16px;
//       padding: 12px;
//       border: 1px dashed #000;
//       background: #f9f9f9;
//       page-break-inside: avoid;
//     }
//     .qr-title {
//       font-size: 10px;
//       font-weight: 700;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       margin-bottom: 8px;
//     }
//     .qr-content {
//       display: flex;
//       align-items: center;
//       gap: 16px;
//     }
//     .qr-img {
//       width: 120px;
//       height: 120px;
//       border: 1px solid #ddd;
//       background: #fff;
//       padding: 4px;
//     }
//     .qr-info {
//       flex: 1;
//     }
//     .qr-amount {
//       font-size: 14px;
//       font-weight: 700;
//       margin-bottom: 6px;
//     }
//     .qr-upi-label {
//       font-size: 9px;
//       color: #666;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//     }
//     .qr-upi-id {
//       font-family: 'Courier New', monospace;
//       font-size: 12px;
//       font-weight: 700;
//       margin-top: 2px;
//     }
//     .qr-hint {
//       font-size: 9px;
//       color: #666;
//       margin-top: 6px;
//     }
//     .terms {
//       margin-top: 12px;
//       font-size: 10px;
//       color: #444;
//     }
//     .terms-title {
//       font-size: 9px;
//       font-weight: 700;
//       text-transform: uppercase;
//       letter-spacing: 0.5px;
//       margin-bottom: 4px;
//     }
//     @media print {
//       @page { size: A4 portrait; margin: 10mm; }
//       body { padding: 0; }
//     }
//   </style>
// </head>
// <body>
//   <div class="page">
//     <!-- HEADER -->
//     <div class="header">
//   <div class="shop-header">
//     ${settings.showLogo !== false && shop.logoUrl ? `
//       <img src="${shop.logoUrl}" alt="Logo" class="shop-logo" onerror="this.style.display='none'" />
//     ` : ''}
//     <div class="shop-info">
//       <div class="shop-name">${shop.name || 'BazaarBook'}</div>
//       ${shop.owner ? `<div class="shop-detail">${shop.owner}</div>` : ''}
//       ${shop.mobile ? `<div class="shop-detail">📞 ${shop.mobile}</div>` : ''}
//       ${(shop.address || shop.city) ? `<div class="shop-detail">📍 ${shop.address || ''}${shop.address && shop.city ? ', ' : ''}${shop.city || ''}${shop.state ? ', ' + shop.state : ''}${shop.pincode ? ' - ' + shop.pincode : ''}</div>` : ''}
//       ${shop.gstin ? `<div class="shop-detail"><strong>GSTIN:</strong> ${shop.gstin}</div>` : ''}
//     </div>
//   </div>
// </div>

//     <!-- BILL META -->
//     <div class="bill-meta">
//       <div>
//         <div class="bill-number">Bill: ${bill.number}</div>
//         <div class="bill-date">${new Date(bill.createdAt).toLocaleString('en-IN', {
//           day: 'numeric', month: 'short', year: 'numeric',
//           hour: '2-digit', minute: '2-digit'
//         })}</div>
//       </div>
//       <div style="text-align: right;">
//         <div class="status-badge">
//           ${bill.paymentStatus === 'paid' ? '✓ PAID' : bill.paymentStatus === 'partial' ? 'PARTIAL' : 'PENDING'}
//         </div>
//         <div class="bill-date" style="margin-top: 4px;">
//           ${bill.paymentMode?.toUpperCase() || 'CASH'}
//         </div>
//       </div>
//     </div>

//     <!-- CUSTOMER -->
//     <div class="customer">
//       <div class="customer-label">Grahak</div>
//       <div class="customer-name">${bill.customerName || 'Walk-in Customer'}</div>
//       ${bill.customerMobile ? `<div class="shop-detail">📱 ${bill.customerMobile}</div>` : ''}
//     </div>

//     <!-- ITEMS -->
//     <table>
//       <thead>
//         <tr>
//           <th>Item</th>
//           <th class="right">Qty</th>
//           <th class="right">Rate</th>
//           <th class="right">Total</th>
//         </tr>
//       </thead>
//       <tbody>
//         ${bill.items.map((it: any) => `
//           <tr>
//             <td>
//               <div class="item-name">${it.name}</div>
//               ${it.discount > 0 ? `<div class="item-sub">Discount: −₹${it.discount}</div>` : ''}
//             </td>
//             <td class="right">${it.quantity} ${it.unit || ''}</td>
//             <td class="right">₹${it.price}</td>
//             <td class="right"><strong>₹${it.lineTotal || (it.price * it.quantity - (it.discount || 0))}</strong></td>
//           </tr>
//         `).join('')}
//       </tbody>
//     </table>

//     <!-- TOTALS -->
//     <div class="totals">
//       <div class="total-row">
//         <span>Subtotal</span>
//         <span>₹${bill.subtotal}</span>
//       </div>
//       ${bill.itemDiscounts > 0 ? `
//         <div class="total-row">
//           <span>Item Discount</span>
//           <span>− ₹${bill.itemDiscounts}</span>
//         </div>
//       ` : ''}
//       ${bill.billDiscount > 0 ? `
//         <div class="total-row">
//           <span>Bill Discount</span>
//           <span>− ₹${bill.billDiscount}</span>
//         </div>
//       ` : ''}
//       ${bill.gstAmount > 0 ? `
//         <div class="total-row">
//           <span>GST @ ${bill.gstRate}%</span>
//           <span>+ ₹${bill.gstAmount}</span>
//         </div>
//       ` : ''}
//       ${Math.abs(bill.roundOff || 0) > 0.01 ? `
//         <div class="total-row">
//           <span>Round Off</span>
//           <span>${bill.roundOff > 0 ? '+' : ''}₹${bill.roundOff}</span>
//         </div>
//       ` : ''}
//       <div class="total-row total-divider">
//         <span>TOTAL</span>
//         <span>₹${bill.total}</span>
//       </div>
//       ${bill.paymentStatus !== 'paid' ? `
//         <div class="due-box">
//           <div style="display:flex; justify-content:space-between;">
//             <span>Paid</span><span>₹${bill.paidAmount}</span>
//           </div>
//           <div style="display:flex; justify-content:space-between; font-weight:700; margin-top:4px;">
//             <span>Baki</span><span>₹${bill.dueAmount}</span>
//           </div>
//         </div>
//       ` : ''}
//     </div>

//     ${bill.notes ? `<div class="notes">"${bill.notes}"</div>` : ''}

//     ${settings.terms ? `
//       <div class="terms">
//         <div class="terms-title">Terms & Conditions</div>
//         <div>${settings.terms}</div>
//       </div>
//     ` : ''}
//     <!-- UPI QR -->
//     ${upiUrl ? `
//       <div class="qr-section">
//         <div class="qr-title">💳 UPI se Pay Karein</div>
//         <div class="qr-content">
//           <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}&margin=10&color=000000&bgcolor=ffffff" alt="UPI QR" class="qr-img" />
//           <div class="qr-info">
//             <div class="qr-amount">Amount: ₹${bill.dueAmount}</div>
//             <div class="qr-upi-label">UPI ID:</div>
//             <div class="qr-upi-id">${settings.upiId}</div>
//             <div class="qr-hint">Scan karein — GPay, PhonePe, Paytm</div>
//           </div>
//         </div>
//       </div>
//     ` : ''}
//         <!-- WATERMARK -->
//     <div class="watermark">BazaarBook</div>
//     <!-- FOOTER -->
//     <div class="footer">
//       <div>${settings.footerNote || 'Dhanyavaad! Phir aane ke liye shukriya 🙏'}</div>
//       <div class="footer-sub">— BazaarBook se banaya gaya —</div>
//     </div>
//   </div>
// </body>
// </html>
//     `;

//     printWindow.document.write(billHTML);
//     printWindow.document.close();

//     printWindow.onload = () => {
//       printWindow.focus();
//       setTimeout(() => {
//         printWindow.print();
//       }, 200);
//     };

//     setTimeout(() => {
//       if (!printWindow.closed) {
//         printWindow.focus();
//         printWindow.print();
//       }
//     }, 600);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
//       <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

//       <div className="bill-print-area relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
//         {loading || !bill ? (
//           <div className="p-10 text-center">
//             <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
//             <p className="mt-4 text-sm text-slate-500">Load ho raha…</p>
//           </div>
//         ) : (
//           <>
//             {/* Header */}
//             <div className="bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex items-start gap-3 min-w-0">
//                   {settings.showLogo !== false && shop.logoUrl ? (
//                     <img
//                       src={shop.logoUrl}
//                       alt="Logo"
//                       className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-2 ring-white/30"
//                       onError={(e: any) => { e.target.style.display = 'none'; }}
//                     />
//                   ) : (
//                     <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-xl font-extrabold backdrop-blur ring-2 ring-white/30">
//                       {(shop.name || 'B').charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                   <div className="min-w-0">
//                     <p className="truncate font-display text-lg font-extrabold">
//                       {shop.name || 'BazaarBook'}
//                     </p>
//                     {shop.owner && <p className="truncate text-xs text-white/80">{shop.owner}</p>}
//                     {shop.mobile && <p className="truncate text-[11px] text-white/70">📞 {shop.mobile}</p>}
//                     {(shop.city || shop.address) && (
//                       <p className="truncate text-[11px] text-white/70">
//                         📍 {shop.address ? `${shop.address}, ` : ''}{shop.city}
//                         {shop.state ? `, ${shop.state}` : ''}
//                       </p>
//                     )}
//                     {shop.gstin && (
//                       <p className="truncate font-mono text-[10px] text-white/60">
//                         GSTIN: {shop.gstin}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="shrink-0 text-right">
//                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
//                     Bill
//                   </p>
//                   <p className="font-display text-lg font-extrabold">{bill.number}</p>
//                   <p className="mt-0.5 text-[10px] text-white/70">
//                     {new Date(bill.createdAt).toLocaleString('en-IN', {
//                       day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
//                     })}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-3 flex items-center gap-2 flex-wrap">
//                 <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
//                   bill.paymentStatus === 'paid' ? 'bg-lime-400/90 text-lime-950'
//                   : bill.paymentStatus === 'partial' ? 'bg-amber-400/90 text-amber-950'
//                   : 'bg-red-400/90 text-red-950'
//                 }`}>
//                   {bill.paymentStatus === 'paid' ? 'PAID' : bill.paymentStatus === 'partial' ? 'PARTIAL' : 'PENDING'}
//                 </span>
//                 <span className="text-xs text-white/90">
//                   {MODE_EMOJI[bill.paymentMode]} {bill.paymentMode?.toUpperCase()}
//                 </span>
//               </div>
//             </div>

//             {/* Body */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="border-b border-stone-100 p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                   Grahak
//                 </p>
//                 <p className="mt-0.5 text-sm font-bold text-slate-900">
//                   {bill.customerName || 'Walk-in Customer'}
//                 </p>
//                 {bill.customerMobile && (
//                   <p className="font-mono text-xs text-slate-500">{bill.customerMobile}</p>
//                 )}
//               </div>

//               <div className="border-b border-stone-100 bg-stone-50/50 px-4 py-2">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                   Saman ({bill.items.length})
//                 </p>
//               </div>
//               <ul className="divide-y divide-stone-100">
//                 {bill.items.map((it: any, i: number) => (
//                   <li key={i} className="flex items-start gap-3 px-4 py-3">
//                     <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-700">
//                       {i + 1}
//                     </span>
//                     <div className="min-w-0 flex-1">
//                       <p className="text-sm font-semibold text-slate-900">{it.name}</p>
//                       <p className="text-xs text-slate-500">
//                         {inr(it.price)} × {it.quantity} {it.unit}
//                         {it.discount > 0 && (
//                           <span className="ml-2 text-accent-600">− {inr(it.discount)}</span>
//                         )}
//                       </p>
//                     </div>
//                     <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
//                       {inr(it.lineTotal || (it.price * it.quantity - it.discount))}
//                     </p>
//                   </li>
//                 ))}
//               </ul>

//               <div className="space-y-2 border-t border-stone-100 p-4">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-slate-600">Subtotal</span>
//                   <span className="text-sm font-semibold text-slate-900">{inr(bill.subtotal)}</span>
//                 </div>
//                 {bill.itemDiscounts > 0 && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Item Discount</span>
//                     <span className="text-sm font-semibold text-accent-600">− {inr(bill.itemDiscounts)}</span>
//                   </div>
//                 )}
//                 {bill.billDiscount > 0 && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">Bill Discount</span>
//                     <span className="text-sm font-semibold text-accent-600">− {inr(bill.billDiscount)}</span>
//                   </div>
//                 )}
//                 {bill.gstAmount > 0 && (
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-slate-600">GST @ {bill.gstRate}%</span>
//                     <span className="text-sm font-semibold text-slate-900">+ {inr(bill.gstAmount)}</span>
//                   </div>
//                 )}

//                 <div className="mt-3 flex items-center justify-between border-t border-dashed border-stone-200 pt-3">
//                   <span className="font-display text-base font-bold text-slate-700">Total</span>
//                   <span className="font-display text-2xl font-extrabold text-slate-900">{inr(bill.total)}</span>
//                 </div>

//                 {bill.paymentStatus !== 'paid' && (
//                   <div className="mt-2 space-y-1.5 rounded-2xl bg-red-50 p-3 ring-1 ring-red-100">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-red-700">Paid</span>
//                       <span className="font-bold text-red-900">{inr(bill.paidAmount)}</span>
//                     </div>
//                     <div className="flex justify-between border-t border-red-200 pt-1.5">
//                       <span className="font-bold text-red-700">Baki</span>
//                       <span className="font-display text-base font-extrabold text-red-900">
//                         {inr(bill.dueAmount)}
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {upiUrl && (
//                 <div className="border-t border-stone-100 bg-lime-50/50 p-4">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-lime-800">
//                     💳 UPI se pay karein
//                   </p>
//                   <div className="mt-3 flex items-center gap-4">
//                     <img
//                       src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiUrl)}&margin=8`}
//                       alt="UPI QR"
//                       className="h-32 w-32 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-lime-200"
//                     />
//                     <div>
//                       <p className="text-xs font-bold text-slate-700">Amount: {inr(bill.dueAmount)}</p>
//                       <p className="mt-1 text-[10px] text-slate-500">UPI ID:</p>
//                       <p className="font-mono text-xs font-bold text-lime-800">{settings.upiId}</p>
//                       <p className="mt-2 text-[10px] text-lime-700">Scan karein — GPay, PhonePe, Paytm</p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {bill.notes && (
//                 <div className="border-t border-stone-100 p-4">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Note</p>
//                   <p className="mt-1 text-xs italic text-slate-600">"{bill.notes}"</p>
//                 </div>
//               )}

//               {settings.terms && (
//                 <div className="border-t border-stone-100 bg-stone-50 p-4">
//                   <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                     Terms & Conditions
//                   </p>
//                   <p className="mt-1 text-[11px] text-slate-600">{settings.terms}</p>
//                 </div>
//               )}

//               <div className="border-t border-dashed border-stone-200 bg-stone-50/80 p-4 text-center">
//                 <p className="text-xs font-semibold text-slate-700">
//                   {settings.footerNote || 'Dhanyavaad! Phir aane ke liye shukriya 🙏'}
//                 </p>
//                 <p className="mt-1 text-[10px] text-slate-400">
//                   — BazaarBook se banaya gaya —
//                 </p>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="no-print grid grid-cols-2 gap-2 border-t border-stone-200 p-4">
//               {bill.dueAmount > 0 && (
//                 <button
//                   onClick={() => setPayOpen(true)}
//                   className="btn btn-md bg-lime-600 text-white hover:bg-lime-700"
//                 >
//                   <Wallet className="h-4 w-4" />
//                   Receive {inr(bill.dueAmount)}
//                 </button>
//               )}
//               <button
//                 onClick={handlePrint}
//                 className="btn-outline btn-md"
//               >
//                 <Printer className="h-4 w-4" />
//                 Print
//               </button>
//               <button
//                 onClick={() => onDelete(bill)}
//                 className={`btn-outline btn-md text-red-600 ${bill.dueAmount <= 0 ? 'col-span-1' : ''}`}
//               >
//                 <Trash2 className="h-4 w-4" />
//                 Delete
//               </button>
//             </div>
//           </>
//         )}
//       </div>

//       {payOpen && bill && (
//         <PaymentModal
//           amount={bill.dueAmount}
//           onClose={() => setPayOpen(false)}
//           onSubmit={receivePayment}
//         />
//       )}
//     </div>
//   );
// }

// /* ===================== PAYMENT MODAL ===================== */
// function PaymentModal({ amount, onClose, onSubmit }: any) {
//   const [amt, setAmt] = useState(amount);
//   const [mode, setMode] = useState('cash');
//   const [saving, setSaving] = useState(false);

//   const submit = async () => {
//     if (amt <= 0 || amt > amount) return toast.error('Sahi amount daalein');
//     setSaving(true);
//     try {
//       await onSubmit(amt, mode);
//     } finally { setSaving(false); }
//   };

//   return (
//     <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center">
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

//       <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
//         <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-5 text-white">
//           <div className="flex items-center justify-between">
//             <h3 className="font-display text-lg font-extrabold">Payment Receive</h3>
//             <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30">
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//           <p className="mt-2 font-display text-3xl font-extrabold">{inr(amount)}</p>
//           <p className="text-xs text-white/85">Bill ka baki</p>
//         </div>

//         <div className="space-y-4 p-5">
//           <div>
//             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//               Kitna mila?
//             </label>
//             <div className="relative">
//               <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">₹</span>
//               <input
//                 type="number"
//                 value={amt || ''}
//                 onChange={(e) => setAmt(Number(e.target.value) || 0)}
//                 className="input pl-10 text-lg font-extrabold"
//                 placeholder="0"
//                 autoFocus
//               />
//             </div>
//             <div className="mt-2 flex gap-2">
//               {[100, 500, 1000].filter(q => q <= amount).map(q => (
//                 <button
//                   key={q}
//                   onClick={() => setAmt(q)}
//                   className="flex-1 rounded-full border border-stone-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-300 hover:bg-brand-50"
//                 >
//                   ₹{q}
//                 </button>
//               ))}
//               <button
//                 onClick={() => setAmt(amount)}
//                 className="flex-1 rounded-full border border-brand-300 bg-brand-50 px-2 py-1.5 text-xs font-bold text-brand-700"
//               >
//                 Full
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//               Payment mode
//             </label>
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { v: 'cash', l: 'Cash', e: '💵' },
//                 { v: 'upi', l: 'UPI', e: '📱' },
//                 { v: 'card', l: 'Card', e: '💳' }
//               ].map((m) => (
//                 <button
//                   key={m.v}
//                   onClick={() => setMode(m.v)}
//                   className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold transition ${
//                     mode === m.v
//                       ? 'border-lime-500 bg-lime-50 text-lime-800 ring-2 ring-lime-500/20'
//                       : 'border-stone-200 bg-white text-slate-600'
//                   }`}
//                 >
//                   <span className="text-lg">{m.e}</span>
//                   {m.l}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-2xl bg-stone-50 p-3">
//             <div className="flex justify-between text-sm">
//               <span className="text-slate-600">Payment</span>
//               <span className="font-bold text-slate-900">− {inr(amt)}</span>
//             </div>
//             <div className="mt-1 flex justify-between border-t border-dashed border-stone-300 pt-1">
//               <span className="text-slate-600">Baki rahega</span>
//               <span className={`font-display text-base font-extrabold ${amount - amt > 0 ? 'text-red-600' : 'text-lime-600'}`}>
//                 {inr(Math.max(0, amount - amt))}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-2 border-t border-stone-200 p-4">
//           <button onClick={onClose} className="btn-ghost btn-md flex-1">Cancel</button>
//           <button
//             onClick={submit}
//             disabled={saving || amt <= 0 || amt > amount}
//             className="btn btn-md flex-[2] bg-lime-600 text-white hover:bg-lime-700 disabled:opacity-50"
//           >
//             {saving ? 'Save…' : `Receive ${inr(amt)}`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Receipt, Search, X, Calendar, Download, ChevronRight,
  Phone, MessageCircle, CheckCircle2, AlertCircle, Clock,
  IndianRupee, Wallet, TrendingDown, Trash2, Printer
} from 'lucide-react';
import { toast } from 'sonner';
import { inr, timeAgo } from '@/lib/format';
import { ROUTES } from '@/lib/constants';
import { api } from '@/lib/api';

type Bill = {
  id: string;
  number: string;
  customerId?: string;
  customerName: string;
  customerMobile?: string;
  itemCount: number;
  total: number;
  paidAmount: number;
  dueAmount: number;
  paymentMode: string;
  paymentStatus: 'paid' | 'partial' | 'pending';
  createdAt: string;
};

type RangeKey = 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all';

const RANGES: { k: RangeKey; l: string }[] = [
  { k: 'today', l: 'Aaj' },
  { k: 'yesterday', l: 'Kal' },
  { k: '7d', l: '7 Din' },
  { k: '30d', l: '30 Din' },
  { k: 'month', l: 'Is Mahine' },
  { k: 'all', l: 'Sab' }
];

const MODE_EMOJI: any = {
  cash: '💵', upi: '📱', card: '💳', udhaar: '📝', split: '🔀'
};

const STATUS_CONFIG: any = {
  paid:    { label: 'Paid',  bg: 'bg-lime-100',  text: 'text-lime-800',  icon: CheckCircle2 },
  partial: { label: 'Aadha', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
  pending: { label: 'Baki',  bg: 'bg-red-100',   text: 'text-red-700',   icon: AlertCircle }
};

function rangeToDates(range: RangeKey): { from?: string; to?: string } {
  const now = new Date();
  const startOf = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
  const endOf = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };

  if (range === 'today') return { from: startOf(now).toISOString(), to: endOf(now).toISOString() };
  if (range === 'yesterday') {
    const y = new Date(now); y.setDate(y.getDate() - 1);
    return { from: startOf(y).toISOString(), to: endOf(y).toISOString() };
  }
  if (range === '7d') {
    const f = new Date(now); f.setDate(f.getDate() - 6);
    return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
  }
  if (range === '30d') {
    const f = new Date(now); f.setDate(f.getDate() - 29);
    return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
  }
  if (range === 'month') {
    const f = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
  }
  return {};
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [summary, setSummary] = useState({ total_bills: 0, total_amount: 0, total_paid: 0, total_due: 0 });
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>('7d');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');
  const [mode, setMode] = useState('all');
  const [sort, setSort] = useState('recent');
  const [advanced, setAdvanced] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Bill | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      const dates = rangeToDates(range);
      if (dates.from) params.set('from', dates.from);
      if (dates.to) params.set('to', dates.to);
      if (q) params.set('q', q);
      if (status !== 'all') params.set('status', status);
      if (mode !== 'all') params.set('mode', mode);
      params.set('sort', sort);

      const d = await api.get<{ bills: Bill[]; summary: any }>(
        `/api/bills?${params.toString()}`
      );
      setBills(d.bills || []);
      setSummary(d.summary || { total_bills: 0, total_amount: 0, total_paid: 0, total_due: 0 });
    } catch (err: any) {
      toast.error(err.message || 'Bills load nahi hui');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [range, q, status, mode, sort]);

  const grouped = useMemo(() => {
    const map = new Map<string, Bill[]>();
    bills.forEach((b) => {
      const key = b.createdAt.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    });
    return Array.from(map.entries());
  }, [bills]);

  const handleExport = () => {
    if (bills.length === 0) return toast.error('Kuch bills nahi');
    const rows = [
      ['Bill No', 'Date', 'Customer', 'Mobile', 'Items', 'Total', 'Paid', 'Baki', 'Mode', 'Status'],
      ...bills.map((b) => [
        b.number,
        new Date(b.createdAt).toLocaleDateString('en-IN'),
        b.customerName,
        b.customerMobile || '',
        b.itemCount,
        b.total,
        b.paidAmount,
        b.dueAmount,
        b.paymentMode,
        b.paymentStatus
      ])
    ];
    const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bills-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Bills export ho gayi');
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete(`/api/bills/${deleting.id}`);
      toast.success('Bill delete ho gayi');
      setDeleting(null);
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Delete nahi hua');
    }
  };

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Purane Bills
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Sabhi bills ek jagah
          </p>
        </div>
        <div className="flex gap-2">
          {bills.length > 0 && (
            <button onClick={handleExport} className="btn-outline btn-md">
              <Download className="h-4 w-4" />
              CSV
            </button>
          )}
          <Link to={ROUTES.newBill} className="btn-primary btn-md">
            <Plus className="h-4 w-4" />
            Naya
          </Link>
        </div>
      </div>

      {!loading && bills.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Mini icon={<Receipt className="h-5 w-5" />} label="Total Bills" value={String(summary.total_bills)} tone="brand" />
          <Mini icon={<IndianRupee className="h-5 w-5" />} label="Total Amount" value={inr(summary.total_amount)} tone="accent" />
          <Mini icon={<Wallet className="h-5 w-5" />} label="Mila" value={inr(summary.total_paid)} tone="success" />
          <Mini icon={<TrendingDown className="h-5 w-5" />} label="Baki" value={inr(summary.total_due)} tone="danger" />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Bill no, grahak, mobile…"
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
          <button
            onClick={() => setAdvanced(!advanced)}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl border transition ${
              advanced
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-stone-200 bg-white text-slate-600'
            }`}
            title="Filters"
          >
            <Calendar className="h-4 w-4" />
          </button>
        </div>

        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
          {RANGES.map((r) => (
            <button
              key={r.k}
              onClick={() => setRange(r.k)}
              className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
                range === r.k
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-stone-200 bg-white text-slate-600'
              }`}
            >
              {r.l}
            </button>
          ))}
        </div>

        {advanced && (
          <div className="card space-y-4 p-4">
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Payment Status
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { k: 'all', l: 'Sab', e: '📋' },
                  { k: 'paid', l: 'Paid', e: '✅' },
                  { k: 'partial', l: 'Aadha', e: '⚡' },
                  { k: 'pending', l: 'Baki', e: '⚠️' }
                ].map((s) => (
                  <button
                    key={s.k}
                    onClick={() => setStatus(s.k)}
                    className={`flex flex-col items-center gap-0.5 rounded-2xl border px-2 py-2 text-[10px] font-bold transition ${
                      status === s.k
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-stone-200 bg-white text-slate-600'
                    }`}
                  >
                    <span className="text-sm">{s.e}</span>
                    {s.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Payment Mode
              </p>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { k: 'all', l: 'Sab', e: '📋' },
                  { k: 'cash', l: 'Cash', e: '💵' },
                  { k: 'upi', l: 'UPI', e: '📱' },
                  { k: 'card', l: 'Card', e: '💳' },
                  { k: 'udhaar', l: 'Udhaar', e: '📝' }
                ].map((m) => (
                  <button
                    key={m.k}
                    onClick={() => setMode(m.k)}
                    className={`flex flex-col items-center gap-0.5 rounded-2xl border px-1 py-2 text-[10px] font-bold transition ${
                      mode === m.k
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-stone-200 bg-white text-slate-600'
                    }`}
                  >
                    <span className="text-sm">{m.e}</span>
                    {m.l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Sort
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { k: 'recent', l: 'Naye pehle' },
                  { k: 'amount_desc', l: 'Zyada amount' },
                  { k: 'amount_asc', l: 'Kam amount' },
                  { k: 'customer', l: 'Naam A–Z' }
                ].map((s) => (
                  <button
                    key={s.k}
                    onClick={() => setSort(s.k)}
                    className={`rounded-2xl border px-3 py-2 text-xs font-bold transition ${
                      sort === s.k
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : 'border-stone-200 bg-white text-slate-600'
                    }`}
                  >
                    {s.l}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setQ('');
                setStatus('all');
                setMode('all');
                setSort('recent');
              }}
              className="btn-ghost btn-sm w-full"
            >
              <X className="h-3.5 w-3.5" />
              Filters reset karein
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="card divide-y divide-stone-100 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4">
              <div className="h-11 w-11 animate-pulse rounded-full bg-stone-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-40 animate-pulse rounded-full bg-stone-200" />
                <div className="h-2.5 w-24 animate-pulse rounded-full bg-stone-100" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded-full bg-stone-200" />
            </div>
          ))}
        </div>
      ) : bills.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
            <Receipt className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold">
            {q || status !== 'all' || mode !== 'all'
              ? 'Kuch nahi mila'
              : 'Is period mein koi bill nahi'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {q || status !== 'all' || mode !== 'all'
              ? 'Filters badal kar dekhein'
              : 'Pehla bill banayein — 30 second mein ready'}
          </p>
          {q || status !== 'all' || mode !== 'all' ? (
            <button
              onClick={() => { setQ(''); setStatus('all'); setMode('all'); }}
              className="btn-primary btn-md mt-5"
            >
              <X className="h-4 w-4" /> Filters hatao
            </button>
          ) : (
            <Link to={ROUTES.newBill} className="btn-primary btn-md mt-5 inline-flex">
              <Plus className="h-4 w-4" /> Naya Bill Banayein
            </Link>
          )}
        </div>
      ) : (
        <div className="card overflow-hidden">
          {grouped.map(([day, dayBills]) => {
            const dayTotal = dayBills.reduce((s, b) => s + b.total, 0);
            return (
              <div key={day}>
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 bg-stone-50 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      {dayLabel(dayBills[0].createdAt)}
                    </span>
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                      {dayBills.length} {dayBills.length === 1 ? 'bill' : 'bills'}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 tabular-nums">
                    {inr(dayTotal)}
                  </span>
                </div>

                <ul className="divide-y divide-stone-100">
                  {dayBills.map((b) => (
                    <BillRow
                      key={b.id}
                      bill={b}
                      onOpen={() => setDetailId(b.id)}
                      onDelete={() => setDeleting(b)}
                    />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {!loading && bills.length > 0 && (
        <p className="text-center text-xs text-slate-400">
          {bills.length} bill {status !== 'all' && `(${status})`}
        </p>
      )}

      {detailId && (
        <BillDetailModal
          id={detailId}
          onClose={() => setDetailId(null)}
          onRefresh={load}
          onDelete={(b: any) => { setDetailId(null); setDeleting(b); }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleting(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900">
              Bill delete karein?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Bill <strong>{deleting.number}</strong> ko delete kar dein?
              Stock wapas jud jayega aur udhaar reverse ho jayega.
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
    </div>
  );
}

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yest = new Date(today); yest.setDate(yest.getDate() - 1);
  const tgt = new Date(d); tgt.setHours(0, 0, 0, 0);

  if (tgt.getTime() === today.getTime()) return 'Aaj';
  if (tgt.getTime() === yest.getTime()) return 'Kal';
  return d.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'short',
    year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}

function Mini({ icon, label, value, tone }: any) {
  const tones: any = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    accent: 'bg-accent-50 text-accent-600 ring-accent-100',
    success: 'bg-lime-50 text-lime-600 ring-lime-100',
    danger: 'bg-red-50 text-red-500 ring-red-100'
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

function BillRow({ bill, onOpen, onDelete }: any) {
  const cfg = STATUS_CONFIG[bill.paymentStatus];
  const Icon = cfg.icon;

  return (
    <li>
      <button
        onClick={onOpen}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-stone-50 active:bg-stone-100"
      >
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white shadow-sm ${
          bill.paymentStatus === 'paid'
            ? 'bg-gradient-to-br from-brand-500 to-accent-500'
            : bill.paymentStatus === 'partial'
            ? 'bg-gradient-to-br from-amber-400 to-amber-600'
            : 'bg-gradient-to-br from-red-400 to-red-600'
        }`}>
          {(bill.customerName || 'W').charAt(0).toUpperCase()}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-bold text-slate-900">
              {bill.customerName || 'Walk-in'}
            </p>
            <span className="shrink-0 font-mono text-[11px] text-slate-400">
              {bill.number}
            </span>
          </div>

          <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
            <span>{MODE_EMOJI[bill.paymentMode] || '💵'}</span>
            <span className="capitalize">{bill.paymentMode}</span>
            <span>•</span>
            <span>{bill.itemCount} item</span>
            <span>•</span>
            <span>{timeAgo(bill.createdAt)}</span>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
            {inr(bill.total)}
          </p>
          <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${cfg.bg} ${cfg.text}`}>
            <Icon className="h-3 w-3" />
            {cfg.label}
          </span>
          {bill.dueAmount > 0 && (
            <p className="mt-0.5 text-[10px] font-bold text-red-500">
              Baki {inr(bill.dueAmount)}
            </p>
          )}
        </div>

        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
      </button>
    </li>
  );
}

function BillDetailModal({ id, onClose, onRefresh, onDelete }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);

  const load = async () => {
    try {
      const d = await api.get(`/api/bills/${id}`);
      setData(d);
    } catch (err: any) {
      toast.error(err.message || 'Bill load nahi hua');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const receivePayment = async (amount: number, mode: string) => {
    await api.post(`/api/bills/${id}/payment`, { amount, mode });
    toast.success(`${inr(amount)} received!`);
    setPayOpen(false);
    await load();
    onRefresh();
  };

  const bill = data?.bill;
  const shop = data?.shop || {};
  const settings = data?.settings || {};

  const upiUrl = settings.showQR && settings.upiId && bill?.dueAmount > 0
    ? `upi://pay?pa=${settings.upiId}&pn=${encodeURIComponent(shop.name || '')}&am=${bill.dueAmount}&cu=INR&tn=${encodeURIComponent('Bill ' + bill.number)}`
    : null;

  const handlePrint = () => {
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
    body {
      font-family: 'Inter', -apple-system, system-ui, sans-serif;
      font-size: 12px;
      line-height: 1.4;
      color: #000;
      background: #fff;
      padding: 10mm;
      max-width: 210mm;
      margin: 0 auto;
    }
    .page {
      border: 2px solid #000;
      padding: 12mm 10mm;
      min-height: calc(100vh - 20mm);
      position: relative;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 90px;
      font-weight: 900;
      color: #000;
      opacity: 0.05;
      letter-spacing: 4px;
      pointer-events: none;
      z-index: -1;
      user-select: none;
      white-space: nowrap;
    }
    .shop-header {
      display: flex;
      align-items: center;
      gap: 14px;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .shop-logo {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #ddd;
      flex-shrink: 0;
    }
    .shop-info { flex: 1; min-width: 0; }
    .shop-name {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 4px;
    }
    .shop-detail {
      font-size: 11px;
      color: #333;
      margin: 1px 0;
    }
    .bill-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px dashed #000;
    }
    .bill-number { font-size: 16px; font-weight: 700; }
    .bill-date { font-size: 10px; color: #666; }
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 700;
      border: 1px solid #000;
      border-radius: 12px;
      margin-top: 4px;
    }
    .customer { margin-bottom: 12px; }
    .customer-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin-bottom: 2px;
    }
    .customer-name { font-weight: 700; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th {
      text-align: left;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 6px 0;
      border-bottom: 1px solid #000;
    }
    th.right, td.right { text-align: right; }
    td { padding: 7px 0; font-size: 12px; border-bottom: 1px solid #e5e5e5; }
    .item-name { font-weight: 600; }
    .item-sub { font-size: 10px; color: #666; }
    .totals { margin-left: auto; width: 100%; max-width: 280px; }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 12px;
    }
    .total-divider {
      border-top: 2px solid #000;
      margin-top: 6px;
      padding-top: 6px;
      font-size: 16px;
      font-weight: 800;
    }
    .due-box {
      margin-top: 8px;
      padding: 6px;
      border: 1px dashed #000;
      font-size: 11px;
    }
    .qr-section {
      margin-top: 16px;
      padding: 12px;
      border: 1px dashed #000;
      background: #f9f9f9;
    }
    .qr-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .qr-content { display: flex; align-items: center; gap: 16px; }
    .qr-img {
      width: 120px;
      height: 120px;
      border: 1px solid #ddd;
      background: #fff;
      padding: 4px;
    }
    .qr-info { flex: 1; }
    .qr-amount { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
    .qr-upi-label {
      font-size: 9px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .qr-upi-id {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: 700;
      margin-top: 2px;
    }
    .qr-hint { font-size: 9px; color: #666; margin-top: 6px; }
    .terms { margin-top: 12px; font-size: 10px; color: #444; }
    .terms-title {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px dashed #000;
      text-align: center;
      font-size: 11px;
    }
    .footer-sub { font-size: 9px; color: #666; margin-top: 4px; }
    .notes {
      margin-top: 12px;
      padding: 8px;
      background: #f5f5f5;
      font-size: 11px;
      font-style: italic;
    }
    @media print {
      @page { size: A4 portrait; margin: 10mm; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="watermark">BazaarBook</div>
  <div class="page">
    <div class="shop-header">
      ${settings.showLogo !== false && shop.logoUrl ? `
        <img src="${shop.logoUrl}" alt="Logo" class="shop-logo" onerror="this.style.display='none'" />
      ` : ''}
      <div class="shop-info">
        <div class="shop-name">${shop.name || 'BazaarBook'}</div>
        ${shop.owner ? `<div class="shop-detail">${shop.owner}</div>` : ''}
        ${shop.mobile ? `<div class="shop-detail">📞 ${shop.mobile}</div>` : ''}
        ${(shop.address || shop.city) ? `<div class="shop-detail">📍 ${shop.address || ''}${shop.address && shop.city ? ', ' : ''}${shop.city || ''}${shop.state ? ', ' + shop.state : ''}${shop.pincode ? ' - ' + shop.pincode : ''}</div>` : ''}
        ${shop.gstin ? `<div class="shop-detail"><strong>GSTIN:</strong> ${shop.gstin}</div>` : ''}
      </div>
    </div>

    <div class="bill-meta">
      <div>
        <div class="bill-number">Bill: ${bill.number}</div>
        <div class="bill-date">${new Date(bill.createdAt).toLocaleString('en-IN', {
          day: 'numeric', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        })}</div>
      </div>
      <div style="text-align: right;">
        <div class="status-badge">
          ${bill.paymentStatus === 'paid' ? '✓ PAID' : bill.paymentStatus === 'partial' ? 'PARTIAL' : 'PENDING'}
        </div>
        <div class="bill-date" style="margin-top: 4px;">
          ${bill.paymentMode?.toUpperCase() || 'CASH'}
        </div>
      </div>
    </div>

    <div class="customer">
      <div class="customer-label">Grahak</div>
      <div class="customer-name">${bill.customerName || 'Walk-in Customer'}</div>
      ${bill.customerMobile ? `<div class="shop-detail">📱 ${bill.customerMobile}</div>` : ''}
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th class="right">Qty</th>
          <th class="right">Rate</th>
          <th class="right">Total</th>
        </tr>
      </thead>
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
      <div class="total-row">
        <span>Subtotal</span>
        <span>₹${bill.subtotal}</span>
      </div>
      ${bill.itemDiscounts > 0 ? `
        <div class="total-row">
          <span>Item Discount</span>
          <span>− ₹${bill.itemDiscounts}</span>
        </div>
      ` : ''}
      ${bill.billDiscount > 0 ? `
        <div class="total-row">
          <span>Bill Discount</span>
          <span>− ₹${bill.billDiscount}</span>
        </div>
      ` : ''}
      ${bill.gstAmount > 0 ? `
        <div class="total-row">
          <span>GST @ ${bill.gstRate}%</span>
          <span>+ ₹${bill.gstAmount}</span>
        </div>
      ` : ''}
      ${Math.abs(bill.roundOff || 0) > 0.01 ? `
        <div class="total-row">
          <span>Round Off</span>
          <span>${bill.roundOff > 0 ? '+' : ''}₹${bill.roundOff}</span>
        </div>
      ` : ''}
      <div class="total-row total-divider">
        <span>TOTAL</span>
        <span>₹${bill.total}</span>
      </div>
      ${bill.paymentStatus !== 'paid' ? `
        <div class="due-box">
          <div style="display:flex; justify-content:space-between;">
            <span>Paid</span><span>₹${bill.paidAmount}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-weight:700; margin-top:4px;">
            <span>Baki</span><span>₹${bill.dueAmount}</span>
          </div>
        </div>
      ` : ''}
    </div>

    ${upiUrl ? `
      <div class="qr-section">
        <div class="qr-title">💳 UPI se Pay Karein</div>
        <div class="qr-content">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}&margin=10" alt="UPI QR" class="qr-img" />
          <div class="qr-info">
            <div class="qr-amount">Amount: ₹${bill.dueAmount}</div>
            <div class="qr-upi-label">UPI ID:</div>
            <div class="qr-upi-id">${settings.upiId}</div>
            <div class="qr-hint">Scan karein — GPay, PhonePe, Paytm</div>
          </div>
        </div>
      </div>
    ` : ''}

    ${bill.notes ? `<div class="notes">"${bill.notes}"</div>` : ''}

    ${settings.terms ? `
      <div class="terms">
        <div class="terms-title">Terms & Conditions</div>
        <div>${settings.terms}</div>
      </div>
    ` : ''}

    <div class="footer">
      <div>${settings.footerNote || 'Dhanyavaad! Phir aane ke liye shukriya 🙏'}</div>
      <div class="footer-sub">— BazaarBook se banaya gaya —</div>
    </div>
  </div>
</body>
</html>
    `;

    printWindow.document.write(billHTML);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => { printWindow.print(); }, 200);
    };

    setTimeout(() => {
      if (!printWindow.closed) {
        printWindow.focus();
        printWindow.print();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="bill-print-area relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
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
                    {(shop.city || shop.address) && (
                      <p className="truncate text-[11px] text-white/70">
                        📍 {shop.address ? `${shop.address}, ` : ''}{shop.city}
                        {shop.state ? `, ${shop.state}` : ''}
                      </p>
                    )}
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
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                  {bill.customerName || 'Walk-in Customer'}
                </p>
                {bill.customerMobile && (
                  <p className="font-mono text-xs text-slate-500">{bill.customerMobile}</p>
                )}
              </div>

              <div className="border-b border-stone-100 bg-stone-50/50 px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Saman ({bill.items.length})
                </p>
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
                        {it.discount > 0 && (
                          <span className="ml-2 text-accent-600">− {inr(it.discount)}</span>
                        )}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
                      {inr(it.lineTotal || (it.price * it.quantity - it.discount))}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 border-t border-stone-100 p-4">
                <Row label="Subtotal" value={inr(bill.subtotal)} />
                {bill.itemDiscounts > 0 && (
                  <Row label="Item Discount" value={`− ${inr(bill.itemDiscounts)}`} tone="accent" />
                )}
                {bill.billDiscount > 0 && (
                  <Row label="Bill Discount" value={`− ${inr(bill.billDiscount)}`} tone="accent" />
                )}
                {bill.gstAmount > 0 && (
                  <Row label={`GST @ ${bill.gstRate}%`} value={`+ ${inr(bill.gstAmount)}`} />
                )}
                {Math.abs(bill.roundOff) > 0.01 && (
                  <Row label="Round off" value={inr(bill.roundOff)} tone="muted" />
                )}

                <div className="mt-3 border-t border-dashed border-stone-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base font-bold text-slate-700">Total</span>
                    <span className="font-display text-2xl font-extrabold text-slate-900">
                      {inr(bill.total)}
                    </span>
                  </div>
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

              {upiUrl && (
                <div className="border-t border-stone-100 bg-lime-50/50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-lime-800">
                    💳 UPI se pay karein
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(upiUrl)}&margin=8`}
                      alt="UPI QR"
                      className="h-32 w-32 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-lime-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-700">Amount: {inr(bill.dueAmount)}</p>
                      <p className="mt-1 text-[10px] text-slate-500">UPI ID:</p>
                      <p className="font-mono text-xs font-bold text-lime-800">{settings.upiId}</p>
                      <p className="mt-2 text-[10px] text-lime-700">Scan karein — GPay, PhonePe, Paytm</p>
                    </div>
                  </div>
                </div>
              )}

              {bill.notes && (
                <div className="border-t border-stone-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Note</p>
                  <p className="mt-1 text-xs italic text-slate-600">"{bill.notes}"</p>
                </div>
              )}

              {settings.terms && (
                <div className="border-t border-stone-100 bg-stone-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Terms & Conditions
                  </p>
                  <p className="mt-1 text-[11px] text-slate-600">{settings.terms}</p>
                </div>
              )}

              <div className="border-t border-dashed border-stone-200 bg-stone-50/80 p-4 text-center">
                <p className="text-xs font-semibold text-slate-700">
                  {settings.footerNote || 'Dhanyavaad! Phir aane ke liye shukriya 🙏'}
                </p>
                <p className="mt-1 text-[10px] text-slate-400">
                  — BazaarBook se banaya gaya —
                </p>
              </div>
            </div>

            <div className="no-print grid grid-cols-2 gap-2 border-t border-stone-200 p-4">
              {bill.dueAmount > 0 && (
                <button
                  onClick={() => setPayOpen(true)}
                  className="btn btn-md bg-lime-600 text-white hover:bg-lime-700"
                >
                  <Wallet className="h-4 w-4" />
                  Receive {inr(bill.dueAmount)}
                </button>
              )}
              <button onClick={handlePrint} className="btn-outline btn-md">
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                onClick={() => onDelete(bill)}
                className={`btn-outline btn-md text-red-600 ${bill.dueAmount <= 0 ? 'col-span-1' : ''}`}
              >
                <Trash2 className="h-4 w-4" />
                Delete
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

function Row({ label, value, tone = 'default' }: any) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`font-semibold ${
        tone === 'accent' ? 'text-accent-600' : tone === 'muted' ? 'text-slate-400' : 'text-slate-900'
      }`}>
        {value}
      </span>
    </div>
  );
}

function PaymentModal({ amount, onClose, onSubmit }: any) {
  const [amt, setAmt] = useState(amount);
  const [mode, setMode] = useState('cash');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (amt <= 0 || amt > amount) return toast.error('Sahi amount daalein');
    setSaving(true);
    try {
      await onSubmit(amt, mode);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-lime-500 to-emerald-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold">Payment Receive</h3>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold">{inr(amount)}</p>
          <p className="text-xs text-white/85">Bill ka baki</p>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Kitna mila?
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">₹</span>
              <input
                type="number"
                value={amt || ''}
                onChange={(e) => setAmt(Number(e.target.value) || 0)}
                className="input pl-10 text-lg font-extrabold"
                placeholder="0"
                autoFocus
              />
            </div>
            <div className="mt-2 flex gap-2">
              {[100, 500, 1000].filter(q => q <= amount).map(q => (
                <button
                  key={q}
                  onClick={() => setAmt(q)}
                  className="flex-1 rounded-full border border-stone-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 hover:border-brand-300 hover:bg-brand-50"
                >
                  ₹{q}
                </button>
              ))}
              <button
                onClick={() => setAmt(amount)}
                className="flex-1 rounded-full border border-brand-300 bg-brand-50 px-2 py-1.5 text-xs font-bold text-brand-700"
              >
                Full
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Payment mode
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 'cash', l: 'Cash', e: '💵' },
                { v: 'upi', l: 'UPI', e: '📱' },
                { v: 'card', l: 'Card', e: '💳' }
              ].map((m) => (
                <button
                  key={m.v}
                  onClick={() => setMode(m.v)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold transition ${
                    mode === m.v
                      ? 'border-lime-500 bg-lime-50 text-lime-800 ring-2 ring-lime-500/20'
                      : 'border-stone-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="text-lg">{m.e}</span>
                  {m.l}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-stone-50 p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Payment</span>
              <span className="font-bold text-slate-900">− {inr(amt)}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-dashed border-stone-300 pt-1">
              <span className="text-slate-600">Baki rahega</span>
              <span className={`font-display text-base font-extrabold ${amount - amt > 0 ? 'text-red-600' : 'text-lime-600'}`}>
                {inr(Math.max(0, amount - amt))}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-stone-200 p-4">
          <button onClick={onClose} className="btn-ghost btn-md flex-1">Cancel</button>
          <button
            onClick={submit}
            disabled={saving || amt <= 0 || amt > amount}
            className="btn btn-md flex-[2] bg-lime-600 text-white hover:bg-lime-700 disabled:opacity-50"
          >
            {saving ? 'Save…' : `Receive ${inr(amt)}`}
          </button>
        </div>
      </div>
    </div>
  );
}