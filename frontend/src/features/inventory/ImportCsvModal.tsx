import { useState, useRef } from 'react';
import { X, Upload, Download, Check, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';

type Props = {
  open: boolean;
  onClose: () => void;
  onImported: () => void;
};

export function ImportCsvModal({ open, onClose, onImported }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  const handleFile = (f: File) => {
    if (!f.name.toLowerCase().endsWith('.csv')) {
      toast.error('Sirf CSV file upload karein');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error('File 5 MB se chhoti honi chahiye');
      return;
    }
    setFile(f);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('bb_token');
      const API_URL = import.meta.env.VITE_API_URL || 'https://bazaar-book-api.onrender.com';

      const res = await fetch(`${API_URL}/api/products/bulk`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload fail');

      setResult(data);
      toast.success(`${data.inserted} products jud gaye!`);
      onImported();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = '\uFEFF' +
      'name,category,brand,unit,price,purchasePrice,stock,reorderLevel,barcode\n' +
      'Surf Excel 1kg,Detergent,Surf,pkt,95,78,50,10,\n' +
      'Tata Salt 1kg,Grocery,Tata,pkt,28,22,200,20,\n' +
      'Colgate 100g,Toothpaste,Colgate,pcs,55,44,30,10,8901234567890\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bazaar-book-template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template download ho gaya');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-stone-200 p-4">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-600">
            <Upload className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-bold">Excel/CSV Import</h2>
            <p className="text-xs text-slate-500">5000 products tak ek saath</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {/* Template download */}
          <div className="rounded-2xl bg-brand-50 p-4 ring-1 ring-brand-100">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" />
              <div className="flex-1">
                <p className="text-sm font-bold text-brand-900">Pehle template download karein</p>
                <p className="mt-1 text-xs text-brand-700">
                  Excel mein template bharein, phir CSV file upload karein.
                </p>
                <button onClick={downloadTemplate} className="btn-outline btn-sm mt-3">
                  <Download className="h-3.5 w-3.5" />
                  Template download
                </button>
              </div>
            </div>
          </div>

          {/* File drop zone */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              CSV File chunein
            </label>
            <div
              onClick={() => inputRef.current?.click()}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition',
                file
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-stone-300 hover:border-brand-400 hover:bg-brand-50/40'
              )}
            >
              {file ? (
                <>
                  <Check className="h-8 w-8 text-brand-600" />
                  <p className="mt-2 text-sm font-bold text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setResult(null);
                    }}
                    className="mt-2 text-xs font-bold text-red-500 hover:underline"
                  >
                    Hatayein
                  </button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-slate-400" />
                  <p className="mt-2 text-sm font-bold text-slate-700">Click karke file chunein</p>
                  <p className="text-xs text-slate-500">.csv file, max 5 MB</p>
                </>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          {/* Result */}
          {result && (
            <div
              className={cn(
                'rounded-2xl p-4 ring-1',
                result.errors?.length > 0
                  ? 'bg-amber-50 ring-amber-100'
                  : 'bg-lime-50 ring-lime-100'
              )}
            >
              <p className="text-sm font-bold text-slate-900">
                ✅ {result.inserted} / {result.total} products jud gaye
              </p>
              {result.errors?.length > 0 && (
                <>
                  <p className="mt-1 text-xs font-semibold text-amber-800">
                    ⚠️ {result.errors.length} mein problem thi
                  </p>
                  <div className="mt-2 max-h-32 space-y-1 overflow-y-auto">
                    {result.errors.slice(0, 5).map((e: any, i: number) => (
                      <p key={i} className="text-[10px] text-amber-700">
                        Row {e.row}: {e.error}
                      </p>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-stone-200 p-4">
          <button onClick={onClose} className="btn-ghost btn-md flex-1">
            {result ? 'Band karein' : 'Cancel'}
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="btn-primary btn-md flex-[2]"
          >
            {uploading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Upload…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Karein
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}