import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

type Props = {
  onScan: (barcode: string) => void;
  onClose: () => void;
};

export function BarcodeScanner({ onScan, onClose }: Props) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const divId = 'barcode-scanner-region';

  useEffect(() => {
    const scanner = new Html5Qrcode(divId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onScan(decodedText);
          scanner.stop().then(() => onClose()).catch(() => onClose());
        },
        () => {}
      )
      .catch((err) => {
        console.error('Camera error:', err);
      });

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <p className="font-bold text-white">Barcode scan karein</p>
        <button
          onClick={() => {
            scannerRef.current?.stop().then(() => onClose()).catch(() => onClose());
          }}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div id={divId} className="h-[calc(100vh-64px)] w-full" />
    </div>
  );
}