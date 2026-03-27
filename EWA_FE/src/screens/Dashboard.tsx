import { useEffect, useState } from 'react';
import { Bell, BadgeCheck, Landmark, CheckCircle2, Wallet, Tag, Receipt, AlertCircle, LogOut } from 'lucide-react';
import { Screen } from '../types';
import { useApp } from '../AppContext';
import * as mockApi from '@/services/mockApi';

export default function Dashboard({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { employee, refreshEmployee, logout } = useApp();
  const [limit, setLimit] = useState(0);

  useEffect(() => {
    refreshEmployee();
  }, []);

  useEffect(() => {
    if (employee) {
      setLimit(mockApi.calculateLimit(employee));
    }
  }, [employee]);

  if (!employee) return null;

  const dailyRate = employee.grossSalary / 22;
  const earnedSalary = Math.floor(dailyRate * employee.workingDays);
  const workProgress = Math.round((employee.workingDays / 22) * 100);
  const hasLinkedBank = !!employee.linkedBank;

  const formatMoney = (n: number) => n.toLocaleString('vi-VN');

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 sticky top-0 bg-slate-50/80 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://i.pravatar.cc/150?img=68" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Xin chào, {employee.name.split(' ').pop()}</p>
            <h1 className="text-indigo-700 font-black text-2xl tracking-tight leading-none">EWA</h1>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors">
            <Bell className="w-6 h-6 text-indigo-600" />
          </button>
          <button onClick={() => { logout(); onNavigate('login'); }} className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 transition-colors" title="Đăng xuất">
            <LogOut className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </header>

      <div className="px-6 space-y-6 mt-2">
        {/* Hero Card */}
        <section className="relative">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-[0_20px_40px_rgba(79,70,229,0.05)] border border-white">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-slate-500 font-medium text-sm mb-1">Hạn mức khả dụng</p>
                <h2 className="text-4xl font-black text-indigo-700 tracking-tighter">
                  {formatMoney(limit)}<span className="text-xl font-bold ml-1">đ</span>
                </h2>
              </div>
              <div className="bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1">
                <BadgeCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-tight">Standard</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1 font-medium">Lương tạm tính</p>
                <p className="text-lg font-bold text-slate-900">{formatMoney(earnedSalary)}đ</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1 font-medium">Ngày công</p>
                <p className="text-lg font-bold text-slate-900">{employee.workingDays}/22 <span className="text-sm font-medium text-slate-500">ngày</span></p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold text-indigo-600 uppercase">Tiến độ tháng này</span>
                <span className="text-[11px] font-bold text-indigo-600">{workProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${workProgress}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Bank Status */}
        <section 
          onClick={() => onNavigate('link-bank')}
          className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer active:scale-[0.98] transition-all hover:border-primary/30"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasLinkedBank ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {hasLinkedBank ? <Landmark className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Tài khoản liên kết</p>
              {hasLinkedBank ? (
                <p className="text-sm font-bold text-slate-900">
                  {employee.linkedBank!.bankCode} ****{employee.linkedBank!.accountNo.slice(-4)} • {employee.linkedBank!.accountName}
                </p>
              ) : (
                <p className="text-sm font-bold text-amber-600">Chưa liên kết ngân hàng</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasLinkedBank && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            <span className="text-xs font-bold text-primary">{hasLinkedBank ? 'Thay đổi' : 'Liên kết'}</span>
          </div>
        </section>

        {/* Bento Actions */}
        <section className="grid grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate('withdraw')}
            className="col-span-2 row-span-2 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-3xl p-6 flex flex-col justify-between shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all text-left min-h-[160px]"
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">Rút tiền</h3>
              <p className="text-white/80 text-xs mt-1">Về tài khoản ngay</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('topup')}
            className="col-span-2 bg-white rounded-3xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all shadow-sm border border-slate-100"
          >
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-500" />
            </div>
            <span className="font-bold text-sm text-slate-900">Nạp ĐT</span>
          </button>

          <button 
            onClick={() => onNavigate('bill')}
            className="col-span-2 bg-white rounded-3xl p-5 flex items-center gap-4 active:scale-[0.98] transition-all shadow-sm border border-slate-100"
          >
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-600" />
            </div>
            <span className="font-bold text-sm text-slate-900">Hóa đơn</span>
          </button>
        </section>

        {/* Promo Banner */}
        <section className="rounded-3xl overflow-hidden relative h-40 group shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-blue-900 flex flex-col justify-center px-8">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1 relative z-10">Dành cho bạn</p>
            <h3 className="text-white text-xl font-black max-w-[200px] leading-tight relative z-10">Nhận ngay bảo hiểm sức khỏe</h3>
            <button className="mt-4 w-fit bg-white text-indigo-700 px-4 py-2 rounded-full text-xs font-black uppercase relative z-10">Khám phá</button>
          </div>
        </section>
      </div>
    </div>
  );
}
