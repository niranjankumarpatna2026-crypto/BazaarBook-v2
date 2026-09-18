// import { useEffect, useMemo, useState } from 'react';
// import {
//   Crown, Check, Sparkles, IndianRupee, Receipt, RefreshCw,
//   Download, AlertCircle, Wallet, TrendingUp, ChevronDown,
//   HelpCircle, Zap, Star
// } from 'lucide-react';
// import { toast } from 'sonner';
// import { inr, dateHi } from '@/lib/format';
// import { useAuth } from '@/context/AuthContext';
// import { api } from '@/lib/api';

// // ============ PLANS DATA ============
// const PLANS = [
//   {
//     code: 'free',
//     name: 'Free',
//     tagline: 'Shuru karne ke liye',
//     emoji: '🌱',
//     monthly: 0,
//     yearly: 0,
//     features: [
//       '20 bills / mahina',
//       '50 products',
//       '25 customers',
//       'Basic dashboard',
//       'WhatsApp bill share'
//     ],
//     limits: { bills: 20, products: 50, customers: 25 }
//   },
//   {
//     code: 'starter',
//     name: 'Starter',
//     tagline: 'Chhoti dukaan ke liye',
//     emoji: '🚀',
//     monthly: 99,
//     yearly: 950,
//     features: [
//       '200 bills / mahina',
//       '500 products',
//       '200 customers',
//       'Khata book + reminders',
//       'Kamai report',
//       'CSV export'
//     ],
//     limits: { bills: 200, products: 500, customers: 200 }
//   },
//   {
//     code: 'pro',
//     name: 'Pro',
//     tagline: 'Sabse popular',
//     emoji: '⭐',
//     monthly: 249,
//     yearly: 2390,
//     popular: true,
//     features: [
//       'Unlimited bills',
//       'Unlimited products',
//       'Unlimited customers',
//       'GST billing',
//       'Thermal print',
//       'Advanced reports',
//       '2 staff accounts',
//       'Priority WhatsApp support'
//     ],
//     limits: { bills: -1, products: -1, customers: -1 }
//   },
//   {
//     code: 'business',
//     name: 'Business',
//     tagline: 'Badhi dukaan ke liye',
//     emoji: '👑',
//     monthly: 599,
//     yearly: 5750,
//     features: [
//       'Sab kuch Pro mein',
//       'Multi-shop support (3)',
//       'Unlimited staff',
//       'Barcode scanning',
//       'Custom bill template',
//       'API access',
//       'Dedicated account manager',
//       'Phone + WhatsApp support'
//     ],
//     limits: { bills: -1, products: -1, customers: -1 }
//   }
// ] as const;

// type PlanCode = 'free' | 'starter' | 'pro' | 'business';

// // ============ FAQ ============
// const FAQS = [
//   {
//     q: 'Kya main kabhi bhi plan badal sakta hoon?',
//     a: 'Haan. Aap kabhi bhi upgrade kar sakte hain — turant apply ho jayega. Downgrade agle billing cycle se hoga.'
//   },
//   {
//     q: 'Payment ke kaun se options hain?',
//     a: 'Razorpay ke through UPI (PhonePe, GPay, Paytm), Credit/Debit Card, Net Banking — sab supported hain.'
//   },
//   {
//     q: 'Auto-renew kaise kaam karta hai?',
//     a: 'Auto-renew ON karein toh expiry se pehle automatically renew ho jayega. OFF karein toh manually renew karna hoga.'
//   },
//   {
//     q: 'Kya refund milta hai?',
//     a: '7 din ke andar full refund. Baad mein nahi. Refund ke liye support par contact karein.'
//   },
//   {
//     q: 'Yearly plan mein kitni bachat hoti hai?',
//     a: 'Yearly plan par 20% tak bachat — jaise Pro monthly ₹249, yearly ₹199/mahina.'
//   },
//   {
//     q: 'Free plan mein kitne bills bana sakte hain?',
//     a: 'Free plan mein 20 bills/mahina, 50 products aur 25 customers tak.'
//   }
// ];

// // ============ MAIN COMPONENT ============
// export default function SubscriptionPage() {
//   const token = localStorage.getItem('bb_token');
//   const { user, updateUser } = useAuth();

//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
//   const [processing, setProcessing] = useState(false);
//   const [openFaq, setOpenFaq] = useState<number | null>(0);

//   // ============ LOAD ============
//   const load = async () => {
//     setLoading(true);
//     try {
//       // const r = await fetch('/api/subscription/current', {
//       //   headers: { Authorization: 'Bearer ' + token }
//       // });
//       // if (r.ok) setData(await r.json());
//       const d = await api.get('/api/subscription/current');
// setData(d);
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };

//   useEffect(() => { load(); }, []);

//   // ============ RAZORPAY CHECKOUT ============
//   const handleSelectPlan = async (plan: any) => {
//     if (processing) return;

//     // Free plan — no payment
//     if (plan.monthly === 0) {
//       toast.info('Free plan already active hai');
//       return;
//     }

//     setProcessing(true);
//     try {
//       // Load Razorpay script
//       if (!(window as any).Razorpay) {
//         await new Promise<void>((resolve, reject) => {
//           const s = document.createElement('script');
//           s.src = 'https://checkout.razorpay.com/v1/checkout.js';
//           s.onload = () => resolve();
//           s.onerror = () => reject(new Error('Razorpay script load fail'));
//           document.body.appendChild(s);
//         });
//       }

