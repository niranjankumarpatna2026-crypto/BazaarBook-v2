// import { useEffect, useMemo, useState } from 'react';
// import {
//   IndianRupee, TrendingUp, TrendingDown, Receipt, BarChart3,
//   Wallet, Package, Users, PieChart, CalendarDays, Download,
//   AlertCircle, ArrowUpRight, ArrowDownRight
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { inr } from '@/lib/format';
// import { api } from '@/lib/api';

// // ===================== TYPES =====================
// type RangeKey = 'today' | 'yesterday' | '7d' | '30d' | 'month';

// const RANGES: { k: RangeKey; l: string }[] = [
//   { k: 'today', l: 'Aaj' },
//   { k: 'yesterday', l: 'Kal' },
//   { k: '7d', l: '7 Din' },
//   { k: '30d', l: '30 Din' },
//   { k: 'month', l: 'Is Mahine' }
// ];

// function rangeToDates(range: RangeKey): { from: string; to: string } {
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
//   const f = new Date(now.getFullYear(), now.getMonth(), 1);
//   return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
// }

// export default function ReportsPage() {
//   const token = localStorage.getItem('bb_token');
//   const [range, setRange] = useState<RangeKey>('7d');
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const { from, to } = rangeToDates(range);
//       // const r = await fetch(
//       //   `/api/reports?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
//       //   { headers: { Authorization: 'Bearer ' + token } }
//       // );
//       // if (r.ok) setData(await r.json());
//       const d = await api.get(
//   `/api/reports?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
// );
// setData(d);
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, [range]);

//   // ===================== EXPORT =====================
//   const handleExport = () => {
//     if (!data) return;
//     const rows: any[] = [
//       ['BazaarBook — Kamai Report'],
//       ['Range', RANGES.find(r => r.k === range)?.l || range],
//       [],
//       ['Summary'],
//       ['Total Kamai', data.stats.totalSales],
//       ['Total Munafa', data.stats.totalProfit],
//       ['Bills', data.stats.totalBills],
//       ['Avg Bill', data.stats.avgBill],
//       [],
//       ['Din-wise'],
//       ['Date', 'Sales', 'Profit', 'Bills'],
//       ...data.days.map((d: any) => [d.label, d.sales, d.profit, d.bills]),
//       [],
//       ['Top Products'],
//       ['Name', 'Quantity', 'Revenue'],
//       ...data.topProducts.map((p: any) => [p.name, p.quantity, p.revenue])
//     ];
//     const csv = '\uFEFF' + rows.map(r => r.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `report-${new Date().toISOString().slice(0, 10)}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//     toast.success('Report download ho gayi');
//   };

//   // ===================== RENDER =====================
//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <div className="h-8 w-40 animate-pulse rounded-full bg-stone-200" />
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           {[1, 2, 3, 4].map(i => <div key={i} className="card h-28 animate-pulse" />)}
//         </div>
//         <div className="card h-80 animate-pulse" />
//       </div>
//     );
//   }

//   if (!data) return <div className="card p-10 text-center">Report load nahi hui</div>;

//   const s = data.stats;
//   const hasData = s.totalBills > 0;

//   return (
//     <div className="space-y-4 pb-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-start justify-between gap-3">
//         <div>
//           <h1 className="font-display text-2xl font-extrabold text-slate-900">
//             Kamai Report
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             Kamai, munafa aur sales ka poora hisaab
//           </p>
//         </div>
//         {hasData && (
//           <button onClick={handleExport} className="btn-outline btn-md">
//             <Download className="h-4 w-4" />
//             Download
//           </button>
//         )}
//       </div>

//       {/* Range chips */}
//       <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
//         {RANGES.map((r) => (
//           <button
//             key={r.k}
//             onClick={() => setRange(r.k)}
//             className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
//               range === r.k
//                 ? 'border-brand-500 bg-brand-50 text-brand-700'
//                 : 'border-stone-200 bg-white text-slate-600 hover:border-stone-300'
//             }`}
//           >
//             {r.l}
//           </button>
//         ))}
//       </div>

//       {/* Empty state */}
//       {!hasData ? (
//         <div className="card p-10 text-center">
//           <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
//             <BarChart3 className="h-7 w-7" />
//           </div>
//           <h3 className="mt-4 font-display text-lg font-bold">
//             Is period mein koi bill nahi
//           </h3>
//           <p className="mt-1 text-sm text-slate-500">
//             Doosra range try karein ya bill banayein
//           </p>
//         </div>
//       ) : (
//         <>
//           {/* 4 KPI cards */}
//           <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//             <KpiCard
//               label="Total Kamai"
//               value={inr(s.totalSales)}
//               change={s.salesChange}
//               icon={<IndianRupee className="h-5 w-5" />}
//               tone="brand"
//             />
//             <KpiCard
//               label="Munafa"
//               value={inr(s.totalProfit)}
//               change={s.salesChange}
//               icon={<TrendingUp className="h-5 w-5" />}
//               tone="success"
//             />
//             <KpiCard
//               label="Total Bills"
//               value={String(s.totalBills)}
//               change={s.billsChange}
//               icon={<Receipt className="h-5 w-5" />}
//               tone="accent"
//             />
//             <KpiCard
//               label="Avg Bill"
//               value={inr(s.avgBill)}
//               icon={<BarChart3 className="h-5 w-5" />}
//               tone="warning"
//             />
//           </div>

//           {/* Trend chart */}
//           <TrendChart data={data.trend} />

//           {/* Payment + Category */}
//           <div className="grid gap-4 lg:grid-cols-2">
//             <PaymentBreakdown data={data.payments} />
//             <CategoryBreakdown data={data.categories} />
//           </div>

//           {/* Top Products + Customers */}
//           <div className="grid gap-4 lg:grid-cols-2">
//             <TopProducts data={data.topProducts} />
//             <TopCustomers data={data.topCustomers} />
//           </div>

