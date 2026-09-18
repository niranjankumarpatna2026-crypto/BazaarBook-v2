export function StatCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <div className="h-3 w-20 animate-pulse rounded-full bg-stone-200" />
          <div className="h-7 w-28 animate-pulse rounded-full bg-stone-200" />
          <div className="h-3 w-24 animate-pulse rounded-full bg-stone-100" />
        </div>
        <div className="h-11 w-11 animate-pulse rounded-2xl bg-stone-100" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="card p-5">
      <div className="mb-4 h-4 w-40 animate-pulse rounded-full bg-stone-200" />
      <div className="h-48 animate-pulse rounded-2xl bg-stone-100" />
    </div>
  );
}

export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card divide-y divide-stone-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-2xl bg-stone-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-32 animate-pulse rounded-full bg-stone-200" />
            <div className="h-2.5 w-24 animate-pulse rounded-full bg-stone-100" />
          </div>
          <div className="h-4 w-16 animate-pulse rounded-full bg-stone-200" />
        </div>
      ))}
    </div>
  );
}