//       // Create order
//       // const orderRes = await fetch('/api/subscription/create-order', {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //     Authorization: 'Bearer ' + token
//       //   },
//       //   body: JSON.stringify({
//       //     planCode: plan.code,
//       //     billingCycle: billing
//       //   })
//       // });

//       // const orderData = await orderRes.json();
//       // if (!orderRes.ok) throw new Error(orderData.error || 'Order create nahi hua');

//       const orderData = await api.post('/api/subscription/create-order', {
//   planCode: plan.code,
//   billingCycle: billing
// });

//       // Open Razorpay
//       const rzp = new (window as any).Razorpay({
//         key: orderData.keyId,
//         amount: orderData.amount,
//         currency: orderData.currency,
//         order_id: orderData.orderId,
//         name: 'BazaarBook',
//         description: `${plan.name} — ${billing === 'yearly' ? 'Yearly' : 'Monthly'}`,
//         prefill: {
//           name: user?.ownerName,
//           email: user?.email,
//           contact: user?.mobile
//         },
//         theme: { color: '#7c3aed' },
// handler: async (response: any) => {
//   try {
//     // const verifyRes = await fetch('/api/subscription/verify', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //     Authorization: 'Bearer ' + token
//     //   },
//     //   body: JSON.stringify({
//     //     ...response,
//     //     planCode: plan.code,
//     //     billingCycle: billing
//     //   })
//     // });
//     // const verifyData = await verifyRes.json();
//     // if (!verifyRes.ok) throw new Error(verifyData.error);
//     await api.post('/api/subscription/verify', {
//   ...response,
//   planCode: plan.code,
//   billingCycle: billing
// });
//     toast.success(`🎉 ${plan.name} active ho gaya!`);
//     updateUser({ plan: plan.code });
//     await load();
//   } catch (e: any) {
//     toast.error(e.message || 'Verify nahi hua');
//   } finally {
//     setProcessing(false);  // ← YE LINE ADD KARO
//   }
// },
//         modal: {
//           ondismiss: () => {
//             toast.info('Payment cancel kiya gaya');
//             setProcessing(false);
//           }
//         }
//       });

//       rzp.on('payment.failed', (resp: any) => {
//         toast.error(resp.error?.description || 'Payment fail ho gaya');
//         setProcessing(false);
//       });

//       rzp.open();
//     } catch (e: any) {
//       toast.error(e.message || 'Checkout error');
//       setProcessing(false);
//     }
//   };

//   // ============ AUTO-RENEW ============
//   const handleToggleAutoRenew = async () => {
//   const current = data?.subscription?.autoRenew || false;
//   const newVal = !current;

//   // Optimistic update — turant UI badal do
//   setData((prev: any) => prev ? {
//     ...prev,
//     subscription: { ...prev.subscription, autoRenew: newVal }
//   } : prev);

//   try {
//     const r = await fetch('/api/subscription/auto-renew', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + token
//       },
//       body: JSON.stringify({ autoRenew: newVal })
//     });
//     if (r.ok) {
//       toast.success(newVal ? '✅ Auto-renew ON' : '❌ Auto-renew OFF');
//       // Note: load() call NAHI karenge, warna delay se flicker hoga
//     } else {
//       // Rollback on failure
//       setData((prev: any) => prev ? {
//         ...prev,
//         subscription: { ...prev.subscription, autoRenew: current }
//       } : prev);
//       toast.error('Update nahi hua');
//     }
//   } catch (e: any) {
//     // Rollback on error
//     setData((prev: any) => prev ? {
//       ...prev,
//       subscription: { ...prev.subscription, autoRenew: current }
//     } : prev);
//     toast.error(e.message);
//   }
// };

//   // ============ RENDER ============
//   if (loading) {
//     return (
//       <div className="space-y-4 pb-6">
//         <div className="h-8 w-40 animate-pulse rounded-full bg-stone-200" />
//         <div className="card h-56 animate-pulse" />
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="card h-96 animate-pulse" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const sub = data?.subscription;
//   const usage = data?.usage || { bills: 0, products: 0, customers: 0 };
//   const limits = data?.limits || PLANS[0].limits;
//   const payments = data?.payments || [];

//   return (
//     <div className="space-y-5 pb-6">
//       {/* Header */}
//       <div>
//         <h1 className="font-display text-2xl font-extrabold text-slate-900">
//           Aapka Plan 💎
//         </h1>
//         <p className="mt-0.5 text-sm text-slate-500">
//           Apni dukaan ke liye sahi plan chunein
//         </p>
//       </div>

