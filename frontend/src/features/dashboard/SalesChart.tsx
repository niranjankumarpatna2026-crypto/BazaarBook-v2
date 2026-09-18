import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { inr } from '@/lib/format';
import type { DaySales } from '@/types/dashboard';

type Props = {
  data: DaySales[];
};

const W = 600;
const H = 220;
const PADDING = { top: 30, right: 16, bottom: 36, left: 16 };

export function SalesChart({ data }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const { points, maxVal, total } = useMemo(() => {
    const max = Math.max(...data.map((d) => d.total), 1);
    const innerW = W - PADDING.left - PADDING.right;
    const innerH = H - PADDING.top - PADDING.bottom;
    const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;
    const sum = data.reduce((s, d) => s + d.total, 0);

    const pts = data.map((d, i) => ({
      x: PADDING.left + i * stepX,
      y: PADDING.top + innerH - (d.total / max) * innerH,
      raw: d
    }));

    return { points: pts, maxVal: max, total: sum };
  }, [data]);

  // Build smooth path (Catmull-Rom → Bézier)
  const pathD = useMemo(() => {
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

  const areaD = `${pathD} L ${points[points.length - 1]?.x} ${H - PADDING.bottom} L ${points[0]?.x} ${H - PADDING.bottom} Z`;

  const innerH = H - PADDING.top - PADDING.bottom;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 p-5">
        <div>
          <h3 className="font-display text-base font-bold text-slate-900">
            Pichle 7 din ki kamai
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Total: <span className="font-bold text-slate-700">{inr(total)}</span>
          </p>
        </div>
        <div className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          Is hafte
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ height: 'auto', maxHeight: 260 }}
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setHovered(null)}
        >
          <defs>
            <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line
              key={p}
              x1={PADDING.left}
              x2={W - PADDING.right}
              y1={PADDING.top + innerH * p}
              y2={PADDING.top + innerH * p}
              stroke="#e7e5e4"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area */}
          <path d={areaD} fill="url(#chartArea)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#chartLine)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points + hover zones */}
          {points.map((p, i) => {
            const isHover = hovered === i;
            const isLast = i === points.length - 1;
            return (
              <g key={i}>
                {/* Bigger transparent hit area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={20}
                  fill="transparent"
                  onMouseEnter={() => setHovered(i)}
                  onTouchStart={() => setHovered(i)}
                />
                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHover ? 6 : isLast ? 5 : 3.5}
                  fill="#fff"
                  stroke={isHover ? '#7c3aed' : isLast ? '#7c3aed' : '#a78bfa'}
                  strokeWidth={isHover ? 3 : 2}
                />
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((d, i) => {
            const x = points[i]?.x ?? 0;
            return (
              <text
                key={i}
                x={x}
                y={H - 12}
                textAnchor="middle"
                className={cn(
                  'text-[10px] font-bold',
                  hovered === i ? 'fill-brand-700' : 'fill-slate-400'
                )}
              >
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hovered !== null && points[hovered] && (
          <div className="pointer-events-none mt-3 flex animate-fade-in items-center justify-between rounded-2xl bg-brand-50 px-4 py-3 ring-1 ring-brand-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                {points[hovered].raw.label}
              </p>
              <p className="font-display text-lg font-extrabold text-brand-900">
                {inr(points[hovered].raw.total)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                Bills
              </p>
              <p className="font-display text-lg font-extrabold text-brand-900">
                {points[hovered].raw.bills}
              </p>
            </div>
          </div>
        )}

        {hovered === null && (
          <p className="mt-3 text-center text-xs text-slate-400">
            Bar par hover karein — detail dekhne ke liye
          </p>
        )}
      </div>
    </div>
  );
}