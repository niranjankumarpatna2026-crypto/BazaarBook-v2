import { useMemo, useState } from 'react';
import { inr } from '@/lib/format';
import { cn } from '@/lib/cn';

const W = 700;
const H = 260;
const PAD = { top: 30, right: 20, bottom: 40, left: 20 };

export function AdminRevenueChart({ data }: { data: any[] }) {
  const [hover, setHover] = useState<number | null>(null);

  const { points, maxVal, total } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.revenue), 1);
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;
    const step = data.length > 1 ? innerW / (data.length - 1) : innerW;
    const sum = data.reduce((s, d) => s + d.revenue, 0);

    const pts = data.map((d, i) => ({
      x: PAD.left + i * step,
      y: PAD.top + innerH - (d.revenue / max) * innerH,
      raw: d
    }));

    return { points: pts, maxVal: max, total: sum };
  }, [data]);

  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? 0 : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] ?? p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  const areaPath = `${linePath} L ${points[points.length - 1]?.x} ${H - PAD.bottom} L ${points[0]?.x} ${H - PAD.bottom} Z`;
  const innerH = H - PAD.top - PAD.bottom;

  if (data.length === 0) {
    return (
      <div className="card flex h-80 items-center justify-center text-sm text-slate-500">
        Revenue data nahi hai
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-5">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900">
            Revenue (30 din)
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Total:{' '}
            <span className="font-bold text-slate-800">{inr(total)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="h-2 w-2 rounded-full bg-brand-500" />
          Revenue
        </div>
      </div>

      <div className="p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ maxHeight: 320 }}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={PAD.top + innerH * p}
              y2={PAD.top + innerH * p}
              stroke="#e7e5e4"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          <path d={areaPath} fill="url(#adminRevGrad)" />
          <path
            d={linePath}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={20}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onTouchStart={() => setHover(i)}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={hover === i ? 6 : 3}
                fill="#fff"
                stroke="#7c3aed"
                strokeWidth={hover === i ? 3 : 2}
              />
            </g>
          ))}

          {data.map((d, i) => {
            const step = Math.ceil(data.length / 8);
            if (i % step !== 0 && i !== data.length - 1) return null;
            return (
              <text
                key={i}
                x={points[i]?.x ?? 0}
                y={H - 14}
                textAnchor="middle"
                className={cn(
                  'text-[9px] font-bold',
                  hover === i ? 'fill-brand-700' : 'fill-slate-400'
                )}
              >
                {new Date(d.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short'
                })}
              </text>
            );
          })}
        </svg>

        {hover !== null && data[hover] && (
          <div className="mt-3 flex animate-fade-in items-center justify-between rounded-2xl bg-brand-50 px-4 py-3 ring-1 ring-brand-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                {new Date(data[hover].date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short'
                })}
              </p>
              <p className="font-display text-lg font-extrabold text-brand-900">
                {inr(data[hover].revenue)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Naye Users
              </p>
              <p className="font-display text-lg font-extrabold text-slate-900">
                {data[hover].newUsers}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Paid
              </p>
              <p className="font-display text-lg font-extrabold text-lime-700">
                {data[hover].paidUsers}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}