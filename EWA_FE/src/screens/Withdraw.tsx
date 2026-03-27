import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Landmark, ChevronRight, Info, AlertCircle, Wallet } from 'lucide-react';
import { Screen } from '../types';
import { useApp } from '../AppContext';
import * as mockApi from '@/services/mockApi';
import { MOCK_BANKS } from '@/data/mockData';
import ConfirmSheet from '../components/ConfirmSheet';
import SuccessScreen from '../components/SuccessScreen';

const QUICK_AMOUNTS = [500000, 1000000, 2000000, 3000000];

export default function Withdraw({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { employee, refreshEmployee } = useApp();
  const [amountStr, setAmountStr] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => { refreshEmployee(); }, []);

  const limit = useMemo(() => employee ? mockApi.calculateLimit(employee) : 0, [employee]);
  const amount = useMemo(() => {
    const n = parseInt(amountStr.replace(/\D/g, ''), 10);
    return isNaN(n) ? 0 : n;
  }, [amountStr]);
  const fee = useMemo(() => amount > 0 ? mockApi.calculateFee(amount) : 0, [amount]);
  const totalDeduction = amount + fee;

  const formatMoney = (n: number) => n.toLocaleString('vi-VN');
  const formatInput = (val: string) => {
    const num = parseInt(val.replace(/\D/g, ''), 10);
    if (isNaN(num) || num === 0) return '';
    return num.toLocaleString('vi-VN');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setAmountStr(raw ? formatInput(raw) : '');
    setError('');
  };

  const handleQuickAmount = (val: number) => {
    setAmountStr(formatInput(val.toString()));
    setError('');
  };

  const handleShowConfirm = () => {
    if (!employee) return;
    if (amount <= 0) { setError('Vui lòng nhập số tiền rút'); return; }
    if (!employee.linkedBank) { setError('Vui lòng liên kết ngân hàng trước khi rút tiền'); return; }
    if (totalDeduction > limit) { setError(`Số tiền rút + phí (${formatMoney(totalDeduction)}đ) vượt quá hạn mức (${formatMoney(limit)}đ)`); return; }
    setShowConfirm(true);
  };

  const handleWithdraw = async () => {
    if (!employee) return;
    setLoading(true);
    setError('');
    const result = await mockApi.processWithdrawal(employee.id, amount);
    setLoading(false);
    if (result.success) {
      setShowConfirm(false);
      setSuccess(true);
      setResultData(result.data);
      refreshEmployee();
    } else {
      setShowConfirm(false);
      setError(result.error || 'Giao dịch thất bại');
    }
  };

  if (!employee) return null;

  const bankName = employee.linkedBank
    ? (MOCK_BANKS.find(b => b.code === employee.linkedBank!.bankCode)?.name || employee.linkedBank.bankCode)
    : null;

  if (success) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}, ${now.getDate().toString().padStart(2,'0')} Th${(now.getMonth()+1).toString().padStart(2,'0')} ${now.getFullYear()}`;
    const txId = `EWA${Date.now().toString().slice(-9)}`;
    return (
      <div className="flex-1 flex flex-col">
        <SuccessScreen
          title="Giao dịch thành công!"
          subtitle="Khoản ứng lương của bạn đã được xử lý"
          amountLabel="Số tiền nhận thực tế"
          amount={`${formatMoney(amount)} đ`}
          breakdown={[
            { label: 'Số tiền ứng', value: `${formatMoney(amount + fee)} đ` },
            { label: 'Phí dịch vụ', value: `${formatMoney(fee)} đ` },
          ]}
          meta={[
            { label: 'Mã giao dịch', value: txId },
            { label: 'Thời gian', value: timeStr },
            { label: 'Phương thức', value: `${bankName} ****${employee.linkedBank?.accountNo.slice(-4)}` },
          ]}
          primaryAction={{ label: 'Về Trang chủ', onClick: () => onNavigate('dashboard') }}
          secondaryAction={{ label: 'Xem chi tiết giao dịch', onClick: () => { setSuccess(false); setAmountStr(''); setResultData(null); } }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-surface text-on-surface">
      {/* Top Navigation */}
      <header className="w-full top-0 z-50 shadow-sm bg-slate-100/50 backdrop-blur-md sticky">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('dashboard')} className="active:scale-95 transition-transform hover:opacity-80 text-indigo-900"><ArrowLeft className="w-6 h-6" /></button>
            <h1 className="font-bold text-lg tracking-tight text-indigo-900">Rút tiền</h1>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8 space-y-8 w-full pb-32 overflow-y-auto">
        {/* Balance Hero */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary-container p-8 shadow-2xl shadow-primary/20">
          <div className="relative z-10 space-y-2">
            <p className="text-on-primary/80 font-medium text-sm tracking-wide">Hạn mức khả dụng</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-white text-4xl font-extrabold tracking-tight">{formatMoney(limit)}</h2>
              <span className="text-on-primary/90 text-xl font-bold">đ</span>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        <div className="space-y-10">
          {/* Bank Selection */}
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="text-on-surface-variant font-bold text-sm uppercase tracking-widest px-1">Ngân hàng nhận</h3>
              <button onClick={() => onNavigate('link-bank')} className="text-primary text-xs font-bold hover:underline">Thay đổi</button>
            </div>
            {employee.linkedBank ? (
              <div onClick={() => onNavigate('link-bank')} className="bg-white/70 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-5 flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center"><Landmark className="text-primary w-6 h-6" /></div>
                  <div>
                    <p className="font-bold text-on-surface">{bankName}</p>
                    <p className="text-on-surface-variant text-xs mt-0.5">**** {employee.linkedBank.accountNo.slice(-4)} • {employee.linkedBank.accountName}</p>
                  </div>
                </div>
                <ChevronRight className="text-outline-variant group-hover:text-primary transition-colors w-5 h-5" />
              </div>
            ) : (
              <button onClick={() => onNavigate('link-bank')} className="w-full bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <span className="font-bold text-amber-700 text-sm">Chưa có tài khoản liên kết. Nhấn để thêm.</span>
              </button>
            )}
          </section>

          {/* Amount Input */}
          <section className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-on-surface-variant font-bold text-sm uppercase tracking-widest px-1">Số tiền rút</h3>
              <div className="relative">
                <input type="text" value={amountStr} onChange={handleAmountChange} placeholder="0" className="w-full bg-surface-container-high border-none rounded-xl p-6 text-3xl font-bold text-primary focus:ring-2 focus:ring-primary/30 transition-all tracking-tight" />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-primary font-bold text-xl">đ</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_AMOUNTS.map(val => (
                <button key={val} onClick={() => handleQuickAmount(val)} className={`py-4 px-2 rounded-xl font-bold transition-all active:scale-95 text-sm shadow-sm ${amount === val ? 'bg-primary-container text-white shadow-md' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-primary-fixed hover:text-primary'}`}>
                  {formatMoney(val)}đ
                </button>
              ))}
            </div>
          </section>

          {/* Fee Info */}
          {amount > 0 && (
            <section className="bg-indigo-50/50 rounded-xl p-6 border-l-4 border-primary space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm font-medium">Phí giao dịch</span>
                <span className="text-on-surface font-bold text-sm">{formatMoney(fee)} đ</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant text-sm font-medium">Tiền thực nhận</span>
                <span className="text-emerald-600 font-bold text-base">{formatMoney(amount)} đ</span>
              </div>
              {totalDeduction > limit && (
                <div className="pt-2 flex gap-2">
                  <AlertCircle className="text-red-500 w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-600 font-medium">Số tiền + phí vượt hạn mức khả dụng!</p>
                </div>
              )}
              <div className="pt-2 flex gap-2">
                <Info className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs text-on-surface-variant leading-relaxed">Tiền sẽ được chuyển vào tài khoản của bạn ngay lập tức.</p>
              </div>
            </section>
          )}

          {error && <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">{error}</div>}
        </div>
      </main>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-white/80 backdrop-blur-xl z-40 flex justify-center">
        <div className="w-full max-w-xl">
          <button onClick={handleShowConfirm} disabled={amount <= 0} className="w-full bg-gradient-to-r from-primary to-primary-container text-white font-bold py-5 rounded-xl shadow-2xl shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
            Xác nhận rút tiền
          </button>
        </div>
      </div>

      {/* Confirmation Sheet */}
      {showConfirm && (
        <ConfirmSheet
          title="Xác nhận rút tiền"
          icon={<Wallet className="w-6 h-6 text-indigo-600" />}
          details={[
            { label: 'Ngân hàng', value: bankName || '' },
            { label: 'Tài khoản', value: `****${employee.linkedBank!.accountNo.slice(-4)}` },
            { label: 'Số tiền rút', value: `${formatMoney(amount)}đ`, highlight: true },
            { label: 'Phí giao dịch', value: `${formatMoney(fee)}đ` },
            { label: 'Tổng trừ hạn mức', value: `${formatMoney(totalDeduction)}đ`, accent: 'indigo' },
          ]}
          note="Tiền sẽ được chuyển về tài khoản ngân hàng của bạn ngay lập tức sau khi xác nhận."
          confirmLabel="Đồng ý rút tiền"
          loading={loading}
          onConfirm={handleWithdraw}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
