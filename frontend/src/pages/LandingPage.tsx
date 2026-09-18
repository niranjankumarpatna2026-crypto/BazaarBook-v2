// // // import { Link } from 'react-router-dom';
// // // import { ArrowRight } from 'lucide-react';
// // // import { ROUTES } from '@/lib/constants';
// // // import { BrandLogo } from '@/components/BrandLogo';

// // // export default function LandingPage() {
// // //   return (
// // //     <div className="min-h-screen bg-gradient-to-b from-white to-stone-50">
// // //       <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
// // //         <div className="container-app flex h-16 items-center">
// // //           {/* <div className="flex items-center gap-2">
// // //             <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 font-extrabold text-white">B</span>
// // //             <span className="text-lg font-extrabold">Bazaar<span className="text-brand-600">Book</span></span>
// // //           </div> */}
// // //           <BrandLogo size="sm" />
// // //           <div className="ml-auto flex gap-2">
// // //             <Link to={ROUTES.login} className="btn-ghost btn-md">Login</Link>
// // //             <Link to={ROUTES.register} className="btn-primary btn-md">Free Shuru Karein</Link>
// // //           </div>
// // //         </div>
// // //       </header>

// // //       <section className="container-app py-20 text-center">
// // //         <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl">
// // //           Aapki dukaan ka <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">digital saathi</span>
// // //         </h1>
// // //         <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
// // //           Bill banao, udhaar track karo, kamai dekho — sab Hindi mein, mobile par.
// // //         </p>
// // //         <div className="mt-10">
// // //           <Link to={ROUTES.register} className="btn-primary btn-lg">
// // //             Free Mein Shuru Karein <ArrowRight className="h-4 w-4" />
// // //           </Link>
// // //         </div>

// // //         <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-3">
// // //           {[
// // //             { emoji: '🧾', t: '30 Second Bill' },
// // //             { emoji: '👥', t: 'Udhaar Khata' },
// // //             { emoji: '📈', t: 'Kamai Report' }
// // //           ].map((f) => (
// // //             <div key={f.t} className="card p-6 text-left">
// // //               <div className="text-3xl">{f.emoji}</div>
// // //               <h3 className="mt-3 font-bold">{f.t}</h3>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </section>
// // //     </div>
// // //   );
// // // }


// // import { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import {
// //   ArrowRight, Check, Star, Users, TrendingUp, Package, Receipt,
// //   MessageCircle, Shield, Smartphone, Zap, Clock, IndianRupee,
// //   ChevronDown, Play, Sparkles, Store, Calculator, FileText
// // } from 'lucide-react';
// // import { ROUTES } from '@/lib/constants';
// // import { BrandLogo } from '@/components/BrandLogo';

// // // ============ DATA ============
// // const STATS = [
// //   { value: '50,000+', label: 'Dukaandaar' },
// //   { value: '₹200 Cr+', label: 'Bills Banaye' },
// //   { value: '4.8★',    label: 'Rating' },
// //   { value: '24/7',    label: 'Support' }
// // ];

// // const FEATURES = [
// //   {
// //     icon: Receipt,
// //     title: '30 Second Bill',
// //     desc: 'Ek tap mein bill banayein — print karein ya WhatsApp par bhejein.',
// //     color: 'brand'
// //   },
// //   {
// //     icon: Users,
// //     title: 'Udhaar Khata',
// //     desc: 'Kisne kitna dena hai — sab track karein. WhatsApp reminder bhejein.',
// //     color: 'danger'
// //   },
// //   {
// //     icon: Package,
// //     title: 'Stock Alert',
// //     desc: 'Saman khatam hone se pehle alert. Auto reorder level.',
// //     color: 'accent'
// //   },
// //   {
// //     icon: TrendingUp,
// //     title: 'Kamai Report',
// //     desc: 'Din, hafta, mahina — poora hisaab. Real profit tracking.',
// //     color: 'success'
// //   },
// //   {
// //     icon: Smartphone,
// //     title: 'Offline Bhi Chalega',
// //     desc: 'Internet band ho toh bhi bill banao — auto sync jab online aao.',
// //     color: 'brand'
// //   },
// //   {
// //     icon: Shield,
// //     title: '100% Safe',
// //     desc: 'Data encrypted. Aapka business, aapka data — koi leak nahi.',
// //     color: 'accent'
// //   }
// // ];

// // const STEPS = [
// //   {
// //     n: 1,
// //     title: '2 Minute Mein Setup',
// //     desc: 'Mobile number se free account banayein. Credit card nahi chahiye.',
// //     emoji: '📝'
// //   },
// //   {
// //     n: 2,
// //     title: 'Saman Aur Grahak Jodein',
// //     desc: 'Ek baar list banayein — ya seedha bill banana shuru karein.',
// //     emoji: '📦'
// //   },
// //   {
// //     n: 3,
// //     title: 'Bill Banao, Kamai Badhao',
// //     desc: 'Roz bill banayein, udhaar track karein, profit dekhein.',
// //     emoji: '🚀'
// //   }
// // ];

// // const TESTIMONIALS = [
// //   {
// //     name: 'Ramesh Kumar',
// //     shop: 'Sharma Kirana Store',
// //     city: 'Ranchi',
// //     emoji: '🛒',
// //     quote: 'Pehle udhaar copy mein tha — ab sab mobile par. WhatsApp reminder se ₹40,000 wapas mila!',
// //     rating: 5
// //   },
// //   {
// //     name: 'Sunita Devi',
// //     shop: 'Sunita Medical',
// //     city: 'Patna',
// //     emoji: '💊',
// //     quote: 'Bill banana bahut aasan hai. Customer WhatsApp par bill dekh leta hai — bharosa badh gaya.',
// //     rating: 5
// //   },
// //   {
// //     name: 'Mohan Lal',
// //     shop: 'Mohan General Store',
// //     city: 'Delhi',
// //     emoji: '🏪',
// //     quote: 'Roz raat ko kamai report dekhta hun. Kaunsa maal zyada bikta hai — pata chal jaata hai.',
// //     rating: 5
// //   }
// // ];

// // const FAQS = [
// //   {
// //     q: 'Kya BazaarBook bilkul free hai?',
// //     a: 'Haan! Free plan mein 20 bills, 50 products aur 25 customers tak sab features milte hain. Business badhne par ₹99/month se upgrade kar sakte hain.'
// //   },
// //   {
// //     q: 'Mere data ka kya hoga? Safe hai?',
// //     a: 'Aapka poora data encrypted cloud par safe hai. Aap kabhi bhi CSV mein export kar sakte hain. Hum data kisi ke saath share nahi karte.'
// //   },
// //   {
// //     q: 'Internet nahi hai toh chalega?',
// //     a: 'Bilkul! BazaarBook offline bhi kaam karta hai. Internet aate hi sab automatically sync ho jata hai.'
// //   },
// //   {
// //     q: 'Kitne devices par use kar sakta hun?',
// //     a: 'Ek account se mobile, tablet aur laptop — teeno par use kar sakte hain. Sab par same data dikhega.'
// //   },
// //   {
// //     q: 'Bill print kaise karun?',
// //     a: 'Bluetooth thermal printer (58mm / 80mm) support hai. Ya A4 paper par normal printer se print kar sakte hain. WhatsApp par bhi bhej sakte hain.'
// //   },
// //   {
// //     q: 'Paisa kaise pay karun?',
// //     a: 'Razorpay se UPI (GPay, PhonePe, Paytm), Debit/Credit Card, Net Banking — sab supported hai. Auto-renew option bhi hai.'
// //   }
// // ];

// // // ============ MAIN COMPONENT ============
// // export default function LandingPage() {
// //   return (
// //     <div className="min-h-screen bg-white">
// //       {/* NAVBAR */}
// //       <Navbar />

// //       {/* HERO */}
// //       <Hero />

// //       {/* STATS */}
// //       <StatsBar />

// //       {/* PROBLEM */}
// //       <ProblemSection />

// //       {/* FEATURES */}
// //       <FeaturesSection />

// //       {/* HOW IT WORKS */}
// //       <HowItWorksSection />

// //       {/* TESTIMONIALS */}
// //       <TestimonialsSection />

// //       {/* PRICING PREVIEW */}
// //       <PricingPreview />

// //       {/* FAQ */}
// //       <FaqSection />

// //       {/* FINAL CTA */}
// //       <FinalCta />

// //       {/* FOOTER */}
// //       <Footer />
// //     </div>
// //   );
// // }