//       {/* Expiry Banner */}
//       {sub && sub.daysRemaining <= 7 && sub.status === 'active' && (
//         <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4 ring-1 ring-amber-100">
//           <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
//             <AlertCircle className="h-5 w-5" />
//           </div>
//           <div className="flex-1">
//             <p className="text-sm font-bold text-amber-900">
//               {sub.daysRemaining === 0
//                 ? 'Aaj plan expire ho raha hai!'
//                 : `${sub.daysRemaining} din mein plan expire hoga`}
//             </p>
//             <p className="text-xs text-amber-700">
//               Renew karein taaki service na ruke
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Current Plan Card */}
//       {sub && (
//         <div className="card overflow-hidden">
//           <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-accent-500 p-5 text-white">
//             <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
//             <div className="relative flex items-start justify-between gap-3">
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Crown className="h-4 w-4 text-amber-300" />
//                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
//                     Current Plan
//                   </span>
//                 </div>
//                 <p className="mt-1 font-display text-3xl font-extrabold">
//                   {PLANS.find(p => p.code === sub.planCode)?.emoji}{' '}
//                   {sub.planName}
//                 </p>
//                 <p className="mt-0.5 text-xs text-white/80">
//                   Expires: {dateHi(sub.expiresAt)}
//                 </p>
//               </div>
//               <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
//                 sub.status === 'active'
//                   ? 'bg-lime-400 text-lime-950'
//                   : 'bg-red-400 text-red-950'
//               }`}>
//                 {sub.status}
//               </span>
//             </div>

//             {sub.status === 'active' && (
//               <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold backdrop-blur">
//                 <Zap className="h-3 w-3" />
//                 {sub.daysRemaining} din bache
//               </div>
//             )}
//           </div>

//           {/* Usage Meters */}
//           <div className="space-y-4 p-5">
//             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//               Is mahine ka usage
//             </p>

//             <UsageMeter
//               label="Bills"
//               used={usage.bills}
//               limit={limits.bills}
//             />
//             <UsageMeter
//               label="Products"
//               used={usage.products}
//               limit={limits.products}
//             />
//             <UsageMeter
//               label="Customers"
//               used={usage.customers}
//               limit={limits.customers}
//             />

//             {/* Auto-renew */}
//             <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-3">
//               <div className="flex items-center gap-2">
//                 <RefreshCw className="h-4 w-4 text-slate-500" />
//                 <div>
//                   <p className="text-xs font-bold text-slate-900">Auto Renew</p>
//                   <p className="text-[10px] text-slate-500">
//                     {sub.autoRenew ? 'Automatically renew hoga' : 'Manually renew karna hoga'}
//                   </p>
//                 </div>
//               </div>
//               <button
//                 onClick={handleToggleAutoRenew}
//                 className={`relative h-6 w-11 shrink-0 rounded-full transition ${
//                   sub.autoRenew ? 'bg-lime-500' : 'bg-stone-300'
//                 }`}
//               >
//                 <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
//                   sub.autoRenew ? 'translate-x-5' : 'translate-x-0.5'
//                 }`} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Plans Header */}
//       <div className="text-center">
//         <h2 className="font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
//           {sub && sub.planCode !== 'free'
//             ? 'Upgrade ya change karein'
//             : 'Apna plan chunein'}
//         </h2>
//         <p className="mt-1 text-sm text-slate-500">
//           Kabhi bhi cancel ya upgrade kar sakte hain
//         </p>
//       </div>

//       {/* Billing Toggle */}
//       <div className="flex justify-center">
//         <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1">
//           <button
//             onClick={() => setBilling('monthly')}
//             className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
//               billing === 'monthly' ? 'bg-brand-600 text-white' : 'text-slate-600'
//             }`}
//           >
//             Monthly
//           </button>
//           <button
//             onClick={() => setBilling('yearly')}
//             className={`relative rounded-full px-4 py-1.5 text-xs font-bold transition ${
//               billing === 'yearly' ? 'bg-brand-600 text-white' : 'text-slate-600'
//             }`}
//           >
//             Yearly
//             <span className="ml-2 inline-block rounded-full bg-lime-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
//               −20%
//             </span>
//           </button>
//         </div>
//       </div>

//       {/* Plans Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {PLANS.map((plan) => {
//           const isCurrent = sub?.planCode === plan.code;
//           const price = billing === 'yearly' ? plan.yearly : plan.monthly;
//           const perMonth = billing === 'yearly' ? Math.round(plan.yearly / 12) : plan.monthly;

//           return (
//             <div
//               key={plan.code}
//               className={`card relative flex flex-col transition ${
//                 (plan as any).popular
//                   ? 'border-brand-500 shadow-xl shadow-brand-500/10 lg:-translate-y-1'
//                   : 'hover:border-stone-300'
//               } ${isCurrent ? 'ring-2 ring-lime-400/40' : ''}`}
//             >
//               {(plan as any).popular && (
//                 <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
//                   <Sparkles className="h-3 w-3" />
//                   Popular
//                 </span>
//               )}

//               {isCurrent && (
//                 <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
//                   ✓ Current
//                 </span>
//               )}

//               {/* Header */}
//               <div className="p-5">
//                 <div className="flex items-center gap-2">
//                   <span className="text-2xl">{plan.emoji}</span>
//                   <div>
//                     <h3 className="font-display text-lg font-extrabold text-slate-900">
//                       {plan.name}
//                     </h3>
//                     <p className="text-xs text-slate-500">{plan.tagline}</p>
//                   </div>
//                 </div>

