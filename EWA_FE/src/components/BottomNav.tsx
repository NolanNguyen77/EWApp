import { Wallet, Tag, Clock, User } from 'lucide-react';
import { Screen } from '../types';

interface Props {
  current: Screen;
  onNavigate: (s: Screen) => void;
}

export default function BottomNav({ current, onNavigate }: Props) {
  const navItems = [
    { id: 'dashboard', icon: Wallet, label: 'EWA' },
    { id: 'offers', icon: Tag, label: 'Ưu đãi' },
    { id: 'history', icon: Clock, label: 'Lịch sử GD' },
    { id: 'profile', icon: User, label: 'Tôi' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-center z-50 pointer-events-none">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl border-t border-slate-100/50 pb-6 pt-3 px-6 flex justify-between items-center rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.04)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = current === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Screen)}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-2xl transition-all duration-300 ${
                isActive ? 'text-indigo-600 bg-indigo-50/80' : 'text-slate-400 hover:text-indigo-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
