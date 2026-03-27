import { useState, useEffect, useMemo } from 'react';
import { Smartphone, Contact, Check, Phone } from 'lucide-react';
import TopBar from '../components/TopBar';
import ConfirmSheet from '../components/ConfirmSheet';
import SuccessScreen from '../components/SuccessScreen';
import { Screen } from '../types';
import { useApp } from '../AppContext';
import * as mockApi from '@/services/mockApi';
import { TOPUP_DENOMINATIONS } from '@/data/mockData';

export default function TopUp({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { employee, refreshEmployee } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDenom, setSelectedDenom] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    refreshEmployee();
    if (employee) setPhoneNumber(employee.phone);
  }, []);

  const limit = useMemo(() => employee ? mockApi.calculateLimit(employee) : 0, [employee]);

  const carrierInfo = useMemo(() => {
    if (phoneNumber.replace(/\D/g, '').length >= 3) {
      return mockApi.detectCarrier(phoneNumber);
    }
    return null;
  }, [phoneNumber]);

  const formatMoney = (n: number) => n.toLocaleString('vi-VN');

  const formatPhone = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(raw);
  };

  const handleShowConfirm = () => {
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length < 10) { setError('Số điện thoại không hợp lệ'); return; }
    if (!selectedDenom) { setError('Vui lòng chọn mệnh giá'); return; }
    if (selectedDenom > limit) { setError(`Mệnh giá vượt hạn mức (${formatMoney(limit)}đ)`); return; }
    setShowConfirm(true);
  };

  const handleTopup = async () => {
    if (!employee || !selectedDenom) return;
    setLoading(true);
    setError('');
    const result = await mockApi.processTopup(employee.id, phoneNumber.replace(/\D/g, ''), selectedDenom);
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

  if (success) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}, ${now.getDate().toString().padStart(2,'0')} Th${(now.getMonth()+1).toString().padStart(2,'0')} ${now.getFullYear()}`;
    const txId = `EWA${Date.now().toString().slice(-9)}`;
    return (
      <div className="flex-1 flex flex-col">
        <SuccessScreen
          title="Giao dịch thành công!"
          subtitle="Nạp tiền điện thoại đã được xử lý"
          amountLabel="Mệnh giá nạp"
          amount={`${formatMoney(selectedDenom!)} đ`}
          breakdown={[
            { label: 'Phí dịch vụ', value: 'Miễn phí' },
          ]}
          meta={[
            { label: 'Mã giao dịch', value: txId },
            { label: 'Thời gian', value: timeStr },
            { label: 'Số điện thoại', value: formatPhone(phoneNumber) },
            { label: 'Nhà mạng', value: carrierInfo?.carrier.name || 'Không xác định' },
          ]}
          primaryAction={{ label: 'Về Trang chủ', onClick: () => onNavigate('dashboard') }}
          secondaryAction={{ label: 'Xem chi tiết giao dịch', onClick: () => { setSuccess(false); setSelectedDenom(null); setResultData(null); } }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <TopBar title="Nạp điện thoại" onBack={() => onNavigate('dashboard')} />
      
      <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 space-y-8">
        {/* Phone Input */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Thông tin thuê bao</h2>
            {carrierInfo && (
              <div className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: `${carrierInfo.carrier.color}15`, color: carrierInfo.carrier.color }}>
                <Check className="w-3 h-3" /> {carrierInfo.carrier.name}
              </div>
            )}
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Smartphone className="w-5 h-5 text-indigo-600" />
            </div>
            <input type="tel" value={formatPhone(phoneNumber)} onChange={handlePhoneChange} placeholder="Nhập số điện thoại"
              className="w-full bg-white border border-slate-100 rounded-2xl py-5 pl-12 pr-12 text-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/30 transition-all shadow-sm" />
            <button className="absolute inset-y-0 right-4 flex items-center">
              <Contact className="w-5 h-5 text-slate-400 hover:text-indigo-600 transition-colors" />
            </button>
          </div>
        </section>

        {/* Denominations */}
        <section className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">Chọn mệnh giá</h2>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1.5 rounded-full">Phí: 0đ (Miễn phí)</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {TOPUP_DENOMINATIONS.map((denom) => {
              const isSelected = selectedDenom === denom;
              const isOverLimit = denom > limit;
              return (
                <button key={denom} onClick={() => { if (!isOverLimit) { setSelectedDenom(denom); setError(''); } }} disabled={isOverLimit}
                  className={`relative p-5 rounded-2xl flex flex-col items-start gap-1 overflow-hidden text-left transition-all active:scale-95 ${
                    isSelected ? 'bg-indigo-50 border-2 border-indigo-600'
                    : isOverLimit ? 'bg-slate-50 border border-slate-100 opacity-50 cursor-not-allowed'
                    : 'bg-white border border-slate-100 hover:border-indigo-200 shadow-sm'
                  }`}>
                  <span className={`text-xl font-black tracking-tight ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>{formatMoney(denom)}đ</span>
                  {isOverLimit && <span className="text-[10px] font-bold text-red-400 uppercase">Vượt hạn mức</span>}
                  {isSelected && (
                    <div className="absolute -top-4 -right-4 w-10 h-10 bg-indigo-600 rotate-45 flex items-end justify-center pb-0.5">
                      <Check className="w-3 h-3 text-white -rotate-45 mb-1" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Limit info */}
        <section className="bg-indigo-50/50 rounded-xl p-4 flex items-center gap-3">
          <div className="text-xs text-slate-600">
            <span className="font-medium">Hạn mức hiện tại: </span>
            <span className="font-bold text-indigo-600">{formatMoney(limit)}đ</span>
          </div>
        </section>

        {error && <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">{error}</div>}
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-md p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100/50 pointer-events-auto">
          <button onClick={handleShowConfirm} disabled={!selectedDenom}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-200 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
            {selectedDenom ? `Nạp ${formatMoney(selectedDenom)}đ` : 'Chọn mệnh giá'}
          </button>
        </div>
      </div>

      {/* Confirmation Sheet */}
      {showConfirm && (
        <ConfirmSheet
          title="Xác nhận nạp tiền"
          icon={<Phone className="w-6 h-6 text-indigo-600" />}
          details={[
            { label: 'Số điện thoại', value: formatPhone(phoneNumber) },
            { label: 'Nhà mạng', value: carrierInfo?.carrier.name || 'Không xác định' },
            { label: 'Mệnh giá', value: `${formatMoney(selectedDenom!)}đ`, highlight: true },
            { label: 'Phí', value: 'Miễn phí', accent: 'emerald' },
          ]}
          note="Thẻ nạp sẽ được kích hoạt ngay sau khi xác nhận giao dịch."
          confirmLabel="Đồng ý nạp tiền"
          loading={loading}
          onConfirm={handleTopup}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
