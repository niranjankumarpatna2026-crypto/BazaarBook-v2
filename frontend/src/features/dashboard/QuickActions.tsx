import { Plus, Package, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';

const ACTIONS = [
  {
    to: ROUTES.newBill,
    icon: Plus,
    label: 'Naya Bill',
    hint: '30 second mein',
    tone: 'from-brand-600 to-brand-500'
  },
  {
    to: ROUTES.inventory,
    icon: Package,
    label: 'Saman Jodein',
    hint: 'Stock update',
    tone: 'from-accent-500 to-accent-600'
  },
  {
    to: ROUTES.customers,
    icon: UserPlus,
    label: 'Grahak Jodein',
    hint: 'Khata kholein',
    tone: 'from-lime-500 to-emerald-600'
  }
];

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {ACTIONS.map(({ to, icon: Icon, label, hint, tone }) => (
        <Link
          key={to}
          to={to}
          className={`
            group relative overflow-hidden rounded-3xl bg-gradient-to-br ${tone}
            p-5 text-white shadow-card transition
            hover:shadow-lift hover:-translate-y-0.5 active:scale-[0.98]
          `}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-xl transition group-hover:bg-white/20" />
          <Icon className="relative h-6 w-6" strokeWidth={2.5} />
          <p className="relative mt-4 font-display text-base font-extrabold">
            {label}
          </p>
          <p className="relative text-xs text-white/80">{hint}</p>
        </Link>
      ))}
    </div>
  );
}