// // // ============ NAVBAR ============
// // function Navbar() {
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   return (
// //     <header className="relative z-[100] border-b border-stone-200 bg-white shadow-sm">
// //       <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
// //         <Link to={ROUTES.home}>
// //           <BrandLogo size="sm" />
// //         </Link>

// //         <nav className="hidden items-center gap-8 md:flex">
// //           <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-brand-600">
// //             Features
// //           </a>
// //           <a href="#how" className="text-sm font-semibold text-slate-600 hover:text-brand-600">
// //             Kaise Kaam Karta Hai
// //           </a>
// //           <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-brand-600">
// //             Pricing
// //           </a>
// //           <a href="#faq" className="text-sm font-semibold text-slate-600 hover:text-brand-600">
// //             FAQ
// //           </a>
// //         </nav>

// //         <div className="hidden items-center gap-2 md:flex">
// //           <Link to={ROUTES.login} className="btn-ghost btn-md">
// //             Login
// //           </Link>
// //           <Link to={ROUTES.register} className="btn-primary btn-md">
// //             Free Shuru Karein
// //             <ArrowRight className="h-4 w-4" />
// //           </Link>
// //         </div>

// //         {/* Mobile toggle */}
// //         <button
// //           onClick={() => setMobileOpen(!mobileOpen)}
// //           className="grid h-10 w-10 place-items-center rounded-full text-slate-700 hover:bg-stone-100 md:hidden"
// //         >
// //           {mobileOpen ? (
// //             <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //               <path d="M6 6l12 12M6 18L18 6" />
// //             </svg>
// //           ) : (
// //             <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //               <path d="M3 6h18M3 12h18M3 18h18" />
// //             </svg>
// //           )}
// //         </button>
// //       </div>

// //       {/* Mobile menu */}
// //       {/* Mobile menu — full screen overlay */}

// // {/* Mobile Menu */}
// // {mobileOpen && (
// //   <>
// //     {/* Dark Background / Backdrop */}
// //     <div
// //       className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-[2px] md:hidden"
// //       onClick={() => setMobileOpen(false)}
// //       aria-hidden="true"
// //     />

// //     {/* Right Side Drawer */}
// //     <aside
// //       className="fixed inset-y-0 right-0 z-40 flex w-80 max-w-[88vw] flex-col overflow-hidden bg-white shadow-2xl md:hidden animate-slide-in-right"
// //       aria-label="Mobile navigation"
// //     >
// //       {/* Drawer Header */}
// //       <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4">
        
// //         {/* Logo */}
// //         <Link
// //           to={ROUTES.home}
// //           onClick={() => setMobileOpen(false)}
// //           aria-label="BazaarBook Home"
// //         >
// //           <BrandLogo size="sm" />
// //         </Link>

// //         {/* Close Button */}
// //         <button
// //           type="button"
// //           onClick={() => setMobileOpen(false)}
// //           aria-label="Close menu"
// //           className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-stone-100 hover:text-slate-900"
// //         >
// //           <svg
// //             className="h-5 w-5"
// //             viewBox="0 0 24 24"
// //             fill="none"
// //             stroke="currentColor"
// //             strokeWidth="2"
// //             strokeLinecap="round"
// //           >
// //             <path d="M6 6l12 12M6 18L18 6" />
// //           </svg>
// //         </button>
// //       </div>

// //       {/* Navigation Links */}
// //       <nav className="flex-1 overflow-y-auto bg-white p-4">
// //         <div className="flex flex-col gap-2">
// //           {[
// //             {
// //               label: 'Features',
// //               href: '#features',
// //               emoji: '✨',
// //             },
// //             {
// //               label: 'Kaise Kaam Karta Hai',
// //               href: '#how',
// //               emoji: '🚀',
// //             },
// //             {
// //               label: 'Pricing',
// //               href: '#pricing',
// //               emoji: '💰',
// //             },
// //             {
// //               label: 'FAQ',
// //               href: '#faq',
// //               emoji: '❓',
// //             },
// //           ].map((item) => (
// //             <a
// //               key={item.label}
// //               href={item.href}
// //               onClick={() => setMobileOpen(false)}
// //               className="flex min-h-[50px] w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-800 transition-all duration-200 hover:bg-brand-50 hover:text-brand-700 active:bg-brand-100"
// //             >
// //               <span
// //                 className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-lg"
// //                 aria-hidden="true"
// //               >
// //                 {item.emoji}
// //               </span>

// //               <span className="whitespace-nowrap">
// //                 {item.label}
// //               </span>
// //             </a>
// //           ))}
// //         </div>
// //       </nav>

// //       {/* Bottom Buttons */}
// //       <div className="shrink-0 space-y-3 border-t border-stone-200 bg-white p-4">
        
// //         {/* Login */}
// //         <Link
// //           to={ROUTES.login}
// //           onClick={() => setMobileOpen(false)}
// //           className="btn-ghost btn-md flex w-full items-center justify-center"
// //         >
// //           Login
// //         </Link>

// //         {/* Register */}
// //         <Link
// //           to={ROUTES.register}
// //           onClick={() => setMobileOpen(false)}
// //           className="btn-primary btn-md flex w-full items-center justify-center gap-2"
// //         >
// //           Free Shuru Karein
// //           <ArrowRight className="h-4 w-4" />
// //         </Link>
// //       </div>
// //     </aside>
// //   </>
// // )}
// //     </header>
// //   );
// // }

// // // ============ HERO ============
// // function Hero() {
// //   return (
// //     <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/30 to-white">
// //       {/* Decoration */}
// //       <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />

// //       <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
// //         <div className="mx-auto max-w-4xl text-center">
// //           {/* Badge */}
// //           <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-brand-700 shadow-soft backdrop-blur animate-slide-down">
// //             <span className="flex -space-x-1.5">
// //               {['🛒', '💊', '🏪'].map((e, i) => (
// //                 <span key={i} className="grid h-5 w-5 place-items-center rounded-full bg-white ring-2 ring-white text-[10px]">
// //                   {e}
// //                 </span>
// //               ))}
// //             </span>
// //             50,000+ dukaandaar bharosa karte hain
// //             <Sparkles className="h-3 w-3 text-accent-500" />
// //           </div>

// //           {/* Headline */}
// //           <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl text-balance">
// //             Aapki dukaan ka{' '}
// //             <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
// //               digital saathi
// //             </span>
// //           </h1>

// //           {/* Subheading */}
// //           <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl text-balance">
// //             Bill banao, udhaar track karo, kamai dekho —{' '}
// //             <strong className="font-bold text-slate-900">sab kuch ek app mein</strong>.
// //             Hindi mein, mobile par, bina internet bhi.
// //           </p>

// //           {/* CTA */}
// //           <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
// //             <Link to={ROUTES.register} className="btn-primary btn-lg w-full shadow-lg shadow-brand-500/20 sm:w-auto">
// //               Free Mein Shuru Karein
// //               <ArrowRight className="h-4 w-4" />
// //             </Link>
// //             <a href="#how" className="btn-outline btn-lg w-full sm:w-auto">
// //               <Play className="h-4 w-4" />
// //               Kaise Kaam Karta Hai
// //             </a>
// //           </div>

// //           {/* Trust line */}
// //           <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
// //             <span className="inline-flex items-center gap-1">
// //               <Check className="h-3 w-3 text-lime-600" />
// //               30 din free
// //             </span>
// //             <span className="inline-flex items-center gap-1">
// //               <Check className="h-3 w-3 text-lime-600" />
// //               Credit card nahi chahiye
// //             </span>
// //             <span className="inline-flex items-center gap-1">
// //               <Check className="h-3 w-3 text-lime-600" />
// //               2 minute mein setup
// //             </span>
// //           </div>
// //         </div>

// //         {/* App preview mockup */}
// //         <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
// //           <AppPreview />
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // function AppPreview() {
// //   return (
// //     <div className="relative">
// //       <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-r from-brand-400/20 via-accent-400/20 to-lime-400/20 blur-2xl" />
// //       <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl shadow-brand-500/10">
// //         {/* Browser chrome */}
// //         <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-50 px-4 py-3">
// //           <span className="h-3 w-3 rounded-full bg-red-400" />
// //           <span className="h-3 w-3 rounded-full bg-amber-400" />
// //           <span className="h-3 w-3 rounded-full bg-lime-400" />
// //           <div className="ml-3 flex-1">
// //             <div className="mx-auto w-40 rounded-full bg-white px-3 py-1 text-center text-[10px] font-mono text-slate-400 ring-1 ring-stone-200">
// //               bazaar-book.com/app
// //             </div>
// //           </div>
// //         </div>

// //         {/* Dashboard preview */}
// //         <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
// //           {/* Stat cards */}
// //           <div className="col-span-full grid grid-cols-3 gap-3">
// //             {[
// //               { l: 'Aaj Ki Kamai', v: '₹4,520', c: 'text-brand-600' },
// //               { l: 'Bills', v: '32', c: 'text-accent-600' },
// //               { l: 'Baki Udhaar', v: '₹8,900', c: 'text-red-600' }
// //             ].map((s) => (
// //               <div key={s.l} className="rounded-2xl bg-stone-50 p-3 sm:p-4">
// //                 <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:text-[10px]">{s.l}</p>
// //                 <p className={`mt-1 font-display text-base font-extrabold sm:text-2xl ${s.c}`}>{s.v}</p>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Chart */}
// //           <div className="col-span-full rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-4 sm:col-span-2">
// //             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">7 Din Ki Kamai</p>
// //             <div className="mt-4 flex h-24 items-end gap-2">
// //               {[40, 55, 35, 70, 85, 60, 90].map((h, i) => (
// //                 <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-500 to-accent-400" style={{ height: `${h}%` }} />
// //               ))}
// //             </div>
// //           </div>

// //           {/* Quick actions */}
// //           <div className="col-span-full rounded-2xl bg-gradient-to-br from-lime-50 to-emerald-50 p-4 sm:col-span-1">
// //             <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Quick Actions</p>
// //             <div className="mt-3 space-y-2">
// //               {['🧾 Naya Bill', '👥 Grahak Jodein', '📊 Report Dekhein'].map((a) => (
// //                 <div key={a} className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft">
// //                   {a}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // ============ STATS ============
// // function StatsBar() {
// //   return (
// //     <section className="border-y border-stone-200 bg-white/50 py-8">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
// //           {STATS.map((s) => (
// //             <div key={s.label} className="text-center">
// //               <p className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
// //                 {s.value}
// //               </p>
// //               <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
// //                 {s.label}
// //               </p>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ============ PROBLEM ============
// // function ProblemSection() {
// //   const problems = [
// //     'Udhaar ka hisaab copy mein — kho jaata hai',
// //     'Bill banane mein 10 minute lagte hain',
// //     'Stock kab khatam hua, pata nahi chalta',
// //     'Customer ko bill bhejne ke liye photo kheenchte ho',
// //     'Raat ko pata nahi aaj kitna kamaya'
// //   ];

// //   const solutions = [
// //     'Udhaar sab digital — kuch nahi khota',
// //     'Bill 30 second mein ready',
// //     'Stock alert khud aata hai',
// //     'Bill WhatsApp par direct bhejo',
// //     'Kamai report roz raat ko'
// //   ];

// //   return (
// //     <section className="py-14 sm:py-20 lg:py-24">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="mx-auto max-w-3xl text-center">
// //           <span className="chip-danger">Dukaan ki asli problem</span>
// //           <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
// //             Rozana ki dukaan, rozana ki tension? 😰
// //           </h2>
// //           <p className="mt-4 text-lg text-slate-600">
// //             Ye 5 problems har dukaandaar ko pareshan karti hain. BazaarBook sab solve karta hai.
// //           </p>
// //         </div>

// //         <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6">
// //           {/* Before */}
// //           <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 sm:p-8">
// //             <div className="flex items-center gap-2">
// //               <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-100 text-red-600">
// //                 <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
// //                   <path d="M6 6l12 12M6 18L18 6" />
// //                 </svg>
// //               </div>
// //               <div>
// //                 <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">Pehle</p>
// //                 <p className="font-display text-lg font-bold text-red-900">Traditional tarika</p>
// //               </div>
// //             </div>
// //             <ul className="mt-6 space-y-3">
// //               {problems.map((p) => (
// //                 <li key={p} className="flex items-start gap-2 text-sm text-red-800">
// //                   <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
// //                     <path d="M6 6l12 12M6 18L18 6" />
// //                   </svg>
// //                   <span>{p}</span>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>

// //           {/* After */}
// //           <div className="relative rounded-3xl border-2 border-lime-300 bg-gradient-to-br from-lime-50 to-emerald-50 p-6 shadow-lg shadow-lime-500/10 sm:p-8">
// //             <span className="absolute -top-3 left-6 inline-flex rounded-full bg-lime-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
// //               BazaarBook ke saath
// //             </span>
// //             <div className="flex items-center gap-2">
// //               <div className="grid h-10 w-10 place-items-center rounded-2xl bg-lime-100 text-lime-700">
// //                 <Check className="h-5 w-5" strokeWidth={3.5} />
// //               </div>
// //               <div>
// //                 <p className="text-[10px] font-bold uppercase tracking-widest text-lime-700">Ab</p>
// //                 <p className="font-display text-lg font-bold text-lime-900">Digital dukaan</p>
// //               </div>
// //             </div>
// //             <ul className="mt-6 space-y-3">
// //               {solutions.map((s) => (
// //                 <li key={s} className="flex items-start gap-2 text-sm font-semibold text-lime-900">
// //                   <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime-600" strokeWidth={3.5} />
// //                   <span>{s}</span>
// //                 </li>
// //               ))}
// //             </ul>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ============ FEATURES ============
// // function FeaturesSection() {
// //   const COLORS: any = {
// //     brand:   'bg-brand-50 text-brand-600 ring-brand-100',
// //     accent:  'bg-accent-50 text-accent-600 ring-accent-100',
// //     success: 'bg-lime-50 text-lime-600 ring-lime-100',
// //     danger:  'bg-red-50 text-red-500 ring-red-100'
// //   };

// //   return (
// //     <section id="features" className="bg-stone-50 py-14 sm:py-20 lg:py-24">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="mx-auto max-w-3xl text-center">
// //           <span className="chip-brand">Sab features</span>
// //           <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
// //             Sab kuch jo aapki dukaan ko chahiye 🎯
// //           </h2>
// //           <p className="mt-4 text-lg text-slate-600">
// //             Ek app, saare kaam. Billing se lekar report tak — sab Hindi mein.
// //           </p>
// //         </div>

// //         <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
// //           {FEATURES.map((f) => {
// //             const Icon = f.icon;
// //             return (
// //               <div
// //                 key={f.title}
// //                 className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift"
// //               >
// //                 <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

// //                 <div className={`grid h-14 w-14 place-items-center rounded-2xl ring-1 ${COLORS[f.color]}`}>
// //                   <Icon className="h-7 w-7" />
// //                 </div>

// //                 <h3 className="mt-5 font-display text-lg font-bold text-slate-900">{f.title}</h3>
// //                 <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ============ HOW IT WORKS ============
// // function HowItWorksSection() {
// //   return (
// //     <section id="how" className="bg-gradient-to-b from-brand-50 to-white py-16 sm:py-20 lg:py-24">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="mx-auto max-w-3xl text-center">
// //           <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
// //             🚀 Kaise chalega
// //           </span>
// //           <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
// //             3 simple steps, 2 minute
// //           </h2>
// //           <p className="mt-4 text-base text-slate-600 sm:text-lg">
// //             Koi training nahi, koi jhanjhat nahi. Bas shuru karein.
// //           </p>
// //         </div>

// //         <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
// //           {STEPS.map((s, i) => (
// //             <div key={s.n} className="relative">
// //               {i < STEPS.length - 1 && (
// //                 <div className="absolute left-8 top-16 hidden lg:block">
// //                   <ArrowRight className="h-6 w-6 text-brand-400" />
// //                 </div>
// //               )}

// //               <div className="relative h-full rounded-3xl border border-stone-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift sm:p-6">
// //                 <div className="flex items-center gap-3">
// //                   <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl shadow-md">
// //                     {s.emoji}
// //                   </div>
// //                   <span className="font-mono text-5xl font-extrabold text-brand-100">
// //                     0{s.n}
// //                   </span>
// //                 </div>

// //                 <h3 className="mt-4 font-display text-lg font-bold text-slate-900 sm:text-xl">
// //                   {s.title}
// //                 </h3>
// //                 <p className="mt-2 text-sm leading-relaxed text-slate-600">
// //                   {s.desc}
// //                 </p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <div className="mt-12 text-center">
// //           <Link to={ROUTES.register} className="btn-primary btn-lg">
// //             Free Account Banayein
// //             <ArrowRight className="h-4 w-4" />
// //           </Link>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }


// // // ============ TESTIMONIALS ============
// // function TestimonialsSection() {
// //   return (
// //     <section className="py-14 sm:py-20 lg:py-24">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="mx-auto max-w-3xl text-center">
// //           <span className="chip-accent">Dukaandaar ki zubaani</span>
// //           <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
// //             Unki kahani, aapki inspiration ✨
// //           </h2>
// //           <p className="mt-4 text-lg text-slate-600">
// //             Roz 50,000+ dukaandaar BazaarBook se apni dukaan chalate hain.
// //           </p>
// //         </div>

// //         <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
// //           {TESTIMONIALS.map((t) => (
// //             <div key={t.name} className="group relative flex flex-col rounded-3xl border border-stone-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-lift">
// //               {/* Rating */}
// //               <div className="flex gap-0.5">
// //                 {Array.from({ length: t.rating }).map((_, i) => (
// //                   <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
// //                 ))}
// //               </div>

// //               <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">"{t.quote}"</p>

// //               <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
// //                 <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-2xl">
// //                   {t.emoji}
// //                 </div>
// //                 <div className="min-w-0">
// //                   <p className="truncate text-sm font-bold text-slate-900">{t.name}</p>
// //                   <p className="truncate text-xs text-slate-500">{t.shop} • {t.city}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ============ PRICING PREVIEW ============
// // function PricingPreview() {
// //   const PLANS = [
// //     { code: 'free',    name: 'Free',     emoji: '🌱', price: 0,    tagline: 'Shuru karne ke liye', features: ['20 bills / mahina', '50 products', '25 customers'] },
// //     { code: 'starter', name: 'Starter',  emoji: '🚀', price: 99,   tagline: 'Chhoti dukaan',        features: ['200 bills / mahina', '500 products', 'Khata + reminder'] },
// //     { code: 'pro',     name: 'Pro',      emoji: '⭐', price: 249,  tagline: 'Sabse popular',        popular: true, features: ['Unlimited bills', 'GST billing', 'Advanced reports', 'Thermal print'] },
// //     { code: 'business',name: 'Business', emoji: '👑', price: 599,  tagline: 'Badhi dukaan',         features: ['Sab kuch Pro mein', 'Multi-shop (3)', 'API access'] }
// //   ];

// //   return (
// //     <section id="pricing" className="bg-stone-50 py-14 sm:py-20 lg:py-24">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="mx-auto max-w-3xl text-center">
// //           <span className="chip-brand">Pricing</span>
// //           <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
// //             Simple, honest pricing 💰
// //           </h2>
// //           <p className="mt-4 text-lg text-slate-600">
// //             Free se shuru karein, badhne par upgrade karein. Kabhi bhi cancel.
// //           </p>
// //         </div>

// //         <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
// //           {PLANS.map((p) => (
// //             <div
// //               key={p.code}
// //               className={`relative flex flex-col rounded-3xl border bg-white p-6 transition ${
// //                 p.popular
// //                   ? 'border-brand-500 shadow-xl shadow-brand-500/10 lg:-translate-y-2'
// //                   : 'border-stone-200 hover:border-stone-300'
// //               }`}
// //             >
// //               {p.popular && (
// //                 <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
// //                   <Sparkles className="h-3 w-3" />
// //                   Sabse Popular
// //                 </span>
// //               )}

// //               <div className="flex items-center gap-2">
// //                 <span className="text-2xl">{p.emoji}</span>
// //                 <div>
// //                   <h3 className="font-display text-lg font-extrabold text-slate-900">{p.name}</h3>
// //                   <p className="text-xs text-slate-500">{p.tagline}</p>
// //                 </div>
// //               </div>

// //               <div className="mt-5">
// //                 {p.price === 0 ? (
// //                   <p className="font-display text-3xl font-extrabold text-slate-900">Free</p>
// //                 ) : (
// //                   <div className="flex items-baseline gap-1">
// //                     <span className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">₹{p.price}</span>
// //                     <span className="text-sm font-semibold text-slate-500">/mahina</span>
// //                   </div>
// //                 )}
// //               </div>

// //               <ul className="mt-5 flex-1 space-y-2">
// //                 {p.features.map((f) => (
// //                   <li key={f} className="flex items-start gap-2 text-xs text-slate-700">
// //                     <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime-100 text-lime-700">
// //                       <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
// //                     </span>
// //                     {f}
// //                   </li>
// //                 ))}
// //               </ul>

// //               <Link to={ROUTES.register} className={`btn btn-md mt-6 w-full ${p.popular ? 'btn-primary' : 'btn-outline'}`}>
// //                 {p.price === 0 ? 'Free mein shuru' : `${p.name} chunein`}
// //               </Link>
// //             </div>
// //           ))}
// //         </div>

// //         <div className="mt-10 text-center">
// //           <Link to={ROUTES.register} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline">
// //             Detailed comparison dekhein
// //             <ArrowRight className="h-4 w-4" />
// //           </Link>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ============ FAQ ============
// // function FaqSection() {
// //   const [open, setOpen] = useState<number | null>(0);

// //   return (
// //     <section id="faq" className="py-14 sm:py-20 lg:py-24">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="mx-auto max-w-3xl text-center">
// //           <span className="chip-accent">FAQ</span>
// //           <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
// //             Aksar puche jaane wale sawaal ❓
// //           </h2>
// //           <p className="mt-4 text-lg text-slate-600">
// //             Aur bhi sawaal hain? WhatsApp par poochein —{' '}
// //             <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="font-bold text-brand-600 hover:underline">
// //               +91 98765 43210
// //             </a>
// //           </p>
// //         </div>

// //         <div className="mx-auto mt-12 max-w-3xl">
// //           <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white divide-y divide-stone-100">
// //             {FAQS.map((f, i) => (
// //               <div key={i}>
// //                 <button
// //                   onClick={() => setOpen(open === i ? null : i)}
// //                   className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-stone-50 sm:px-6"
// //                 >
// //                   <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
// //                     <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //                       <circle cx="12" cy="12" r="10" />
// //                       <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
// //                     </svg>
// //                   </span>
// //                   <span className="flex-1 text-sm font-bold text-slate-900 sm:text-base">{f.q}</span>
// //                   <ChevronDown
// //                     className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
// //                       open === i ? 'rotate-180 text-brand-600' : ''
// //                     }`}
// //                   />
// //                 </button>
// //                 {open === i && (
// //                   <div className="animate-slide-down border-t border-stone-100 bg-stone-50/60 px-5 py-4 pl-16 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pl-20">
// //                     {f.a}
// //                   </div>
// //                 )}
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ============ FINAL CTA ============
// // function FinalCta() {
// //   return (
// //     <section className="py-14 sm:py-20 lg:py-24">
// //       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
// //         <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 px-6 py-16 text-center shadow-2xl shadow-brand-500/20 sm:px-12 sm:py-20">
// //           <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_80%,white_0,transparent_40%)]" />
// //           <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
// //           <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

// //           <div className="relative">
// //             <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur ring-1 ring-white/20">
// //               🎉 30 din free
// //             </span>

// //             <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
// //               Aaj hi apni dukaan ko
// //               <br />
// //               <span className="bg-gradient-to-r from-amber-200 via-lime-200 to-white bg-clip-text text-transparent">
// //                 digitally banayein
// //               </span>
// //             </h2>

// //             <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
// //               2 minute mein setup. Credit card nahi chahiye. Kabhi bhi cancel kar sakte hain.
// //             </p>

// //             <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white/95">
// //               {['Bina card signup', 'Turant ready', 'Hindi interface', 'Offline support'].map((t) => (
// //                 <span key={t} className="inline-flex items-center gap-1.5">
// //                   <Check className="h-4 w-4" strokeWidth={3} />
// //                   {t}
// //                 </span>
// //               ))}
// //             </div>

// //             <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
// //               <Link to={ROUTES.register} className="btn btn-lg w-full bg-white text-brand-700 shadow-xl hover:bg-white/95 sm:w-auto">
// //                 Free Account Banayein
// //                 <ArrowRight className="h-4 w-4" />
// //               </Link>
// //               <Link to={ROUTES.login} className="btn btn-lg w-full border-2 border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:w-auto">
// //                 Pehle se account hai? Login
// //               </Link>
// //             </div>

// //             <p className="mt-6 text-xs text-white/70">
// //               🤝 50,000+ dukaandaar BazaarBook par bharosa karte hain
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// // // ============ FOOTER ============
// // function Footer() {
// //   const SECTIONS = [
// //     {
// //       title: 'Product',
// //       links: [
// //         { label: 'Features', href: '#features' },
// //         { label: 'Pricing', href: '#pricing' },
// //         { label: 'Kaise chalega', href: '#how' }
// //       ]
// //     },
// //     {
// //       title: 'Support',
// //       links: [
// //         { label: 'Help Center', href: '#' },
// //         { label: 'WhatsApp', href: 'https://wa.me/919876543210' },
// //         { label: 'Videos', href: '#' }
// //       ]
// //     },
// //     {
// //       title: 'Legal',
// //       links: [
// //         { label: 'Terms', href: '/terms' },
// //         { label: 'Privacy', href: '/privacy' },
// //         { label: 'Refund', href: '/refund' }
// //       ]
// //     }
// //   ];

// //   return (
// //     <footer className="border-t border-stone-200 bg-stone-50">
// //       <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
// //         {/* Top — Brand + Contact */}
// //         <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
// //           <div className="max-w-sm">
// //             <BrandLogo size="sm" />
// //             <p className="mt-3 text-xs text-slate-600 sm:text-sm">
// //               Bharat ke chhote dukaandaaron ke liye digital billing, khata aur report.
// //             </p>
// //           </div>

// //           <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
// //             <a
// //               href="https://wa.me/919876543210"
// //               target="_blank"
// //               rel="noopener noreferrer"
// //               className="inline-flex items-center gap-1.5 hover:text-brand-600"
// //             >
// //               <MessageCircle className="h-3.5 w-3.5" />
// //               +91 98765 43210
// //             </a>
// //             <a
// //               href="mailto:help@bazaar-book.com"
// //               className="inline-flex items-center gap-1.5 hover:text-brand-600"
// //             >
// //               <FileText className="h-3.5 w-3.5" />
// //               help@bazaar-book.com
// //             </a>
// //           </div>
// //         </div>

// //         {/* Middle — Links (3 columns) */}
// //         <div className="mt-8 grid grid-cols-2 gap-6 border-t border-stone-200 pt-8 sm:grid-cols-3">
// //           {SECTIONS.map((s) => (
// //             <div key={s.title}>
// //               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
// //                 {s.title}
// //               </h4>
// //               <ul className="mt-3 space-y-2">
// //                 {s.links.map((l) => (
// //                   <li key={l.label}>
// //                     {l.href.startsWith('http') ? (
// //                       <a
// //                         href={l.href}
// //                         target="_blank"
// //                         rel="noopener noreferrer"
// //                         className="text-xs text-slate-600 transition hover:text-brand-600 sm:text-sm"
// //                       >
// //                         {l.label}
// //                       </a>
// //                     ) : (
// //                       <a
// //                         href={l.href}
// //                         className="text-xs text-slate-600 transition hover:text-brand-600 sm:text-sm"
// //                       >
// //                         {l.label}
// //                       </a>
// //                     )}
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Bottom — Copyright + Social */}
// //         <div className="mt-8 flex flex-col items-center gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
// //           <p className="text-[11px] text-slate-500 sm:text-xs">
// //             © {new Date().getFullYear()} BazaarBook. Made with ❤️ in India.
// //           </p>

