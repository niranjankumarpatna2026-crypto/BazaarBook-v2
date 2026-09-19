// import { Link, useNavigate } from 'react-router-dom';
// import { Home, Receipt, Plus, Users, Package, BarChart3, Settings, Crown, LogOut } from 'lucide-react';
// import { useAuth } from '@/features/auth/AuthContext';
// import { ROUTES } from '@/lib/constants';
// import { BrandLogo } from '@/components/BrandLogo';

// const SIDEBAR_NAV = [
//   { to: ROUTES.dashboard, label: 'Dashboard', icon: Home },
//   { to: ROUTES.bills, label: 'Bills', icon: Receipt },
//   { to: ROUTES.inventory, label: 'Saman', icon: Package },
//   { to: ROUTES.customers, label: 'Grahak', icon: Users },
//   { to: ROUTES.reports, label: 'Report', icon: BarChart3 },
//   { to: ROUTES.subscription, label: 'Plan', icon: Crown },
//   { to: ROUTES.settings, label: 'Settings', icon: Settings }
// ];

// const BOTTOM_NAV = [
//   { to: ROUTES.dashboard, label: 'Ghar', icon: Home },
//   { to: ROUTES.bills, label: 'Bill', icon: Receipt },
//   { to: ROUTES.newBill, label: 'Naya', icon: Plus, primary: true },
//   { to: ROUTES.inventory, label: 'Saman', icon: Package },
//   { to: ROUTES.customers, label: 'Grahak', icon: Users }
// ];

// export function AppLayout({ children }: any) {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate(ROUTES.home);
//   };

//   return (
//     <div className="flex h-[100dvh] overflow-hidden bg-stone-50">
//       {/* Desktop sidebar — fixed height, own scroll */}
//       <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-stone-200 bg-white">
//         <div className="flex h-16 shrink-0 items-center border-b border-stone-200 px-5">
//   <BrandLogo size="sm" />
// </div>

//         <nav className="flex-1 overflow-y-auto p-3 space-y-1">
//           {SIDEBAR_NAV.map(({ to, label, icon: Icon }) => (
//             <Link
//               key={to}
//               to={to}
//               className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-stone-100"
//             >
//               <Icon className="h-4 w-4 shrink-0" />
//               {label}
//             </Link>
//           ))}
//         </nav>

//         <div className="shrink-0 border-t border-stone-200 p-3">
//           <Link to={ROUTES.newBill} className="btn-primary btn-md w-full">
//             <Plus className="h-4 w-4" />
//             Naya Bill
//           </Link>
//         </div>

//         <div className="flex shrink-0 items-center gap-3 border-t border-stone-200 p-3">
//           <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
//             {(user?.ownerName || user?.shopName || '?')[0]}
//           </span>
//           <div className="min-w-0 flex-1">
//             <p className="truncate text-xs font-bold">{user?.shopName || 'Dukaan'}</p>
//             <p className="truncate text-[10px] text-slate-500">{user?.ownerName || ''}</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600"
//             aria-label="Logout"
//           >
//             <LogOut className="h-4 w-4" />
//           </button>
//         </div>
//       </aside>

//       {/* Right side — topbar + main content only scroll */}
//       <div className="flex min-w-0 flex-1 flex-col overflow-hidden">


//         {/* Mobile top header — FIXED with shop name + logout */}
//         <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-stone-200 bg-white px-4 lg:hidden">
//   <div className="flex min-w-0 flex-1 items-center gap-2">
//   <BrandLogo size="sm" showText={false} />
//   <span className="truncate font-extrabold text-sm">
//     {user?.shopName || 'BazaarBook'}
//   </span>
// </div>

//   <div className="flex shrink-0 items-center gap-0.5">
//     <Link
//       to={ROUTES.reports}
//       className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100"
//       title="Report"
//     >
//       <BarChart3 className="h-5 w-5 text-slate-600" />
//     </Link>
//     <Link
//       to={ROUTES.subscription}
//       className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100"
//       title="Plan"
//     >
//       <Crown className="h-5 w-5 text-slate-600" />
//     </Link>
//     <Link
//       to={ROUTES.settings}
//       className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100"
//       title="Settings"
//     >
//       <Settings className="h-5 w-5 text-slate-600" />
//     </Link>
//     <button
//       onClick={handleLogout}
//       className="grid h-9 w-9 place-items-center rounded-full text-red-500 hover:bg-red-50"
//       title="Logout"
//       aria-label="Logout"
//     >
//       <LogOut className="h-5 w-5" />
//     </button>
//   </div>
// </header>

//         {/* Main scrollable area */}
//         <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
//           <div className="container-app py-4 sm:py-6">{children}</div>
//         </main>