//                 {/* Price */}
//                 <div className="mt-5">
//                   {plan.monthly === 0 ? (
//                     <p className="font-display text-3xl font-extrabold text-slate-900">
//                       Free
//                     </p>
//                   ) : (
//                     <>
//                       <div className="flex items-baseline gap-1">
//                         <span className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
//                           ₹{price}
//                         </span>
//                         <span className="text-sm font-semibold text-slate-500">
//                           /{billing === 'monthly' ? 'mahina' : 'saal'}
//                         </span>
//                       </div>
//                       {billing === 'yearly' && (
//                         <p className="mt-0.5 text-[11px] font-semibold text-lime-600">
//                           ≈ ₹{perMonth}/mahina — 20% bachat!
//                         </p>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Features */}
//               <ul className="flex-1 space-y-2 border-t border-stone-100 px-5 py-4">
//                 {plan.features.map((f) => (
//                   <li key={f} className="flex items-start gap-2 text-xs">
//                     <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime-100 text-lime-700">
//                       <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
//                     </span>
//                     <span className="text-slate-700">{f}</span>
//                   </li>
//                 ))}
//               </ul>

//               {/* CTA */}
//               <div className="border-t border-stone-100 p-4">
//                 <button
//                   onClick={() => !isCurrent && handleSelectPlan(plan)}
//                   disabled={isCurrent || processing}
//                   className={`btn-md w-full ${
//                     isCurrent
//                       ? 'btn-ghost opacity-60 cursor-not-allowed'
//                       : (plan as any).popular
//                       ? 'btn-primary'
//                       : 'btn-outline'
//                   }`}
//                 >
//                   {isCurrent
//                     ? 'Current plan'
//                     : plan.monthly === 0
//                     ? 'Free mein continue'
//                     : `${plan.name} chunein`}
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Comparison Table */}
//       <ComparisonTable currentPlan={sub?.planCode} />

//       {/* Payment History */}
//       {payments.length > 0 && (
//         <div className="card overflow-hidden">
//           <div className="flex items-center gap-2 border-b border-stone-100 p-4">
//             <Receipt className="h-4 w-4 text-brand-600" />
//             <h3 className="font-display text-base font-bold text-slate-900">
//               Payment History
//             </h3>
//             <span className="ml-auto text-xs text-slate-400">
//               {payments.length} payments
//             </span>
//           </div>
//           <ul className="divide-y divide-stone-100">
//             {payments.map((p: any) => (
//               <li key={p.id} className="flex items-center gap-3 p-4">
//                 <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
//                   <Receipt className="h-5 w-5" />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <div className="flex items-center gap-2">
//                     <p className="truncate text-sm font-bold text-slate-900 capitalize">
//                       {p.planCode} — {p.billingCycle}
//                     </p>
//                     <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
//                       p.status === 'paid' ? 'bg-lime-100 text-lime-800'
//                       : p.status === 'failed' ? 'bg-red-100 text-red-700'
//                       : 'bg-stone-100 text-slate-600'
//                     }`}>
//                       {p.status}
//                     </span>
//                   </div>
//                   <p className="truncate font-mono text-[10px] text-slate-400">
//                     {p.razorpayPaymentId || p.razorpayOrderId}
//                   </p>
//                   <p className="text-[10px] text-slate-500">
//                     {dateHi(p.createdAt)}
//                   </p>
//                 </div>
//                 <div className="shrink-0 text-right">
//                   <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
//                     {inr(p.amount / 100)}
//                   </p>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* FAQ */}
//       <div className="card overflow-hidden">
//         <div className="flex items-center gap-2 border-b border-stone-100 p-4">
//           <HelpCircle className="h-4 w-4 text-brand-600" />
//           <h3 className="font-display text-base font-bold text-slate-900">
//             Aksar puche jaane wale sawaal
//           </h3>
//         </div>
//         <ul className="divide-y divide-stone-100">
//           {FAQS.map((f, i) => (
//             <li key={i}>
//               <button
//                 onClick={() => setOpenFaq(openFaq === i ? null : i)}
//                 className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-stone-50"
//               >
//                 <span className="flex-1 text-sm font-semibold text-slate-800">
//                   {f.q}
//                 </span>
//                 <ChevronDown
//                   className={`h-4 w-4 shrink-0 text-slate-400 transition ${
//                     openFaq === i ? 'rotate-180 text-brand-600' : ''
//                   }`}
//                 />
//               </button>
//               {openFaq === i && (
//                 <div className="border-t border-stone-100 bg-stone-50/60 px-4 py-3 text-xs leading-relaxed text-slate-600">
//                   {f.a}
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Processing Overlay */}
//       {processing && (
//         <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/60 backdrop-blur-sm">
//           <div className="card max-w-sm p-6 text-center">
//             <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
//             <p className="mt-4 text-sm font-bold text-slate-900">
//               Payment process ho rahi hai…
//             </p>
//             <p className="mt-1 text-xs text-slate-500">
//               Window band na karein
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ===================== USAGE METER =====================
// function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
//   const unlimited = limit === -1;
//   const pct = unlimited ? 0 : Math.min(100, (used / limit) * 100);
//   const danger = pct >= 90;
//   const warn = pct >= 70 && pct < 90;

