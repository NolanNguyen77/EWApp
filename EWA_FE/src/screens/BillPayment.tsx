import { useState, useMemo } from 'react';
import { ArrowLeft, Zap, Droplet, Search, ShieldCheck, AlertCircle, Loader2, Receipt } from 'lucide-react';
import { Screen, BillData } from '../types';
import { useApp } from '../AppContext';
import * as mockApi from '@/services/mockApi';
import ConfirmSheet from '../components/ConfirmSheet';
import SuccessScreen from '../components/SuccessScreen';

type ServiceType = 'ELECTRIC' | 'WATER';

export default function BillPayment({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { employee, refreshEmployee } = useApp();
  const [serviceType, setServiceType] = useState<ServiceType>('ELECTRIC');
  const [customerId, setCustomerId] = useState('');
  const [billData, setBillData] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  const limit = useMemo(() => employee ? mockApi.calculateLimit(employee) : 0, [employee]);
  const formatMoney = (n: number) => n.toLocaleString('vi-VN');

  const handleLookup = async () => {
    if (!customerId.trim()) { setError('Vui lòng nhập mã khách hàng'); return; }
    setLoading(true);
    setError('');
    setBillData(null);
    const result = await mockApi.lookupBill(serviceType, customerId);
    setLoading(false);
    if (result.success) {
      setBillData(result.data as BillData);
    } else {
      setError(result.error || 'Không tìm thấy hóa đơn');
    }
  };

  const handleShowConfirm = () => {
    if (!billData) return;
    if (billData.amount > limit) { setError(`Số tiền (${formatMoney(billData.amount)}đ) vượt hạn mức (${formatMoney(limit)}đ)`); return; }
    setShowConfirm(true);
  };

  const handlePay = async () => {
    if (!employee || !billData) return;
    setPaying(true);
    setError('');
    const result = await mockApi.payBill(employee.id, billData.billKey);
    setPaying(false);
    if (result.success) {
      setShowConfirm(false);
      setSuccess(true);
      setResultData(result.data);
      refreshEmployee();
    } else {
      setShowConfirm(false);
      setError(result.error || 'Thanh toán thất bại');
    }
  };

  if (!employee) return null;

  const serviceName = serviceType === 'ELECTRIC' ? 'Điện (EVN)' : 'Nước';

  if (success) {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}, ${now.getDate().toString().padStart(2,'0')} Th${(now.getMonth()+1).toString().padStart(2,'0')} ${now.getFullYear()}`;
    const txId = `EWA${Date.now().toString().slice(-9)}`;
    return (
      <div className="flex-1 flex flex-col">
        <SuccessScreen
          title="Giao dịch thành công!"
          subtitle={`Hóa đơn ${serviceName} đã được thanh toán`}
          amountLabel="Số tiền thanh toán"
          amount={`${formatMoney(billData?.amount || 0)} đ`}
          breakdown={[
            { label: 'Phí dịch vụ', value: 'Miễn phí' },
          ]}
          meta={[
            { label: 'Mã giao dịch', value: txId },
            { label: 'Thời gian', value: timeStr },
            { label: 'Dịch vụ', value: serviceName },
            { label: 'Khách hàng', value: billData?.customerName || '' },
          ]}
          primaryAction={{ label: 'Về Trang chủ', onClick: () => onNavigate('dashboard') }}
          secondaryAction={{ label: 'Xem chi tiết giao dịch', onClick: () => { setSuccess(false); setBillData(null); setCustomerId(''); setResultData(null); } }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] text-on-surface font-body min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-xl mx-auto">
          <button onClick={() => onNavigate('dashboard')} className="active:scale-95 duration-200 text-blue-600 w-10 h-10 flex items-center justify-start"><ArrowLeft className="w-6 h-6" /></button>
          <h1 className="font-bold text-lg tracking-tight text-primary flex-grow text-center">Thanh toán hóa đơn</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-xl mx-auto space-y-8 w-full overflow-y-auto">
        {/* Service Selector */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-on-surface-variant/60 tracking-widest uppercase pl-2">Dịch vụ</h2>
          <div className="grid grid-cols-2 gap-4">
            <div onClick={() => { setServiceType('ELECTRIC'); setBillData(null); setError(''); setCustomerId(''); }}
              className={`relative group cursor-pointer active:scale-95 duration-200 ${serviceType === 'ELECTRIC' ? '' : 'opacity-70'}`}>
              {serviceType === 'ELECTRIC' && <div className="absolute inset-0 bg-primary/10 blur-xl rounded-xl"></div>}
              <div className={`relative p-6 rounded-xl flex flex-col gap-3 shadow-sm ${serviceType === 'ELECTRIC' ? 'bg-surface-container-lowest' : 'bg-surface-container-low/50 hover:bg-surface-container-low'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${serviceType === 'ELECTRIC' ? 'bg-primary text-white shadow-[0_8px_16px_rgba(67,56,218,0.2)]' : 'bg-white text-blue-400'}`}>
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <p className={`text-[11px] font-bold tracking-wide ${serviceType === 'ELECTRIC' ? 'text-primary' : 'text-on-surface-variant/40'}`}>{serviceType === 'ELECTRIC' ? 'ĐANG CHỌN' : 'CHƯA CHỌN'}</p>
                  <p className={`font-bold ${serviceType === 'ELECTRIC' ? 'text-on-surface' : 'text-on-surface-variant/80'}`}>Điện (EVN)</p>
                </div>
              </div>
            </div>

            <div onClick={() => { setServiceType('WATER'); setBillData(null); setError(''); setCustomerId(''); }}
              className={`relative group cursor-pointer active:scale-95 duration-200 ${serviceType === 'WATER' ? '' : 'opacity-70'}`}>
              {serviceType === 'WATER' && <div className="absolute inset-0 bg-primary/10 blur-xl rounded-xl"></div>}
              <div className={`relative p-6 rounded-xl flex flex-col gap-3 shadow-sm ${serviceType === 'WATER' ? 'bg-surface-container-lowest' : 'bg-surface-container-low/50 hover:bg-surface-container-low'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${serviceType === 'WATER' ? 'bg-primary text-white shadow-[0_8px_16px_rgba(67,56,218,0.2)]' : 'bg-white text-blue-400'}`}>
                  <Droplet className="w-6 h-6" />
                </div>
                <div>
                  <p className={`text-[11px] font-bold tracking-wide ${serviceType === 'WATER' ? 'text-primary' : 'text-on-surface-variant/40'}`}>{serviceType === 'WATER' ? 'ĐANG CHỌN' : 'CHƯA CHỌN'}</p>
                  <p className={`font-bold ${serviceType === 'WATER' ? 'text-on-surface' : 'text-on-surface-variant/80'}`}>Nước</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="space-y-4">
          <label className="block text-[13px] font-medium text-on-surface-variant mb-2 ml-4">Mã Khách Hàng</label>
          <div className="flex gap-2">
            <input type="text" value={customerId} onChange={(e) => { setCustomerId(e.target.value); setError(''); }} onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              placeholder={serviceType === 'ELECTRIC' ? 'VD: PE01234567' : 'VD: DN001234'}
              className="flex-grow bg-surface-container-high border-none rounded-xl h-14 px-5 text-on-surface font-medium focus:ring-2 focus:ring-primary/30 transition-shadow" />
            <button onClick={handleLookup} disabled={loading}
              className="bg-primary text-white w-14 h-14 rounded-xl flex items-center justify-center shadow-[0_8px_20px_rgba(67,56,218,0.15)] active:scale-90 duration-200 disabled:opacity-50">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
            </button>
          </div>
        </section>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />{error}
          </div>
        )}

        {/* Bill Details Card */}
        {billData && (
          <section className="pt-2">
            <div className="bg-white/70 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-8 shadow-[0_20px_40px_rgba(67,56,218,0.06)] relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-xs font-bold text-primary tracking-widest uppercase mb-1">Chi tiết hóa đơn</p>
                  <h3 className="text-xl font-bold text-on-surface">Thông tin thanh toán</h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-[11px] font-bold border ${billData.status === 'PAID' ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  {billData.status === 'PAID' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-end border-b border-dashed border-outline-variant/30 pb-4">
                  <div className="space-y-1"><p className="text-xs text-on-surface-variant">Tên khách hàng</p><p className="font-bold text-on-surface">{billData.customerName}</p></div>
                  <div className="text-right space-y-1"><p className="text-xs text-on-surface-variant">Kỳ thanh toán</p><p className="font-medium text-on-surface">{billData.period}</p></div>
                </div>
                <div className="space-y-1"><p className="text-xs text-on-surface-variant">Địa chỉ</p><p className="font-medium text-on-surface leading-relaxed">{billData.address}</p></div>
                <div className="pt-4 mt-2">
                  <p className="text-xs text-on-surface-variant mb-1">Số tiền cần trả</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary tracking-tight">{formatMoney(billData.amount)}</span>
                    <span className="text-xl font-bold text-primary">đ</span>
                  </div>
                  {billData.amount > limit && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Vượt hạn mức ({formatMoney(limit)}đ)</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        {billData && billData.status === 'UNPAID' && (
          <section className="pt-4 space-y-6">
            <button onClick={handleShowConfirm} disabled={billData.amount > limit || billData.amount === 0}
              className="w-full h-16 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(67,56,218,0.25)] active:scale-[0.98] transition-all disabled:opacity-50">
              Thanh toán ngay
            </button>
            <div className="flex items-center justify-center gap-2 text-on-surface-variant/60 pb-8">
              <ShieldCheck className="w-5 h-5 fill-current" />
              <p className="text-[11px] font-medium tracking-wide">Giao dịch được bảo mật bởi chuẩn PCI DSS</p>
            </div>
          </section>
        )}
      </main>

      {/* Confirmation Sheet */}
      {showConfirm && billData && (
        <ConfirmSheet
          title="Xác nhận thanh toán"
          icon={<Receipt className="w-6 h-6 text-indigo-600" />}
          details={[
            { label: 'Dịch vụ', value: serviceName },
            { label: 'Khách hàng', value: billData.customerName },
            { label: 'Kỳ thanh toán', value: billData.period },
            { label: 'Số tiền', value: `${formatMoney(billData.amount)}đ`, highlight: true },
            { label: 'Phí', value: 'Miễn phí', accent: 'emerald' },
          ]}
          note="Hóa đơn sẽ được cập nhật trạng thái thanh toán ngay sau khi xác nhận."
          confirmLabel="Đồng ý thanh toán"
          loading={paying}
          onConfirm={handlePay}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