// //           <div className="flex items-center gap-2">
// //             {[
// //               { emoji: '📱', label: 'Instagram', href: '#' },
// //               { emoji: '▶️', label: 'YouTube', href: '#' },
// //               { emoji: '🐦', label: 'Twitter', href: '#' }
// //             ].map((s) => (
// //               <a
// //                 key={s.label}
// //                 href={s.href}
// //                 aria-label={s.label}
// //                 className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm ring-1 ring-stone-200 transition hover:ring-brand-300"
// //               >
// //                 {s.emoji}
// //               </a>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </footer>
// //   );
// // }








// import { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   ArrowRight, Check, Star, Users, TrendingUp, Package, Receipt,
//   MessageCircle, Shield, Smartphone, ChevronDown, Play, Sparkles,
//   Store, FileText, X, Menu, Crown
// } from 'lucide-react';
// import { ROUTES } from '@/lib/constants';
// import { BrandLogo } from '@/components/BrandLogo';
// import { cn } from '@/lib/cn';

// // ============================================
// // DATA
// // ============================================
// const STATS = [
//   { value: '50,000+', label: 'Dukaandaar' },
//   { value: '₹200 Cr+', label: 'Bills Banaye' },
//   { value: '4.8★',    label: 'Rating' },
//   { value: '24/7',    label: 'Support' }
// ];

// const FEATURES = [
//   {
//     icon: Receipt,
//     title: '30 Second Bill',
//     desc: 'Ek tap mein bill banayein — print karein ya WhatsApp par bhejein.',
//     color: 'brand'
//   },
//   {
//     icon: Users,
//     title: 'Udhaar Khata',
//     desc: 'Kisne kitna dena hai — sab track karein. WhatsApp reminder bhejein.',
//     color: 'danger'
//   },
//   {
//     icon: Package,
//     title: 'Stock Alert',
//     desc: 'Saman khatam hone se pehle alert. Auto reorder level.',
//     color: 'accent'
//   },
//   {
//     icon: TrendingUp,
//     title: 'Kamai Report',
//     desc: 'Din, hafta, mahina — poora hisaab. Real profit tracking.',
//     color: 'success'
//   },
//   {
//     icon: Smartphone,
//     title: 'Offline Bhi Chalega',
//     desc: 'Internet band ho toh bhi bill banao — auto sync jab online aao.',
//     color: 'brand'
//   },
//   {
//     icon: Shield,
//     title: '100% Safe',
//     desc: 'Data encrypted. Aapka business, aapka data — koi leak nahi.',
//     color: 'accent'
//   }
// ];

