export type DashboardStats = {
  todaySales: number;
  todayBills: number;
  todayProfit?: number;
  yesterdaySales: number;      // for % change
  newCustomers: number;
  pendingUdhaar: number;
  pendingUdhaarCount: number;
};

export type DaySales = {
  date: string;         // ISO
  label: string;        // 'Mon', 'Tue' or 'सोम', 'मंगल'
  total: number;
  bills: number;
};

export type TopProduct = {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
};

export type RecentBill = {
  id: string;
  number: string;
  customerName: string;
  total: number;
  paymentMode: 'cash' | 'upi' | 'card' | 'udhaar' | 'split';
  status: 'paid' | 'pending' | 'partial';
  createdAt: string;
};

export type UdhaarAlert = {
  customerId: string;
  customerName: string;
  mobile: string;
  balance: number;
  lastPaymentDate?: string;
};

export type LowStockItem = {
  id: string;
  name: string;
  stock: number;
  unit: string;
  reorderLevel: number;
};