//         {/* Mobile bottom nav — fixed */}
//         <nav className="shrink-0 border-t border-stone-200 bg-white lg:hidden">
//           <ul className="mx-auto grid max-w-md grid-cols-5">
//             {BOTTOM_NAV.map(({ to, label, icon: Icon, primary }: any) => (
//               <li key={to}>
//                 <Link
//                   to={to}
//                   className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold text-slate-500"
//                 >
//                   {primary ? (
//                     <span className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-lg ring-4 ring-white">
//                       <Icon className="h-6 w-6" />
//                     </span>
//                   ) : (
//                     <Icon className="h-5 w-5" />
//                   )}
//                   <span>{primary ? 'Naya' : label}</span>
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </div>
//     </div>
//   );
// }

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Home, Receipt, Plus, Users, Package, BarChart3, Settings, Crown, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { ROUTES } from '@/lib/constants';
import { BrandLogo } from '@/components/BrandLogo';

const SIDEBAR_NAV = [
  { to: ROUTES.dashboard, label: 'Dashboard', icon: Home },
  { to: ROUTES.bills, label: 'Bills', icon: Receipt },
  { to: ROUTES.inventory, label: 'Saman', icon: Package },
  { to: ROUTES.customers, label: 'Grahak', icon: Users },
  { to: ROUTES.reports, label: 'Report', icon: BarChart3 },
  { to: ROUTES.subscription, label: 'Plan', icon: Crown },
  { to: ROUTES.settings, label: 'Settings', icon: Settings }
];

const BOTTOM_NAV = [
  { to: ROUTES.dashboard, label: 'Ghar', icon: Home },
  { to: ROUTES.bills, label: 'Bill', icon: Receipt },
  { to: ROUTES.newBill, label: 'Naya', icon: Plus, primary: true },
  { to: ROUTES.inventory, label: 'Saman', icon: Package },
  { to: ROUTES.customers, label: 'Grahak', icon: Users }
];

export function AppLayout({ children }: any) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.home);
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-stone-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-stone-200 bg-white">
        <div className="flex h-16 shrink-0 items-center border-b border-stone-200 px-5">
          <BrandLogo size="sm" />
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {SIDEBAR_NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.dashboard}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-stone-100'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-stone-200 p-3">
          <Link to={ROUTES.newBill} className="btn-primary btn-md w-full">
            <Plus className="h-4 w-4" />
            Naya Bill
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-stone-200 p-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
            {(user?.ownerName || user?.shopName || '?')[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">{user?.shopName || 'Dukaan'}</p>
            <p className="truncate text-[10px] text-slate-500">{user?.ownerName || ''}</p>
          </div>
          <button
            onClick={handleLogout}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Right side */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-stone-200 bg-white px-4 lg:hidden">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <BrandLogo size="sm" showText={false} />
            <span className="truncate font-extrabold text-sm">
              {user?.shopName || 'BazaarBook'}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <Link
              to={ROUTES.reports}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100"
              title="Report"
            >
              <BarChart3 className="h-5 w-5 text-slate-600" />
            </Link>
            <Link
              to={ROUTES.subscription}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100"
              title="Plan"
            >
              <Crown className="h-5 w-5 text-slate-600" />
            </Link>
            <Link
              to={ROUTES.settings}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-stone-100"
              title="Settings"
            >
              <Settings className="h-5 w-5 text-slate-600" />
            </Link>
            <button
              onClick={handleLogout}
              className="grid h-9 w-9 place-items-center rounded-full text-red-500 hover:bg-red-50"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <div className="container-app py-4 sm:py-6">{children}</div>
        </main>

        {/* Mobile bottom nav — UPDATED with active state */}
        <nav className="shrink-0 border-t border-stone-200 bg-white lg:hidden">
          <ul className="mx-auto grid max-w-md grid-cols-5">
            {BOTTOM_NAV.map(({ to, label, icon: Icon, primary }: any) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === ROUTES.dashboard}
                  className={({ isActive }) =>
                    `relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition ${
                      isActive
                        ? 'text-brand-600'
                        : 'text-slate-500 hover:text-slate-700'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Active indicator bar at top */}
                      {isActive && !primary && (
                        <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brand-500" />
                      )}

                      {primary ? (
                        <span
                          className={`-mt-6 grid h-12 w-12 place-items-center rounded-full text-white shadow-lg ring-4 ring-white transition ${
                            isActive
                              ? 'bg-gradient-to-br from-brand-700 to-accent-600 scale-105'
                              : 'bg-gradient-to-br from-brand-600 to-accent-500'
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </span>
                      ) : (
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                      )}

                      <span className={isActive ? 'font-bold' : ''}>
                        {primary ? 'Naya' : label}
                      </span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}