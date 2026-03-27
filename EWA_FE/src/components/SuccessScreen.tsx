import { CheckCircle2, ArrowRight, Wallet } from 'lucide-react';

interface SuccessScreenProps {
  title: string;
  subtitle?: string;
  /** The main highlighted amount label (e.g. "SỐ TIỀN NHẬN THỰC TẾ") */
  amountLabel?: string;
  /** The main highlighted amount value (e.g. "1,980,000 đ") */
  amount?: string;
  /** Breakdown items shown inside the card below the amount */
  breakdown?: { label: string; value: string }[];
  /** Metadata items shown below the card (transaction ID, time, method) */
  meta?: { label: string; value: string }[];
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

export default function SuccessScreen({ title, subtitle, amountLabel, amount, breakdown, meta, primaryAction, secondaryAction }: SuccessScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-purple-50/40 pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-b from-indigo-100/60 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gradient-to-t from-purple-100/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-10 w-full max-w-sm mx-auto">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(99,102,241,0.3)]">
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center border-[3px] border-white shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-black text-slate-900 text-center leading-tight mb-2">{title}</h1>
        {subtitle && <p className="text-slate-500 text-sm text-center mb-8 max-w-[250px]">{subtitle}</p>}

        {/* Amount Card */}
        {amount && (
          <div className="w-full bg-white rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-slate-100/80 overflow-hidden mb-6">
            {/* Main amount */}
            <div className="px-6 pt-6 pb-4 text-center">
              {amountLabel && (
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">{amountLabel}</p>
              )}
              <p className="text-[34px] font-black text-indigo-600 tracking-tight leading-none">{amount}</p>
            </div>

            {/* Breakdown */}
            {breakdown && breakdown.length > 0 && (
              <div className="px-6 pb-5 space-y-0">
                {breakdown.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-t border-dashed border-slate-100 first:border-t-0">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-bold text-slate-700">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Meta info */}
        {meta && meta.length > 0 && (
          <div className="w-full space-y-3 mb-8">
            {meta.map((item, i) => (
              <div key={i} className="flex justify-between items-center px-1">
                <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                <span className="text-xs font-bold text-slate-600">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="w-full space-y-3 mt-auto">
          <button
            onClick={primaryAction.onClick}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white font-bold py-4 rounded-full shadow-[0_8px_32px_rgba(99,102,241,0.35)] active:scale-[0.97] transition-all flex items-center justify-center gap-2 text-base"
          >
            {primaryAction.label}
          </button>
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="w-full bg-white text-indigo-600 font-bold py-3.5 rounded-full border-2 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-sm"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pb-8 flex items-center justify-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 tracking-widest">EWA</span>
        <span className="text-slate-300">•</span>
        <span className="text-[10px] font-medium text-slate-400 tracking-wider">SECURED BY LUMINA</span>
      </div>
    </div>
  );
}
