// import { useNavigate } from 'react-router-dom';
// import {
//   IndianRupee, Receipt, UserPlus, AlertCircle, RefreshCw
// } from 'lucide-react';
// import { cn } from '@/lib/cn';
// import { inr } from '@/lib/format';
// import { ROUTES } from '@/lib/constants';
// import { useAuth } from '@/features/auth/AuthContext';
// import { useDashboard } from '@/features/dashboard/useDashboard';
// import { getGreeting, getTodayHi } from '@/features/dashboard/greeting';
// import { StatCard } from '@/features/dashboard/StatCard';
// import { SalesChart } from '@/features/dashboard/SalesChart';
// import { RecentBills } from '@/features/dashboard/RecentBills';
// import { TopProducts } from '@/features/dashboard/TopProducts';
// import { UdhaarAlerts } from '@/features/dashboard/UdhaarAlerts';
// import { LowStockAlerts } from '@/features/dashboard/LowStockAlerts';
// import { QuickActions } from '@/features/dashboard/QuickActions';
// import {
//   StatCardSkeleton,
//   ChartSkeleton,
//   ListSkeleton
// } from '@/features/dashboard/Skeletons';

// export default function DashboardPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { data, loading, error, refetch } = useDashboard();

//   const firstName = user?.ownerName?.split(' ')[0] || 'ji';
//   const shopName = user?.shopName || 'Aapki Dukaan';
//   const greeting = getGreeting();

//   // % change vs yesterday
//   const change =
//     data && data.stats.yesterdaySales > 0
//       ? ((data.stats.todaySales - data.stats.yesterdaySales) /
//           data.stats.yesterdaySales) *
//         100
//       : undefined;

//   return (
//     <div className="space-y-6 pb-6">
//       {/* Greeting */}
//       <div className="flex flex-wrap items-start justify-between gap-3">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
//             {getTodayHi()}
//           </p>
//           <h1 className="mt-1 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
//             {greeting}, {firstName} 👋
//           </h1>
//           <p className="mt-0.5 text-sm text-slate-500">
//             {shopName} ka aaj ka haal
//           </p>
//         </div>

//         <button
//           onClick={refetch}
//           disabled={loading}
//           className="btn-outline btn-sm"
//           aria-label="Refresh"
//         >
//           <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
//           Refresh
//         </button>
//       </div>

//       {/* Error */}
//       {error && (
//         <div className="card border-red-200 bg-red-50/50 p-4 text-sm text-red-700">
//           ⚠️ {error}
//           <button
//             onClick={refetch}
//             className="ml-2 font-bold underline"
//           >
//             Dobara try karein
//           </button>
//         </div>
//       )}

//       {/* Quick actions */}
//       <QuickActions />

//       {/* Stats */}
//       {loading || !data ? (
//         // <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
//           {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
//         </div>
//       ) : (
//         // <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
//           <StatCard
//             label="Aaj Ki Kamai"
//             value={inr(data.stats.todaySales)}
//             icon={<IndianRupee className="h-5 w-5" strokeWidth={2.5} />}
//             tone="brand"
//             change={change}
//             hint={`${data.stats.todayBills} bills aaj`}
//           />
//           <StatCard
//             label="Aaj Ke Bills"
//             value={String(data.stats.todayBills)}
//             icon={<Receipt className="h-5 w-5" strokeWidth={2.5} />}
//             tone="accent"
//             hint={
//               data.stats.todayProfit
//                 ? `Profit: ${inr(data.stats.todayProfit)}`
//                 : undefined
//             }
//           />
//           <StatCard
//             label="Naye Grahak"
//             value={String(data.stats.newCustomers)}
//             icon={<UserPlus className="h-5 w-5" strokeWidth={2.5} />}
//             tone="success"
//             hint="Aaj jude"
//           />
//           <StatCard
//             label="Baki Udhaar"
//             value={inr(data.stats.pendingUdhaar)}
//             icon={<AlertCircle className="h-5 w-5" strokeWidth={2.5} />}
//             tone="danger"
//             hint={`${data.stats.pendingUdhaarCount} grahak se`}
//             onClick={() => navigate(ROUTES.customers)}
//           />
//         </div>
//       )}

//       {/* Chart + Top products */}
//       <div className="grid gap-4 lg:grid-cols-5">
//         <div className="lg:col-span-3">
//           {loading || !data ? (
//             <ChartSkeleton />
//           ) : (
//             <SalesChart data={data.sales7d} />
//           )}
//         </div>
//         <div className="lg:col-span-2">
//           {loading || !data ? (
//             <ListSkeleton rows={5} />
//           ) : (
//             <TopProducts products={data.topProducts} />
//           )}
//         </div>
//       </div>

//       {/* Alerts */}
//       {!loading && data && (
//         <div className="grid gap-4 lg:grid-cols-2">
//           <UdhaarAlerts alerts={data.udhaarAlerts} />
//           <LowStockAlerts items={data.lowStock} />
//         </div>
//       )}