//           {/* Day-wise table */}
//           <DayTable days={data.days} onExport={handleExport} />
//         </>
//       )}
//     </div>
//   );
// }

// // ===================== KPI CARD =====================
// function KpiCard({ label, value, change, icon, tone }: any) {
//   const tones: any = {
//     brand:   { bg: 'bg-brand-50',  text: 'text-brand-600',  ring: 'ring-brand-100' },
//     success: { bg: 'bg-lime-50',   text: 'text-lime-600',   ring: 'ring-lime-100' },
//     accent:  { bg: 'bg-accent-50', text: 'text-accent-600', ring: 'ring-accent-100' },
//     warning: { bg: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-100' }
//   };
//   const t = tones[tone];
//   const isPositive = change >= 0;

//   return (
//     <div className="card p-5">
//       <div className="flex items-start justify-between gap-3">
//         <div className="min-w-0">
//           <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//             {label}
//           </p>
//           <p className="mt-2 font-display text-2xl font-extrabold text-slate-900 truncate">
//             {value}
//           </p>
//           {change !== undefined && (
//             <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
//               isPositive ? 'bg-lime-100 text-lime-800' : 'bg-red-100 text-red-700'
//             }`}>
//               {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
//               {isPositive ? '+' : ''}{change.toFixed(1)}%
//               <span className="font-medium opacity-70">pichle period</span>
//             </div>
//           )}
//         </div>
//         <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 ${t.bg} ${t.text} ${t.ring}`}>
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ===================== TREND CHART (SVG) =====================
// // function TrendChart({ data }: { data: any[] }) {
// //   const [hover, setHover] = useState<number | null>(null);
// //   const [mode, setMode] = useState<'sales' | 'profit' | 'both'>('both');

// //   const W = 700, H = 260;
// //   const PAD = { top: 30, right: 16, bottom: 40, left: 16 };

// //   const { salesPts, profitPts, maxVal } = useMemo(() => {
// //     const max = Math.max(...data.map(d => Math.max(d.sales, d.profit)), 1);
// //     const innerW = W - PAD.left - PAD.right;
// //     const innerH = H - PAD.top - PAD.bottom;
// //     const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

// //     const sales = data.map((d, i) => ({
// //       x: PAD.left + i * step,
// //       y: PAD.top + innerH - (d.sales / max) * innerH,
// //       raw: d
// //     }));
// //     const profit = data.map((d, i) => ({
// //       x: PAD.left + i * step,
// //       y: PAD.top + innerH - (d.profit / max) * innerH,
// //       raw: d
// //     }));

// //     return { salesPts: sales, profitPts: profit, maxVal: max };
// //   }, [data]);

// //   const buildPath = (pts: any[]) => {
// //     if (pts.length === 0) return '';
// //     if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
// //     let d = `M ${pts[0].x} ${pts[0].y}`;
// //     for (let i = 0; i < pts.length - 1; i++) {
// //       const p0 = pts[i === 0 ? 0 : i - 1];
// //       const p1 = pts[i];
// //       const p2 = pts[i + 1];
// //       const p3 = pts[i + 2] ?? p2;
// //       const cp1x = p1.x + (p2.x - p0.x) / 6;
// //       const cp1y = p1.y + (p2.y - p0.y) / 6;
// //       const cp2x = p2.x - (p3.x - p1.x) / 6;
// //       const cp2y = p2.y - (p3.y - p1.y) / 6;
// //       d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
// //     }
// //     return d;
// //   };

// //   const salesPath = buildPath(salesPts);
// //   const profitPath = buildPath(profitPts);
// //   const salesArea = `${salesPath} L ${salesPts[salesPts.length - 1]?.x} ${H - PAD.bottom} L ${salesPts[0]?.x} ${H - PAD.bottom} Z`;
// //   const innerH = H - PAD.top - PAD.bottom;

// //   return (
// //     <div className="card overflow-hidden">
// //       <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 p-4">
// //         <div>
// //           <h3 className="font-display text-base font-bold text-slate-900">
// //             Kamai aur Munafa trend
// //           </h3>
// //           <p className="text-xs text-slate-500">{data.length} din ka data</p>
// //         </div>
// //         <div className="flex rounded-full border border-stone-200 bg-stone-50 p-0.5">
// //           {[
// //             { k: 'sales',  l: 'Kamai',   dot: 'bg-brand-500' },
// //             { k: 'profit', l: 'Munafa',  dot: 'bg-lime-500' },
// //             { k: 'both',   l: 'Dono',    dot: 'bg-gradient-to-r from-brand-500 to-lime-500' }
// //           ].map((m: any) => (
// //             <button
// //               key={m.k}
// //               onClick={() => setMode(m.k)}
// //               className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
// //                 mode === m.k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
// //               }`}
// //             >
// //               <span className={`h-2 w-2 rounded-full ${m.dot}`} />
// //               {m.l}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="p-3">
// //         <svg
// //           viewBox={`0 0 ${W} ${H}`}
// //           className="w-full"
// //           onMouseLeave={() => setHover(null)}
// //         >
// //           <defs>
// //             <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
// //               <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
// //               <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
// //             </linearGradient>
// //           </defs>

// //           {[0, 0.25, 0.5, 0.75, 1].map((p) => (
// //             <line
// //               key={p}
// //               x1={PAD.left}
// //               x2={W - PAD.right}
// //               y1={PAD.top + innerH * p}
// //               y2={PAD.top + innerH * p}
// //               stroke="#e7e5e4"
// //               strokeWidth="1"
// //               strokeDasharray="4 4"
// //             />
// //           ))}

// //           {(mode === 'sales' || mode === 'both') && (
// //             <>
// //               <path d={salesArea} fill="url(#salesGrad)" />
// //               <path d={salesPath} fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
// //             </>
// //           )}