//   return (
//     <div>
//       <div className="flex items-center justify-between gap-2 text-xs">
//         <span className="font-semibold text-slate-700">{label}</span>
//         <span className={`font-bold tabular-nums ${
//           danger ? 'text-red-600' : warn ? 'text-amber-600' : 'text-slate-700'
//         }`}>
//           {used}
//           {unlimited ? (
//             <span className="ml-1 text-slate-400">/ ∞</span>
//           ) : (
//             <span className="text-slate-400"> / {limit}</span>
//           )}
//         </span>
//       </div>
//       {!unlimited && (
//         <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
//           <div
//             className={`h-full rounded-full transition-all duration-700 ${
//               danger ? 'bg-red-500' : warn ? 'bg-amber-500' : 'bg-gradient-to-r from-brand-500 to-accent-500'
//             }`}
//             style={{ width: `${pct}%` }}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// // ===================== COMPARISON TABLE =====================
// function ComparisonTable({ currentPlan }: { currentPlan?: string }) {
//   const ROWS = [
//     { label: 'Bills / mahina',    free: '20',   starter: '200',  pro: '∞',    business: '∞' },
//     { label: 'Products',          free: '50',   starter: '500',  pro: '∞',    business: '∞' },
//     { label: 'Customers',         free: '25',   starter: '200',  pro: '∞',    business: '∞' },
//     { label: 'Khata book',        free: false,  starter: true,   pro: true,   business: true },
//     { label: 'WhatsApp share',    free: true,   starter: true,   pro: true,   business: true },
//     { label: 'Thermal print',     free: false,  starter: false,  pro: true,   business: true },
//     { label: 'GST billing',       free: false,  starter: false,  pro: true,   business: true },
//     { label: 'Advanced reports',  free: false,  starter: true,   pro: true,   business: true },
//     { label: 'Multi-shop',        free: false,  starter: false,  pro: false,  business: '3' },
//     { label: 'Staff accounts',    free: '1',    starter: '1',    pro: '2',    business: '∞' },
//     { label: 'Support',           free: 'Email', starter: 'Email', pro: 'Priority', business: 'Dedicated' }
//   ];

//   const PLANS = [
//     { code: 'free', name: 'Free', emoji: '🌱' },
//     { code: 'starter', name: 'Starter', emoji: '🚀' },
//     { code: 'pro', name: 'Pro', emoji: '⭐' },
//     { code: 'business', name: 'Business', emoji: '👑' }
//   ];

//   return (
//     <div className="card overflow-hidden">
//       <div className="border-b border-stone-100 p-4">
//         <h3 className="font-display text-base font-bold text-slate-900">
//           Plan Comparison
//         </h3>
//         <p className="text-xs text-slate-500">
//           Saare features side-by-side dekhein
//         </p>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[560px] text-sm">
//           <thead>
//             <tr className="border-b border-stone-100 bg-stone-50/60">
//               <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                 Feature
//               </th>
//               {PLANS.map((p) => (
//                 <th
//                   key={p.code}
//                   className={`px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider ${
//                     currentPlan === p.code ? 'text-brand-700' : 'text-slate-500'
//                   }`}
//                 >
//                   <div className="flex flex-col items-center gap-0.5">
//                     <span className="text-base">{p.emoji}</span>
//                     <span>{p.name}</span>
//                     {currentPlan === p.code && (
//                       <span className="rounded-full bg-lime-100 px-1.5 py-0.5 text-[8px] text-lime-800">
//                         Current
//                       </span>
//                     )}
//                   </div>
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-stone-100">
//             {ROWS.map((r, i) => (
//               <tr key={i} className="hover:bg-stone-50/50">
//                 <td className="px-4 py-3 text-xs font-semibold text-slate-700">
//                   {r.label}
//                 </td>
//                 {(['free', 'starter', 'pro', 'business'] as const).map((code) => {
//                   const val = (r as any)[code];
//                   return (
//                     <td key={code} className="px-4 py-3 text-center text-xs text-slate-700">
//                       {val === true ? (
//                         <Check className="mx-auto h-4 w-4 text-lime-600" strokeWidth={3} />
//                       ) : val === false ? (
//                         <span className="text-slate-300">—</span>
//                       ) : (
//                         <span className="font-bold">{val}</span>
//                       )}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import {
  Crown, Check, Sparkles, IndianRupee, Receipt, RefreshCw,
  AlertCircle, Wallet, TrendingUp, ChevronDown, HelpCircle,
  Zap, Star
} from 'lucide-react';
import { toast } from 'sonner';
import { inr, dateHi } from '@/lib/format';
import { useAuth } from '@/features/auth/AuthContext';
import { api } from '@/lib/api';

// ============ PLANS ============
const PLANS = [
  {
    code: 'free',
    name: 'Free',
    tagline: 'Shuru karne ke liye',
    emoji: '🌱',
    monthly: 0,
    yearly: 0,
    features: [
      '20 bills / mahina',
      '50 products',
      '25 customers',
      'Basic dashboard',
      'WhatsApp bill share'
    ],
    limits: { bills: 20, products: 50, customers: 25 }
  },
  {
    code: 'starter',
    name: 'Starter',
    tagline: 'Chhoti dukaan ke liye',
    emoji: '🚀',
    monthly: 99,
    yearly: 950,
    features: [
      '200 bills / mahina',
      '500 products',
      '200 customers',
      'Khata book + reminders',
      'Kamai report',
      'CSV export'
    ],
    limits: { bills: 200, products: 500, customers: 200 }
  },
  {
    code: 'pro',
    name: 'Pro',
    tagline: 'Sabse popular',
    emoji: '⭐',
    monthly: 249,
    yearly: 2390,
    popular: true,
    features: [
      'Unlimited bills',
      'Unlimited products',
      'Unlimited customers',
      'GST billing',
      'Thermal print',
      'Advanced reports',
      '2 staff accounts',
      'Priority WhatsApp support'
    ],
    limits: { bills: -1, products: -1, customers: -1 }
  },
  {
    code: 'business',
    name: 'Business',
    tagline: 'Badhi dukaan ke liye',
    emoji: '👑',
    monthly: 599,
    yearly: 5750,
    features: [
      'Sab kuch Pro mein',
      'Multi-shop support (3)',
      'Unlimited staff',
      'Barcode scanning',
      'Custom bill template',
      'API access',
      'Dedicated account manager',
      'Phone + WhatsApp support'
    ],
    limits: { bills: -1, products: -1, customers: -1 }
  }
] as const;

