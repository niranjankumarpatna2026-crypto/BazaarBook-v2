import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';

type Tone = 'brand' | 'accent' | 'success' | 'danger';

type Props = {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: Tone;
  change?: number;      // % change vs yesterday
  hint?: string;
  onClick?: () => void;
};

const TONES: Record<Tone, { bg: string; icon: string; ring: string }> = {
  brand:   { bg: 'bg-brand-50',   icon: 'text-brand-600',   ring: 'ring-brand-100' },
  accent:  { bg: 'bg-accent-50',  icon: 'text-accent-600',  ring: 'ring-accent-100' },
  success: { bg: 'bg-lime-50',    icon: 'text-lime-600',    ring: 'ring-lime-100' },
  danger:  { bg: 'bg-red-50',     icon: 'text-red-500',     ring: 'ring-red-100' }
};

export function StatCard({
  label,
  value,
  icon,
  tone = 'brand',
  change,
  hint,
  onClick
}: Props) {
  const t = TONES[tone];
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      className={cn(
        'card p-5 transition',
        isClickable && 'cursor-pointer hover:shadow-lift hover:-translate-y-0.5'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {label}
          </p>
          <p className="mt-2 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-slate-500">{hint}</p>
          )}
        </div>

        <div
          className={cn(
            'grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1',
            t.bg,
            t.icon,
            t.ring
          )}
        >
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div
          className={cn(
            'mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold',
            change >= 0
              ? 'bg-lime-100 text-lime-800'
              : 'bg-red-100 text-red-700'
          )}
        >
          {change >= 0 ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {change >= 0 ? '+' : ''}{change.toFixed(0)}% kal se
        </div>
      )}
    </div>
  );
}