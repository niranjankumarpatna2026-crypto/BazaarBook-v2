import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CreditCard, Shield, LogOut, Home
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { initial } from '@/lib/format';

const NAV = [
  { to: '/admin',          label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users',    label: 'Users',     icon: Users },
  { to: '/admin/payments', label: 'Payments',  icon: CreditCard }
];

export function AdminLayout() {
  const navigate = useNavigate();
  const admin = (() => {
    try {
      return JSON.parse(localStorage.getItem('bb_admin_user') || 'null');
    } catch {
      return null;
    }
  })();

  const logout = () => {
    localStorage.removeItem('bb_admin_token');
    localStorage.removeItem('bb_admin_user');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-stone-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-stone-200 px-5">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white">
            <Shield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-extrabold">BazaarBook</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition',
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-stone-100'
                )
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-stone-200 p-3">
          <NavLink
            to="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-stone-100"
          >
            <Home className="h-4 w-4" />
            <span>Public site</span>
          </NavLink>
        </div>

        <div className="flex items-center gap-3 border-t border-stone-200 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-white">
            {initial(admin?.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">
              {admin?.name || 'Admin'}
            </p>
            <p className="truncate text-[10px] font-semibold uppercase text-slate-400">
              {admin?.role || 'admin'}
            </p>
          </div>
          <button
            onClick={logout}
            className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-stone-200 bg-white px-4 lg:hidden">
        <p className="text-sm font-extrabold">Admin Panel</p>
        <button
          onClick={logout}
          className="grid h-9 w-9 place-items-center rounded-full text-red-500 hover:bg-red-50"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      <main className="lg:pl-64">
        <div className="container-app py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}