// const STEPS = [
//   {
//     n: 1,
//     title: '2 Minute Mein Setup',
//     desc: 'Mobile number se free account banayein. Credit card nahi chahiye.',
//     emoji: '📝'
//   },
//   {
//     n: 2,
//     title: 'Saman Aur Grahak Jodein',
//     desc: 'Ek baar list banayein — ya seedha bill banana shuru karein.',
//     emoji: '📦'
//   },
//   {
//     n: 3,
//     title: 'Bill Banao, Kamai Badhao',
//     desc: 'Roz bill banayein, udhaar track karein, profit dekhein.',
//     emoji: '🚀'
//   }
// ];

// const TESTIMONIALS = [
//   {
//     name: 'Ramesh Kumar',
//     shop: 'Sharma Kirana Store',
//     city: 'Ranchi',
//     emoji: '🛒',
//     quote: 'Pehle udhaar copy mein tha — ab sab mobile par. WhatsApp reminder se ₹40,000 wapas mila!',
//     rating: 5
//   },
//   {
//     name: 'Sunita Devi',
//     shop: 'Sunita Medical',
//     city: 'Patna',
//     emoji: '💊',
//     quote: 'Bill banana bahut aasan hai. Customer WhatsApp par bill dekh leta hai — bharosa badh gaya.',
//     rating: 5
//   },
//   {
//     name: 'Mohan Lal',
//     shop: 'Mohan General Store',
//     city: 'Delhi',
//     emoji: '🏪',
//     quote: 'Roz raat ko kamai report dekhta hun. Kaunsa maal zyada bikta hai — pata chal jaata hai.',
//     rating: 5
//   }
// ];

// const FAQS = [
//   {
//     q: 'Kya BazaarBook bilkul free hai?',
//     a: 'Haan! Free plan mein 20 bills, 50 products aur 25 customers tak sab features milte hain. Business badhne par ₹99/month se upgrade kar sakte hain.'
//   },
//   {
//     q: 'Mere data ka kya hoga? Safe hai?',
//     a: 'Aapka poora data encrypted cloud par safe hai. Aap kabhi bhi CSV mein export kar sakte hain. Hum data kisi ke saath share nahi karte.'
//   },
//   {
//     q: 'Internet nahi hai toh chalega?',
//     a: 'Bilkul! BazaarBook offline bhi kaam karta hai. Internet aate hi sab automatically sync ho jata hai.'
//   },
//   {
//     q: 'Kitne devices par use kar sakta hun?',
//     a: 'Ek account se mobile, tablet aur laptop — teeno par use kar sakte hain. Sab par same data dikhega.'
//   },
//   {
//     q: 'Bill print kaise karun?',
//     a: 'Bluetooth thermal printer (58mm / 80mm) support hai. Ya A4 paper par normal printer se print kar sakte hain. WhatsApp par bhi bhej sakte hain.'
//   },
//   {
//     q: 'Paisa kaise pay karun?',
//     a: 'Razorpay se UPI (GPay, PhonePe, Paytm), Debit/Credit Card, Net Banking — sab supported hai. Auto-renew option bhi hai.'
//   }
// ];

// const DEMO_VIDEOS = [
//   {
//     id: 'demo-1',
//     youtubeId: 'JVdS9PRKSnI',
//     title: 'BazaarBook kaise kaam karta hai?',
//     subtitle: '2 minute mein poora tour',
//     duration: '2:15',
//     emoji: '🎬',
//     badge: 'App Demo'
//   },
//   {
//     id: 'demo-2',
//     youtubeId: 'dQw4w9WgXcQ',
//     title: 'Bill 30 second mein banao',
//     subtitle: 'Billing feature step-by-step',
//     duration: '1:45',
//     emoji: '🧾',
//     badge: 'Features'
//   }
// ];

// const TESTIMONIAL_VIDEOS = [
//   {
//     id: 't-1',
//     youtubeId: 'dQw4w9WgXcQ',
//     name: 'Ramesh Kumar',
//     shop: 'Sharma Kirana Store',
//     city: 'Ranchi',
//     emoji: '🛒',
//     duration: '1:20',
//     quote: 'Pehle udhaar copy mein tha — ab sab mobile par'
//   },
//   {
//     id: 't-2',
//     youtubeId: 'dQw4w9WgXcQ',
//     name: 'Sunita Devi',
//     shop: 'Sunita Medical',
//     city: 'Patna',
//     emoji: '💊',
//     duration: '0:58',
//     quote: 'Bill WhatsApp par bhejti hoon — customer khush'
//   },
//   {
//     id: 't-3',
//     youtubeId: 'dQw4w9WgXcQ',
//     name: 'Mohan Lal',
//     shop: 'Mohan General Store',
//     city: 'Delhi',
//     emoji: '🏪',
//     duration: '1:35',
//     quote: 'Roz raat kamai report dekhta hoon'
//   }
// ];

// // ============================================
// // SCROLL REVEAL HOOK
// // ============================================
// function useScrollReveal() {
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('in-view');
//             observer.unobserve(entry.target);
//           }
//         });
//       },
//       { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
//     );

//     const scan = () => {
//       document.querySelectorAll('.reveal:not(.in-view)').forEach((el) => observer.observe(el));
//     };
//     scan();
//     const t = setTimeout(scan, 100);

//     return () => {
//       clearTimeout(t);
//       observer.disconnect();
//     };
//   }, []);
// }

// // ============================================
// // MAIN COMPONENT
// // ============================================
// export default function LandingPage() {
//   useScrollReveal();

//   return (
//     <div className="min-h-screen overflow-x-hidden bg-white">
//       <Navbar />
//       {/* Padding for fixed header */}
//       <div className="h-16" />
//       <Hero />
//       <StatsBar />
//       <ProblemSection />
//       <FeaturesSection />
//       <HowItWorksSection />
//       <VideoSection />
//       <TestimonialsSection />
//       <PricingPreview />
//       <FaqSection />
//       <FinalCta />
//       <Footer />
//     </div>
//   );
// }

// // ============================================
// // NAVBAR — Sticky, scroll-aware
// // ============================================
// function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     window.addEventListener('scroll', onScroll, { passive: true });
//     onScroll();
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   // Lock body scroll when drawer open
//   useEffect(() => {
//     if (mobileOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//     return () => {
//       document.body.style.overflow = '';
//     };
//   }, [mobileOpen]);

//   const NAV_LINKS = [
//     { label: 'Features', href: '#features' },
//     { label: 'Kaise Chalega', href: '#how' },
//     { label: 'Pricing', href: '#pricing' },
//     { label: 'FAQ', href: '#faq' }
//   ];

//   return (
//     <>
//       <header
//         className={cn(
//           'fixed inset-x-0 top-0 z-[100] transition-all duration-300',
//     scrolled
//       ? 'border-b border-stone-200 bg-white/95 backdrop-blur-lg shadow-sm'
//       : 'border-b border-transparent bg-white'
//   )}
//   style={{ WebkitTransform: 'translate3d(0, 0, 0)' }}
//       >
//         <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
//           <Link to={ROUTES.home} className="shrink-0">
//             <BrandLogo size="sm" />
//           </Link>

//           {/* Desktop nav */}
//           <nav className="hidden items-center gap-8 md:flex">
//             {NAV_LINKS.map((item) => (
//               <a
//                 key={item.href}
//                 href={item.href}
//                 className="text-sm font-semibold text-slate-600 transition-colors hover:text-brand-600"
//               >
//                 {item.label}
//               </a>
//             ))}
//           </nav>

//           {/* Desktop actions */}
//           <div className="hidden items-center gap-2 md:flex">
//             <Link to={ROUTES.login} className="btn-ghost btn-md">
//               Login
//             </Link>
//             <Link to={ROUTES.register} className="btn-primary btn-md">
//               Free Shuru Karein
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setMobileOpen(true)}
//             className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-stone-100 md:hidden"
//             aria-label="Menu kholen"
//           >
//             <Menu className="h-5 w-5" />
//           </button>
//         </div>
//       </header>

//       {/* Mobile Drawer */}
//       {mobileOpen && (
//         <MobileDrawer
//           onClose={() => setMobileOpen(false)}
//           links={NAV_LINKS}
//         />
//       )}
//     </>
//   );
// }

// // ============================================
// // MOBILE DRAWER
// // ============================================
// function MobileDrawer({
//   onClose,
//   links
// }: {
//   onClose: () => void;
//   links: { label: string; href: string }[];
// }) {
//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
//     window.addEventListener('keydown', onKey);
//     return () => window.removeEventListener('keydown', onKey);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 z-[110] md:hidden">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in"
//         onClick={onClose}
//       />

//       {/* Panel */}
//       <div className="absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl animate-slide-in-right">
//         {/* Header */}
//         <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 px-4">
//           <BrandLogo size="sm" />
//           <button
//             onClick={onClose}
//             className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-stone-100"
//             aria-label="Band karein"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Links */}
//         <nav className="flex-1 overflow-y-auto p-4">
//           <div className="space-y-1">
//             {links.map((item, i) => (
//               <a
//                 key={item.href}
//                 href={item.href}
//                 onClick={onClose}
//                 className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
//               >
//                 <span className="text-lg">
//                   {['✨', '🚀', '💰', '❓'][i] || '•'}
//                 </span>
//                 {item.label}
//               </a>
//             ))}
//           </div>

//           {/* Trust card */}
//           <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-4 ring-1 ring-brand-100">
//             <div className="flex items-center gap-2">
//               <Sparkles className="h-4 w-4 text-brand-600" />
//               <span className="text-xs font-bold text-brand-700">
//                 50,000+ dukaandaar
//               </span>
//             </div>
//             <p className="mt-1 text-xs text-slate-600">
//               BazaarBook par bharosa karte hain
//             </p>
//           </div>
//         </nav>

//         {/* Footer CTA */}
//         <div className="shrink-0 space-y-2 border-t border-stone-200 bg-white p-4">
//           <Link
//             to={ROUTES.login}
//             onClick={onClose}
//             className="btn-ghost btn-md w-full"
//           >
//             Login
//           </Link>
//           <Link
//             to={ROUTES.register}
//             onClick={onClose}
//             className="btn-primary btn-md w-full"
//           >
//             Free Shuru Karein
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // HERO
// // ============================================
// function Hero() {
//   return (
//     <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/40 to-white">
//       <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.18),transparent_60%)]" />

//       <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
//         <div className="mx-auto max-w-4xl text-center">
//           <div className="reveal inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-brand-700 shadow-soft backdrop-blur">
//             <span className="flex -space-x-1.5">
//               {['🛒', '💊', '🏪'].map((e, i) => (
//                 <span
//                   key={i}
//                   className="grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] ring-2 ring-white"
//                 >
//                   {e}
//                 </span>
//               ))}
//             </span>
//             50,000+ dukaandaar bharosa karte hain
//             <Sparkles className="h-3 w-3 text-accent-500" />
//           </div>

//           <h1 className="reveal mt-6 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl text-balance">
//             Aapki dukaan ka{' '}
//             <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
//               digital saathi
//             </span>
//           </h1>

//           <p className="reveal mx-auto mt-5 max-w-2xl text-base text-slate-600 sm:mt-6 sm:text-xl text-balance">
//             Bill banao, udhaar track karo, kamai dekho —{' '}
//             <strong className="font-bold text-slate-900">
//               sab kuch ek app mein
//             </strong>
//             . Hindi mein, mobile par, bina internet bhi.
//           </p>

//           <div className="reveal mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row">
//             <Link
//               to={ROUTES.register}
//               className="btn-primary btn-lg w-full shadow-lg shadow-brand-500/20 sm:w-auto"
//             >
//               Free Mein Shuru Karein
//               <ArrowRight className="h-4 w-4" />
//             </Link>
//             <a href="#how" className="btn-outline btn-lg w-full sm:w-auto">
//               <Play className="h-4 w-4" />
//               Kaise Kaam Karta Hai
//             </a>
//           </div>

//           <div className="reveal mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-500">
//             {[
//               '30 din free',
//               'Credit card nahi chahiye',
//               '2 minute mein setup'
//             ].map((t) => (
//               <span key={t} className="inline-flex items-center gap-1">
//                 <Check className="h-3 w-3 text-lime-600" strokeWidth={3} />
//                 {t}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="reveal mx-auto mt-12 max-w-4xl sm:mt-16 lg:mt-20">
//           <AppPreview />
//         </div>
//       </div>
//     </section>
//   );
// }