// //           {(mode === 'profit' || mode === 'both') && (
// //             <path
// //               d={profitPath}
// //               fill="none"
// //               stroke="#84cc16"
// //               strokeWidth="3"
// //               strokeDasharray={mode === 'both' ? '6 4' : '0'}
// //               strokeLinecap="round"
// //             />
// //           )}

// //           {(mode === 'sales' || mode === 'both') && salesPts.map((p, i) => (
// //             <g key={`s${i}`}>
// //               <circle cx={p.x} cy={p.y} r={20} fill="transparent"
// //                 onMouseEnter={() => setHover(i)}
// //                 onTouchStart={() => setHover(i)} />
// //               <circle cx={p.x} cy={p.y} r={hover === i ? 6 : 3.5}
// //                 fill="#fff" stroke="#7c3aed" strokeWidth={hover === i ? 3 : 2} />
// //             </g>
// //           ))}

// //           {(mode === 'profit' || mode === 'both') && profitPts.map((p, i) => (
// //             <circle key={`p${i}`} cx={p.x} cy={p.y}
// //               r={hover === i ? 5 : 3}
// //               fill="#fff" stroke="#84cc16" strokeWidth={hover === i ? 3 : 2} />
// //           ))}

// //           {data.map((d, i) => {
// //             const step = Math.ceil(data.length / 8);
// //             if (i % step !== 0 && i !== data.length - 1) return null;
// //             return (
// //               <text key={i} x={salesPts[i]?.x ?? 0} y={H - 14}
// //                 textAnchor="middle"
// //                 className={`text-[9px] font-bold ${hover === i ? 'fill-brand-700' : 'fill-slate-400'}`}>
// //                 {d.label}
// //               </text>
// //             );
// //           })}
// //         </svg>

// //         {hover !== null && data[hover] && (
// //           <div className="mt-2 flex animate-fade-in items-center justify-between gap-2 rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100">
// //             <div>
// //               <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
// //                 {data[hover].fullLabel || data[hover].label}
// //               </p>
// //               <p className="font-display text-lg font-extrabold text-brand-900">
// //                 {inr(data[hover].sales)}
// //               </p>
// //             </div>
// //             <div className="text-right">
// //               <p className="text-[10px] font-bold uppercase tracking-wider text-lime-700">Munafa</p>
// //               <p className="font-display text-lg font-extrabold text-lime-900">
// //                 {inr(data[hover].profit)}
// //               </p>
// //             </div>
// //             <div className="text-right">
// //               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bills</p>
// //               <p className="font-display text-lg font-extrabold text-slate-900">
// //                 {data[hover].bills}
// //               </p>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// function TrendChart({ data }: { data: any[] }) {
//   const [hover, setHover] = useState<number | null>(null);
//   const [mode, setMode] = useState<'sales' | 'profit' | 'both'>('both');

//   const W = 700, H = 260;
//   const PAD = { top: 30, right: 16, bottom: 40, left: 16 };

//   // ============ EMPTY CHECK ============
//   const isEmpty = data.length === 0 || data.every(d => d.sales === 0 && d.profit === 0);

//   const { salesPts, profitPts, maxVal } = useMemo(() => {
//     const max = Math.max(...data.map(d => Math.max(d.sales, d.profit)), 1);
//     const innerW = W - PAD.left - PAD.right;
//     const innerH = H - PAD.top - PAD.bottom;
//     const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

//     const sales = data.map((d, i) => ({
//       x: PAD.left + i * step,
//       y: PAD.top + innerH - (d.sales / max) * innerH,
//       raw: d
//     }));
//     const profit = data.map((d, i) => ({
//       x: PAD.left + i * step,
//       y: PAD.top + innerH - (d.profit / max) * innerH,
//       raw: d
//     }));

//     return { salesPts: sales, profitPts: profit, maxVal: max };
//   }, [data]);

//   const buildPath = (pts: any[]) => {
//     if (pts.length === 0) return '';
//     if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
//     let d = `M ${pts[0].x} ${pts[0].y}`;
//     for (let i = 0; i < pts.length - 1; i++) {
//       const p0 = pts[i === 0 ? 0 : i - 1];
//       const p1 = pts[i];
//       const p2 = pts[i + 1];
//       const p3 = pts[i + 2] ?? p2;
//       const cp1x = p1.x + (p2.x - p0.x) / 6;
//       const cp1y = p1.y + (p2.y - p0.y) / 6;
//       const cp2x = p2.x - (p3.x - p1.x) / 6;
//       const cp2y = p2.y - (p3.y - p1.y) / 6;
//       d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
//     }
//     return d;
//   };

//   const salesPath = buildPath(salesPts);
//   const profitPath = buildPath(profitPts);
//   const salesArea = `${salesPath} L ${salesPts[salesPts.length - 1]?.x} ${H - PAD.bottom} L ${salesPts[0]?.x} ${H - PAD.bottom} Z`;
//   const innerH = H - PAD.top - PAD.bottom;

