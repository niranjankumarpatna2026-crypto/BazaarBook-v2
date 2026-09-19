// import { useEffect, useState } from 'react';
// import type {
//   DashboardStats,
//   DaySales,
//   TopProduct,
//   RecentBill,
//   UdhaarAlert,
//   LowStockItem
// } from '@/types/dashboard';

// export type DashboardData = {
//   stats: DashboardStats;
//   sales7d: DaySales[];
//   topProducts: TopProduct[];
//   recentBills: RecentBill[];
//   udhaarAlerts: UdhaarAlert[];
//   lowStock: LowStockItem[];
// };

// // TODO: Replace with real API
// const MOCK: DashboardData = {
//   stats: {
//     todaySales: 4520,
//     todayBills: 32,
//     todayProfit: 1240,
//     yesterdaySales: 4040,
//     newCustomers: 5,
//     pendingUdhaar: 8900,
//     pendingUdhaarCount: 12
//   },
//   sales7d: [
//     { date: '2026-09-08', label: 'Mon', total: 3200, bills: 24 },
//     { date: '2026-09-09', label: 'Tue', total: 4100, bills: 30 },
//     { date: '2026-09-10', label: 'Wed', total: 2800, bills: 20 },
//     { date: '2026-09-11', label: 'Thu', total: 5200, bills: 38 },
//     { date: '2026-09-12', label: 'Fri', total: 6100, bills: 44 },
//     { date: '2026-09-13', label: 'Sat', total: 7200, bills: 52 },
//     { date: '2026-09-14', label: 'Sun', total: 4520, bills: 32 }
//   ],
//   topProducts: [
//     { id: 'p1', name: 'Surf Excel 1kg', quantity: 34, revenue: 3230 },
//     { id: 'p2', name: 'Tata Salt 1kg', quantity: 62, revenue: 1736 },
//     { id: 'p3', name: 'Colgate 100g', quantity: 24, revenue: 1320 },
//     { id: 'p4', name: 'Parle-G 250g', quantity: 48, revenue: 960 },
//     { id: 'p5', name: 'Amul Butter 100g', quantity: 12, revenue: 744 }
//   ],
//   recentBills: [
//     { id: 'b1', number: '#144', customerName: 'Geeta Devi', total: 180, paymentMode: 'cash', status: 'paid', createdAt: new Date().toISOString() },
//     { id: 'b2', number: '#143', customerName: 'Sunil Sharma', total: 520, paymentMode: 'upi', status: 'paid', createdAt: new Date(Date.now() - 3600_000).toISOString() },
//     { id: 'b3', number: '#142', customerName: 'Ramesh Kumar', total: 250, paymentMode: 'udhaar', status: 'pending', createdAt: new Date(Date.now() - 7200_000).toISOString() },
//     { id: 'b4', number: '#141', customerName: 'Mohan Lal', total: 890, paymentMode: 'cash', status: 'paid', createdAt: new Date(Date.now() - 86400_000).toISOString() },
//     { id: 'b5', number: '#140', customerName: 'Priya Singh', total: 340, paymentMode: 'card', status: 'paid', createdAt: new Date(Date.now() - 90000_000).toISOString() }
//   ],
//   udhaarAlerts: [
//     { customerId: 'c1', customerName: 'Ramesh Kumar', mobile: '9876543210', balance: 2450, lastPaymentDate: '2026-08-20' },
//     { customerId: 'c2', customerName: 'Geeta Devi', mobile: '9876543212', balance: 340, lastPaymentDate: '2026-09-01' },
//     { customerId: 'c3', customerName: 'Sunil Sharma', mobile: '9876543211', balance: 890, lastPaymentDate: '2026-09-05' }
//   ],
//   lowStock: [
//     { id: 'p5', name: 'Amul Butter 100g', stock: 3, unit: 'pcs', reorderLevel: 10 },
//     { id: 'p4', name: 'Parle-G 250g', stock: 8, unit: 'pkt', reorderLevel: 20 }
//   ]
// };

// export function useDashboard() {
//   const [data, setData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const controller = new AbortController();
//     setLoading(true);
//     setError(null);

//     (async () => {
//       try {
//         // TODO: replace with real API
//         // const res = await fetch('/api/dashboard', { signal: controller.signal });
//         // const json = await res.json();
//         await new Promise((r) => setTimeout(r, 600));
//         setData(MOCK);
//       } catch (e: any) {
//         if (e.name !== 'AbortError') setError(e.message || 'Kuch galat ho gaya');
//       } finally {
//         setLoading(false);
//       }
//     })();

//     return () => controller.abort();
//   }, []);

//   return { data, loading, error, refetch: () => setLoading((l) => !l) };
// }

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type {
  DashboardStats,
  DaySales,
  TopProduct,
  RecentBill,
  UdhaarAlert,
  LowStockItem
} from '@/types/dashboard';

export type DashboardData = {
  stats: DashboardStats;
  sales7d: DaySales[];
  topProducts: TopProduct[];
  recentBills: RecentBill[];
  udhaarAlerts: UdhaarAlert[];
  lowStock: LowStockItem[];
};

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DashboardData>('/api/dashboard/stats');
      setData(res);
    } catch (e: any) {
      setError(e.message || 'Dashboard load nahi hua');
      console.error('Dashboard fetch failed:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}