//       {/* Recent bills */}
//       {loading || !data ? (
//         <ListSkeleton rows={5} />
//       ) : (
//         <RecentBills
//           bills={data.recentBills}
//           onOpen={handleOpenBill}     // ← YE ADD KARO
//         />
//       )}
//     </div>
//   );
// }





import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee, Receipt, UserPlus, AlertCircle, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { inr } from '@/lib/format';
import { ROUTES } from '@/lib/constants';
import { useAuth } from '@/features/auth/AuthContext';
import { useDashboard } from '@/features/dashboard/useDashboard';
import { getGreeting, getTodayHi } from '@/features/dashboard/greeting';
import { StatCard } from '@/features/dashboard/StatCard';
import { SalesChart } from '@/features/dashboard/SalesChart';
import { RecentBills } from '@/features/dashboard/RecentBills';
import { TopProducts } from '@/features/dashboard/TopProducts';
import { UdhaarAlerts } from '@/features/dashboard/UdhaarAlerts';
import { LowStockAlerts } from '@/features/dashboard/LowStockAlerts';
import { QuickActions } from '@/features/dashboard/QuickActions';
import { BillDetailModal } from '@/features/bills/BillDetailModal';
import {
  StatCardSkeleton,
  ChartSkeleton,
  ListSkeleton
} from '@/features/dashboard/Skeletons';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useDashboard();
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  const firstName = user?.ownerName?.split(' ')[0] || 'ji';
  const shopName = user?.shopName || 'Aapki Dukaan';
  const greeting = getGreeting();

  const change =
    data && data.stats.yesterdaySales > 0
      ? ((data.stats.todaySales - data.stats.yesterdaySales) /
          data.stats.yesterdaySales) *
        100
      : undefined;

  return (
    <div className="space-y-6 pb-6">
      {/* Greeting */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {getTodayHi()}
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {greeting}, {firstName} 👋
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {shopName} ka aaj ka haal
          </p>
        </div>

        <button
          onClick={refetch}
          disabled={loading}
          className="btn-outline btn-sm"
          aria-label="Refresh"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card border-red-200 bg-red-50/50 p-4 text-sm text-red-700">
          ⚠️ {error}
          <button onClick={refetch} className="ml-2 font-bold underline">
            Dobara try karein
          </button>
        </div>
      )}

      {/* Quick actions */}
      <QuickActions />

      {/* Stats */}
      {loading || !data ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard
            label="Aaj Ki Kamai"
            value={inr(data.stats.todaySales)}
            icon={<IndianRupee className="h-5 w-5" strokeWidth={2.5} />}
            tone="brand"
            change={change}
            hint={`${data.stats.todayBills} bills aaj`}
          />
          <StatCard
            label="Aaj Ke Bills"
            value={String(data.stats.todayBills)}
            icon={<Receipt className="h-5 w-5" strokeWidth={2.5} />}
            tone="accent"
            hint={
              data.stats.todayProfit
                ? `Profit: ${inr(data.stats.todayProfit)}`
                : undefined
            }
          />
          <StatCard
            label="Naye Grahak"
            value={String(data.stats.newCustomers)}
            icon={<UserPlus className="h-5 w-5" strokeWidth={2.5} />}
            tone="success"
            hint="Aaj jude"
          />
          <StatCard
            label="Baki Udhaar"
            value={inr(data.stats.pendingUdhaar)}
            icon={<AlertCircle className="h-5 w-5" strokeWidth={2.5} />}
            tone="danger"
            hint={`${data.stats.pendingUdhaarCount} grahak se`}
            onClick={() => navigate(ROUTES.customers)}
          />
        </div>
      )}

      {/* Chart + Top products */}
      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {loading || !data ? (
            <ChartSkeleton />
          ) : (
            <SalesChart data={data.sales7d} />
          )}
        </div>
        <div className="lg:col-span-2">
          {loading || !data ? (
            <ListSkeleton rows={5} />
          ) : (
            <TopProducts products={data.topProducts} />
          )}
        </div>
      </div>

      {/* Alerts */}
      {!loading && data && (
        <div className="grid gap-4 lg:grid-cols-2">
          <UdhaarAlerts alerts={data.udhaarAlerts} />
          <LowStockAlerts items={data.lowStock} />
        </div>
      )}

      {/* Recent bills — WITH onOpen */}
      {loading || !data ? (
        <ListSkeleton rows={5} />
      ) : (
        <RecentBills
          bills={data.recentBills}
          onOpen={(id) => setSelectedBillId(id)}
        />
      )}

      {/* Bill Detail Modal */}
      {selectedBillId && (
        <BillDetailModal
          id={selectedBillId}
          onClose={() => setSelectedBillId(null)}
          onRefresh={refetch}
        />
      )}
    </div>
  );
}