//   // ============ EMPTY STATE ============
//   if (isEmpty) {
//     return (
//       <div className="card overflow-hidden">
//         <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 p-4">
//           <div>
//             <h3 className="font-display text-base font-bold text-slate-900">
//               Kamai aur Munafa trend
//             </h3>
//             <p className="text-xs text-slate-500">
//               {data.length === 0 ? 'Koi data nahi' : `${data.length} din ka data`}
//             </p>
//           </div>
//         </div>
//         <div className="flex flex-col items-center justify-center py-14 text-center">
//           <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600">
//             <BarChart3 className="h-7 w-7" />
//           </div>
//           <p className="mt-4 font-display text-base font-bold text-slate-800">
//             Chart ready hai! 📊
//           </p>
//           <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
//             Jitne zyada din ka data hoga, utna behtar chart dikhega.
//             Roz bills banate rahein.
//           </p>
//           <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400">
//             <span>💡 Tip: 7 din ka data se chart start hota hai</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ============ MAIN CHART ============
//   return (
//     <div className="card overflow-hidden">
//       <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 p-4">
//         <div>
//           <h3 className="font-display text-base font-bold text-slate-900">
//             Kamai aur Munafa trend
//           </h3>
//           <p className="text-xs text-slate-500">{data.length} din ka data</p>
//         </div>
//         <div className="flex rounded-full border border-stone-200 bg-stone-50 p-0.5">
//           {[
//             { k: 'sales',  l: 'Kamai',   dot: 'bg-brand-500' },
//             { k: 'profit', l: 'Munafa',  dot: 'bg-lime-500' },
//             { k: 'both',   l: 'Dono',    dot: 'bg-gradient-to-r from-brand-500 to-lime-500' }
//           ].map((m: any) => (
//             <button
//               key={m.k}
//               onClick={() => setMode(m.k)}
//               className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
//                 mode === m.k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
//               }`}
//             >
//               <span className={`h-2 w-2 rounded-full ${m.dot}`} />
//               {m.l}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="p-3">
//         <svg
//           viewBox={`0 0 ${W} ${H}`}
//           className="w-full"
//           onMouseLeave={() => setHover(null)}
//         >
//           <defs>
//             <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
//               <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
//             </linearGradient>
//           </defs>

//           {[0, 0.25, 0.5, 0.75, 1].map((p) => (
//             <line
//               key={p}
//               x1={PAD.left}
//               x2={W - PAD.right}
//               y1={PAD.top + innerH * p}
//               y2={PAD.top + innerH * p}
//               stroke="#e7e5e4"
//               strokeWidth="1"
//               strokeDasharray="4 4"
//             />
//           ))}

//           {(mode === 'sales' || mode === 'both') && (
//             <>
//               <path d={salesArea} fill="url(#salesGrad)" />
//               <path d={salesPath} fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
//             </>
//           )}

//           {(mode === 'profit' || mode === 'both') && (
//             <path
//               d={profitPath}
//               fill="none"
//               stroke="#84cc16"
//               strokeWidth="3"
//               strokeDasharray={mode === 'both' ? '6 4' : '0'}
//               strokeLinecap="round"
//             />
//           )}

//           {(mode === 'sales' || mode === 'both') && salesPts.map((p, i) => (
//             <g key={`s${i}`}>
//               <circle cx={p.x} cy={p.y} r={20} fill="transparent"
//                 onMouseEnter={() => setHover(i)}
//                 onTouchStart={() => setHover(i)} />
//               <circle cx={p.x} cy={p.y} r={hover === i ? 6 : 3.5}
//                 fill="#fff" stroke="#7c3aed" strokeWidth={hover === i ? 3 : 2} />
//             </g>
//           ))}

//           {(mode === 'profit' || mode === 'both') && profitPts.map((p, i) => (
//             <circle key={`p${i}`} cx={p.x} cy={p.y}
//               r={hover === i ? 5 : 3}
//               fill="#fff" stroke="#84cc16" strokeWidth={hover === i ? 3 : 2} />
//           ))}

//           {data.map((d, i) => {
//             const step = Math.ceil(data.length / 8);
//             if (i % step !== 0 && i !== data.length - 1) return null;
//             return (
//               <text key={i} x={salesPts[i]?.x ?? 0} y={H - 14}
//                 textAnchor="middle"
//                 className={`text-[9px] font-bold ${hover === i ? 'fill-brand-700' : 'fill-slate-400'}`}>
//                 {d.label}
//               </text>
//             );
//           })}
//         </svg>

//         {hover !== null && data[hover] && (
//           <div className="mt-2 flex animate-fade-in items-center justify-between gap-2 rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100">
//             <div>
//               <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
//                 {data[hover].fullLabel || data[hover].label}
//               </p>
//               <p className="font-display text-lg font-extrabold text-brand-900">
//                 {inr(data[hover].sales)}
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-[10px] font-bold uppercase tracking-wider text-lime-700">Munafa</p>
//               <p className="font-display text-lg font-extrabold text-lime-900">
//                 {inr(data[hover].profit)}
//               </p>
//             </div>
//             <div className="text-right">
//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bills</p>
//               <p className="font-display text-lg font-extrabold text-slate-900">
//                 {data[hover].bills}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// // ===================== PAYMENT BREAKDOWN =====================
// function PaymentBreakdown({ data }: any) {
//   const total = data.reduce((s: number, p: any) => s + p.amount, 0) || 1;
//   const META: any = {
//     cash:   { emoji: '💵', label: 'Cash',   color: 'bg-lime-500',   text: 'text-lime-700' },
//     upi:    { emoji: '📱', label: 'UPI',    color: 'bg-brand-500',  text: 'text-brand-700' },
//     card:   { emoji: '💳', label: 'Card',   color: 'bg-accent-500', text: 'text-accent-700' },
//     udhaar: { emoji: '📝', label: 'Udhaar', color: 'bg-red-500',    text: 'text-red-700' },
//     split:  { emoji: '🔀', label: 'Split',  color: 'bg-slate-500',  text: 'text-slate-700' }
//   };

//   return (
//     <div className="card overflow-hidden">
//       <div className="flex items-center gap-2 border-b border-stone-100 p-4">
//         <Wallet className="h-4 w-4 text-brand-600" />
//         <h3 className="font-display text-base font-bold text-slate-900">
//           Payment Breakdown
//         </h3>
//       </div>
//       {data.length === 0 ? (
//         <div className="p-10 text-center text-sm text-slate-500">Koi data nahi</div>
//       ) : (
//         <ul className="divide-y divide-stone-100">
//           {data.map((p: any) => {
//             const m = META[p.mode] || { emoji: '💵', label: p.mode, color: 'bg-slate-500', text: 'text-slate-700' };
//             const pct = (p.amount / total) * 100;
//             return (
//               <li key={p.mode} className="p-4">
//                 <div className="flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     <span className="text-lg">{m.emoji}</span>
//                     <div>
//                       <p className="text-sm font-bold text-slate-900">{m.label}</p>
//                       <p className="text-[10px] text-slate-500">{p.count} bills</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className={`font-display text-base font-extrabold ${m.text}`}>
//                       {inr(p.amount)}
//                     </p>
//                     <p className="text-[10px] font-bold text-slate-400">{pct.toFixed(0)}%</p>
//                   </div>
//                 </div>
//                 <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
//                   <div className={`h-full rounded-full ${m.color}`} style={{ width: `${pct}%` }} />
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }

