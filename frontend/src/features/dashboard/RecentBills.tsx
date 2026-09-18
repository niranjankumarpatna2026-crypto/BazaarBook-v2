import { ChevronRight, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { inr, timeAgo, initial } from '@/lib/format';
import { ROUTES } from '@/lib/constants';
import type { RecentBill } from '@/types/dashboard';

const MODE_EMOJI: Record<RecentBill['paymentMode'], string> = {
  cash:   '💵',
  upi:    '📱',
  card:   '💳',
  udhaar: '📝',
  split:  '🔀'
};

export function RecentBills({ bills }: { bills: RecentBill[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <h3 className="font-display text-base font-bold text-slate-900">
          Aakhri Bills
        </h3>
        <Link
          to={ROUTES.bills}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
        >
          Sab dekhein
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {bills.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <Receipt className="mb-2 h-8 w-8 text-slate-300" />
          <p className="text-sm text-slate-500">Abhi koi bill nahi</p>
        </div>
      ) : (
        <ul className="divide-y divide-stone-100">
          {bills.slice(0, 5).map((b) => (
            <li key={b.id}>
              <Link
                to={`/app/bills/${b.id}`}
                className="flex items-center gap-3 px-5 py-3 transition hover:bg-stone-50"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-stone-100 to-stone-50 text-sm font-bold text-slate-700">
                  {initial(b.customerName)}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {b.customerName || 'Walk-in'}
                    </p>
                    <span className="text-xs font-mono text-slate-400">
                      {b.number}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                    <span>{MODE_EMOJI[b.paymentMode]}</span>
                    <span className="capitalize">{b.paymentMode}</span>
                    <span>•</span>
                    <span>{timeAgo(b.createdAt)}</span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-display text-base font-extrabold text-slate-900">
                    {inr(b.total)}
                  </p>
                  <span
                    className={cn(
                      'chip text-[9px]',
                      b.status === 'paid'    && 'bg-lime-100 text-lime-800',
                      b.status === 'pending' && 'bg-red-100 text-red-700',
                      b.status === 'partial' && 'bg-yellow-100 text-yellow-800'
                    )}
                  >
                    {b.status === 'paid' ? 'Paid' : b.status === 'pending' ? 'Baki' : 'Aadha'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}