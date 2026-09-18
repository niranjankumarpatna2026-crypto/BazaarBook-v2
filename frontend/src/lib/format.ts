// export function inr(n: number, sym = true) {
//   const f = new Intl.NumberFormat('en-IN').format(n);
//   return sym ? '₹' + f : f;
// }

// export function initial(n?: string) {
//   return (n?.trim()?.[0] || '?').toUpperCase();
// }

// export function timeAgo(d: string | Date) {
//   const t = typeof d === 'string' ? new Date(d) : d;
//   const s = Math.floor((Date.now() - t.getTime()) / 1000);
//   if (s < 60) return 'abhi';
//   if (s < 3600) return Math.floor(s / 60) + ' min';
//   if (s < 86400) return Math.floor(s / 3600) + ' ghante';
//   return Math.floor(s / 86400) + ' din';
// }

// export function dateHi(date: string | Date): string {
//   const d = typeof date === 'string' ? new Date(date) : date;
//   return d.toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric'
//   });
// }
/**


 * BazaarBook Format Helpers
 * Safe, null-proof formatting utilities
 */

export function inr(amount: number | undefined | null, withSymbol = true): string {
  const n = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(n);
  return withSymbol ? `₹${formatted}` : formatted;
}

export function initial(name?: string): string {
  if (!name || typeof name !== 'string') return '?';
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : '?';
}

export function timeAgo(date: string | Date | undefined): string {
  if (!date) return 'abhi';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'abhi';

  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return 'abhi';
  if (secs < 3600) return `${Math.floor(secs / 60)} min pehle`;
  if (secs < 86400) return `${Math.floor(secs / 3600)} ghante pehle`;
  if (secs < 604800) return `${Math.floor(secs / 86400)} din pehle`;
  return dateHi(d);
}

export function dateHi(date: string | Date | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}