// // ===================== CATEGORY BREAKDOWN =====================
// function CategoryBreakdown({ data }: any) {
//   const COLORS = ['bg-brand-500', 'bg-accent-500', 'bg-lime-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
//   const total = data.reduce((s: number, c: any) => s + c.revenue, 0) || 1;

//   return (
//     <div className="card overflow-hidden">
//       <div className="flex items-center gap-2 border-b border-stone-100 p-4">
//         <PieChart className="h-4 w-4 text-brand-600" />
//         <h3 className="font-display text-base font-bold text-slate-900">
//           Category-wise Kamai
//         </h3>
//       </div>
//       {data.length === 0 ? (
//         <div className="p-10 text-center text-sm text-slate-500">Koi data nahi</div>
//       ) : (
//         <ul className="divide-y divide-stone-100">
//           {data.map((c: any, i: number) => {
//             const pct = (c.revenue / total) * 100;
//             return (
//               <li key={c.category} className="p-4">
//                 <div className="flex items-center justify-between gap-3">
//                   <div className="flex items-center gap-2">
//                     <span className={`h-3 w-3 rounded-full ${COLORS[i % COLORS.length]}`} />
//                     <div>
//                       <p className="text-sm font-bold text-slate-900">{c.category}</p>
//                       <p className="text-[10px] text-slate-500">{c.items} items</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-display text-sm font-extrabold text-slate-900">
//                       {inr(c.revenue)}
//                     </p>
//                     <p className="text-[10px] font-bold text-slate-400">{pct.toFixed(0)}%</p>
//                   </div>
//                 </div>
//                 <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
//                   <div className={`h-full rounded-full ${COLORS[i % COLORS.length]}`} style={{ width: `${pct}%` }} />
//                 </div>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }

// // ===================== TOP PRODUCTS =====================
// function TopProducts({ data }: any) {
//   const max = Math.max(...data.map((p: any) => p.revenue), 1);

//   return (
//     <div className="card overflow-hidden">
//       <div className="flex items-center gap-2 border-b border-stone-100 p-4">
//         <Package className="h-4 w-4 text-accent-600" />
//         <h3 className="font-display text-base font-bold text-slate-900">Top Products</h3>
//       </div>
//       {data.length === 0 ? (
//         <div className="p-10 text-center text-sm text-slate-500">Koi data nahi</div>
//       ) : (
//         <ul className="divide-y divide-stone-100">
//           {data.slice(0, 5).map((p: any, i: number) => (
//             <li key={p.id || i} className="p-4">
//               <div className="flex items-center gap-3">
//                 <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
//                   i === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-sm' :
//                   i === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-white' :
//                   i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
//                   'bg-stone-100 text-slate-600'
//                 }`}>
//                   {i + 1}
//                 </span>
//                 <div className="min-w-0 flex-1">
//                   <div className="flex items-center justify-between gap-2">
//                     <p className="truncate text-sm font-bold text-slate-900">{p.name}</p>
//                     <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
//                       {inr(p.revenue)}
//                     </p>
//                   </div>
//                   <div className="mt-1 flex items-center gap-2">
//                     <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-100">
//                       <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
//                         style={{ width: `${(p.revenue / max) * 100}%` }} />
//                     </div>
//                     <span className="shrink-0 text-[10px] font-bold text-lime-600">
//                       +{inr(p.profit)}
//                     </span>
//                   </div>
//                   <p className="mt-1 text-[10px] text-slate-400">
//                     {p.quantity} qty biki
//                   </p>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// // ===================== TOP CUSTOMERS =====================
// function TopCustomers({ data }: any) {
//   return (
//     <div className="card overflow-hidden">
//       <div className="flex items-center gap-2 border-b border-stone-100 p-4">
//         <Users className="h-4 w-4 text-brand-600" />
//         <h3 className="font-display text-base font-bold text-slate-900">Top Grahak</h3>
//       </div>
//       {data.length === 0 ? (
//         <div className="p-10 text-center text-sm text-slate-500">Koi data nahi</div>
//       ) : (
//         <ul className="divide-y divide-stone-100">
//           {data.slice(0, 5).map((c: any) => (
//             <li key={c.id} className="flex items-center gap-3 p-4">
//               <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
//                 {c.name.charAt(0).toUpperCase()}
//               </span>
//               <div className="min-w-0 flex-1">
//                 <p className="truncate text-sm font-bold text-slate-900">{c.name}</p>
//                 <p className="truncate font-mono text-[10px] text-slate-500">
//                   {c.mobile} • {c.bills} bills
//                 </p>
//               </div>
//               <div className="shrink-0 text-right">
//                 <p className="font-display text-sm font-extrabold text-slate-900">
//                   {inr(c.business)}
//                 </p>
//                 {c.pending > 0 && (
//                   <p className="text-[10px] font-bold text-red-500">
//                     Baki {inr(c.pending)}
//                   </p>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// // ===================== DAY TABLE =====================
// function DayTable({ days, onExport }: any) {
//   const totals = days.reduce(
//     (acc: any, d: any) => ({
//       sales: acc.sales + d.sales,
//       profit: acc.profit + d.profit,
//       bills: acc.bills + d.bills
//     }),
//     { sales: 0, profit: 0, bills: 0 }
//   );