// function AppPreview() {
//   return (
//     <div className="relative">
//       <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-r from-brand-400/20 via-accent-400/20 to-lime-400/20 blur-2xl" />
//       <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl shadow-brand-500/10">
//         {/* Browser chrome */}
//         <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-50 px-4 py-3">
//           <span className="h-3 w-3 rounded-full bg-red-400" />
//           <span className="h-3 w-3 rounded-full bg-amber-400" />
//           <span className="h-3 w-3 rounded-full bg-lime-400" />
//           <div className="ml-3 flex-1">
//             <div className="mx-auto w-40 max-w-full truncate rounded-full bg-white px-3 py-1 text-center text-[10px] font-mono text-slate-400 ring-1 ring-stone-200">
//               bazaar-book.com/app
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-3 p-4 sm:gap-4 sm:p-6 lg:p-8">
//           <div className="grid grid-cols-3 gap-2 sm:gap-3">
//             {[
//               { l: 'Aaj Ki Kamai', v: '₹4,520', c: 'text-brand-600' },
//               { l: 'Bills', v: '32', c: 'text-accent-600' },
//               { l: 'Baki Udhaar', v: '₹8,900', c: 'text-red-600' }
//             ].map((s) => (
//               <div key={s.l} className="rounded-2xl bg-stone-50 p-2.5 sm:p-4">
//                 <p className="text-[8px] font-bold uppercase tracking-wider text-slate-500 sm:text-[10px]">
//                   {s.l}
//                 </p>
//                 <p
//                   className={cn(
//                     'mt-1 font-display text-sm font-extrabold sm:text-2xl',
//                     s.c
//                   )}
//                 >
//                   {s.v}
//                 </p>
//               </div>
//             ))}
//           </div>

//           <div className="grid gap-3 sm:grid-cols-3">
//             <div className="col-span-full rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-4 sm:col-span-2">
//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                 7 Din Ki Kamai
//               </p>
//               <div className="mt-3 flex h-16 items-end gap-1.5 sm:mt-4 sm:h-24 sm:gap-2">
//                 {[40, 55, 35, 70, 85, 60, 90].map((h, i) => (
//                   <div
//                     key={i}
//                     className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-500 to-accent-400"
//                     style={{ height: `${h}%` }}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="col-span-full rounded-2xl bg-gradient-to-br from-lime-50 to-emerald-50 p-4 sm:col-span-1">
//               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                 Quick Actions
//               </p>
//               <div className="mt-3 space-y-2">
//                 {['🧾 Naya Bill', '👥 Grahak', '📊 Report'].map((a) => (
//                   <div
//                     key={a}
//                     className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft"
//                   >
//                     {a}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // STATS BAR
// // ============================================
// function StatsBar() {
//   return (
//     <section className="border-y border-stone-200 bg-white/70 py-8 sm:py-10">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
//           {STATS.map((s) => (
//             <div key={s.label} className="reveal text-center">
//               <p className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
//                 {s.value}
//               </p>
//               <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 sm:text-xs">
//                 {s.label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ============================================
// // PROBLEM
// // ============================================
// function ProblemSection() {
//   const problems = [
//     'Udhaar ka hisaab copy mein — kho jaata hai',
//     'Bill banane mein 10 minute lagte hain',
//     'Stock kab khatam hua, pata nahi chalta',
//     'Customer ko bill bhejne ke liye photo kheenchte ho',
//     'Raat ko pata nahi aaj kitna kamaya'
//   ];
//   const solutions = [
//     'Udhaar sab digital — kuch nahi khota',
//     'Bill 30 second mein ready',
//     'Stock alert khud aata hai',
//     'Bill WhatsApp par direct bhejo',
//     'Kamai report roz raat ko'
//   ];

//   return (
//     <section className="py-14 sm:py-20 lg:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="reveal mx-auto max-w-3xl text-center">
//           <span className="chip-danger">Dukaan ki asli problem</span>
//           <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
//             Rozana ki dukaan, rozana ki tension? 😰
//           </h2>
//           <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
//             Ye 5 problems har dukaandaar ko pareshan karti hain. BazaarBook
//             sab solve karta hai.
//           </p>
//         </div>

//         <div className="mt-10 grid gap-4 sm:mt-12 md:grid-cols-2 md:gap-6">
//           <div className="reveal rounded-3xl border border-red-200 bg-red-50/50 p-5 sm:p-6 lg:p-8">
//             <div className="flex items-center gap-2">
//               <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-100 text-red-600">
//                 <X className="h-5 w-5" strokeWidth={3} />
//               </div>
//               <div>
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">
//                   Pehle
//                 </p>
//                 <p className="font-display text-base font-bold text-red-900 sm:text-lg">
//                   Traditional tarika
//                 </p>
//               </div>
//             </div>
//             <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
//               {problems.map((p) => (
//                 <li
//                   key={p}
//                   className="flex items-start gap-2 text-sm text-red-800"
//                 >
//                   <X
//                     className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
//                     strokeWidth={3}
//                   />
//                   <span>{p}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div className="reveal relative rounded-3xl border-2 border-lime-300 bg-gradient-to-br from-lime-50 to-emerald-50 p-5 shadow-lg shadow-lime-500/10 sm:p-6 lg:p-8">
//             <span className="absolute -top-3 left-5 inline-flex rounded-full bg-lime-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md sm:left-6">
//               BazaarBook ke saath
//             </span>
//             <div className="flex items-center gap-2">
//               <div className="grid h-10 w-10 place-items-center rounded-2xl bg-lime-100 text-lime-700">
//                 <Check className="h-5 w-5" strokeWidth={3.5} />
//               </div>
//               <div>
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-lime-700">
//                   Ab
//                 </p>
//                 <p className="font-display text-base font-bold text-lime-900 sm:text-lg">
//                   Digital dukaan
//                 </p>
//               </div>
//             </div>
//             <ul className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
//               {solutions.map((s) => (
//                 <li
//                   key={s}
//                   className="flex items-start gap-2 text-sm font-semibold text-lime-900"
//                 >
//                   <Check
//                     className="mt-0.5 h-4 w-4 shrink-0 text-lime-600"
//                     strokeWidth={3.5}
//                   />
//                   <span>{s}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ============================================
// // FEATURES
// // ============================================
// function FeaturesSection() {
//   const COLORS: Record<string, string> = {
//     brand:   'bg-brand-50 text-brand-600 ring-brand-100',
//     accent:  'bg-accent-50 text-accent-600 ring-accent-100',
//     success: 'bg-lime-50 text-lime-600 ring-lime-100',
//     danger:  'bg-red-50 text-red-500 ring-red-100'
//   };

//   return (
//     <section id="features" className="bg-stone-50 py-14 sm:py-20 lg:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="reveal mx-auto max-w-3xl text-center">
//           <span className="chip-brand">Sab features</span>
//           <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
//             Sab kuch jo aapki dukaan ko chahiye 🎯
//           </h2>
//           <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
//             Ek app, saare kaam. Billing se lekar report tak — sab Hindi mein.
//           </p>
//         </div>

//         <div className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
//           {FEATURES.map((f) => {
//             const Icon = f.icon;
//             return (
//               <div
//                 key={f.title}
//                 className="reveal group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift sm:p-6"
//               >
//                 <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

//                 <div
//                   className={cn(
//                     'grid h-12 w-12 place-items-center rounded-2xl ring-1 sm:h-14 sm:w-14',
//                     COLORS[f.color]
//                   )}
//                 >
//                   <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
//                 </div>

//                 <h3 className="mt-4 font-display text-base font-bold text-slate-900 sm:mt-5 sm:text-lg">
//                   {f.title}
//                 </h3>
//                 <p className="mt-2 text-sm leading-relaxed text-slate-600">
//                   {f.desc}
//                 </p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ============================================
// // HOW IT WORKS
// // ============================================
// function HowItWorksSection() {
//   return (
//     <section
//       id="how"
//       className="bg-gradient-to-b from-brand-50 to-white py-14 sm:py-20 lg:py-24"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="reveal mx-auto max-w-3xl text-center">
//           <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
//             🚀 Kaise chalega
//           </span>
//           <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
//             3 simple steps, 2 minute
//           </h2>
//           <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
//             Koi training nahi, koi jhanjhat nahi. Bas shuru karein.
//           </p>
//         </div>

//         <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
//           {STEPS.map((s, i) => (
//             <div key={s.n} className="reveal relative">
//               {i < STEPS.length - 1 && (
//                 <div className="absolute left-8 top-16 hidden lg:block">
//                   <ArrowRight className="h-6 w-6 text-brand-400" />
//                 </div>
//               )}

//               <div className="relative h-full rounded-3xl border border-stone-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift sm:p-6">
//                 <div className="flex items-center gap-3">
//                   <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl shadow-md">
//                     {s.emoji}
//                   </div>
//                   <span className="font-mono text-5xl font-extrabold text-brand-100">
//                     0{s.n}
//                   </span>
//                 </div>

//                 <h3 className="mt-4 font-display text-lg font-bold text-slate-900 sm:text-xl">
//                   {s.title}
//                 </h3>
//                 <p className="mt-2 text-sm leading-relaxed text-slate-600">
//                   {s.desc}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="reveal mt-10 text-center sm:mt-12">
//           <Link to={ROUTES.register} className="btn-primary btn-lg">
//             Free Account Banayein
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ============================================
// // VIDEO SECTION
// // ============================================
// function VideoSection() {
//   const [activeVideo, setActiveVideo] = useState<string | null>(null);

//   return (
//     <section className="relative overflow-hidden bg-gradient-to-b from-white to-stone-50 py-14 sm:py-20 lg:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="reveal mx-auto max-w-3xl text-center">
//           <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-700">
//             <Sparkles className="h-3 w-3" />
//             Dekhein Kaise Chalta Hai
//           </span>
//                     <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
//             Video mein dekhein — 2 minute mein samjho 🎬
//           </h2>
//           <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
//             Poora app, bill banane se lekar kamai report tak — video mein sab kuch.
//           </p>
//         </div>

//         Demo videos grid
//         <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6">
//           {DEMO_VIDEOS.map((v) => (
//             <button
//               key={v.id}
//               onClick={() => setActiveVideo(v.youtubeId)}
//               className="reveal group relative aspect-video overflow-hidden rounded-3xl border border-stone-200 bg-slate-900 shadow-card transition-all hover:shadow-lift hover:-translate-y-1"
//             >
//               {/* Thumbnail */}
//               <img
//                 src={`https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`}
//                 alt={v.title}
//                 className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-60"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
//                 }}
//               />

//               {/* Dark overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

//               {/* Badge */}
//               <div className="absolute left-4 top-4 flex items-center gap-2">
//                 <span className="rounded-full bg-accent-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
//                   {v.badge}
//                 </span>
//                 <span className="rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
//                   {v.duration}
//                 </span>
//               </div>

//               {/* Play button */}
//               <div className="absolute inset-0 grid place-items-center">
//                 <div className="grid h-16 w-16 place-items-center rounded-full bg-white/95 shadow-xl transition group-hover:scale-110 group-hover:bg-white">
//                   <Play className="ml-1 h-6 w-6 fill-brand-600 text-brand-600" />
//                 </div>
//               </div>

//               {/* Title */}
//               <div className="absolute inset-x-4 bottom-4 text-left text-white">
//                 <p className="text-lg">{v.emoji}</p>
//                 <p className="mt-1 font-display text-base font-bold sm:text-lg">
//                   {v.title}
//                 </p>
//                 <p className="mt-0.5 text-xs text-white/80">{v.subtitle}</p>
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* Testimonial videos */}
//         <div className="mt-16 sm:mt-20">
//           <div className="reveal mx-auto max-w-3xl text-center">
//             <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700">
//               <Check className="h-3 w-3" />
//               Dukaandaar Ki Zubaani
//             </span>
//             <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl text-balance">
//               Real shopkeepers, real stories 🎥
//             </h3>
//             <p className="mt-3 text-base text-slate-600 sm:text-lg">
//               Jo roz BazaarBook use karte hain — unse hi sunein.
//             </p>
//           </div>

//           <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//             {TESTIMONIAL_VIDEOS.map((v) => (
//               <button
//                 key={v.id}
//                 onClick={() => setActiveVideo(v.youtubeId)}
//                 className="reveal group relative aspect-[3/4] overflow-hidden rounded-3xl border border-stone-200 bg-slate-900 shadow-card transition-all hover:shadow-lift hover:-translate-y-1"
//               >
//                 <img
//                   src={`https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`}
//                   alt={v.name}
//                   className="absolute inset-0 h-full w-full object-cover opacity-70 transition group-hover:opacity-60"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
//                   }}
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

//                 <div className="absolute inset-0 grid place-items-center">
//                   <div className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-xl transition group-hover:scale-110">
//                     <Play className="ml-0.5 h-5 w-5 fill-brand-600 text-brand-600" />
//                   </div>
//                 </div>

//                 <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
//                   {v.duration}
//                 </span>

