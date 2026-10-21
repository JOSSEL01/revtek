import { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  // Se cierra automáticamente a los 3.5 segundos
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-lg bg-white p-4 shadow-xl border border-slate-200 animate-in slide-in-from-right-5 fade-in duration-300">
      {type === 'success' ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
      <p className="text-sm font-medium text-slate-700">{message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600 ml-2">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}