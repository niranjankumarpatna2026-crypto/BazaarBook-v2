import { cn } from '@/lib/cn';

type Props = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
};

const SIZES = {
  sm: { box: 'h-9 w-9',   text: 'text-base' },
  md: { box: 'h-10 w-10', text: 'text-lg' },
  lg: { box: 'h-14 w-14', text: 'text-2xl' }
};

export function BrandLogo({ size = 'md', showText = true, className }: Props) {
  const s = SIZES[size];

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Logo Image */}
      <div
        className={cn(
          'grid shrink-0 place-items-center overflow-hidden rounded-2xl',
          'shadow-sm ring-1 ring-stone-200/50',
          s.box
        )}
      >
        <img
          src="/logo.png"
          alt="BazaarBook Logo"
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback — agar logo.png nahi mila
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              parent.classList.add(
                'bg-gradient-to-br',
                'from-brand-600',
                'via-brand-500',
                'to-accent-500'
              );
              parent.innerHTML = '<span class="text-white font-extrabold text-lg">B</span>';
            }
          }}
        />
      </div>

      {showText && (
        <div className="leading-none">
          <div className={cn('font-display font-extrabold text-slate-900', s.text)}>
            Bazaar<span className="text-brand-600">Book</span>
          </div>
          <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Dukaan Ka Saathi
          </div>
        </div>
      )}
    </div>
  );
}