//                 <div className="absolute inset-x-4 bottom-4 text-left text-white">
//                   <div className="flex items-center gap-2">
//                     <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-lg backdrop-blur">
//                       {v.emoji}
//                     </span>
//                     <div className="min-w-0">
//                       <p className="truncate text-sm font-bold">{v.name}</p>
//                       <p className="truncate text-[11px] text-white/80">
//                         {v.shop} • {v.city}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="mt-3 line-clamp-2 text-xs italic text-white/90">
//                     "{v.quote}"
//                   </p>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* CTA */}
//         <div className="reveal mt-12 text-center sm:mt-16">
//           <Link to={ROUTES.register} className="btn-primary btn-lg inline-flex">
//             Free Mein Shuru Karein
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//           <p className="mt-4 text-xs text-slate-500">
//             Credit card nahi chahiye • 2 minute mein setup
//           </p>
//         </div>
//       </div>

//       {/* Lightbox */}
//       {activeVideo && (
//         <VideoLightbox
//           youtubeId={activeVideo}
//           onClose={() => setActiveVideo(null)}
//         />
//       )}
//     </section>
//   );
// }

// function VideoLightbox({
//   youtubeId,
//   onClose
// }: {
//   youtubeId: string;
//   onClose: () => void;
// }) {
//   useEffect(() => {
//     document.body.style.overflow = 'hidden';
//     const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
//     window.addEventListener('keydown', onKey);
//     return () => {
//       document.body.style.overflow = '';
//       window.removeEventListener('keydown', onKey);
//     };
//   }, [onClose]);

//   return (
//     <div
//       className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
//       onClick={onClose}
//     >
//       <button
//         onClick={onClose}
//         className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
//         aria-label="Band karein"
//       >
//         <X className="h-6 w-6" />
//       </button>

//       <div
//         className="relative w-full max-w-4xl animate-scale-in"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl">
//           <iframe
//             src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
//             title="BazaarBook video"
//             className="absolute inset-0 h-full w-full"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ============================================
// // TESTIMONIALS (TEXT)
// // ============================================
// function TestimonialsSection() {
//   return (
//     <section className="py-14 sm:py-20 lg:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="reveal mx-auto max-w-3xl text-center">
//           <span className="chip-accent">Likhit Reviews</span>
//           <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
//             Unki kahani, aapki inspiration ✨
//           </h2>
//           <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
//             Roz 50,000+ dukaandaar BazaarBook se apni dukaan chalate hain.
//           </p>
//         </div>

//         <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
//           {TESTIMONIALS.map((t) => (
//             <div
//               key={t.name}
//               className="reveal flex flex-col rounded-3xl border border-stone-200 bg-white p-5 transition hover:border-brand-200 hover:shadow-lift sm:p-6"
//             >
//               <div className="flex gap-0.5">
//                 {Array.from({ length: t.rating }).map((_, i) => (
//                   <Star
//                     key={i}
//                     className="h-4 w-4 fill-amber-400 text-amber-400"
//                   />
//                 ))}
//               </div>

//               <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
//                 "{t.quote}"
//               </p>

//               <div className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4 sm:mt-6 sm:pt-5">
//                 <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-2xl">
//                   {t.emoji}
//                 </div>
//                 <div className="min-w-0">
//                   <p className="truncate text-sm font-bold text-slate-900">
//                     {t.name}
//                   </p>
//                   <p className="truncate text-xs text-slate-500">
//                     {t.shop} • {t.city}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// // ============================================
// // PRICING PREVIEW
// // ============================================
// function PricingPreview() {
//   const PLANS = [
//     {
//       code: 'free',
//       name: 'Free',
//       emoji: '🌱',
//       price: 0,
//       tagline: 'Shuru karne ke liye',
//       features: ['20 bills / mahina', '50 products', '25 customers']
//     },
//     {
//       code: 'starter',
//       name: 'Starter',
//       emoji: '🚀',
//       price: 99,
//       tagline: 'Chhoti dukaan',
//       features: ['200 bills / mahina', '500 products', 'Khata + reminder']
//     },
//     {
//       code: 'pro',
//       name: 'Pro',
//       emoji: '⭐',
//       price: 249,
//       tagline: 'Sabse popular',
//       popular: true,
//       features: [
//         'Unlimited bills',
//         'GST billing',
//         'Advanced reports',
//         'Thermal print'
//       ]
//     },
//     {
//       code: 'business',
//       name: 'Business',
//       emoji: '👑',
//       price: 599,
//       tagline: 'Badhi dukaan',
//       features: ['Sab kuch Pro mein', 'Multi-shop (3)', 'API access']
//     }
//   ];

//   return (
//     <section id="pricing" className="bg-stone-50 py-14 sm:py-20 lg:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="reveal mx-auto max-w-3xl text-center">
//           <span className="chip-brand">Pricing</span>
//           <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
//             Simple, honest pricing 💰
//           </h2>
//           <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
//             Free se shuru karein, badhne par upgrade karein. Kabhi bhi cancel.
//           </p>
//         </div>

//         <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
//           {PLANS.map((p) => (
//             <div
//               key={p.code}
//               className={cn(
//                 'reveal relative flex flex-col rounded-3xl border bg-white p-5 transition sm:p-6',
//                 p.popular
//                   ? 'border-brand-500 shadow-xl shadow-brand-500/10 lg:-translate-y-2'
//                   : 'border-stone-200 hover:border-stone-300'
//               )}
//             >
//               {p.popular && (
//                 <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
//                   <Sparkles className="h-3 w-3" />
//                   Sabse Popular
//                 </span>
//               )}

//               <div className="flex items-center gap-2">
//                 <span className="text-2xl">{p.emoji}</span>
//                 <div>
//                   <h3 className="font-display text-lg font-extrabold text-slate-900">
//                     {p.name}
//                   </h3>
//                   <p className="text-xs text-slate-500">{p.tagline}</p>
//                 </div>
//               </div>

//               <div className="mt-5">
//                 {p.price === 0 ? (
//                   <p className="font-display text-3xl font-extrabold text-slate-900">
//                     Free
//                   </p>
//                 ) : (
//                   <div className="flex items-baseline gap-1">
//                     <span className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">
//                       ₹{p.price}
//                     </span>
//                     <span className="text-sm font-semibold text-slate-500">
//                       /mahina
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <ul className="mt-5 flex-1 space-y-2">
//                 {p.features.map((f) => (
//                   <li
//                     key={f}
//                     className="flex items-start gap-2 text-xs text-slate-700"
//                   >
//                     <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime-100 text-lime-700">
//                       <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
//                     </span>
//                     {f}
//                   </li>
//                 ))}
//               </ul>

//               <Link
//                 to={ROUTES.register}
//                 className={cn(
//                   'btn btn-md mt-6 w-full',
//                   p.popular ? 'btn-primary' : 'btn-outline'
//                 )}
//               >
//                 {p.price === 0 ? 'Free mein shuru' : `${p.name} chunein`}
//               </Link>
//             </div>
//           ))}
//         </div>

//         <div className="reveal mt-10 text-center">
//           <Link
//             to={ROUTES.register}
//             className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:underline"
//           >
//             Detailed comparison dekhein
//             <ArrowRight className="h-4 w-4" />
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ============================================
// // FAQ
// // ============================================
// function FaqSection() {
//   const [open, setOpen] = useState<number | null>(0);

//   return (
//     <section id="faq" className="py-14 sm:py-20 lg:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="reveal mx-auto max-w-3xl text-center">
//           <span className="chip-accent">FAQ</span>
//           <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl text-balance">
//             Aksar puche jaane wale sawaal ❓
//           </h2>
//           <p className="mt-3 text-base text-slate-600 sm:mt-4 sm:text-lg">
//             Aur bhi sawaal hain? WhatsApp par poochein —{' '}
//             <a
//               href="https://wa.me/919876543210"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="font-bold text-brand-600 hover:underline"
//             >
//               +91 98765 43210
//             </a>
//           </p>
//         </div>

//         <div className="reveal mx-auto mt-10 max-w-3xl sm:mt-12">
//           <div className="divide-y divide-stone-100 overflow-hidden rounded-3xl border border-stone-200 bg-white">
//             {FAQS.map((f, i) => (
//               <div key={i}>
//                 <button
//                   onClick={() => setOpen(open === i ? null : i)}
//                   className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-stone-50 sm:px-6"
//                 >
//                   <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
//                     <span className="text-sm font-bold">?</span>
//                   </span>
//                   <span className="flex-1 text-sm font-bold text-slate-900 sm:text-base">
//                     {f.q}
//                   </span>
//                   <ChevronDown
//                     className={cn(
//                       'h-5 w-5 shrink-0 text-slate-400 transition-transform',
//                       open === i && 'rotate-180 text-brand-600'
//                     )}
//                   />
//                 </button>
//                 {open === i && (
//                   <div className="animate-slide-down border-t border-stone-100 bg-stone-50/60 px-5 py-4 pl-16 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pl-20">
//                     {f.a}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ============================================
// // FINAL CTA
// // ============================================
// function FinalCta() {
//   return (
//     <section className="py-14 sm:py-20 lg:py-24">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="reveal relative overflow-hidden rounded-[40px] bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 px-6 py-14 text-center shadow-2xl shadow-brand-500/20 sm:px-12 sm:py-20">
//           <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_80%,white_0,transparent_40%)]" />
//           <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
//           <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

//           <div className="relative">
//             <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur ring-1 ring-white/20">
//               🎉 30 din free
//             </span>

//             <h2 className="mt-6 font-display text-2xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl text-balance">
//               Aaj hi apni dukaan ko
//               <br />
//               <span className="bg-gradient-to-r from-amber-200 via-lime-200 to-white bg-clip-text text-transparent">
//                 digitally banayein
//               </span>
//             </h2>

//             <p className="mx-auto mt-5 max-w-xl text-base text-white/90 sm:text-lg">
//               2 minute mein setup. Credit card nahi chahiye. Kabhi bhi cancel
//               kar sakte hain.
//             </p>

//             <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white/95">
//               {[
//                 'Bina card signup',
//                 'Turant ready',
//                 'Hindi interface',
//                 'Offline support'
//               ].map((t) => (
//                 <span key={t} className="inline-flex items-center gap-1.5">
//                   <Check className="h-4 w-4" strokeWidth={3} />
//                   {t}
//                 </span>
//               ))}
//             </div>

//             <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
//               <Link
//                 to={ROUTES.register}
//                 className="btn btn-lg w-full bg-white text-brand-700 shadow-xl hover:bg-white/95 sm:w-auto"
//               >
//                 Free Account Banayein
//                 <ArrowRight className="h-4 w-4" />
//               </Link>
//               <Link
//                 to={ROUTES.login}
//                 className="btn btn-lg w-full border-2 border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:w-auto"
//               >
//                 Pehle se account hai? Login
//               </Link>
//             </div>

//             <p className="mt-6 text-xs text-white/70">
//               🤝 50,000+ dukaandaar BazaarBook par bharosa karte hain
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// // ============================================
// // FOOTER
// // ============================================
// function Footer() {
//   const SECTIONS = [
//     {
//       title: 'Product',
//       links: [
//         { label: 'Features', href: '#features' },
//         { label: 'Pricing', href: '#pricing' },
//         { label: 'Kaise chalega', href: '#how' }
//       ]
//     },
//     {
//       title: 'Support',
//       links: [
//         { label: 'Help Center', href: '#' },
//         { label: 'WhatsApp', href: 'https://wa.me/919876543210' },
//         { label: 'Videos', href: '#' }
//       ]
//     },
//     {
//       title: 'Legal',
//       links: [
//         { label: 'Terms', href: '/terms' },
//         { label: 'Privacy', href: '/privacy' },
//         { label: 'Refund', href: '/refund' }
//       ]
//     }
//   ];

//   return (
    
//     <footer className="border-t border-stone-200 bg-stone-50">
//       <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
//         {/* Top — Brand + Contact */}
//         <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
//           <div className="max-w-sm">
//             <BrandLogo size="sm" />
//             <p className="mt-3 text-xs text-slate-600 sm:text-sm">
//               Bharat ke chhote dukaandaaron ke liye digital billing, khata aur
//               report.
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
//             <a
//               href="https://wa.me/919876543210"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-1.5 hover:text-brand-600"
//             >
//               <MessageCircle className="h-3.5 w-3.5" />
//               +91 98765 43210
//             </a>
//             <a
//               href="mailto:help@bazaar-book.com"
//               className="inline-flex items-center gap-1.5 hover:text-brand-600"
//             >
//               <FileText className="h-3.5 w-3.5" />
//               help@bazaar-book.com
//             </a>
//             <span className="inline-flex items-center gap-1.5">
//               <Store className="h-3.5 w-3.5" />
//               Ranchi, Jharkhand
//             </span>
//           </div>
//         </div>

//         {/* Middle — Links */}

//         {/* <div className="mt-8 grid grid-cols-2 gap-6 border-t border-stone-200 pt-8 sm:grid-cols-3"> */}
//         <div className="mt-8 grid grid-cols-3 gap-3 border-t border-stone-200 pt-8 sm:grid-cols-3">

//           {SECTIONS.map((s) => (
//             <div key={s.title}>
//               <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
//                 {s.title}
//               </h4>
//               <ul className="mt-3 space-y-2">
//                 {s.links.map((l) => (
//                   <li key={l.label}>
//                     <a
//                       href={l.href}
//                       target={l.href.startsWith('http') ? '_blank' : undefined}
//                       rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
//                       className="text-xs text-slate-600 transition hover:text-brand-600 sm:text-sm"
//                     >
//                       {l.label}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>

