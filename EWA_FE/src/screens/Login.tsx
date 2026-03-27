import { useState, useRef } from 'react';
import { Wallet, ArrowRight, ShieldCheck, KeyRound, Lock } from 'lucide-react';
import { useApp } from '../AppContext';
import * as mockApi from '@/services/mockApi';

type LoginStep = 'employee' | 'otp';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const { login } = useApp();
  const [step, setStep] = useState<LoginStep>('employee');
  const [employeeCode, setEmployeeCode] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState<any>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleValidateEmployee = async () => {
    if (!employeeCode.trim()) { setError('Vui lòng nhập mã nhân viên'); return; }
    setLoading(true);
    setError('');
    const result = await mockApi.validateEmployee(employeeCode);
    setLoading(false);
    if (result.success) {
      setEmployeeData(result.data);
      setStep('otp');
      setError('');
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } else {
      setError(result.error || 'Mã nhân viên không tồn tại');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);
    setError('');
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    const fullOtp = newDigits.join('');
    if (fullOtp.length === 6) handleVerifyOtp(fullOtp);
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...otpDigits];
      for (let i = 0; i < 6; i++) newDigits[i] = pasted[i] || '';
      setOtpDigits(newDigits);
      if (pasted.length === 6) handleVerifyOtp(pasted);
      else otpRefs.current[pasted.length]?.focus();
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    setError('');
    const result = await mockApi.verifyOtp(otp);
    setLoading(false);
    if (result.success) { login(employeeData); onLogin(); }
    else { setError(result.error || 'Mã OTP không đúng'); setOtpDigits(['', '', '', '', '', '']); setTimeout(() => otpRefs.current[0]?.focus(), 100); }
  };

  // ===== OTP SCREEN =====
  if (step === 'otp') {
    const maskedPhone = employeeData?.phone
      ? employeeData.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
      : '***';

    return (
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-purple-50/40"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-100/60 to-transparent rounded-full blur-3xl"></div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12">
          {/* Icon */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_12px_40px_rgba(99,102,241,0.3)]">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center border-[3px] border-white">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-slate-900 text-center mb-2">Xác thực OTP</h1>
          <p className="text-slate-500 text-sm text-center leading-relaxed max-w-[280px] mb-10">
            Mã xác thực đã được gửi đến<br/>số điện thoại <span className="font-bold text-slate-700">{maskedPhone}</span>
          </p>

          {/* OTP Boxes */}
          <div className="flex justify-center gap-3 mb-4" onPaste={handleOtpPaste}>
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={el => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className={`w-[48px] h-[56px] text-center text-2xl font-bold rounded-2xl transition-all duration-200 outline-none ${
                  digit
                    ? 'bg-indigo-50 border-2 border-indigo-500 text-indigo-700 shadow-[0_4px_12px_rgba(99,102,241,0.15)]'
                    : 'bg-white border-2 border-slate-200 text-slate-900 focus:border-indigo-400 focus:shadow-[0_4px_12px_rgba(99,102,241,0.1)]'
                }`}
              />
            ))}
          </div>

          {/* Resend / Change */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => { setStep('employee'); setOtpDigits(['', '', '', '', '', '']); setError(''); }}
              className="text-indigo-600 text-xs font-semibold hover:underline">
              Đổi mã nhân viên
            </button>
            <span className="text-slate-300">|</span>
            <button className="text-indigo-600 text-xs font-semibold hover:underline">Gửi lại mã</button>
          </div>

          {/* Error */}
          {error && (
            <div className="w-full max-w-xs bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-2xl border border-red-100 text-center mb-6">{error}</div>
          )}

          {/* Submit Button */}
          <button
            onClick={() => handleVerifyOtp(otpDigits.join(''))}
            disabled={loading || otpDigits.join('').length < 6}
            className="w-full max-w-xs bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white font-bold py-4 rounded-full shadow-[0_8px_32px_rgba(99,102,241,0.35)] active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Đang xác thực...
              </span>
            ) : <>Xác nhận<ArrowRight className="w-5 h-5" /></>}
          </button>
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

  // ===== LOGIN SCREEN =====
  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-purple-50/40"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-100/60 to-transparent rounded-full blur-3xl"></div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-12">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-[0_12px_40px_rgba(99,102,241,0.3)] mb-5">
            <Wallet className="text-white w-10 h-10" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-indigo-700">EWA</h1>
          <p className="text-slate-400 font-medium mt-1 text-sm tracking-wide">Enterprise Wallet Access</p>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Chào mừng trở lại!</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[260px] mx-auto">
            Nhập mã nhân viên để truy cập<br/>quyền lợi ứng lương của bạn
          </p>
        </div>

        {/* Input */}
        <div className="w-full max-w-xs space-y-3 mb-8">
          <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 px-1">Mã nhân viên</label>
          <div className="relative">
            <input
              type="text"
              placeholder="VD: NV001"
              value={employeeCode}
              onChange={(e) => { setEmployeeCode(e.target.value.toUpperCase()); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleValidateEmployee()}
              autoFocus
              className="w-full px-5 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-indigo-400 focus:shadow-[0_4px_16px_rgba(99,102,241,0.1)] transition-all text-slate-900 text-lg font-bold placeholder:text-slate-300 placeholder:font-medium outline-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="w-full max-w-xs bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-2xl border border-red-100 text-center mb-6">{error}</div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleValidateEmployee}
          disabled={loading}
          className="w-full max-w-xs bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white font-bold py-4 rounded-full shadow-[0_8px_32px_rgba(99,102,241,0.35)] active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Đang xử lý...
            </span>
          ) : <>Tiếp tục<ArrowRight className="w-5 h-5" /></>}
        </button>

        {/* Info card */}
        <div className="mt-10 w-full max-w-xs bg-white/60 backdrop-blur-sm p-4 rounded-2xl flex items-start gap-3 border border-slate-100/80">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">Truy cập tức thì</h3>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">Nhận lương sớm mà không cần thủ tục rườm rà.</p>
          </div>
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
