// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Users, Crown, IndianRupee } from 'lucide-react';
// import { inr } from '@/lib/format';

// export default function AdminDashboardPage() {
//   const nav = useNavigate();
//   const [stats, setStats] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('bb_admin_token');
//     if (!token) { nav('/admin/login'); return; }
//     (async () => {
//       try {
//         const r = await fetch('/api/admin/dashboard/stats', { headers: { Authorization: 'Bearer ' + token } });
//         if (r.status === 401) { nav('/admin/login'); return; }
//         if (r.ok) setStats(await r.json());
//       } catch {}
//       finally { setLoading(false); }
//     })();
//   }, [nav]);

//   const logout = () => {
//     localStorage.removeItem('bb_admin_token');
//     localStorage.removeItem('bb_admin_user');
//     nav('/admin/login');
//   };

//   if (loading) return <div className="grid min-h-screen place-items-center">Loading…</div>;

//   return (
//     <div className="min-h-screen bg-stone-100 p-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
//             <p className="text-sm text-slate-500">BazaarBook Platform</p>
//           </div>
//           <button onClick={logout} className="btn-outline btn-md">Logout</button>
//         </div>

//         <div className="mt-6 grid gap-4 sm:grid-cols-3">
//           {[
//             { l: 'Total Users', v: stats?.totalUsers || 0, i: Users },
//             { l: 'Paid Users', v: stats?.paidUsers || 0, i: Crown },
//             { l: 'MRR', v: inr(Math.round((stats?.mrr || 0) / 100)), i: IndianRupee }
//           ].map((x: any) => {
//             const Icon = x.i;
//             return (
//               <div key={x.l} className="card p-5">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs font-bold uppercase text-slate-500">{x.l}</p>
//                     <p className="mt-2 text-2xl font-extrabold">{x.v}</p>
//                   </div>
//                   <Icon className="h-8 w-8 text-brand-600" />
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from 'react';
import {
  Users, Crown, IndianRupee, TrendingUp, TrendingDown,
  UserPlus, Receipt, Package, Activity, RefreshCw,
  Building2, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { inr, timeAgo, initial } from '@/lib/format';
import {
  useAdminStats,
  useAdminRevenue,
  useAdminRecentUsers,
  useAdminRecentPayments,
  useAdminTopShops
} from '@/features/admin/useAdminDashboard';
import { AdminRevenueChart } from '@/features/admin/AdminRevenueChart';

export default function AdminDashboardPage() {
  const { data: stats, loading: statsLoading, error: statsError } = useAdminStats();
  const { data: revenue, loading: revLoading } = useAdminRevenue(30);
  const { data: recentUsers } = useAdminRecentUsers();
  const { data: recentPayments } = useAdminRecentPayments();
  const { data: topShops } = useAdminTopShops();

  if (statsLoading) return <DashboardSkeleton />;

  if (statsError) {
    return (
      <div className="card border-red-200 bg-red-50/50 p-6 text-sm text-red-700">
        ⚠️ {statsError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            BazaarBook platform — real-time overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip-success">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse" />
            Live
          </span>
          <button
            onClick={() => window.location.reload()}
            className="btn-outline btn-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString('en-IN')}
          change={{ value: 8.2, label: 'this month' }}
          icon={<Users className="h-5 w-5" />}
          tone="brand"
        />
        <KpiCard
          label="Paid Users"
          value={stats.paidUsers.toLocaleString('en-IN')}
          hint={`${stats.conversionRatePct}% conversion`}
          change={{ value: 12.4, label: 'this month' }}
          icon={<Crown className="h-5 w-5" />}
          tone="accent"
        />
        <KpiCard
          label="MRR"
          value={inr(Math.round(stats.mrr / 100))}
          change={{ value: stats.revenueGrowthPct, label: 'vs last month' }}
          icon={<IndianRupee className="h-5 w-5" />}
          tone="success"
        />
        <KpiCard
          label="ARR"
          value={inr(Math.round(stats.arr / 100))}
          hint="Annual recurring"
          icon={<TrendingUp className="h-5 w-5" />}
          tone="brand"
        />
      </div>

      {/* Secondary row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          icon={<UserPlus className="h-4 w-4" />}
          label="Aaj Signups"
          value={stats.newSignupsToday.toString()}
        />
        <MiniStat
          icon={<UserPlus className="h-4 w-4" />}
          label="Is Hafte"
          value={stats.newSignupsThisWeek.toLocaleString('en-IN')}
        />
        <MiniStat
          icon={<Receipt className="h-4 w-4" />}
          label="Total Bills"
          value={stats.totalBills.toLocaleString('en-IN')}
        />
        <MiniStat
          icon={<Package className="h-4 w-4" />}
          label="Products Tracked"
          value={stats.totalProductsTracked.toLocaleString('en-IN')}
        />
      </div>

      {/* Revenue Chart + Plan Breakdown */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {revLoading ? (
            <div className="card h-96 animate-pulse" />
          ) : (
            <AdminRevenueChart data={revenue} />
          )}
        </div>

        <div className="space-y-4">
          {/* Plan Breakdown */}
          <div className="card p-5">
            <h3 className="font-display text-base font-bold text-slate-900">
              Plan Breakdown
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                { key: 'free',     label: 'Free',     emoji: '🌱', color: 'bg-stone-400' },
                { key: 'starter',  label: 'Starter',  emoji: '🚀', color: 'bg-brand-500' },
                { key: 'pro',      label: 'Pro',      emoji: '⭐', color: 'bg-accent-500' },
                { key: 'business', label: 'Business', emoji: '👑', color: 'bg-purple-600' }
              ].map((p) => {
                const count = stats.planBreakdown?.[p.key] || 0;
                const total =
                  Object.values(stats.planBreakdown || {}).reduce(
                    (s: number, v: any) => s + v,
                    0
                  ) || 1;
                const pct = (count / total) * 100;
                return (
                  <li key={p.key}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{p.emoji}</span>
                        <span className="font-semibold text-slate-700">
                          {p.label}
                        </span>
                      </div>
                      <span className="font-display font-extrabold text-slate-900 tabular-nums">
                        {count}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-stone-100">
                      <div
                        className={cn('h-full rounded-full', p.color)}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick stats */}
          <div className="card p-5">
            <h3 className="font-display text-base font-bold text-slate-900">
              Platform Totals
            </h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row
                label="Total Shops"
                value={stats.totalShops.toLocaleString('en-IN')}
              />
              <Row
                label="Conversion"
                value={`${stats.conversionRatePct}%`}
              />
              <Row
                label="Revenue Growth"
                value={`${stats.revenueGrowthPct}%`}
                positive={stats.revenueGrowthPct >= 0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users + Recent Payments */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-brand-600" />
              <h3 className="font-display text-base font-bold text-slate-900">
                Naye Users
              </h3>
            </div>
            <Link
              to="/admin/users"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
            >
              Sab dekhein
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Koi user nahi
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {recentUsers.slice(0, 6).map((u) => (
                <li key={u.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
                    {initial(u.ownerName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {u.ownerName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {u.shopName} • {u.mobile}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                        u.planCode === 'free'
                          ? 'bg-stone-100 text-slate-600'
                          : 'bg-lime-100 text-lime-800'
                      )}
                    >
                      {u.planCode}
                    </span>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {timeAgo(u.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Payments */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-stone-100 p-5">
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-lime-600" />
              <h3 className="font-display text-base font-bold text-slate-900">
                Recent Payments
              </h3>
            </div>
            <Link
              to="/admin/payments"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
            >
              Sab dekhein
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Koi payment nahi
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {recentPayments.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-lime-50 text-lime-600">
                    <IndianRupee className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {p.shopName}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {p.ownerName} • {p.planCode} / {p.billingCycle}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
                      {inr(Math.round(p.amount / 100))}
                    </p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {timeAgo(p.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

            {/* Top Shops */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-stone-100 p-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-accent-600" />
            <h3 className="font-display text-base font-bold text-slate-900">
              Top Shops (Lifetime Value)
            </h3>
          </div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
          >
            Sab dekhein
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
        {topShops.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Koi data nahi
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-stone-100 bg-stone-50/60">
                <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Shop</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">City</th>
                  <th className="px-5 py-3 text-right">Lifetime Value</th>
                  <th className="px-5 py-3 text-right">Payments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {topShops.map((s, i) => (
                  <tr key={s.id} className="hover:bg-stone-50/50">
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'grid h-7 w-7 place-items-center rounded-full text-xs font-extrabold',
                          i === 0
                            ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white'
                            : i === 1
                            ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-white'
                            : i === 2
                            ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                            : 'bg-stone-100 text-slate-600'
                        )}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-xs font-bold text-slate-900">
                        {s.shopName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {s.ownerName} • {s.mobile}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                          s.planCode === 'free'
                            ? 'bg-stone-100 text-slate-600'
                            : s.planCode === 'starter'
                            ? 'bg-brand-100 text-brand-700'
                            : s.planCode === 'pro'
                            ? 'bg-accent-100 text-accent-700'
                            : 'bg-purple-100 text-purple-700'
                        )}
                      >
                        {s.planCode}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-600">
                      {s.city || '—'}
                    </td>
                    <td className="px-5 py-3 text-right font-display text-sm font-extrabold text-slate-900 tabular-nums">
                      {inr(Math.round(s.lifetimeValue / 100))}
                    </td>
                    <td className="px-5 py-3 text-right text-xs font-semibold text-slate-600 tabular-nums">
                      {s.paymentCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Health */}
      <SystemHealthCard />
    </div>
  );
}

// ============================================
// SYSTEM HEALTH CARD
// ============================================
function SystemHealthCard() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL =
      import.meta.env.VITE_API_URL || 'https://bazaar-book-api.onrender.com';
    const token = localStorage.getItem('bb_admin_token');

    fetch(`${API_URL}/api/admin/dashboard/health`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setHealth(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="card h-32 animate-pulse" />;
  }

  if (!health) {
    return (
      <div className="card border-amber-200 bg-amber-50/50 p-5 text-sm text-amber-800">
        ⚠️ System health load nahi hui
      </div>
    );
  }

  const uptimeHours = Math.floor((health.uptime || 0) / 3600);
  const memoryMB = Math.round((health.memory?.heapUsed || 0) / 1024 / 1024);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-stone-100 p-5">
        <Activity className="h-4 w-4 text-lime-600" />
        <h3 className="font-display text-base font-bold text-slate-900">
          System Health
        </h3>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-lime-800">
          <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse" />
          {health.status}
        </span>
      </div>

      <div className="grid gap-3 p-5 sm:grid-cols-4">
        <HealthItem
          label="DB Latency"
          value={`${health.dbLatencyMs} ms`}
          tone={health.dbLatencyMs < 100 ? 'good' : 'warn'}
        />
        <HealthItem
          label="Uptime"
          value={`${uptimeHours}h`}
          tone="good"
        />
        <HealthItem
          label="Memory"
          value={`${memoryMB} MB`}
          tone="neutral"
        />
        <HealthItem
          label="Active Subs"
          value={String(health.counts?.active_subs ?? 0)}
          tone="good"
        />
      </div>
    </div>
  );
}

function HealthItem({
  label,
  value,
  tone
}: {
  label: string;
  value: string;
  tone: 'good' | 'warn' | 'danger' | 'neutral';
}) {
  const tones = {
    good: 'text-lime-700 bg-lime-50 ring-lime-100',
    warn: 'text-amber-700 bg-amber-50 ring-amber-100',
    danger: 'text-red-700 bg-red-50 ring-red-100',
    neutral: 'text-slate-700 bg-stone-50 ring-stone-200'
  };
  return (
    <div className={cn('rounded-2xl p-3 ring-1', tones[tone])}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-extrabold tabular-nums">
        {value}
      </p>
    </div>
  );
}

// ============================================
// KPI CARD
// ============================================
function KpiCard({
  label,
  value,
  change,
  hint,
  icon,
  tone
}: {
  label: string;
  value: string;
  change?: { value: number; label: string };
  hint?: string;
  icon: React.ReactNode;
  tone: 'brand' | 'accent' | 'success' | 'danger';
}) {
  const tones = {
    brand:   'bg-brand-50 text-brand-600 ring-brand-100',
    accent:  'bg-accent-50 text-accent-600 ring-accent-100',
    success: 'bg-lime-50 text-lime-600 ring-lime-100',
    danger:  'bg-red-50 text-red-500 ring-red-100'
  };
  const positive = change ? change.value >= 0 : true;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900 tabular-nums">
            {value}
          </p>
          {hint && (
            <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
              {hint}
            </p>
          )}
        </div>
        <div
          className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1',
            tones[tone]
          )}
        >
          {icon}
        </div>
      </div>
      {change && (
        <div
          className={cn(
            'mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
            positive
              ? 'bg-lime-100 text-lime-800'
              : 'bg-red-100 text-red-700'
          )}
        >
          {positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {positive ? '+' : ''}
          {change.value.toFixed(1)}%
          <span className="font-medium opacity-70">{change.label}</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// MINI STAT
// ============================================
function MiniStat({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="card flex items-center gap-3 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-stone-100 text-slate-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 font-display text-lg font-extrabold text-slate-900 tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}

// ============================================
// ROW
// ============================================
function Row({
  label,
  value,
  positive
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span
        className={cn(
          'font-bold tabular-nums',
          positive === undefined
            ? 'text-slate-900'
            : positive
            ? 'text-lime-700'
            : 'text-red-600'
        )}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================
// SKELETON
// ============================================
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-full bg-stone-200" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card h-32 animate-pulse" />
        ))}
      </div>
      <div className="card h-96 animate-pulse" />
    </div>
  );
}