//   return (
//     <div className="card overflow-hidden">
//       <div className="flex items-center justify-between gap-2 border-b border-stone-100 p-4">
//         <div className="flex items-center gap-2">
//           <CalendarDays className="h-4 w-4 text-brand-600" />
//           <h3 className="font-display text-base font-bold text-slate-900">
//             Din-wise Breakdown
//           </h3>
//         </div>
//         <button onClick={onExport} className="btn-ghost btn-sm">
//           <Download className="h-3.5 w-3.5" />
//           CSV
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-stone-100 bg-stone-50/60 text-left">
//               <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Tarikh</th>
//               <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Kamai</th>
//               <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Munafa</th>
//               <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Bills</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-stone-100">
//             {days.map((d: any) => (
//               <tr key={d.date} className="hover:bg-stone-50/60">
//                 <td className="px-4 py-3 text-xs font-semibold text-slate-700">{d.label}</td>
//                 <td className="px-4 py-3 text-right text-xs font-bold text-slate-900 tabular-nums">
//                   {inr(d.sales)}
//                 </td>
//                 <td className="px-4 py-3 text-right text-xs font-bold text-lime-700 tabular-nums">
//                   {inr(d.profit)}
//                 </td>
//                 <td className="px-4 py-3 text-right text-xs font-semibold text-slate-600 tabular-nums">
//                   {d.bills}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot>
//             <tr className="border-t-2 border-stone-200 bg-brand-50/40">
//               <td className="px-4 py-3 text-xs font-extrabold text-slate-900">Total</td>
//               <td className="px-4 py-3 text-right text-xs font-extrabold text-brand-700 tabular-nums">
//                 {inr(totals.sales)}
//               </td>
//               <td className="px-4 py-3 text-right text-xs font-extrabold text-lime-700 tabular-nums">
//                 {inr(totals.profit)}
//               </td>
//               <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-900 tabular-nums">
//                 {totals.bills}
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from 'react';
import {
  IndianRupee, TrendingUp, TrendingDown, Receipt, BarChart3,
  Wallet, Package, Users, PieChart, CalendarDays, Download,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { inr } from '@/lib/format';
import { api } from '@/lib/api';

type RangeKey = 'today' | 'yesterday' | '7d' | '30d' | 'month';

const RANGES: { k: RangeKey; l: string }[] = [
  { k: 'today', l: 'Aaj' },
  { k: 'yesterday', l: 'Kal' },
  { k: '7d', l: '7 Din' },
  { k: '30d', l: '30 Din' },
  { k: 'month', l: 'Is Mahine' }
];

function rangeToDates(range: RangeKey): { from: string; to: string } {
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
  const f = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from: startOf(f).toISOString(), to: endOf(now).toISOString() };
}

export default function ReportsPage() {
  const [range, setRange] = useState<RangeKey>('7d');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { from, to } = rangeToDates(range);
      const d = await api.get(
        `/api/reports?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
      );
      setData(d);
    } catch (err: any) {
      toast.error(err.message || 'Report load nahi hui');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [range]);

  const handleExport = () => {
    if (!data) return;
    const rows: any[] = [
      ['BazaarBook — Kamai Report'],
      ['Range', RANGES.find((r) => r.k === range)?.l || range],
      [],
      ['Summary'],
      ['Total Kamai', data.stats.totalSales],
      ['Total Munafa', data.stats.totalProfit],
      ['Bills', data.stats.totalBills],
      ['Avg Bill', data.stats.avgBill],
      [],
      ['Din-wise'],
      ['Date', 'Sales', 'Profit', 'Bills'],
      ...data.days.map((d: any) => [d.label, d.sales, d.profit, d.bills]),
      [],
      ['Top Products'],
      ['Name', 'Quantity', 'Revenue'],
      ...data.topProducts.map((p: any) => [p.name, p.quantity, p.revenue])
    ];
    const csv = '\uFEFF' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report download ho gayi');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded-full bg-stone-200" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="card h-28 animate-pulse" />)}
        </div>
        <div className="card h-80 animate-pulse" />
      </div>
    );
  }

  if (!data) return <div className="card p-10 text-center">Report load nahi hui</div>;

  const s = data.stats;
  const hasData = s.totalBills > 0;

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Kamai Report
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Kamai, munafa aur sales ka poora hisaab
          </p>
        </div>
        {hasData && (
          <button onClick={handleExport} className="btn-outline btn-md">
            <Download className="h-4 w-4" />
            Download
          </button>
        )}
      </div>

      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">
        {RANGES.map((r) => (
          <button
            key={r.k}
            onClick={() => setRange(r.k)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-bold transition ${
              range === r.k
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-stone-200 bg-white text-slate-600 hover:border-stone-300'
            }`}
          >
            {r.l}
          </button>
        ))}
      </div>

      {!hasData ? (
        <div className="card p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-brand-50 text-brand-600">
            <BarChart3 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-lg font-bold">
            Is period mein koi bill nahi
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Doosra range try karein ya bill banayein
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Total Kamai"
              value={inr(s.totalSales)}
              change={s.salesChange}
              icon={<IndianRupee className="h-5 w-5" />}
              tone="brand"
            />
            <KpiCard
              label="Munafa"
              value={inr(s.totalProfit)}
              change={s.salesChange}
              icon={<TrendingUp className="h-5 w-5" />}
              tone="success"
            />
            <KpiCard
              label="Total Bills"
              value={String(s.totalBills)}
              change={s.billsChange}
              icon={<Receipt className="h-5 w-5" />}
              tone="accent"
            />
            <KpiCard
              label="Avg Bill"
              value={inr(s.avgBill)}
              icon={<BarChart3 className="h-5 w-5" />}
              tone="warning"
            />
          </div>

          <TrendChart data={data.trend} />

          <div className="grid gap-4 lg:grid-cols-2">
            <PaymentBreakdown data={data.payments} />
            <CategoryBreakdown data={data.categories} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <TopProducts data={data.topProducts} />
            <TopCustomers data={data.topCustomers} />
          </div>

          <DayTable days={data.days} onExport={handleExport} />
        </>
      )}
    </div>
  );
}

