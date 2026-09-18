import { AlertTriangle, Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import type { LowStockItem } from '@/types/dashboard';

export function LowStockAlerts({ items }: { items: LowStockItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="card overflow-hidden border-accent-200">
      <div className="flex items-center justify-between border-b border-accent-100 bg-accent-50/50 px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-accent-600" />
          <h3 className="font-display text-base font-bold text-slate-900">
            Saman Khatam Hone Wala Hai
          </h3>
        </div>
        <Link
          to={ROUTES.inventory}
          className="inline-flex items-center gap-1 text-xs font-bold text-accent-700 hover:underline"
        >
          Sab dekhein
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ul className="divide-y divide-stone-100">
        {items.slice(0, 3).map((it) => (
          <li key={it.id} className="flex items-center gap-3 px-5 py-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-accent-50 text-accent-600">
              <Package className="h-5 w-5" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {it.name}
              </p>
              <p className="text-xs text-slate-500">
                Reorder level: {it.reorderLevel} {it.unit}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-display text-base font-extrabold text-accent-600">
                {it.stock}
              </p>
              <p className="text-[10px] font-bold uppercase text-slate-400">
                {it.unit} bacha
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}