import { useState, useEffect, useMemo } from 'react';
import { Wallet, Smartphone, Receipt, Gift } from 'lucide-react';
import TopBar from '../components/TopBar';
import { Screen, Transaction } from '../types';
import { useApp } from '../AppContext';
import * as mockApi from '@/services/mockApi';

type FilterType = 'ALL' | 'WITHDRAWAL' | 'TOPUP' | 'BILL_PAYMENT';

const FILTER_TABS: { key: FilterType; label: string }[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'WITHDRAWAL', label: 'Rút tiền' },
  { key: 'TOPUP', label: 'Nạp ĐT' },
  { key: 'BILL_PAYMENT', label: 'Hóa đơn' },
];

const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'WITHDRAWAL': return { Icon: Wallet, bg: 'bg-emerald-50', color: 'text-emerald-600' };
    case 'TOPUP': return { Icon: Smartphone, bg: 'bg-orange-50', color: 'text-orange-500' };
    case 'BILL_PAYMENT': return { Icon: Receipt, bg: 'bg-purple-50', color: 'text-purple-600' };
    default: return { Icon: Wallet, bg: 'bg-slate-50', color: 'text-slate-500' };
  }
};

const getTransactionLabel = (txn: Transaction) => {
  switch (txn.type) {
    case 'WITHDRAWAL': return `Rút tiền • ${txn.bankName || ''}`;
    case 'TOPUP': return `Nạp ĐT • ${txn.phoneNumber || ''}`;
    case 'BILL_PAYMENT': return `${txn.serviceType === 'ELECTRIC' ? 'Tiền điện' : 'Tiền nước'} • ${txn.provider || ''}`;
    default: return 'Giao dịch';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'SUCCESS': return { bg: 'bg-emerald-50', color: 'text-emerald-600', label: 'SUCCESS' };
    case 'PENDING': return { bg: 'bg-amber-50', color: 'text-amber-600', label: 'PENDING' };
    case 'FAILED': return { bg: 'bg-red-50', color: 'text-red-600', label: 'FAILED' };
    default: return { bg: 'bg-slate-50', color: 'text-slate-500', label: status };
  }
};

const formatTime = (isoStr: string) => {
  const d = new Date(isoStr);
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const formatDate = (isoStr: string) => {
  const d = new Date(isoStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  
  if (d.toDateString() === today.toDateString()) return 'Hôm nay';
  if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua';
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

const groupByDate = (txns: Transaction[]) => {
  const groups: { [key: string]: { label: string; transactions: Transaction[] } } = {};
  txns.forEach(txn => {
    const dateKey = new Date(txn.createdAt).toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = { label: formatDate(txn.createdAt), transactions: [] };
    }
    groups[dateKey].transactions.push(txn);
  });
  return Object.values(groups);
};

export default function History({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { employee } = useApp();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (employee) {
      setLoading(true);
      mockApi.getTransactionHistory(employee.id).then(res => {
        setTransactions(res.data as Transaction[]);
        setLoading(false);
      });
    }
  }, [employee]);

  const filteredTxns = useMemo(() => {
    if (filter === 'ALL') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  const grouped = useMemo(() => groupByDate(filteredTxns), [filteredTxns]);

  const formatMoney = (n: number) => n.toLocaleString('vi-VN');

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <TopBar title="Lịch sử giao dịch" onBack={() => onNavigate('dashboard')} />
      
      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32">
        {/* Tabs */}
        <nav className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all ${
                filter === tab.key
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 active:scale-95'
                  : 'bg-white border border-slate-200 text-slate-600 font-medium hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
        ) : filteredTxns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400">
            <Receipt className="w-16 h-16 opacity-30" />
            <p className="font-medium text-sm">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map((group, gi) => (
              <section key={gi}>
                <h2 className="text-slate-500 font-bold text-xs tracking-widest uppercase mb-4 ml-1">{group.label}</h2>
                <div className="space-y-3">
                  {group.transactions.map(txn => {
                    const icon = getTransactionIcon(txn.type);
                    const status = getStatusBadge(txn.status);
                    const Icon = icon.Icon;
                    return (
                      <div key={txn.id} className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${icon.bg} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${icon.color}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{getTransactionLabel(txn)}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-slate-500 text-[10px] font-medium">{formatTime(txn.createdAt)}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className={`px-2 py-0.5 rounded-md ${status.bg} ${status.color} text-[9px] font-bold tracking-wider`}>{status.label}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-bold text-slate-900">- {formatMoney(txn.amount)}đ</span>
                          {txn.fee > 0 && <p className="text-[10px] text-slate-400 mt-0.5">Phí: {formatMoney(txn.fee)}đ</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Promo */}
            <section className="mt-8">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                    <Gift className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold leading-tight mb-2">Thanh toán hóa đơn nhận hoàn tiền 5%</h3>
                    <p className="text-white/80 text-xs font-medium leading-relaxed">Ưu đãi dành riêng cho người dùng EWA tháng này.</p>
                  </div>
                  <button onClick={() => onNavigate('bill')} className="mt-2 px-6 py-3 bg-white text-indigo-700 font-bold text-sm rounded-xl hover:shadow-xl transition-all active:scale-95">
                    Thanh toán ngay
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -left-10 top-0 w-32 h-32 bg-purple-400/30 rounded-full blur-2xl"></div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
