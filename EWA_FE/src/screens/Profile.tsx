import { User, ChevronRight, Shield, CreditCard, Bell, HelpCircle, FileText, Star, LogOut, Landmark, BadgeCheck, Smartphone } from 'lucide-react';
import { Screen } from '../types';
import { useApp } from '../AppContext';

const MENU_SECTIONS = [
  {
    title: 'Tài khoản',
    items: [
      { icon: CreditCard, label: 'Thông tin tài khoản', desc: 'Hạn mức, lương, ngày công', color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { icon: Landmark, label: 'Ngân hàng liên kết', desc: 'Quản lý tài khoản ngân hàng', color: 'text-emerald-600', bg: 'bg-emerald-50', screen: 'link-bank' as Screen },
      { icon: Smartphone, label: 'Thiết bị đăng nhập', desc: 'Quản lý phiên đăng nhập', color: 'text-blue-600', bg: 'bg-blue-50' },
    ],
  },
  {
    title: 'Cài đặt',
    items: [
      { icon: Bell, label: 'Thông báo', desc: 'Tùy chỉnh thông báo', color: 'text-amber-600', bg: 'bg-amber-50' },
      { icon: Shield, label: 'Bảo mật', desc: 'Mật khẩu, xác thực 2 bước', color: 'text-purple-600', bg: 'bg-purple-50' },
    ],
  },
  {
    title: 'Khác',
    items: [
      { icon: FileText, label: 'Điều khoản sử dụng', desc: 'Chính sách & điều khoản', color: 'text-slate-600', bg: 'bg-slate-100' },
      { icon: HelpCircle, label: 'Trung tâm hỗ trợ', desc: 'FAQ & liên hệ hỗ trợ', color: 'text-teal-600', bg: 'bg-teal-50' },
      { icon: Star, label: 'Đánh giá ứng dụng', desc: 'Chia sẻ trải nghiệm', color: 'text-amber-500', bg: 'bg-amber-50' },
    ],
  },
];

export default function Profile({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { employee, logout } = useApp();
  if (!employee) return null;

  const initials = employee.name
    .split(' ')
    .map(w => w[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tài khoản</h1>
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </header>

      <div className="px-6 space-y-6 mt-2">
        {/* Profile Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200/50">
              <span className="text-white text-lg font-black">{initials}</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">{employee.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Mã NV: <span className="font-bold text-indigo-600">{employee.id}</span></p>
              <p className="text-xs text-slate-400 mt-0.5">{employee.phone}</p>
            </div>
            <div className="bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-600">Đã KYC</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100">
            <div className="text-center">
              <p className="text-lg font-black text-indigo-600">{employee.workingDays}</p>
              <p className="text-[10px] text-slate-400 font-medium">Ngày công</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <p className="text-lg font-black text-emerald-600">{employee.linkedBank ? '1' : '0'}</p>
              <p className="text-[10px] text-slate-400 font-medium">TK liên kết</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-black text-amber-600">Standard</p>
              <p className="text-[10px] text-slate-400 font-medium">Hạng thành viên</p>
            </div>
          </div>
        </section>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <section key={section.title} className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2">{section.title}</h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.screen && onNavigate(item.screen)}
                    className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-all text-left ${i < section.items.length - 1 ? 'border-b border-slate-50' : ''}`}
                  >
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900">{item.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {/* Logout Button */}
        <section>
          <button
            onClick={() => { logout(); onNavigate('login'); }}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] border border-red-100"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </section>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-[10px] text-slate-300 font-medium">EWA v1.0.0 • Secured by Lumina</p>
        </div>
      </div>
    </div>
  );
}