function KpiCard({ label, value, change, icon, tone }: any) {
  const tones: any = {
    brand:   { bg: 'bg-brand-50',  text: 'text-brand-600',  ring: 'ring-brand-100' },
    success: { bg: 'bg-lime-50',   text: 'text-lime-600',   ring: 'ring-lime-100' },
    accent:  { bg: 'bg-accent-50', text: 'text-accent-600', ring: 'ring-accent-100' },
    warning: { bg: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-100' }
  };
  const t = tones[tone];
  const isPositive = change >= 0;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900 truncate">{value}</p>
          {change !== undefined && (
            <div className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isPositive ? 'bg-lime-100 text-lime-800' : 'bg-red-100 text-red-700'
            }`}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {isPositive ? '+' : ''}{change.toFixed(1)}%
            </div>
          )}
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 ${t.bg} ${t.text} ${t.ring}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function TrendChart({ data }: { data: any[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const [mode, setMode] = useState<'sales' | 'profit' | 'both'>('both');
  const W = 700, H = 260;
  const PAD = { top: 30, right: 16, bottom: 40, left: 16 };

  const isEmpty = data.length === 0 || data.every((d) => d.sales === 0 && d.profit === 0);

  const { salesPts, profitPts, maxVal } = useMemo(() => {
    const max = Math.max(...data.map((d) => Math.max(d.sales, d.profit)), 1);
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

    const sales = data.map((d, i) => ({
      x: PAD.left + i * step,
      y: PAD.top + innerH - (d.sales / max) * innerH,
      raw: d
    }));
    const profit = data.map((d, i) => ({
      x: PAD.left + i * step,
      y: PAD.top + innerH - (d.profit / max) * innerH,
      raw: d
    }));
    return { salesPts: sales, profitPts: profit, maxVal: max };
  }, [data]);

  const buildPath = (pts: any[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const salesPath = buildPath(salesPts);
  const profitPath = buildPath(profitPts);
  const salesArea = `${salesPath} L ${salesPts[salesPts.length - 1]?.x} ${H - PAD.bottom} L ${salesPts[0]?.x} ${H - PAD.bottom} Z`;
  const innerH = H - PAD.top - PAD.bottom;

  if (isEmpty) {
    return (
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 p-4">
          <div>
            <h3 className="font-display text-base font-bold text-slate-900">
              Kamai aur Munafa trend
            </h3>
            <p className="text-xs text-slate-500">
              {data.length === 0 ? 'Koi data nahi' : `${data.length} din ka data`}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600">
            <BarChart3 className="h-7 w-7" />
          </div>
          <p className="mt-4 font-display text-base font-bold text-slate-800">
            Chart ready hai! 📊
          </p>
          <p className="mx-auto mt-1 max-w-xs text-xs text-slate-500">
            Jitne zyada din ka data hoga, utna behtar chart dikhega.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 p-4">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900">
            Kamai aur Munafa trend
          </h3>
          <p className="text-xs text-slate-500">{data.length} din ka data</p>
        </div>
        <div className="flex rounded-full border border-stone-200 bg-stone-50 p-0.5">
          {[
            { k: 'sales', l: 'Kamai', dot: 'bg-brand-500' },
            { k: 'profit', l: 'Munafa', dot: 'bg-lime-500' },
            { k: 'both', l: 'Dono', dot: 'bg-gradient-to-r from-brand-500 to-lime-500' }
          ].map((m: any) => (
            <button
              key={m.k}
              onClick={() => setMode(m.k)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
                mode === m.k ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${m.dot}`} />
              {m.l}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={PAD.top + innerH * p}
              y2={PAD.top + innerH * p}
              stroke="#e7e5e4"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {(mode === 'sales' || mode === 'both') && (
            <>
              <path d={salesArea} fill="url(#salesGrad)" />
              <path d={salesPath} fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
            </>
          )}

          {(mode === 'profit' || mode === 'both') && (
            <path
              d={profitPath}
              fill="none"
              stroke="#84cc16"
              strokeWidth="3"
              strokeDasharray={mode === 'both' ? '6 4' : '0'}
              strokeLinecap="round"
            />
          )}

          {(mode === 'sales' || mode === 'both') && salesPts.map((p, i) => (
            <g key={`s${i}`}>
              <circle cx={p.x} cy={p.y} r={20} fill="transparent"
                onMouseEnter={() => setHover(i)}
                onTouchStart={() => setHover(i)} />
              <circle cx={p.x} cy={p.y} r={hover === i ? 6 : 3.5}
                fill="#fff" stroke="#7c3aed" strokeWidth={hover === i ? 3 : 2} />
            </g>
          ))}

          {(mode === 'profit' || mode === 'both') && profitPts.map((p, i) => (
            <circle key={`p${i}`} cx={p.x} cy={p.y}
              r={hover === i ? 5 : 3}
              fill="#fff" stroke="#84cc16" strokeWidth={hover === i ? 3 : 2} />
          ))}

          {data.map((d, i) => {
            const step = Math.ceil(data.length / 8);
            if (i % step !== 0 && i !== data.length - 1) return null;
            return (
              <text key={i} x={salesPts[i]?.x ?? 0} y={H - 14}
                textAnchor="middle"
                className={`text-[9px] font-bold ${hover === i ? 'fill-brand-700' : 'fill-slate-400'}`}>
                {d.label}
              </text>
            );
          })}
        </svg>

        {hover !== null && data[hover] && (
          <div className="mt-2 flex animate-fade-in items-center justify-between gap-2 rounded-2xl bg-brand-50 p-3 ring-1 ring-brand-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                {data[hover].fullLabel || data[hover].label}
              </p>
              <p className="font-display text-lg font-extrabold text-brand-900">
                {inr(data[hover].sales)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-lime-700">Munafa</p>
              <p className="font-display text-lg font-extrabold text-lime-900">
                {inr(data[hover].profit)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Bills</p>
              <p className="font-display text-lg font-extrabold text-slate-900">
                {data[hover].bills}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentBreakdown({ data }: any) {
  const total = data.reduce((s: number, p: any) => s + p.amount, 0) || 1;
  const META: any = {
    cash:   { emoji: '💵', label: 'Cash',   color: 'bg-lime-500',   text: 'text-lime-700' },
    upi:    { emoji: '📱', label: 'UPI',    color: 'bg-brand-500',  text: 'text-brand-700' },
    card:   { emoji: '💳', label: 'Card',   color: 'bg-accent-500', text: 'text-accent-700' },
    udhaar: { emoji: '📝', label: 'Udhaar', color: 'bg-red-500',    text: 'text-red-700' }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-stone-100 p-4">
        <Wallet className="h-4 w-4 text-brand-600" />
        <h3 className="font-display text-base font-bold text-slate-900">
          Payment Breakdown
        </h3>
      </div>
      {data.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-500">Koi data nahi</div>
      ) : (
        <ul className="divide-y divide-stone-100">
          {data.map((p: any) => {
            const m = META[p.mode] || META.cash;
            const pct = (p.amount / total) * 100;
            return (
              <li key={p.mode} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{m.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{m.label}</p>
                      <p className="text-[10px] text-slate-500">{p.count} bills</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-base font-extrabold ${m.text}`}>
                      {inr(p.amount)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">{pct.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function CategoryBreakdown({ data }: any) {
  const COLORS = ['bg-brand-500', 'bg-accent-500', 'bg-lime-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
  const total = data.reduce((s: number, c: any) => s + c.revenue, 0) || 1;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-stone-100 p-4">
        <PieChart className="h-4 w-4 text-brand-600" />
        <h3 className="font-display text-base font-bold text-slate-900">
          Category-wise Kamai
        </h3>
      </div>
      {data.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-500">Koi data nahi</div>
      ) : (
        <ul className="divide-y divide-stone-100">
          {data.map((c: any, i: number) => {
            const pct = (c.revenue / total) * 100;
            return (
              <li key={c.category} className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${COLORS[i % COLORS.length]}`} />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{c.category}</p>
                      <p className="text-[10px] text-slate-500">{c.items} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm font-extrabold text-slate-900">
                      {inr(c.revenue)}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">{pct.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-100">
                  <div className={`h-full rounded-full ${COLORS[i % COLORS.length]}`} style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function TopProducts({ data }: any) {
  const max = Math.max(...data.map((p: any) => p.revenue), 1);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-stone-100 p-4">
        <Package className="h-4 w-4 text-accent-600" />
        <h3 className="font-display text-base font-bold text-slate-900">Top Products</h3>
      </div>
      {data.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-500">Koi data nahi</div>
      ) : (
        <ul className="divide-y divide-stone-100">
          {data.slice(0, 5).map((p: any, i: number) => (
            <li key={p.id || i} className="p-4">
              <div className="flex items-center gap-3">
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                  i === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white' :
                  i === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-white' :
                  i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                  'bg-stone-100 text-slate-600'
                }`}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">{p.name}</p>
                    <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
                      {inr(p.revenue)}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-stone-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                        style={{ width: `${(p.revenue / max) * 100}%` }} />
                    </div>
                    <span className="shrink-0 text-[10px] font-bold text-lime-600">
                      +{inr(p.profit)}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-slate-400">{p.quantity} qty biki</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TopCustomers({ data }: any) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-stone-100 p-4">
        <Users className="h-4 w-4 text-brand-600" />
        <h3 className="font-display text-base font-bold text-slate-900">Top Grahak</h3>
      </div>
      {data.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-500">Koi data nahi</div>
      ) : (
        <ul className="divide-y divide-stone-100">
          {data.slice(0, 5).map((c: any) => (
            <li key={c.id} className="flex items-center gap-3 p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                {c.name.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900">{c.name}</p>
                <p className="truncate font-mono text-[10px] text-slate-500">
                  {c.mobile} • {c.bills} bills
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-display text-sm font-extrabold text-slate-900">
                  {inr(c.business)}
                </p>
                {c.pending > 0 && (
                  <p className="text-[10px] font-bold text-red-500">
                    Baki {inr(c.pending)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DayTable({ days, onExport }: any) {
  const totals = days.reduce(
    (acc: any, d: any) => ({
      sales: acc.sales + d.sales,
      profit: acc.profit + d.profit,
      bills: acc.bills + d.bills
    }),
    { sales: 0, profit: 0, bills: 0 }
  );

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-stone-100 p-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-brand-600" />
          <h3 className="font-display text-base font-bold text-slate-900">
            Din-wise Breakdown
          </h3>
        </div>
        <button onClick={onExport} className="btn-ghost btn-sm">
          <Download className="h-3.5 w-3.5" />
          CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/60 text-left">
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">Tarikh</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Kamai</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Munafa</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Bills</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {days.map((d: any) => (
              <tr key={d.date} className="hover:bg-stone-50/60">
                <td className="px-4 py-3 text-xs font-semibold text-slate-700">{d.label}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-slate-900 tabular-nums">
                  {inr(d.sales)}
                </td>
                <td className="px-4 py-3 text-right text-xs font-bold text-lime-700 tabular-nums">
                  {inr(d.profit)}
                </td>
                <td className="px-4 py-3 text-right text-xs font-semibold text-slate-600 tabular-nums">
                  {d.bills}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-stone-200 bg-brand-50/40">
              <td className="px-4 py-3 text-xs font-extrabold text-slate-900">Total</td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-brand-700 tabular-nums">
                {inr(totals.sales)}
              </td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-lime-700 tabular-nums">
                {inr(totals.profit)}
              </td>
              <td className="px-4 py-3 text-right text-xs font-extrabold text-slate-900 tabular-nums">
                {totals.bills}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}