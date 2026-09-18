import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export function OfflineIndicator() {
  const [online, setOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  if (online) return null;

  return (
    <div className="sticky top-0 z-50 animate-slide-down border-b border-amber-200 bg-amber-50 px-4 py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-800">
            Offline mode — internet check karein
          </span>
        </div>
        <button
          onClick={() => location.reload()}
          className="inline-flex items-center gap-1 rounded-full bg-amber-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-amber-700"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      </div>
    </div>
  );
}