import { TrendingUp, Package } from 'lucide-react';
import { inr, initial } from '@/lib/format';
import type { TopProduct } from '@/types/dashboard';

export function TopProducts({ products }: { products: TopProduct[] }) {
  const maxRev = Math.max(...products.map((p) => p.revenue), 1);

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent-600" />
          <h3 className="font-display text-base font-bold text-slate-900">
            Sabse zyada bike
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Is hafte
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <Package className="mb-2 h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">Abhi data nahi</p>
        </div>
      ) : (
        <ul className="divide-y divide-stone-100">
          {products.slice(0, 5).map((p, i) => {
            const pct = (p.revenue / maxRev) * 100;
            return (
              <li key={p.id} className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <span
                    className={`
                      grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-extrabold
                      ${i === 0 ? 'bg-gradient-to-br from-yellow-300 to-amber-500 text-white shadow-sm' : ''}
                      ${i === 1 ? 'bg-gradient-to-br from-slate-200 to-slate-400 text-white' : ''}
                      ${i === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' : ''}
                      ${i > 2 ? 'bg-stone-100 text-slate-600' : ''}
                    `}
                  >
                    {i + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {p.name}
                      </p>
                      <p className="shrink-0 font-display text-sm font-extrabold text-slate-900">
                        {inr(p.revenue)}
                      </p>
                    </div>

                    <div className="mt-1.5 flex items-center gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-slate-500">
                        {p.quantity} बिके
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}