//         {/* Bottom */}
//         <div className="mt-8 flex flex-col items-center gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
//           <p className="text-[11px] text-slate-500 sm:text-xs">
//             © {new Date().getFullYear()} BazaarBook. Made with ❤️ in India.
//           </p>

//           <div className="flex items-center gap-2">
//             {[
//               { emoji: '📱', label: 'Instagram', href: '#' },
//               { emoji: '▶️', label: 'YouTube', href: '#' },
//               { emoji: '🐦', label: 'Twitter', href: '#' }
//             ].map((s) => (
//               <a
//                 key={s.label}
//                 href={s.href}
//                 aria-label={s.label}
//                 className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm ring-1 ring-stone-200 transition hover:ring-brand-300"
//               >
//                 {s.emoji}
//               </a>
//             ))}
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }



      // top pe fine wala hai 














      import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Star,
  Users,
  TrendingUp,
  Package,
  Receipt,
  MessageCircle,
  Shield,
  Smartphone,
  ChevronDown,
  Play,
  Sparkles,
  FileText,
} from 'lucide-react';

import { ROUTES } from '@/lib/constants';
import { BrandLogo } from '@/components/BrandLogo';

/* ============================================================
   DATA
   ============================================================ */

const STATS = [
  { value: '50,000+', label: 'Dukaandaar' },
  { value: '₹200 Cr+', label: 'Bills Banaye' },
  { value: '4.8★', label: 'Rating' },
  { value: '24/7', label: 'Support' },
];

const FEATURES = [
  {
    icon: Receipt,
    title: '30 Second Bill',
    desc: 'Ek tap mein bill banayein — print karein ya WhatsApp par bhejein.',
    color: 'brand',
  },
  {
    icon: Users,
    title: 'Udhaar Khata',
    desc: 'Kisne kitna dena hai — sab track karein. WhatsApp reminder bhejein.',
    color: 'danger',
  },
  {
    icon: Package,
    title: 'Stock Alert',
    desc: 'Saman khatam hone se pehle alert. Auto reorder level.',
    color: 'accent',
  },
  {
    icon: TrendingUp,
    title: 'Kamai Report',
    desc: 'Din, hafta, mahina — poora hisaab. Real profit tracking.',
    color: 'success',
  },
  {
    icon: Smartphone,
    title: 'Offline Bhi Chalega',
    desc: 'Internet band ho toh bhi bill banao — online aate hi sync.',
    color: 'brand',
  },
  {
    icon: Shield,
    title: '100% Safe',
    desc: 'Data encrypted. Aapka business, aapka data.',
    color: 'accent',
  },
];

const STEPS = [
  {
    n: 1,
    title: '2 Minute Mein Setup',
    desc: 'Mobile number se free account banayein. Credit card nahi chahiye.',
    emoji: '📝',
  },
  {
    n: 2,
    title: 'Saman Aur Grahak Jodein',
    desc: 'Ek baar list banayein — ya seedha bill banana shuru karein.',
    emoji: '📦',
  },
  {
    n: 3,
    title: 'Bill Banao, Kamai Badhao',
    desc: 'Roz bill banayein, udhaar track karein, profit dekhein.',
    emoji: '🚀',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ramesh Kumar',
    shop: 'Sharma Kirana Store',
    city: 'Ranchi',
    emoji: '🛒',
    quote:
      'Pehle udhaar copy mein tha — ab sab mobile par. WhatsApp reminder se ₹40,000 wapas mila!',
    rating: 5,
  },
  {
    name: 'Sunita Devi',
    shop: 'Sunita Medical',
    city: 'Patna',
    emoji: '💊',
    quote:
      'Bill banana bahut aasan hai. Customer WhatsApp par bill dekh leta hai — bharosa badh gaya.',
    rating: 5,
  },
  {
    name: 'Mohan Lal',
    shop: 'Mohan General Store',
    city: 'Delhi',
    emoji: '🏪',
    quote:
      'Roz raat ko kamai report dekhta hun. Kaunsa maal zyada bikta hai — pata chal jaata hai.',
    rating: 5,
  },
];

const FAQS = [
  {
    q: 'Kya BazaarBook bilkul free hai?',
    a: 'Haan! Free plan mein 20 bills, 50 products aur 25 customers tak features milte hain. Business badhne par upgrade kar sakte hain.',
  },
  {
    q: 'Mere data ka kya hoga? Safe hai?',
    a: 'Aapka business data secure cloud par store hota hai. Aap apna data export bhi kar sakte hain.',
  },
  {
    q: 'Internet nahi hai toh chalega?',
    a: 'Bilkul! BazaarBook offline bhi kaam karta hai. Internet aate hi data sync ho sakta hai.',
  },
  {
    q: 'Kitne devices par use kar sakta hun?',
    a: 'Ek account se mobile, tablet aur laptop par use kar sakte hain.',
  },
  {
    q: 'Bill print kaise karun?',
    a: 'Bluetooth thermal printer aur normal A4 printer ke saath bill print kiya ja sakta hai.',
  },
  {
    q: 'Paisa kaise pay karun?',
    a: 'Available payment options ke through subscription pay kiya ja sakta hai.',
  },
];

/* ============================================================
   VIDEO DATA
   ============================================================ */

const VIDEOS = [
  {
    title: 'BazaarBook Features',
    description:
      'BazaarBook ke important features ko short video mein dekhein.',
    youtubeId: 'JVdS9PRKSnI',
    aspect: 'vertical',
  },
  {
    title: 'BazaarBook Full App Demo',
    description:
      'Complete app walkthrough — billing, khata, inventory aur reports.',
    youtubeId: 'LONG_VIDEO_ID_HERE',
    aspect: 'horizontal',
  },
];

/* ============================================================
   SCROLL REVEAL HOOK
   ============================================================ */

function useScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll('.scroll-reveal');

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}

/* ============================================================
   MAIN LANDING PAGE
   ============================================================ */

export default function LandingPage() {
  useScrollReveal();

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      <Hero />

      <StatsBar />

      <ProblemSection />

      <FeaturesSection />

      <HowItWorksSection />

      {/* ONLY 2 VIDEOS */}
      <VideosSection />

      <TestimonialsSection />

      <PricingPreview />

      <FaqSection />

      <FinalCta />

      <Footer />
    </div>
  );
}

/* ============================================================
   NAVBAR
   ============================================================ */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const mobileLinks = [
    { label: 'Features', href: '#features', emoji: '✨' },
    { label: 'Kaise Kaam Karta Hai', href: '#how', emoji: '🚀' },
    { label: 'Videos', href: '#videos', emoji: '🎬' },
    { label: 'Pricing', href: '#pricing', emoji: '💰' },
    { label: 'FAQ', href: '#faq', emoji: '❓' },
  ];

  return (
    <header className="relative z-[100] border-b border-stone-200 bg-white shadow-sm">
      {/* Main Header */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.home}
          onClick={() => setMobileOpen(false)}
          aria-label="BazaarBook Home"
        >
          <BrandLogo size="sm" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#features"
            className="text-sm font-semibold text-slate-600 transition hover:text-brand-600"
          >
            Features
          </a>

          <a
            href="#how"
            className="text-sm font-semibold text-slate-600 transition hover:text-brand-600"
          >
            Kaise Kaam Karta Hai
          </a>

          <a
            href="#videos"
            className="text-sm font-semibold text-slate-600 transition hover:text-brand-600"
          >
            Videos
          </a>

          <a
            href="#pricing"
            className="text-sm font-semibold text-slate-600 transition hover:text-brand-600"
          >
            Pricing
          </a>

          <a
            href="#faq"
            className="text-sm font-semibold text-slate-600 transition hover:text-brand-600"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <Link to={ROUTES.login} className="btn-ghost btn-md">
            Login
          </Link>

          <Link to={ROUTES.register} className="btn-primary btn-md">
            Free Shuru Karein
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          className="grid h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-stone-100 md:hidden"
        >
          {mobileOpen ? (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-[2px] md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <aside
            className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[88vw] flex-col overflow-hidden bg-white shadow-2xl md:hidden animate-slide-in-right"
            aria-label="Mobile navigation"
          >
            {/* Drawer Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4">
              <Link
                to={ROUTES.home}
                onClick={() => setMobileOpen(false)}
                aria-label="BazaarBook Home"
              >
                <BrandLogo size="sm" />
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-full text-slate-600 transition hover:bg-stone-100"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto bg-white p-4">
              <div className="flex flex-col gap-2">
                {mobileLinks.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[50px] w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-slate-800 transition hover:bg-brand-50 hover:text-brand-700 active:bg-brand-100"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-lg"
                      aria-hidden="true"
                    >
                      {item.emoji}
                    </span>

                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </nav>

            {/* Bottom Buttons */}
            <div className="shrink-0 space-y-3 border-t border-stone-200 bg-white p-4">
              <Link
                to={ROUTES.login}
                onClick={() => setMobileOpen(false)}
                className="btn-ghost btn-md flex w-full items-center justify-center"
              >
                Login
              </Link>

              <Link
                to={ROUTES.register}
                onClick={() => setMobileOpen(false)}
                className="btn-primary btn-md flex w-full items-center justify-center gap-2"
              >
                Free Shuru Karein
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </>
      )}
    </header>
  );
}

/* ============================================================
   HERO
   ============================================================ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/30 to-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.15),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="scroll-reveal inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-brand-700 shadow-soft backdrop-blur">
            <span className="flex -space-x-1.5">
              {['🛒', '💊', '🏪'].map((emoji, i) => (
                <span
                  key={i}
                  className="grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] ring-2 ring-white"
                >
                  {emoji}
                </span>
              ))}
            </span>

            50,000+ dukaandaar bharosa karte hain

            <Sparkles className="h-3 w-3 text-accent-500" />
          </div>

          <h1 className="scroll-reveal scroll-reveal-delay-1 mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
            Aapki dukaan ka{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
              digital saathi
            </span>
          </h1>

          <p className="scroll-reveal scroll-reveal-delay-2 mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Bill banao, udhaar track karo, kamai dekho —{' '}
            <strong className="font-bold text-slate-900">
              sab kuch ek app mein
            </strong>
            . Hindi mein, mobile par, bina internet bhi.
          </p>

          <div className="scroll-reveal scroll-reveal-delay-3 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to={ROUTES.register}
              className="btn-primary btn-lg w-full shadow-lg shadow-brand-500/20 sm:w-auto"
            >
              Free Mein Shuru Karein
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href="#videos"
              className="btn-outline btn-lg w-full sm:w-auto"
            >
              <Play className="h-4 w-4" />
              Video Dekhein
            </a>
          </div>

          <div className="scroll-reveal mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3 text-lime-600" />
              30 din free
            </span>

            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3 text-lime-600" />
              Credit card nahi chahiye
            </span>

            <span className="inline-flex items-center gap-1">
              <Check className="h-3 w-3 text-lime-600" />
              2 minute mein setup
            </span>
          </div>
        </div>

        <div className="scroll-reveal scroll-reveal-delay-2 mx-auto mt-16 max-w-4xl sm:mt-20">
          <AppPreview />
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   APP PREVIEW
   ============================================================ */

