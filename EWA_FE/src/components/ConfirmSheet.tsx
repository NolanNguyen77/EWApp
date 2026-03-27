import { ShieldCheck, Loader2 } from 'lucide-react';

interface ConfirmDetail {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: 'emerald' | 'indigo' | 'red';
}

interface ConfirmSheetProps {
  title: string;
  icon?: React.ReactNode;
  details: ConfirmDetail[];
  note?: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmSheet({ title, icon, details, note, confirmLabel = 'Xác nhận', loading, onConfirm, onCancel }: ConfirmSheetProps) {
  const accentColor = (a?: string) => {
    if (a === 'emerald') return 'text-emerald-600';
    if (a === 'red') return 'text-red-600';
    if (a === 'indigo') return 'text-indigo-600';
    return 'text-slate-900';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center" onClick={onCancel}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      {/* Sheet */}
      <div 
        className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl animate-[slideUp_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-10 h-1.5 bg-slate-200 rounded-full"></div>
        </div>

        <div className="px-6 pb-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            {icon && <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">{icon}</div>}
            <div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500 font-medium">Vui lòng kiểm tra thông tin trước khi xác nhận</p>
            </div>
          </div>

          {/* Details */}
          <div className="bg-slate-50 rounded-2xl overflow-hidden">
            <div className="divide-y divide-slate-100">
              {details.map((item, i) => (
                <div key={i} className="flex justify-between items-center px-5 py-4">
                  <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                  <span className={`text-sm font-bold ${item.highlight ? 'text-lg' : ''} ${accentColor(item.accent)}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          {note && (
            <div className="flex items-start gap-3 bg-indigo-50/50 text-indigo-700 px-4 py-3 rounded-xl">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">{note}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-[0_8px_24px_rgba(79,70,229,0.25)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Đang xử lý...' : confirmLabel}
            </button>
            <button
              onClick={onCancel}
              disabled={loading}
              className="w-full text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-all text-sm disabled:opacity-40"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
