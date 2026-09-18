// import { useEffect, useMemo, useState } from 'react';
// import {
//   Plus, Users, Search, X, Phone, MessageCircle, Edit2,
//   Trash2, AlertCircle, CheckCircle2, TrendingUp, Wallet,
//   ArrowUpRight, ArrowDownLeft
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { inr, timeAgo } from '@/lib/format';

// type Customer = {
//   id: string;
//   name: string;
//   mobile: string;
//   address?: string;
//   city?: string;
//   group: string;
//   balance: number;
//   totalBilling: number;
//   totalPaid: number;
//   notes?: string;
//   lastTransactionAt?: string;
// };

// type LedgerEntry = {
//   id: string;
//   type: 'bill' | 'payment' | 'adjustment';
//   amount: number;
//   balanceAfter: number;
//   mode?: string;
//   note?: string;
//   createdAt: string;
// };

// export default function CustomersPage() {
//   const token = localStorage.getItem('bb_token');
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [q, setQ] = useState('');
//   const [onlyDue, setOnlyDue] = useState(false);
//   const [sort, setSort] = useState<'due' | 'amount' | 'recent' | 'name'>('due');
//   const [formOpen, setFormOpen] = useState(false);
//   const [editing, setEditing] = useState<Customer | null>(null);
//   const [detailId, setDetailId] = useState<string | null>(null);
//   const [deleting, setDeleting] = useState<Customer | null>(null);

//   // ============ LOAD ============
//   const load = async () => {
//     try {
//       const params = new URLSearchParams();
//       if (q) params.set('q', q);
//       if (onlyDue) params.set('onlyDue', 'true');
//       params.set('sort', sort);

//       const r = await fetch('/api/customers?' + params.toString(), {
//         headers: { Authorization: 'Bearer ' + token }
//       });
//       if (r.ok) {
//         const d = await r.json();
//         setCustomers(d.customers || []);
//       }
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, [q, onlyDue, sort]);

//   // ============ SUMMARY ============
//   const summary = useMemo(() => {
//     const total = customers.length;
//     const pending = customers.filter(c => c.balance > 0);
//     const pendingAmount = pending.reduce((s, c) => s + c.balance, 0);
//     const cleared = customers.filter(c => c.balance <= 0).length;
//     const topDue = [...pending].sort((a, b) => b.balance - a.balance)[0];
//     return { total, pendingCount: pending.length, pendingAmount, cleared, topDue };
//   }, [customers]);

//   // ============ SAVE ============
//   const handleSave = async (draft: any) => {
//     const isEdit = !!editing;
//     const url = isEdit ? `/api/customers/${editing!.id}` : '/api/customers';
//     const method = isEdit ? 'PATCH' : 'POST';

//     const r = await fetch(url, {
//       method,
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + token
//       },
//       body: JSON.stringify(draft)
//     });
//     const data = await r.json();
//     if (!r.ok) throw new Error(data.error || 'Save nahi hua');
//     toast.success(isEdit ? 'Grahak update ho gaya' : 'Naya grahak jud gaya');
//     await load();
//   };

//   // ============ DELETE ============
//   const handleDelete = async () => {
//     if (!deleting) return;
//     const r = await fetch(`/api/customers/${deleting.id}`, {
//       method: 'DELETE',
//       headers: { Authorization: 'Bearer ' + token }
//     });
//     if (r.ok) {
//       toast.success('Grahak delete ho gaya');
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
//             Grahak
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Udhaar khata book — poora hisaab
//           </p>
//         </div>
//         <button
//           onClick={() => { setEditing(null); setFormOpen(true); }}
//           className="btn-primary btn-md"
//         >
//           <Plus className="h-4 w-4" />
//           Naya Grahak
//         </button>
//       </div>

//       {/* Summary cards */}
//       {!loading && customers.length > 0 && (
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           <Mini icon={<Users className="h-5 w-5" />} label="Total Grahak" value={String(summary.total)} tone="brand" />
//           <Mini icon={<AlertCircle className="h-5 w-5" />} label="Udhaar Baki" value={inr(summary.pendingAmount)} hint={`${summary.pendingCount} grahak`} tone="danger" />
//           <Mini icon={<CheckCircle2 className="h-5 w-5" />} label="Hisaab Clear" value={String(summary.cleared)} tone="success" />
//           <Mini icon={<TrendingUp className="h-5 w-5" />} label="Sabse Zyada" value={summary.topDue ? inr(summary.topDue.balance) : '₹0'} hint={summary.topDue?.name || '—'} tone="warning" />
//         </div>
//       )}

//       {/* Filters */}
//       {!loading && customers.length > 0 && (
//         <div className="space-y-3">
//           <div className="flex items-center gap-2">
//             <div className="relative flex-1">
//               <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//               <input
//                 value={q}
//                 onChange={(e) => setQ(e.target.value)}
//                 placeholder="Naam ya mobile…"
//                 className="input pl-11 pr-10"
//               />
//               {q && (
//                 <button
//                   onClick={() => setQ('')}
//                   className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-slate-400 hover:bg-stone-100"
//                 >
//                   <X className="h-3.5 w-3.5" />
//                 </button>
//               )}
//             </div>
//             <button
//               onClick={() => setOnlyDue(!onlyDue)}
//               className={`shrink-0 rounded-full border px-3.5 py-2.5 text-xs font-bold transition ${
//                 onlyDue
//                   ? 'border-red-400 bg-red-50 text-red-700'
//                   : 'border-stone-200 bg-white text-slate-600'
//               }`}
//             >
//               🔴 Udhaar wale
//             </button>
//           </div>

