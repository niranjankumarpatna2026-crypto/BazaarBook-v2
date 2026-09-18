import { useState } from 'react';
import { Download, X, Share, Plus, Smartphone } from 'lucide-react';
import { cn } from '@/lib/cn';
import { usePwaInstall } from './usePwaInstall';

export function InstallBanner() {
  const { canInstall, isInstalled, isIOS, promptInstall, dismiss } = usePwaInstall();
  const [hidden, setHidden] = useState(false);
  const [iosModalOpen, setIosModalOpen] = useState(false);

  if (!canInstall || isInstalled || hidden) return null;

  const handleInstall = async () => {
    if (isIOS) {
      setIosModalOpen(true);
      return;
    }
    const ok = await promptInstall();
    if (ok) setHidden(true);
  };

  return (
    <>
      <div className="fixed inset-x-3 bottom-24 z-30 animate-slide-up lg:bottom-6 lg:left-auto lg:right-6 lg:inset-x-auto lg:w-96 rounded-3xl border border-brand-200 bg-white p-4 shadow-xl ring-1 ring-brand-100">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-md">
            <Smartphone className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-slate-900">📱 BazaarBook install karein</p>
            <p className="mt-0.5 text-xs text-slate-500">Home screen par icon milega — app jaisa</p>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={handleInstall} className="btn-primary btn-sm flex-1">
                <Download className="h-3.5 w-3.5" />
                Install
              </button>
              <button
                onClick={() => { dismiss(); setHidden(true); }}
                className="btn-ghost btn-sm"
              >
                Baad mein
              </button>
            </div>
          </div>
          <button
            onClick={() => { dismiss(); setHidden(true); }}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-400 hover:bg-stone-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {iosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setIosModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl animate-slide-up">
            <div className="border-b border-stone-100 p-5 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg">
                <Smartphone className="h-7 w-7" />
              </div>
              <h2 className="mt-3 font-display text-lg font-extrabold">iPhone par install karein</h2>
              <p className="mt-1 text-xs text-slate-500">Safari browser mein 2 step</p>
            </div>
            <div className="space-y-4 p-5">
              <Step n={1} icon={<Share className="h-5 w-5" />} title="Share button dabayein" hint="Neeche toolbar mein box-arrow icon" />
              <Step n={2} icon={<Plus className="h-5 w-5" />} title="'Add to Home Screen' chunein" hint="Menu scroll karke dhundein" />
            </div>
            <div className="border-t border-stone-100 bg-stone-50 p-4 text-center">
              <button onClick={() => setIosModalOpen(false)} className="btn-primary btn-md w-full">Samajh gaya 👍</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ n, icon, title, hint }: any) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-extrabold text-brand-700">{n}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-stone-100 text-slate-700">{icon}</span>
          <p className="text-sm font-bold text-slate-900">{title}</p>
        </div>
        <p className="mt-0.5 pl-9 text-xs text-slate-500">{hint}</p>
      </div>
    </div>
  );
}