// ============ FAQ ============
const FAQS = [
  {
    q: 'Kya main kabhi bhi plan badal sakta hoon?',
    a: 'Haan. Aap kabhi bhi upgrade kar sakte hain — turant apply ho jayega. Downgrade agle billing cycle se hoga.'
  },
  {
    q: 'Payment ke kaun se options hain?',
    a: 'Razorpay ke through UPI (PhonePe, GPay, Paytm), Credit/Debit Card, Net Banking — sab supported hain.'
  },
  {
    q: 'Auto-renew kaise kaam karta hai?',
    a: 'Auto-renew ON karein toh expiry se pehle automatically renew ho jayega. OFF karein toh manually renew karna hoga.'
  },
  {
    q: 'Kya refund milta hai?',
    a: '7 din ke andar full refund. Baad mein nahi. Refund ke liye support par contact karein.'
  },
  {
    q: 'Yearly plan mein kitni bachat hoti hai?',
    a: 'Yearly plan par 20% tak bachat — jaise Pro monthly ₹249, yearly ₹199/mahina.'
  },
  {
    q: 'Free plan mein kitne bills bana sakte hain?',
    a: 'Free plan mein 20 bills/mahina, 50 products aur 25 customers tak.'
  }
];

// ============ MAIN ============
export default function SubscriptionPage() {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const load = async () => {
    setLoading(true);
    try {
      const d = await api.get('/api/subscription/current');
      setData(d);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ============ RAZORPAY CHECKOUT ============
  const handleSelectPlan = async (plan: any) => {
    if (processing) return;

    if (plan.monthly === 0) {
      toast.info('Free plan already active hai');
      return;
    }

    setProcessing(true);
    try {
      // Load Razorpay script
      if (!(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://checkout.razorpay.com/v1/checkout.js';
          s.onload = () => resolve();
          s.onerror = () => reject(new Error('Razorpay script load fail'));
          document.body.appendChild(s);
        });
      }

      // Create order
      const orderData = await api.post('/api/subscription/create-order', {
        planCode: plan.code,
        billingCycle: billing
      });

      // Open Razorpay
      const rzp = new (window as any).Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'BazaarBook',
        description: `${plan.name} — ${billing === 'yearly' ? 'Yearly' : 'Monthly'}`,
        prefill: {
          name: user?.ownerName,
          email: user?.email,
          contact: user?.mobile
        },
        theme: { color: '#7c3aed' },
        handler: async (response: any) => {
          try {
            await api.post('/api/subscription/verify', {
              ...response,
              planCode: plan.code,
              billingCycle: billing
            });
            toast.success(`🎉 ${plan.name} active ho gaya!`);
            updateUser({ plan: plan.code });
            await load();
          } catch (e: any) {
            toast.error(e.message || 'Verify nahi hua');
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancel kiya gaya');
            setProcessing(false);
          }
        }
      });

      rzp.on('payment.failed', (resp: any) => {
        toast.error(resp.error?.description || 'Payment fail ho gaya');
        setProcessing(false);
      });

      rzp.open();
    } catch (e: any) {
      toast.error(e.message || 'Checkout error');
      setProcessing(false);
    }
  };

  // ============ AUTO-RENEW ============
  const handleToggleAutoRenew = async () => {
    const current = data?.subscription?.autoRenew || false;
    const newVal = !current;

    // Optimistic update
    setData((prev: any) =>
      prev
        ? { ...prev, subscription: { ...prev.subscription, autoRenew: newVal } }
        : prev
    );

    try {
      await api.patch('/api/subscription/auto-renew', { autoRenew: newVal });
      toast.success(newVal ? '✅ Auto-renew ON' : '❌ Auto-renew OFF');
    } catch (err: any) {
      // Rollback
      setData((prev: any) =>
        prev
          ? { ...prev, subscription: { ...prev.subscription, autoRenew: current } }
          : prev
      );
      toast.error(err.message || 'Update nahi hua');
    }
  };

  // ============ RENDER ============
  if (loading) {
    return (
      <div className="space-y-4 pb-6">
        <div className="h-8 w-40 animate-pulse rounded-full bg-stone-200" />
        <div className="card h-56 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const sub = data?.subscription;
  const usage = data?.usage || { bills: 0, products: 0, customers: 0 };
  const limits = data?.limits || PLANS[0].limits;
  const payments = data?.payments || [];

  return (
    <div className="space-y-5 pb-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-slate-900">
          Aapka Plan 💎
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Apni dukaan ke liye sahi plan chunein
        </p>
      </div>

      {/* Expiry Banner */}
      {sub && sub.daysRemaining <= 7 && sub.status === 'active' && (
        <div className="flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 p-4 ring-1 ring-amber-100">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">
              {sub.daysRemaining === 0
                ? 'Aaj plan expire ho raha hai!'
                : `${sub.daysRemaining} din mein plan expire hoga`}
            </p>
            <p className="text-xs text-amber-700">
              Renew karein taaki service na ruke
            </p>
          </div>
        </div>
      )}

      {/* Current Plan Card */}
      {sub && (
        <div className="card overflow-hidden">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-accent-500 p-5 text-white">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-300" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                    Current Plan
                  </span>
                </div>
                <p className="mt-1 font-display text-3xl font-extrabold">
                  {PLANS.find((p) => p.code === sub.planCode)?.emoji}{' '}
                  {sub.planName}
                </p>
                <p className="mt-0.5 text-xs text-white/80">
                  Expires: {dateHi(sub.expiresAt)}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                sub.status === 'active'
                  ? 'bg-lime-400 text-lime-950'
                  : 'bg-red-400 text-red-950'
              }`}>
                {sub.status}
              </span>
            </div>

            {sub.status === 'active' && (
              <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold backdrop-blur">
                <Zap className="h-3 w-3" />
                {sub.daysRemaining} din bache
              </div>
            )}
          </div>

          {/* Usage Meters */}
          <div className="space-y-4 p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Is mahine ka usage
            </p>

            <UsageMeter label="Bills" used={usage.bills} limit={limits.bills} />
            <UsageMeter label="Products" used={usage.products} limit={limits.products} />
            <UsageMeter label="Customers" used={usage.customers} limit={limits.customers} />

            {/* Auto-renew */}
            <div className="flex items-center justify-between rounded-2xl bg-stone-50 p-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Auto Renew</p>
                  <p className="text-[10px] text-slate-500">
                    {sub.autoRenew ? 'Automatically renew hoga' : 'Manually renew karna hoga'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleToggleAutoRenew}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  sub.autoRenew ? 'bg-lime-500' : 'bg-stone-300'
                }`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                  sub.autoRenew ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plans Header */}
      <div className="text-center">
        <h2 className="font-display text-xl font-extrabold text-slate-900 sm:text-2xl">
          {sub && sub.planCode !== 'free'
            ? 'Upgrade ya change karein'
            : 'Apna plan chunein'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Kabhi bhi cancel ya upgrade kar sakte hain
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1">
          <button
            onClick={() => setBilling('monthly')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
              billing === 'monthly' ? 'bg-brand-600 text-white' : 'text-slate-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={`relative rounded-full px-4 py-1.5 text-xs font-bold transition ${
              billing === 'yearly' ? 'bg-brand-600 text-white' : 'text-slate-600'
            }`}
          >
            Yearly
            <span className="ml-2 inline-block rounded-full bg-lime-500 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-white">
              −20%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const isCurrent = sub?.planCode === plan.code;
          const price = billing === 'yearly' ? plan.yearly : plan.monthly;
          const perMonth = billing === 'yearly' ? Math.round(plan.yearly / 12) : plan.monthly;

          return (
            <div
              key={plan.code}
              className={`card relative flex flex-col transition ${
                (plan as any).popular
                  ? 'border-brand-500 shadow-xl shadow-brand-500/10 lg:-translate-y-1'
                  : 'hover:border-stone-300'
              } ${isCurrent ? 'ring-2 ring-lime-400/40' : ''}`}
            >
              {(plan as any).popular && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Popular
                </span>
              )}

              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-lime-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                  ✓ Current
                </span>
              )}

              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{plan.emoji}</span>
                  <div>
                    <h3 className="font-display text-lg font-extrabold text-slate-900">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500">{plan.tagline}</p>
                  </div>
                </div>

                <div className="mt-5">
                  {plan.monthly === 0 ? (
                    <p className="font-display text-3xl font-extrabold text-slate-900">
                      Free
                    </p>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                          ₹{price}
                        </span>
                        <span className="text-sm font-semibold text-slate-500">
                          /{billing === 'monthly' ? 'mahina' : 'saal'}
                        </span>
                      </div>
                      {billing === 'yearly' && (
                        <p className="mt-0.5 text-[11px] font-semibold text-lime-600">
                          ≈ ₹{perMonth}/mahina — 20% bachat!
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <ul className="flex-1 space-y-2 border-t border-stone-100 px-5 py-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime-100 text-lime-700">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </span>
                    <span className="text-slate-700">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-stone-100 p-4">
                <button
                  onClick={() => !isCurrent && handleSelectPlan(plan)}
                  disabled={isCurrent || processing}
                  className={`btn-md w-full ${
                    isCurrent
                      ? 'btn-ghost opacity-60 cursor-not-allowed'
                      : (plan as any).popular
                      ? 'btn-primary'
                      : 'btn-outline'
                  }`}
                >
                  {isCurrent
                    ? 'Current plan'
                    : plan.monthly === 0
                    ? 'Free mein continue'
                    : `${plan.name} chunein`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <ComparisonTable currentPlan={sub?.planCode} />

      {/* Payment History */}
      {payments.length > 0 && (
        <div className="card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-stone-100 p-4">
            <Receipt className="h-4 w-4 text-brand-600" />
            <h3 className="font-display text-base font-bold text-slate-900">
              Payment History
            </h3>
            <span className="ml-auto text-xs text-slate-400">
              {payments.length} payments
            </span>
          </div>
          <ul className="divide-y divide-stone-100">
            {payments.map((p: any) => (
              <li key={p.id} className="flex items-center gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-900 capitalize">
                      {p.planCode} — {p.billingCycle}
                    </p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      p.status === 'paid' ? 'bg-lime-100 text-lime-800'
                      : p.status === 'failed' ? 'bg-red-100 text-red-700'
                      : 'bg-stone-100 text-slate-600'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <p className="truncate font-mono text-[10px] text-slate-400">
                    {p.razorpayPaymentId || p.razorpayOrderId}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {dateHi(p.createdAt)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
                    {inr(p.amount / 100)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FAQ */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-stone-100 p-4">
          <HelpCircle className="h-4 w-4 text-brand-600" />
          <h3 className="font-display text-base font-bold text-slate-900">
            Aksar puche jaane wale sawaal
          </h3>
        </div>
        <ul className="divide-y divide-stone-100">
          {FAQS.map((f, i) => (
            <li key={i}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-stone-50"
              >
                <span className="flex-1 text-sm font-semibold text-slate-800">
                  {f.q}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-slate-400 transition ${
                    openFaq === i ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="border-t border-stone-100 bg-stone-50/60 px-4 py-3 text-xs leading-relaxed text-slate-600">
                  {f.a}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-slate-900/60 backdrop-blur-sm">
          <div className="card max-w-sm p-6 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="mt-4 text-sm font-bold text-slate-900">
              Payment process ho rahi hai…
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Window band na karein
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ USAGE METER ============
function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const unlimited = limit === -1;
  const pct = unlimited ? 0 : Math.min(100, (used / limit) * 100);
  const danger = pct >= 90;
  const warn = pct >= 70 && pct < 90;

  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className={`font-bold tabular-nums ${
          danger ? 'text-red-600' : warn ? 'text-amber-600' : 'text-slate-700'
        }`}>
          {used}
          {unlimited ? (
            <span className="ml-1 text-slate-400">/ ∞</span>
          ) : (
            <span className="text-slate-400"> / {limit}</span>
          )}
        </span>
      </div>
      {!unlimited && (
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              danger ? 'bg-red-500' : warn ? 'bg-amber-500' : 'bg-gradient-to-r from-brand-500 to-accent-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

// ============ COMPARISON TABLE ============
function ComparisonTable({ currentPlan }: { currentPlan?: string }) {
  const ROWS = [
    { label: 'Bills / mahina',    free: '20',    starter: '200',  pro: '∞',       business: '∞' },
    { label: 'Products',          free: '50',    starter: '500',  pro: '∞',       business: '∞' },
    { label: 'Customers',         free: '25',    starter: '200',  pro: '∞',       business: '∞' },
    { label: 'Khata book',        free: false,   starter: true,   pro: true,      business: true },
    { label: 'WhatsApp share',    free: true,    starter: true,   pro: true,      business: true },
    { label: 'Thermal print',     free: false,   starter: false,  pro: true,      business: true },
    { label: 'GST billing',       free: false,   starter: false,  pro: true,      business: true },
    { label: 'Advanced reports',  free: false,   starter: true,   pro: true,      business: true },
    { label: 'Multi-shop',        free: false,   starter: false,  pro: false,     business: '3' },
    { label: 'Staff accounts',    free: '1',     starter: '1',    pro: '2',       business: '∞' },
    { label: 'Support',           free: 'Email', starter: 'Email', pro: 'Priority', business: 'Dedicated' }
  ];

  const PLANS = [
    { code: 'free', name: 'Free', emoji: '🌱' },
    { code: 'starter', name: 'Starter', emoji: '🚀' },
    { code: 'pro', name: 'Pro', emoji: '⭐' },
    { code: 'business', name: 'Business', emoji: '👑' }
  ];

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-stone-100 p-4">
        <h3 className="font-display text-base font-bold text-slate-900">
          Plan Comparison
        </h3>
        <p className="text-xs text-slate-500">
          Saare features side-by-side dekhein
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/60">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Feature
              </th>
              {PLANS.map((p) => (
                <th
                  key={p.code}
                  className={`px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wider ${
                    currentPlan === p.code ? 'text-brand-700' : 'text-slate-500'
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-base">{p.emoji}</span>
                    <span>{p.name}</span>
                    {currentPlan === p.code && (
                      <span className="rounded-full bg-lime-100 px-1.5 py-0.5 text-[8px] text-lime-800">
                        Current
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {ROWS.map((r, i) => (
              <tr key={i} className="hover:bg-stone-50/50">
                <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                  {r.label}
                </td>
                {(['free', 'starter', 'pro', 'business'] as const).map((code) => {
                  const val = (r as any)[code];
                  return (
                    <td key={code} className="px-4 py-3 text-center text-xs text-slate-700">
                      {val === true ? (
                        <Check className="mx-auto h-4 w-4 text-lime-600" strokeWidth={3} />
                      ) : val === false ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <span className="font-bold">{val}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}