//           <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
//             {([
//               { k: 'due', l: 'Sabse zyada udhaar' },
//               { k: 'amount', l: 'Business amount' },
//               { k: 'recent', l: 'Recent activity' },
//               { k: 'name', l: 'Naam A–Z' }
//             ] as const).map((s) => (
//               <button
//                 key={s.k}
//                 onClick={() => setSort(s.k as any)}
//                 className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
//                   sort === s.k
//                     ? 'border-brand-500 bg-brand-50 text-brand-700'
//                     : 'border-stone-200 bg-white text-slate-600'
//                 }`}
//               >
//                 {s.l}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* List */}
//       {loading ? (
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <div key={i} className="card h-40 animate-pulse" />
//           ))}
//         </div>
//       ) : customers.length === 0 ? (
//         <div className="card p-10 text-center">
//           <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
//             <Users className="h-7 w-7" />
//           </div>
//           <h3 className="mt-4 font-display text-lg font-bold">
//             {q || onlyDue ? 'Kuch nahi mila' : 'Abhi koi grahak nahi'}
//           </h3>
//           <p className="mt-1 text-sm text-slate-500">
//             {q || onlyDue ? 'Filters badal kar dekhein' : 'Pehla grahak jodein — khata kholein'}
//           </p>
//           <button
//             onClick={q || onlyDue
//               ? () => { setQ(''); setOnlyDue(false); }
//               : () => { setEditing(null); setFormOpen(true); }}
//             className="btn-primary btn-md mt-5"
//           >
//             {q || onlyDue
//               ? <><X className="h-4 w-4" /> Filters hatao</>
//               : <><Plus className="h-4 w-4" /> Pehla Grahak Jodein</>}
//           </button>
//         </div>
//       ) : (
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
//           {customers.map((c) => {
//             const hasDue = c.balance > 0;
//             return (
//               <div
//                 key={c.id}
//                 className="card overflow-hidden transition hover:shadow-lift cursor-pointer"
//                 onClick={() => setDetailId(c.id)}
//               >
//                 {/* Header */}
//                 <div className="flex items-start gap-3 p-4">
//                   <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-base font-bold text-white shadow-sm ${
//                     hasDue
//                       ? 'bg-gradient-to-br from-red-400 to-red-600'
//                       : 'bg-gradient-to-br from-brand-500 to-accent-500'
//                   }`}>
//                     {c.name.charAt(0).toUpperCase()}
//                   </span>
//                   <div className="min-w-0 flex-1">
//                     <h3 className="truncate text-sm font-bold text-slate-900">
//                       {c.name}
//                     </h3>
//                     <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
//                       {c.mobile}
//                     </p>
//                     {c.lastTransactionAt && (
//                       <p className="mt-0.5 text-[10px] text-slate-400">
//                         Last: {timeAgo(c.lastTransactionAt)}
//                       </p>
//                     )}
//                   </div>
//                   <button
//                     onClick={(e) => { e.stopPropagation(); setEditing(c); setFormOpen(true); }}
//                     className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-brand-50 hover:text-brand-600"
//                     title="Edit"
//                   >
//                     <Edit2 className="h-3.5 w-3.5" />
//                   </button>
//                 </div>

//                 {/* Balance */}
//                 <div className={`flex items-end justify-between gap-2 border-t px-4 py-3 ${
//                   hasDue ? 'bg-red-50/50 border-red-100' : 'bg-lime-50/40 border-lime-100'
//                 }`}>
//                   <div>
//                     <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       {hasDue ? 'Baki Udhaar' : 'Hisaab Clear'}
//                     </p>
//                     <p className={`font-display text-xl font-extrabold ${
//                       hasDue ? 'text-red-600' : 'text-lime-600'
//                     }`}>
//                       {inr(c.balance)}
//                     </p>
//                   </div>

