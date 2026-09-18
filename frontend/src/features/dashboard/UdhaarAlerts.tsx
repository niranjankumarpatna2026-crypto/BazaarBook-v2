import { AlertCircle, Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { inr, initial } from '@/lib/format';
import { ROUTES } from '@/lib/constants';
import type { UdhaarAlert } from '@/types/dashboard';

export function UdhaarAlerts({ alerts }: { alerts: UdhaarAlert[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <h3 className="font-display text-base font-bold text-slate-900">
            Udhaar Wapas Maangein
          </h3>
        </div>
        <Link
          to={ROUTES.customers}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
        >
          Sab dekhein
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ul className="divide-y divide-stone-100">
        {alerts.slice(0, 3).map((a) => (
          <li key={a.customerId} className="flex items-center gap-3 px-5 py-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-red-400 to-red-600 text-sm font-bold text-white">
              {initial(a.customerName)}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {a.customerName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {a.mobile}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="font-display text-base font-extrabold text-red-600">
                {inr(a.balance)}
              </p>
              <div className="mt-1 flex items-center justify-end gap-1">
                <a
                  href={`tel:${a.mobile}`}
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-slate-600 transition hover:bg-brand-100 hover:text-brand-700"
                  aria-label="Call karein"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
                <a
                  href={`https://wa.me/91${a.mobile}?text=${encodeURIComponent(
                    `Namaste ${a.customerName} ji, aapka ${inr(a.balance)} udhaar baki hai. Kripya jaldi de dein. — BazaarBook`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="grid h-7 w-7 place-items-center rounded-full bg-lime-100 text-lime-700 transition hover:bg-lime-200"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}