function AppPreview() {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-r from-brand-400/20 via-accent-400/20 to-lime-400/20 blur-2xl" />

      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-2xl shadow-brand-500/10">
        <div className="flex items-center gap-1.5 border-b border-stone-200 bg-stone-50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-lime-400" />

          <div className="ml-3 flex-1">
            <div className="mx-auto w-40 rounded-full bg-white px-3 py-1 text-center text-[10px] font-mono text-slate-400 ring-1 ring-stone-200">
              bazaar-book.com/app
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
          <div className="col-span-full grid grid-cols-3 gap-3">
            {[
              { l: 'Aaj Ki Kamai', v: '₹4,520', c: 'text-brand-600' },
              { l: 'Bills', v: '32', c: 'text-accent-600' },
              { l: 'Baki Udhaar', v: '₹8,900', c: 'text-red-600' },
            ].map((item) => (
              <div
                key={item.l}
                className="rounded-2xl bg-stone-50 p-3 sm:p-4"
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 sm:text-[10px]">
                  {item.l}
                </p>

                <p
                  className={`mt-1 font-display text-base font-extrabold sm:text-2xl ${item.c}`}
                >
                  {item.v}
                </p>
              </div>
            ))}
          </div>

          <div className="col-span-full rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-4 sm:col-span-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              7 Din Ki Kamai
            </p>

            <div className="mt-4 flex h-24 items-end gap-2">
              {[40, 55, 35, 70, 85, 60, 90].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-500 to-accent-400"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>

          <div className="col-span-full rounded-2xl bg-gradient-to-br from-lime-50 to-emerald-50 p-4 sm:col-span-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Quick Actions
            </p>

            <div className="mt-3 space-y-2">
              {['🧾 Naya Bill', '👥 Grahak Jodein', '📊 Report Dekhein'].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-soft"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STATS
   ============================================================ */

function StatsBar() {
  return (
    <section className="border-y border-stone-200 bg-white/50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="scroll-reveal text-center">
              <p className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PROBLEM
   ============================================================ */

function ProblemSection() {
  const problems = [
    'Udhaar ka hisaab copy mein — kho jaata hai',
    'Bill banane mein 10 minute lagte hain',
    'Stock kab khatam hua, pata nahi chalta',
    'Customer ko bill bhejne ke liye photo kheenchte ho',
    'Raat ko pata nahi aaj kitna kamaya',
  ];

  const solutions = [
    'Udhaar sab digital — kuch nahi khota',
    'Bill 30 second mein ready',
    'Stock alert khud aata hai',
    'Bill WhatsApp par direct bhejo',
    'Kamai report roz raat ko',
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <span className="chip-danger">Dukaan ki asli problem</span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Rozana ki dukaan, rozana ki tension? 😰
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Ye problems har dukaandaar ko pareshan karti hain.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="scroll-reveal rounded-3xl border border-red-200 bg-red-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-red-100 text-red-600">
                ✕
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-red-700">
                  Pehle
                </p>
                <p className="font-display text-lg font-bold text-red-900">
                  Traditional tarika
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {problems.map((problem) => (
                <li
                  key={problem}
                  className="flex items-start gap-2 text-sm text-red-800"
                >
                  <span className="mt-0.5 shrink-0 text-red-500">✕</span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="scroll-reveal scroll-reveal-delay-1 relative rounded-3xl border-2 border-lime-300 bg-gradient-to-br from-lime-50 to-emerald-50 p-6 shadow-lg shadow-lime-500/10 sm:p-8">
            <span className="absolute -top-3 left-6 rounded-full bg-lime-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
              BazaarBook ke saath
            </span>

            <div className="flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-lime-100 text-lime-700">
                <Check className="h-5 w-5" strokeWidth={3.5} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-lime-700">
                  Ab
                </p>
                <p className="font-display text-lg font-bold text-lime-900">
                  Digital dukaan
                </p>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {solutions.map((solution) => (
                <li
                  key={solution}
                  className="flex items-start gap-2 text-sm font-semibold text-lime-900"
                >
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-lime-600"
                    strokeWidth={3.5}
                  />
                  <span>{solution}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FEATURES
   ============================================================ */

function FeaturesSection() {
  const COLORS: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600 ring-brand-100',
    accent: 'bg-accent-50 text-accent-600 ring-accent-100',
    success: 'bg-lime-50 text-lime-600 ring-lime-100',
    danger: 'bg-red-50 text-red-500 ring-red-100',
  };

  return (
    <section
      id="features"
      className="bg-stone-50 py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <span className="chip-brand">Sab features</span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Sab kuch jo aapki dukaan ko chahiye 🎯
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Ek app, saare kaam. Billing se lekar report tak — sab Hindi mein.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`scroll-reveal ${
                  index % 3 === 1 ? 'scroll-reveal-delay-1' : ''
                } group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lift`}
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-brand-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

                <div
                  className={`grid h-14 w-14 place-items-center rounded-2xl ring-1 ${COLORS[feature.color]}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   HOW IT WORKS
   ============================================================ */

function HowItWorksSection() {
  return (
    <section
      id="how"
      className="bg-gradient-to-b from-brand-50 to-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
            🚀 Kaise chalega
          </span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            3 simple steps, 2 minute
          </h2>

          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Koi training nahi, koi jhanjhat nahi. Bas shuru karein.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {STEPS.map((step, index) => (
            <div
              key={step.n}
              className={`scroll-reveal ${
                index === 1 ? 'scroll-reveal-delay-1' : ''
              } relative`}
            >
              {index < STEPS.length - 1 && (
                <div className="absolute left-8 top-16 hidden lg:block">
                  <ArrowRight className="h-6 w-6 text-brand-400" />
                </div>
              )}

              <div className="relative h-full rounded-3xl border border-stone-200 bg-white p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-xl shadow-md">
                    {step.emoji}
                  </div>

                  <span className="font-mono text-5xl font-extrabold text-brand-100">
                    0{step.n}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-slate-900 sm:text-xl">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="scroll-reveal mt-12 text-center">
          <Link to={ROUTES.register} className="btn-primary btn-lg">
            Free Account Banayein
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   VIDEOS — ONLY 2 VIDEOS
   ============================================================ */

function VideosSection() {
  return (
    <section
      id="videos"
      className="bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand-700 ring-1 ring-brand-100">
            <Play className="h-3.5 w-3.5" />
            Video Guide
          </span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            BazaarBook ko video mein samjhein 🎬
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Pehle short features video dekhein, phir complete app demo.
          </p>
        </div>

        {/* TWO VIDEO CARDS */}
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          {VIDEOS.map((video, index) => {
            const isVertical = video.aspect === 'vertical';

            return (
              <div
                key={video.title}
                className={`scroll-reveal ${
                  index === 1 ? 'scroll-reveal-delay-1' : ''
                }`}
              >
                {/* Video Card */}
                <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg">
                  {/* Video */}
                  <div
                    className={`relative w-full overflow-hidden bg-slate-950 ${
                      isVertical
                        ? 'mx-auto aspect-[9/16] max-w-[360px]'
                        : 'aspect-video'
                    }`}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      className="absolute inset-0 h-full w-full border-0"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Info */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                        <Play className="h-5 w-5 fill-current" />
                      </div>

                      <div>
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          {video.title}
                        </h3>

                        <p className="mt-1 text-sm leading-relaxed text-slate-600">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small note */}
        <p className="scroll-reveal mt-8 text-center text-xs text-slate-400">
          Videos directly BazaarBook landing page par play honge.
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */

function TestimonialsSection() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <span className="chip-accent">Dukaandaar ki zubaani</span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Unki kahani, aapki inspiration ✨
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Roz 50,000+ dukaandaar BazaarBook se apni dukaan chalate hain.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={`scroll-reveal ${
                index === 1 ? 'scroll-reveal-delay-1' : ''
              } group relative flex flex-col rounded-3xl border border-stone-200 bg-white p-6 transition hover:border-brand-200 hover:shadow-lift`}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">
                "{testimonial.quote}"
              </p>

              <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-accent-100 text-2xl">
                  {testimonial.emoji}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {testimonial.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {testimonial.shop} • {testimonial.city}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   PRICING
   ============================================================ */

function PricingPreview() {
  const plans = [
    {
      code: 'free',
      name: 'Free',
      emoji: '🌱',
      price: 0,
      tagline: 'Shuru karne ke liye',
      features: ['20 bills / mahina', '50 products', '25 customers'],
    },
    {
      code: 'starter',
      name: 'Starter',
      emoji: '🚀',
      price: 99,
      tagline: 'Chhoti dukaan',
      features: ['200 bills / mahina', '500 products', 'Khata + reminder'],
    },
    {
      code: 'pro',
      name: 'Pro',
      emoji: '⭐',
      price: 249,
      tagline: 'Sabse popular',
      popular: true,
      features: [
        'Unlimited bills',
        'GST billing',
        'Advanced reports',
        'Thermal print',
      ],
    },
    {
      code: 'business',
      name: 'Business',
      emoji: '👑',
      price: 599,
      tagline: 'Badhi dukaan',
      features: ['Sab kuch Pro mein', 'Multi-shop (3)', 'API access'],
    },
  ];

  return (
    <section
      id="pricing"
      className="bg-stone-50 py-14 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <span className="chip-brand">Pricing</span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Simple, honest pricing 💰
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Free se shuru karein, badhne par upgrade karein.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {plans.map((plan, index) => (
            <div
              key={plan.code}
              className={`scroll-reveal ${
                index === 1 ? 'scroll-reveal-delay-1' : ''
              } relative flex flex-col rounded-3xl border bg-white p-6 transition ${
                plan.popular
                  ? 'border-brand-500 shadow-xl shadow-brand-500/10 lg:-translate-y-2'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Sabse Popular
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="text-2xl">{plan.emoji}</span>

                <div>
                  <h3 className="font-display text-lg font-extrabold text-slate-900">
                    {plan.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {plan.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                {plan.price === 0 ? (
                  <p className="font-display text-3xl font-extrabold text-slate-900">
                    Free
                  </p>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl font-extrabold text-slate-900">
                      ₹{plan.price}
                    </span>

                    <span className="text-sm font-semibold text-slate-500">
                      /mahina
                    </span>
                  </div>
                )}
              </div>

              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-slate-700"
                  >
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-lime-100 text-lime-700">
                      <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                    </span>

                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to={ROUTES.register}
                className={`btn btn-md mt-6 w-full ${
                  plan.popular ? 'btn-primary' : 'btn-outline'
                }`}
              >
                {plan.price === 0
                  ? 'Free mein shuru'
                  : `${plan.name} chunein`}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FAQ
   ============================================================ */

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal mx-auto max-w-3xl text-center">
          <span className="chip-accent">FAQ</span>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Aksar puche jaane wale sawaal ❓
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Aur bhi sawaal hain? WhatsApp par poochein —{' '}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-600 hover:underline"
            >
              +91 98765 43210
            </a>
          </p>
        </div>

        <div className="scroll-reveal mx-auto mt-12 max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white divide-y divide-stone-100">
            {FAQS.map((faq, index) => (
              <div key={index}>
                <button
                  type="button"
                  onClick={() =>
                    setOpen(open === index ? null : index)
                  }
                  className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-stone-50 sm:px-6"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                    ?
                  </span>

                  <span className="flex-1 text-sm font-bold text-slate-900 sm:text-base">
                    {faq.q}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      open === index
                        ? 'rotate-180 text-brand-600'
                        : ''
                    }`}
                  />
                </button>

                {open === index && (
                  <div className="border-t border-stone-100 bg-stone-50/60 px-5 py-4 pl-16 text-sm leading-relaxed text-slate-600 sm:px-6 sm:pl-20 animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FINAL CTA
   ============================================================ */

function FinalCta() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="scroll-reveal relative overflow-hidden rounded-[40px] bg-gradient-to-br from-brand-600 via-brand-700 to-accent-600 px-6 py-16 text-center shadow-2xl shadow-brand-500/20 sm:px-12 sm:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur ring-1 ring-white/20">
              🎉 30 din free
            </span>

            <h2 className="mt-6 font-display text-3xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Aaj hi apni dukaan ko
              <br />
              <span className="bg-gradient-to-r from-amber-200 via-lime-200 to-white bg-clip-text text-transparent">
                digitally banayein
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-lg text-white/90">
              2 minute mein setup. Credit card nahi chahiye.
            </p>

            <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold text-white/95">
              {[
                'Bina card signup',
                'Turant ready',
                'Hindi interface',
                'Offline support',
              ].map((text) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" strokeWidth={3} />
                  {text}
                </span>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to={ROUTES.register}
                className="btn btn-lg w-full bg-white text-brand-700 shadow-xl hover:bg-white/95 sm:w-auto"
              >
                Free Account Banayein
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to={ROUTES.login}
                className="btn btn-lg w-full border-2 border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20 sm:w-auto"
              >
                Pehle se account hai? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */

function Footer() {
  const SECTIONS = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Kaise chalega', href: '#how' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        {
          label: 'WhatsApp',
          href: 'https://wa.me/919876543210',
        },
        { label: 'Videos', href: '#videos' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms', href: '/terms' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Refund', href: '/refund' },
      ],
    },
  ];

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        {/* Brand + Contact */}
        <div className="flex flex-col gap-6 border-b border-stone-200 pb-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <BrandLogo size="sm" />

            <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
              Bharat ke chhote dukaandaaron ke liye digital billing,
              khata aur report.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-brand-600"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              +91 98765 43210
            </a>

            <a
              href="mailto:help@bazaar-book.com"
              className="inline-flex items-center gap-1.5 hover:text-brand-600"
            >
              <FileText className="h-3.5 w-3.5" />
              help@bazaar-book.com
            </a>
          </div>
        </div>

        {/* Three columns */}
        <div className="grid grid-cols-3 gap-3 py-8 sm:gap-8 md:gap-12">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 sm:text-xs">
                {section.title}
              </h4>

              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={
                        link.href.startsWith('http')
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        link.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                      className="text-[11px] text-slate-600 transition hover:text-brand-600 sm:text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4 border-t border-stone-200 pt-6 sm:flex-row sm:justify-between">
          <p className="text-[11px] text-slate-500 sm:text-xs">
            © {new Date().getFullYear()} BazaarBook. Made with ❤️ in
            India.
          </p>

          <div className="flex items-center gap-2">
            {[
              { emoji: '📱', label: 'Instagram', href: '#' },
              { emoji: '▶️', label: 'YouTube', href: '#videos' },
              { emoji: '🐦', label: 'Twitter', href: '#' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm ring-1 ring-stone-200 transition hover:ring-brand-300"
              >
                {social.emoji}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}