//                   {hasDue && (
//                     <div className="flex items-center gap-1">
//                       <a
//                         href={`tel:${c.mobile}`}
//                         onClick={(e) => e.stopPropagation()}
//                         className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-slate-600 hover:bg-brand-100 hover:text-brand-700"
//                       >
//                         <Phone className="h-3.5 w-3.5" />
//                       </a>
//                       <a
//                         href={`https://wa.me/91${c.mobile}?text=${encodeURIComponent(
//                           `Namaste ${c.name} ji 🙏\n\nAapka ₹${c.balance} udhaar baki hai. Kripya jaldi de dein.\n\nDhanyavaad!`
//                         )}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         onClick={(e) => e.stopPropagation()}
//                         className="grid h-8 w-8 place-items-center rounded-full bg-lime-100 text-lime-700 hover:bg-lime-200"
//                       >
//                         <MessageCircle className="h-3.5 w-3.5" />
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {!loading && customers.length > 0 && (
//         <p className="text-center text-xs text-slate-400">
//           {customers.length} grahak {onlyDue && 'udhaar wale'}
//         </p>
//       )}

//       {/* Form Modal */}
//       {formOpen && (
//         <CustomerForm
//           editing={editing}
//           onClose={() => setFormOpen(false)}
//           onSave={handleSave}
//         />
//       )}

//       {/* Detail Modal */}
//       {detailId && (
//         <CustomerDetail
//           id={detailId}
//           onClose={() => setDetailId(null)}
//           onRefresh={load}
//           onDelete={(c) => { setDetailId(null); setDeleting(c); }}
//         />
//       )}

//       {/* Delete Confirm */}
//       {deleting && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//           <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleting(null)} />
//           <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
//             <h3 className="font-display text-lg font-bold text-slate-900">Delete karein?</h3>
//             <p className="mt-2 text-sm text-slate-600">
//               "{deleting.name}" ka poora khata delete ho jayega. Ye wapas nahi aayega.
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

// // ============ MINI ============
// function Mini({ icon, label, value, hint, tone }: any) {
//   const tones: any = {
//     brand: 'bg-brand-50 text-brand-600 ring-brand-100',
//     warning: 'bg-amber-50 text-amber-600 ring-amber-100',
//     danger: 'bg-red-50 text-red-500 ring-red-100',
//     success: 'bg-lime-50 text-lime-600 ring-lime-100'
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
//           {hint && <p className="truncate text-[10px] text-slate-400">{hint}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============ CUSTOMER FORM ============
// function CustomerForm({ editing, onClose, onSave }: any) {
//   const [draft, setDraft] = useState<any>(() => ({
//     name: editing?.name || '',
//     mobile: editing?.mobile || '',
//     address: editing?.address || '',
//     city: editing?.city || '',
//     group: editing?.group || 'regular',
//     notes: editing?.notes || '',
//     openingBalance: 0
//   }));
//   const [saving, setSaving] = useState(false);
//   const [errors, setErrors] = useState<any>({});

//   const update = (p: any) => setDraft((d: any) => ({ ...d, ...p }));

//   const validate = () => {
//     const e: any = {};
//     if (!draft.name.trim()) e.name = 'Naam zaroori';
//     if (!/^\d{10}$/.test(draft.mobile)) e.mobile = '10 digit mobile';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const submit = async (ev: React.FormEvent) => {
//     ev.preventDefault();
//     if (!validate()) return;
//     setSaving(true);
//     try {
//       await onSave({
//         ...draft,
//         name: draft.name.trim(),
//         openingBalance: Number(draft.openingBalance) || 0
//       });
//       onClose();
//     } catch (e: any) {
//       toast.error(e.message);
//     } finally { setSaving(false); }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
//       <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

//       <form
//         onSubmit={submit}
//         className="relative w-full max-w-lg max-h-[92vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl flex flex-col"
//       >
//         <div className="flex items-center gap-3 border-b border-stone-200 p-4">
//           <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
//             <Users className="h-5 w-5" />
//           </div>
//           <div className="flex-1">
//             <h2 className="font-display text-lg font-bold">
//               {editing ? 'Grahak Edit Karein' : 'Naya Grahak Jodein'}
//             </h2>
//             <p className="text-xs text-slate-500">
//               {editing ? 'Jaankari update karein' : 'Khata kholein'}
//             </p>
//           </div>
//           <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-stone-100">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="flex-1 space-y-4 overflow-y-auto p-4">
//           <Field label="Naam" required error={errors.name}>
//             <input
//               value={draft.name}
//               onChange={(e) => update({ name: e.target.value })}
//               placeholder="Ramesh Kumar"
//               className={`input ${errors.name ? 'border-red-300' : ''}`}
//               autoFocus
//             />
//           </Field>

//           <Field label="Mobile" required error={errors.mobile}>
//             <input
//               type="tel"
//               value={draft.mobile}
//               onChange={(e) => update({ mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
//               placeholder="9876543210"
//               className={`input font-mono ${errors.mobile ? 'border-red-300' : ''}`}
//             />
//           </Field>

//           <div className="grid grid-cols-2 gap-3">
//             <Field label="Address">
//               <input
//                 value={draft.address}
//                 onChange={(e) => update({ address: e.target.value })}
//                 placeholder="Optional"
//                 className="input"
//               />
//             </Field>
//             <Field label="City">
//               <input
//                 value={draft.city}
//                 onChange={(e) => update({ city: e.target.value })}
//                 placeholder="Optional"
//                 className="input"
//               />
//             </Field>
//           </div>

//           <Field label="Grahak type">
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { v: 'regular', l: 'Regular', e: '🛒' },
//                 { v: 'wholesale', l: 'Wholesale', e: '📦' },
//                 { v: 'vip', l: 'VIP', e: '⭐' }
//               ].map((g) => (
//                 <button
//                   key={g.v}
//                   type="button"
//                   onClick={() => update({ group: g.v })}
//                   className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold transition ${
//                     draft.group === g.v
//                       ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
//                       : 'border-stone-200 bg-white text-slate-600'
//                   }`}
//                 >
//                   <span className="text-lg">{g.e}</span>
//                   {g.l}
//                 </button>
//               ))}
//             </div>
//           </Field>

//           {!editing && (
//             <Field label="Purana udhaar (agar hai)">
//               <div className="relative">
//                 <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">₹</span>
//                 <input
//                   type="number"
//                   value={draft.openingBalance || ''}
//                   onChange={(e) => update({ openingBalance: Number(e.target.value) || 0 })}
//                   className="input pl-7"
//                   placeholder="0"
//                 />
//               </div>
//             </Field>
//           )}

//           <Field label="Note (optional)">
//             <textarea
//               value={draft.notes}
//               onChange={(e) => update({ notes: e.target.value })}
//               rows={2}
//               placeholder="Koi khaas baat…"
//               className="input resize-none"
//             />
//           </Field>
//         </div>

//         <div className="flex gap-2 border-t border-stone-200 p-4">
//           <button type="button" onClick={onClose} className="btn-ghost btn-md flex-1">
//             Cancel
//           </button>
//           <button type="submit" disabled={saving} className="btn-primary btn-md flex-[2]">
//             {saving ? 'Save ho raha…' : editing ? 'Update Karein' : 'Save Karein'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// // ============ CUSTOMER DETAIL (Khata) ============
// function CustomerDetail({ id, onClose, onRefresh, onDelete }: any) {
//   const token = localStorage.getItem('bb_token');
//   const [data, setData] = useState<{ customer: Customer; ledger: LedgerEntry[] } | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [payOpen, setPayOpen] = useState(false);
//   const [udhaarOpen, setUdhaarOpen] = useState(false);

//   const load = async () => {
//     try {
//       const r = await fetch(`/api/customers/${id}`, {
//         headers: { Authorization: 'Bearer ' + token }
//       });
//       if (r.ok) setData(await r.json());
//     } catch {}
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, [id]);

//   const receivePayment = async (amount: number, mode: string) => {
//     const r = await fetch(`/api/customers/${id}/payments`, {
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

//   const addUdhaar = async (amount: number, note: string) => {
//     const r = await fetch(`/api/customers/${id}/udhaar`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
//       body: JSON.stringify({ amount, note })
//     });
//     if (r.ok) {
//       toast.success(`${inr(amount)} udhaar added`);
//       setUdhaarOpen(false);
//       await load();
//       onRefresh();
//     } else {
//       toast.error((await r.json()).error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
//       <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

//       <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
//         {loading || !data ? (
//           <div className="p-10 text-center">
//             <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
//             <p className="mt-4 text-sm text-slate-500">Load ho raha…</p>
//           </div>
//         ) : (
//           <>
//             {/* Header */}
//             <div className="bg-gradient-to-br from-brand-600 to-accent-500 p-5 text-white">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-3">
//                   <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur font-bold text-xl">
//                     {data.customer.name.charAt(0).toUpperCase()}
//                   </span>
//                   <div>
//                     <h2 className="font-display text-lg font-extrabold">
//                       {data.customer.name}
//                     </h2>
//                     <p className="text-xs text-white/80">{data.customer.mobile}</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={onClose}
//                   className="grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>

//               <div className="mt-4 flex items-center justify-between">
//                 <div>
//                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
//                     Baki Udhaar
//                   </p>
//                   <p className="font-display text-3xl font-extrabold">
//                     {inr(data.customer.balance)}
//                   </p>
//                 </div>
//                 <div className="text-right text-xs text-white/80">
//                   <p>Total: {inr(data.customer.totalBilling)}</p>
//                   <p>Paid: {inr(data.customer.totalPaid)}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="grid grid-cols-3 gap-2 border-b border-stone-100 p-3">
//               <button
//                 onClick={() => setPayOpen(true)}
//                 disabled={data.customer.balance <= 0}
//                 className="btn btn-md bg-lime-600 text-white hover:bg-lime-700 disabled:opacity-40"
//               >
//                 <ArrowDownLeft className="h-4 w-4" />
//                 Payment
//               </button>
//               <button
//                 onClick={() => setUdhaarOpen(true)}
//                 className="btn btn-md bg-red-500 text-white hover:bg-red-600"
//               >
//                 <ArrowUpRight className="h-4 w-4" />
//                 Udhaar
//               </button>
//               <button
//                 onClick={() => onDelete(data.customer)}
//                 className="btn-outline btn-md text-red-600"
//               >
//                 <Trash2 className="h-4 w-4" />
//                 Delete
//               </button>
//             </div>

//             {/* Ledger */}
//             <div className="flex-1 overflow-y-auto">
//               <div className="sticky top-0 border-b border-stone-100 bg-stone-50 px-4 py-2">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                   Khata / Ledger ({data.ledger.length})
//                 </p>
//               </div>

//               {data.ledger.length === 0 ? (
//                 <div className="p-10 text-center">
//                   <Wallet className="mx-auto h-10 w-10 text-slate-300" />
//                   <p className="mt-2 text-sm text-slate-500">Abhi koi transaction nahi</p>
//                 </div>
//               ) : (
//                 <ul className="divide-y divide-stone-100">
//                   {data.ledger.map((e) => {
//                     const isPayment = e.amount < 0;
//                     return (
//                       <li key={e.id} className="flex items-center gap-3 px-4 py-3">
//                         <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
//                           isPayment ? 'bg-lime-100 text-lime-700' : 'bg-red-100 text-red-600'
//                         }`}>
//                           {isPayment ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
//                         </span>
//                         <div className="min-w-0 flex-1">
//                           <p className="text-sm font-bold text-slate-900">
//                             {isPayment ? 'Payment mila' : e.type === 'bill' ? 'Bill banaya' : 'Udhaar add'}
//                           </p>
//                           <p className="text-[10px] text-slate-500">
//                             {timeAgo(e.createdAt)}
//                             {e.note && ` • ${e.note}`}
//                           </p>
//                         </div>
//                         <div className="shrink-0 text-right">
//                           <p className={`font-display text-base font-extrabold ${
//                             isPayment ? 'text-lime-600' : 'text-red-600'
//                           }`}>
//                             {isPayment ? '' : '+'}{inr(Math.abs(e.amount))}
//                           </p>
//                           <p className="text-[10px] text-slate-400">
//                             Bal: {inr(e.balanceAfter)}
//                           </p>
//                         </div>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Payment Modal */}
//       {payOpen && data && (
//         <AmountModal
//           title="Payment Receive"
//           amount={data.customer.balance}
//           color="lime"
//           withMode
//           onClose={() => setPayOpen(false)}
//           onSubmit={(amt, mode) => receivePayment(amt, mode || 'cash')}
//         />
//       )}

//       {/* Udhaar Modal */}
//       {udhaarOpen && (
//         <AmountModal
//           title="Udhaar Add Karein"
//           amount={0}
//           color="red"
//           withNote
//           onClose={() => setUdhaarOpen(false)}
//           onSubmit={(amt, _mode, note) => addUdhaar(amt, note || '')}
//         />
//       )}
//     </div>
//   );
// }

// // ============ AMOUNT MODAL ============
// function AmountModal({ title, amount, color, withMode, withNote, onClose, onSubmit }: any) {
//   const [amt, setAmt] = useState(amount || 0);
//   const [mode, setMode] = useState('cash');
//   const [note, setNote] = useState('');
//   const [saving, setSaving] = useState(false);

//   const submit = async () => {
//     if (amt <= 0) return toast.error('Amount daalein');
//     setSaving(true);
//     try {
//       await onSubmit(amt, mode, note);
//     } finally { setSaving(false); }
//   };

//   const isLime = color === 'lime';

//   return (
//     <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center">
//       <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
//       <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
//         <div className={`p-5 text-white ${isLime ? 'bg-gradient-to-br from-lime-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-700'}`}>
//           <div className="flex items-center justify-between">
//             <h3 className="font-display text-lg font-extrabold">{title}</h3>
//             <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30">
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//           {amount > 0 && (
//             <p className="mt-2 font-display text-3xl font-extrabold">{inr(amount)}</p>
//           )}
//         </div>

//         <div className="space-y-4 p-5">
//           <div>
//             <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//               Amount
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
//             {amount > 0 && (
//               <button
//                 onClick={() => setAmt(amount)}
//                 className="mt-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
//               >
//                 Full: {inr(amount)}
//               </button>
//             )}
//           </div>

//           {withMode && (
//             <div>
//               <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                 Payment mode
//               </label>
//               <div className="grid grid-cols-3 gap-2">
//                 {[
//                   { v: 'cash', l: 'Cash', e: '💵' },
//                   { v: 'upi', l: 'UPI', e: '📱' },
//                   { v: 'card', l: 'Card', e: '💳' }
//                 ].map((m) => (
//                   <button
//                     key={m.v}
//                     onClick={() => setMode(m.v)}
//                     className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold transition ${
//                       mode === m.v
//                         ? 'border-lime-500 bg-lime-50 text-lime-800'
//                         : 'border-stone-200 bg-white text-slate-600'
//                     }`}
//                   >
//                     <span className="text-lg">{m.e}</span>
//                     {m.l}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {withNote && (
//             <div>
//               <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                 Note (optional)
//               </label>
//               <input
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 placeholder="Kis cheez ka?"
//                 className="input"
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex gap-2 border-t border-stone-200 p-4">
//           <button onClick={onClose} className="btn-ghost btn-md flex-1">
//             Cancel
//           </button>
//           <button
//             onClick={submit}
//             disabled={saving || amt <= 0}
//             className={`btn btn-md flex-[2] text-white ${isLime ? 'bg-lime-600 hover:bg-lime-700' : 'bg-red-500 hover:bg-red-600'}`}
//           >
//             {saving ? 'Save…' : `Confirm ${inr(amt)}`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Field({ label, required, error, children }: any) {
//   return (
//     <div>
//       <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       {children}
//       {error && <p className="mt-1 text-[11px] font-semibold text-red-500">{error}</p>}
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from 'react';
import {
  Plus, Users, Search, X, Phone, MessageCircle, Edit2,
  Trash2, AlertCircle, CheckCircle2, TrendingUp, Wallet,
  ArrowUpRight, ArrowDownLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { inr, timeAgo } from '@/lib/format';
import { api } from '@/lib/api';

type Customer = {
  id: string;
  name: string;
  mobile: string;
  address?: string;
  city?: string;
  group: string;
  balance: number;
  totalBilling: number;
  totalPaid: number;
  notes?: string;
  lastTransactionAt?: string;
};

type LedgerEntry = {
  id: string;
  type: 'bill' | 'payment' | 'adjustment';
  amount: number;
  balanceAfter: number;
  mode?: string;
  note?: string;
  createdAt: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [onlyDue, setOnlyDue] = useState(false);
  const [sort, setSort] = useState<'due' | 'amount' | 'recent' | 'name'>('due');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<Customer | null>(null);

  const load = async () => {
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (onlyDue) params.set('onlyDue', 'true');
      params.set('sort', sort);

      const data = await api.get<{ customers: Customer[] }>(
        `/api/customers?${params.toString()}`
      );
      setCustomers(data.customers || []);
    } catch (err: any) {
      toast.error(err.message || 'Grahak load nahi hue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [q, onlyDue, sort]);

  const summary = useMemo(() => {
    const total = customers.length;
    const pending = customers.filter((c) => c.balance > 0);
    const pendingAmount = pending.reduce((s, c) => s + c.balance, 0);
    const cleared = customers.filter((c) => c.balance <= 0).length;
    const topDue = [...pending].sort((a, b) => b.balance - a.balance)[0];
    return { total, pendingCount: pending.length, pendingAmount, cleared, topDue };
  }, [customers]);

  const handleSave = async (draft: any) => {
    const isEdit = !!editing;
    const path = isEdit ? `/api/customers/${editing!.id}` : '/api/customers';

    if (isEdit) {
      await api.patch(path, draft);
    } else {
      await api.post(path, draft);
    }
    toast.success(isEdit ? 'Grahak update ho gaya' : 'Naya grahak jud gaya');
    await load();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await api.delete(`/api/customers/${deleting.id}`);
      toast.success('Grahak delete ho gaya');
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
            Grahak
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Udhaar khata book — poora hisaab
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="btn-primary btn-md"
        >
          <Plus className="h-4 w-4" />
          Naya Grahak
        </button>
      </div>

      {!loading && customers.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Mini icon={<Users className="h-5 w-5" />} label="Total Grahak" value={String(summary.total)} tone="brand" />
          <Mini icon={<AlertCircle className="h-5 w-5" />} label="Udhaar Baki" value={inr(summary.pendingAmount)} hint={`${summary.pendingCount} grahak`} tone="danger" />
          <Mini icon={<CheckCircle2 className="h-5 w-5" />} label="Hisaab Clear" value={String(summary.cleared)} tone="success" />
          <Mini icon={<TrendingUp className="h-5 w-5" />} label="Sabse Zyada" value={summary.topDue ? inr(summary.topDue.balance) : '₹0'} hint={summary.topDue?.name || '—'} tone="warning" />
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Naam ya mobile…"
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
              onClick={() => setOnlyDue(!onlyDue)}
              className={`shrink-0 rounded-full border px-3.5 py-2.5 text-xs font-bold transition ${
                onlyDue
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-stone-200 bg-white text-slate-600'
              }`}
            >
              🔴 Udhaar wale
            </button>
          </div>

          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
            {([
              { k: 'due', l: 'Sabse zyada udhaar' },
              { k: 'amount', l: 'Business amount' },
              { k: 'recent', l: 'Recent activity' },
              { k: 'name', l: 'Naam A–Z' }
            ] as const).map((s) => (
              <button
                key={s.k}
                onClick={() => setSort(s.k as any)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
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
      )}

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card h-40 animate-pulse" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
            <Users className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold">
            {q || onlyDue ? 'Kuch nahi mila' : 'Abhi koi grahak nahi'}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {q || onlyDue ? 'Filters badal kar dekhein' : 'Pehla grahak jodein — khata kholein'}
          </p>
          <button
            onClick={q || onlyDue
              ? () => { setQ(''); setOnlyDue(false); }
              : () => { setEditing(null); setFormOpen(true); }}
            className="btn-primary btn-md mt-5"
          >
            {q || onlyDue
              ? <><X className="h-4 w-4" /> Filters hatao</>
              : <><Plus className="h-4 w-4" /> Pehla Grahak Jodein</>}
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {customers.map((c) => {
            const hasDue = c.balance > 0;
            return (
              <div
                key={c.id}
                className="card overflow-hidden transition hover:shadow-lift cursor-pointer"
                onClick={() => setDetailId(c.id)}
              >
                <div className="flex items-start gap-3 p-4">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-base font-bold text-white shadow-sm ${
                    hasDue
                      ? 'bg-gradient-to-br from-red-400 to-red-600'
                      : 'bg-gradient-to-br from-brand-500 to-accent-500'
                  }`}>
                    {c.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
                      {c.mobile}
                    </p>
                    {c.lastTransactionAt && (
                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Last: {timeAgo(c.lastTransactionAt)}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditing(c); setFormOpen(true); }}
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className={`flex items-end justify-between gap-2 border-t px-4 py-3 ${
                  hasDue ? 'bg-red-50/50 border-red-100' : 'bg-lime-50/40 border-lime-100'
                }`}>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {hasDue ? 'Baki Udhaar' : 'Hisaab Clear'}
                    </p>
                    <p className={`font-display text-xl font-extrabold ${
                      hasDue ? 'text-red-600' : 'text-lime-600'
                    }`}>
                      {inr(c.balance)}
                    </p>
                  </div>

                  {hasDue && (
                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${c.mobile}`}
                        onClick={(e) => e.stopPropagation()}
                        className="grid h-8 w-8 place-items-center rounded-full bg-stone-100 text-slate-600 hover:bg-brand-100 hover:text-brand-700"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/91${c.mobile}?text=${encodeURIComponent(
                          `Namaste ${c.name} ji 🙏\n\nAapka ₹${c.balance} udhaar baki hai. Kripya jaldi de dein.\n\nDhanyavaad!`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="grid h-8 w-8 place-items-center rounded-full bg-lime-100 text-lime-700 hover:bg-lime-200"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && customers.length > 0 && (
        <p className="text-center text-xs text-slate-400">
          {customers.length} grahak {onlyDue && 'udhaar wale'}
        </p>
      )}

      {formOpen && (
        <CustomerForm
          editing={editing}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}

      {detailId && (
        <CustomerDetail
          id={detailId}
          onClose={() => setDetailId(null)}
          onRefresh={load}
          onDelete={(c) => { setDetailId(null); setDeleting(c); }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setDeleting(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900">Delete karein?</h3>
            <p className="mt-2 text-sm text-slate-600">
              "{deleting.name}" ka poora khata delete ho jayega. Ye wapas nahi aayega.
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

function Mini({ icon, label, value, hint, tone }: any) {
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
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="font-display text-lg font-extrabold text-slate-900 truncate">{value}</p>
          {hint && <p className="truncate text-[10px] text-slate-400">{hint}</p>}
        </div>
      </div>
    </div>
  );
}

function CustomerForm({ editing, onClose, onSave }: any) {
  const [draft, setDraft] = useState<any>(() => ({
    name: editing?.name || '',
    mobile: editing?.mobile || '',
    address: editing?.address || '',
    city: editing?.city || '',
    group: editing?.group || 'regular',
    notes: editing?.notes || '',
    openingBalance: 0
  }));
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const update = (p: any) => setDraft((d: any) => ({ ...d, ...p }));

  const validate = () => {
    const e: any = {};
    if (!draft.name.trim()) e.name = 'Naam zaroori';
    if (!/^\d{10}$/.test(draft.mobile)) e.mobile = '10 digit mobile';
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
        openingBalance: Number(draft.openingBalance) || 0
      });
      onClose();
    } catch (e: any) {
      toast.error(e.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <form
        onSubmit={submit}
        className="relative w-full max-w-lg max-h-[92vh] overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl flex flex-col"
      >
        <div className="flex items-center gap-3 border-b border-stone-200 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold">
              {editing ? 'Grahak Edit Karein' : 'Naya Grahak Jodein'}
            </h2>
            <p className="text-xs text-slate-500">
              {editing ? 'Jaankari update karein' : 'Khata kholein'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-stone-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <Field label="Naam" required error={errors.name}>
            <input
              value={draft.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Ramesh Kumar"
              className={`input ${errors.name ? 'border-red-300' : ''}`}
              autoFocus
            />
          </Field>

          <Field label="Mobile" required error={errors.mobile}>
            <input
              type="tel"
              value={draft.mobile}
              onChange={(e) => update({ mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              placeholder="9876543210"
              className={`input font-mono ${errors.mobile ? 'border-red-300' : ''}`}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Address">
              <input
                value={draft.address}
                onChange={(e) => update({ address: e.target.value })}
                placeholder="Optional"
                className="input"
              />
            </Field>
            <Field label="City">
              <input
                value={draft.city}
                onChange={(e) => update({ city: e.target.value })}
                placeholder="Optional"
                className="input"
              />
            </Field>
          </div>

          <Field label="Grahak type">
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 'regular', l: 'Regular', e: '🛒' },
                { v: 'wholesale', l: 'Wholesale', e: '📦' },
                { v: 'vip', l: 'VIP', e: '⭐' }
              ].map((g) => (
                <button
                  key={g.v}
                  type="button"
                  onClick={() => update({ group: g.v })}
                  className={`flex flex-col items-center gap-1 rounded-2xl border p-3 text-xs font-bold transition ${
                    draft.group === g.v
                      ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                      : 'border-stone-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="text-lg">{g.e}</span>
                  {g.l}
                </button>
              ))}
            </div>
          </Field>

          {!editing && (
            <Field label="Purana udhaar (agar hai)">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">₹</span>
                <input
                  type="number"
                  value={draft.openingBalance || ''}
                  onChange={(e) => update({ openingBalance: Number(e.target.value) || 0 })}
                  className="input pl-7"
                  placeholder="0"
                />
              </div>
            </Field>
          )}

          <Field label="Note (optional)">
            <textarea
              value={draft.notes}
              onChange={(e) => update({ notes: e.target.value })}
              rows={2}
              placeholder="Koi khaas baat…"
              className="input resize-none"
            />
          </Field>
        </div>

        <div className="flex gap-2 border-t border-stone-200 p-4">
          <button type="button" onClick={onClose} className="btn-ghost btn-md flex-1">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="btn-primary btn-md flex-[2]">
            {saving ? 'Save ho raha…' : editing ? 'Update Karein' : 'Save Karein'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CustomerDetail({ id, onClose, onRefresh, onDelete }: any) {
  const [data, setData] = useState<{ customer: Customer; ledger: LedgerEntry[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [udhaarOpen, setUdhaarOpen] = useState(false);

  const load = async () => {
    try {
      const d = await api.get<{ customer: Customer; ledger: LedgerEntry[] }>(
        `/api/customers/${id}`
      );
      setData(d);
    } catch (err: any) {
      toast.error(err.message || 'Detail load nahi hua');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const receivePayment = async (amount: number, mode: string) => {
    await api.post(`/api/customers/${id}/payments`, { amount, mode });
    toast.success(`${inr(amount)} received!`);
    setPayOpen(false);
    await load();
    onRefresh();
  };

  const addUdhaar = async (amount: number, note: string) => {
    await api.post(`/api/customers/${id}/udhaar`, { amount, note });
    toast.success(`${inr(amount)} udhaar added`);
    setUdhaarOpen(false);
    await load();
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
        {loading || !data ? (
          <div className="p-10 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="mt-4 text-sm text-slate-500">Load ho raha…</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-brand-600 to-accent-500 p-5 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur font-bold text-xl">
                    {data.customer.name.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-extrabold">
                      {data.customer.name}
                    </h2>
                    <p className="text-xs text-white/80">{data.customer.mobile}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">
                    Baki Udhaar
                  </p>
                  <p className="font-display text-3xl font-extrabold">
                    {inr(data.customer.balance)}
                  </p>
                </div>
                <div className="text-right text-xs text-white/80">
                  <p>Total: {inr(data.customer.totalBilling)}</p>
                  <p>Paid: {inr(data.customer.totalPaid)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-b border-stone-100 p-3">
              <button
                onClick={() => setPayOpen(true)}
                disabled={data.customer.balance <= 0}
                className="btn btn-md bg-lime-600 text-white hover:bg-lime-700 disabled:opacity-40"
              >
                <ArrowDownLeft className="h-4 w-4" />
                Payment
              </button>
              <button
                onClick={() => setUdhaarOpen(true)}
                className="btn btn-md bg-red-500 text-white hover:bg-red-600"
              >
                <ArrowUpRight className="h-4 w-4" />
                Udhaar
              </button>
              <button
                onClick={() => onDelete(data.customer)}
                className="btn-outline btn-md text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 border-b border-stone-100 bg-stone-50 px-4 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Khata / Ledger ({data.ledger.length})
                </p>
              </div>

              {data.ledger.length === 0 ? (
                <div className="p-10 text-center">
                  <Wallet className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">Abhi koi transaction nahi</p>
                </div>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {data.ledger.map((e) => {
                    const isPayment = e.amount < 0;
                    return (
                      <li key={e.id} className="flex items-center gap-3 px-4 py-3">
                        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                          isPayment ? 'bg-lime-100 text-lime-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {isPayment ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900">
                            {isPayment ? 'Payment mila' : e.type === 'bill' ? 'Bill banaya' : 'Udhaar add'}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {timeAgo(e.createdAt)}
                            {e.note && ` • ${e.note}`}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className={`font-display text-base font-extrabold ${
                            isPayment ? 'text-lime-600' : 'text-red-600'
                          }`}>
                            {isPayment ? '' : '+'}{inr(Math.abs(e.amount))}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Bal: {inr(e.balanceAfter)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {payOpen && data && (
        <AmountModal
          title="Payment Receive"
          amount={data.customer.balance}
          color="lime"
          withMode
          onClose={() => setPayOpen(false)}
          onSubmit={(amt, mode) => receivePayment(amt, mode || 'cash')}
        />
      )}

      {udhaarOpen && (
        <AmountModal
          title="Udhaar Add Karein"
          amount={0}
          color="red"
          withNote
          onClose={() => setUdhaarOpen(false)}
          onSubmit={(amt, _mode, note) => addUdhaar(amt, note || '')}
        />
      )}
    </div>
  );
}

function AmountModal({ title, amount, color, withMode, withNote, onClose, onSubmit }: any) {
  const [amt, setAmt] = useState(amount || 0);
  const [mode, setMode] = useState('cash');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (amt <= 0) return toast.error('Amount daalein');
    setSaving(true);
    try {
      await onSubmit(amt, mode, note);
    } finally { setSaving(false); }
  };

  const isLime = color === 'lime';

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className={`p-5 text-white ${isLime ? 'bg-gradient-to-br from-lime-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-red-700'}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-extrabold">{title}</h3>
            <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 hover:bg-white/30">
              <X className="h-4 w-4" />
            </button>
          </div>
          {amount > 0 && (
            <p className="mt-2 font-display text-3xl font-extrabold">{inr(amount)}</p>
          )}
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Amount
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
            {amount > 0 && (
              <button
                onClick={() => setAmt(amount)}
                className="mt-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700"
              >
                Full: {inr(amount)}
              </button>
            )}
          </div>

          {withMode && (
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
                        ? 'border-lime-500 bg-lime-50 text-lime-800'
                        : 'border-stone-200 bg-white text-slate-600'
                    }`}
                  >
                    <span className="text-lg">{m.e}</span>
                    {m.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {withNote && (
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Note (optional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Kis cheez ka?"
                className="input"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-stone-200 p-4">
          <button onClick={onClose} className="btn-ghost btn-md flex-1">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || amt <= 0}
            className={`btn btn-md flex-[2] text-white ${isLime ? 'bg-lime-600 hover:bg-lime-700' : 'bg-red-500 hover:bg-red-600'}`}
          >
            {saving ? 'Save…' : `Confirm ${inr(amt)}`}
          </button>
        </div>
      </div>
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