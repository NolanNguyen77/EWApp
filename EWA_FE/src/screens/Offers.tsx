import { Gift, Percent, Clock, ChevronRight, Star, Sparkles, Tag, Zap, Crown } from 'lucide-react';
import { Screen } from '../types';
import { useApp } from '../AppContext';

const OFFERS = [
  {
    id: 1,
    tag: 'HOT',
    tagColor: 'bg-red-500',
    title: 'Giảm 50% phí rút tiền',
    description: 'Áp dụng cho lần rút tiền đầu tiên trong tháng',
    validUntil: '31/03/2026',
    icon: Percent,
    gradient: 'from-rose-500 to-orange-500',
    bgLight: 'bg-rose-50',
  },
  {
    id: 2,
    tag: 'MỚI',
    tagColor: 'bg-emerald-500',
    title: 'Nạp ĐT tặng 10%',
    description: 'Nạp từ 100.000đ, nhận thêm 10% giá trị thẻ',
    validUntil: '15/04/2026',
    icon: Gift,
    gradient: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
  },
  {
    id: 3,
    tag: 'ĐỘC QUYỀN',
    tagColor: 'bg-indigo-500',
    title: 'Miễn phí thanh toán hóa đơn',
    description: 'Thanh toán điện, nước miễn phí dịch vụ trong tháng 4',
    validUntil: '30/04/2026',
    icon: Zap,
    gradient: 'from-indigo-500 to-purple-500',
    bgLight: 'bg-indigo-50',
  },
  {
    id: 4,
    tag: 'VIP',
    tagColor: 'bg-amber-500',
    title: 'Nâng hạn mức lên 80%',
    description: 'Dành cho nhân viên có thâm niên trên 1 năm',
    validUntil: '01/05/2026',
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
  },
];

export default function Offers({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { employee } = useApp();

  return (
    <div className="flex-1 overflow-y-auto pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Khám phá</p>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ưu đãi</h1>
          </div>
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
        </div>
      </header>

      <div className="px-6 space-y-6 mt-2">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-7 shadow-xl shadow-indigo-200/50">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-4 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">Ưu đãi đặc biệt</span>
            </div>
            <h2 className="text-white text-xl font-black leading-tight mb-2">Chào {employee?.name.split(' ').pop()},<br/>nhận ngay ưu đãi hôm nay!</h2>
            <p className="text-white/70 text-xs mb-5">Tận hưởng các ưu đãi độc quyền dành riêng cho bạn</p>
            <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all">
              Xem tất cả →
            </button>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Gift className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-lg font-black text-slate-900">{OFFERS.length}</p>
            <p className="text-[10px] text-slate-500 font-medium">Ưu đãi</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Tag className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-lg font-black text-slate-900">2</p>
            <p className="text-[10px] text-slate-500 font-medium">Đã dùng</p>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-lg font-black text-slate-900">5</p>
            <p className="text-[10px] text-slate-500 font-medium">Ngày còn lại</p>
          </div>
        </section>

        {/* Offers List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Dành cho bạn</h3>
            <button className="text-xs font-bold text-indigo-600">Xem tất cả</button>
          </div>

          {OFFERS.map((offer) => {
            const Icon = offer.icon;
            return (
              <div key={offer.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer">
                <div className="flex items-stretch">
                  {/* Left accent */}
                  <div className={`w-1.5 bg-gradient-to-b ${offer.gradient}`}></div>
                  
                  <div className="flex-1 p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 ${offer.bgLight} rounded-2xl flex items-center justify-center shrink-0`}>
                      <Icon className={`w-6 h-6 bg-gradient-to-br ${offer.gradient} bg-clip-text`} style={{ color: `var(--tw-gradient-from)` }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${offer.tagColor} text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider`}>{offer.tag}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">{offer.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{offer.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">HSD: {offer.validUntil}</p>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-center">
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-2">Giới thiệu bạn bè</p>
          <h3 className="text-white text-lg font-black mb-2">Nhận 50.000đ cho mỗi lời mời</h3>
          <p className="text-white/50 text-xs mb-4">Chia sẻ mã giới thiệu và nhận thưởng ngay</p>
          <button className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider active:scale-95 transition-all">
            Mời ngay
          </button>
        </section>
      </div>
    </div>
  );
}
