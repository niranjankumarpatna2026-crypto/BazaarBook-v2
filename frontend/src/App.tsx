import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
// import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { ROUTES } from './lib/constants';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage_2';
import DashboardPage from './pages/app/DashboardPage';
// import BillsPage from './pages/BillsPage_Final';
import BillsPage from './pages/BillsPage';

import NewBillPage from './pages/NewBillPage';
import InventoryPage from './pages/InventoryPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingsPage from './pages/SettingsPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

import { AppLayout } from './components/AppLayout';

import { InstallBanner } from '@/features/pwa/InstallBanner';
import { OfflineIndicator } from '@/features/pwa/OfflineIndicator';




function Protected({ children }: { children: any }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center">Loading…</div>;
  if (!user) return <Navigate to={ROUTES.login} replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.home} element={<LandingPage />} />
      <Route path={ROUTES.login} element={<LoginPage />} />
      <Route path={ROUTES.register} element={<RegisterPage />} />

      <Route path={ROUTES.dashboard} element={<Protected><DashboardPage /></Protected>} />
      <Route path={ROUTES.bills} element={<Protected><BillsPage /></Protected>} />
      <Route path={`${ROUTES.bills}/:id`} element={<Protected><BillsPage /></Protected>} />
      <Route path={ROUTES.newBill} element={<Protected><NewBillPage /></Protected>} />
      <Route path={ROUTES.inventory} element={<Protected><InventoryPage /></Protected>} />
      <Route path={ROUTES.customers} element={<Protected><CustomersPage /></Protected>} />
      <Route path={ROUTES.reports} element={<Protected><ReportsPage /></Protected>} />
      <Route path={ROUTES.subscription} element={<Protected><SubscriptionPage /></Protected>} />
      <Route path={ROUTES.settings} element={<Protected><SettingsPage /></Protected>} />

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />

      <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineIndicator />
        <AppRouter />
        <InstallBanner />
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </BrowserRouter>
  );
}