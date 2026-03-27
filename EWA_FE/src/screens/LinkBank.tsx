import { useState } from 'react';
import { ArrowLeft, Search, Landmark, CreditCard, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Screen } from '../types';
import { useApp } from '../AppContext';
import * as mockApi from '@/services/mockApi';
import { MOCK_BANKS } from '@/data/mockData';

type LinkStep = 'select-bank' | 'enter-account' | 'confirm';

export default function LinkBank({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const { employee, refreshEmployee } = useApp();
  const [step, setStep] = useState<LinkStep>('select-bank');
  const [selectedBank, setSelectedBank] = useState<{ code: string; name: string } | null>(null);
  const [accountNo, setAccountNo] = useState('');
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const popularBanks = MOCK_BANKS.map(b => ({
    id: b.code.toLowerCase(),
    code: b.code,
    name: b.name,
    shortName: b.code,
    color: b.code === 'VCB' ? 'bg-emerald-50 text-emerald-600' :
           b.code === 'TCB' ? 'bg-red-50 text-red-600' :
           b.code === 'MB'  ? 'bg-indigo-50 text-indigo-600' :
           b.code === 'ACB' ? 'bg-blue-50 text-blue-600' :
           'bg-cyan-50 text-cyan-600',
  }));

  const filteredBanks = searchQuery
    ? popularBanks.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.code.toLowerCase().includes(searchQuery.toLowerCase()))
    : popularBanks;

  const handleSelectBank = (bank: typeof popularBanks[0]) => {
    setSelectedBank({ code: bank.code, name: bank.name });
    setStep('enter-account');
    setError('');
    setAccountNo('');
    setAccountName('');
  };

  const handleLookup = async () => {
    if (!accountNo.trim()) {
      setError('Vui lòng nhập số tài khoản');
      return;
    }
    setLoading(true);
    setError('');

    const result = await mockApi.lookupBankAccount(selectedBank!.code, accountNo);
    setLoading(false);

    if (result.success) {
      setAccountName(result.accountName!);
      setStep('confirm');
    } else {
      setError(result.error || 'Không tìm thấy tài khoản');
    }
  };

  const handleLink = async () => {
    if (!employee) return;
    setLoading(true);
    setError('');

    const result = await mockApi.linkBankAccount(employee.id, {
      bankCode: selectedBank!.code,
      accountNo,
      accountName,
    });
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      refreshEmployee();
      setTimeout(() => onNavigate('dashboard'), 1500);
    } else {
      setError(result.error || 'Không thể liên kết tài khoản');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-surface text-on-surface min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-50/70 backdrop-blur-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between px-6 h-16 w-full max-w-xl mx-auto">
          <button 
            onClick={() => {
              if (step === 'enter-account') { setStep('select-bank'); setError(''); }
              else if (step === 'confirm') { setStep('enter-account'); setError(''); }
              else onNavigate('dashboard');
            }}
            className="active:scale-95 duration-200 text-primary w-10 h-10 flex items-center justify-start"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg tracking-tight text-primary flex-grow text-center">Liên kết ngân hàng</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-xl mx-auto space-y-8 w-full overflow-y-auto">
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Liên kết thành công!</h2>
            <p className="text-sm text-slate-500">{selectedBank?.name} • ****{accountNo.slice(-4)}</p>
          </div>
        ) : step === 'select-bank' ? (
          <>
            {/* Search Section */}
            <section className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm ngân hàng..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-surface-container-high border-none rounded-xl h-14 pl-12 pr-5 text-on-surface font-medium focus:ring-2 focus:ring-primary/30 transition-shadow" 
                />
              </div>
            </section>

            {/* Popular Banks */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-on-surface-variant/60 tracking-widest uppercase pl-2">Ngân hàng phổ biến</h2>
              <div className="grid grid-cols-2 gap-4">
                {filteredBanks.map(bank => (
                  <button 
                    key={bank.id} 
                    onClick={() => handleSelectBank(bank)}
                    className="bg-white p-4 rounded-xl flex flex-col items-center gap-3 shadow-sm border border-outline-variant/20 active:scale-95 transition-all hover:border-primary/30"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bank.color}`}>
                      <Landmark className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm text-on-surface">{bank.shortName}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{bank.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Other Methods */}
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-on-surface-variant/60 tracking-widest uppercase pl-2">Phương thức khác</h2>
              <button className="w-full bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm border border-outline-variant/20 active:scale-95 transition-all hover:border-primary/30 group">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left flex-grow">
                  <p className="font-bold text-sm text-on-surface">Thêm thẻ ATM/Tín dụng</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Hỗ trợ thẻ Visa, Mastercard, JCB</p>
                </div>
                <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary transition-colors" />
              </button>
            </section>
          </>
        ) : step === 'enter-account' ? (
          <>
            <section className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-xl flex items-center gap-3">
                <Landmark className="w-6 h-6 text-indigo-600" />
                <div>
                  <p className="font-bold text-sm text-indigo-700">{selectedBank?.name}</p>
                  <p className="text-xs text-indigo-500">Nhập số tài khoản ngân hàng</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 px-1">Số tài khoản</label>
              <input
                type="text"
                placeholder="Nhập số tài khoản"
                value={accountNo}
                onChange={(e) => { setAccountNo(e.target.value); setError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
                autoFocus
                className="w-full bg-white border-none rounded-xl py-4 px-5 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/30 shadow-sm tracking-wider"
              />

              {error && (
                <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button
                onClick={handleLookup}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                {loading ? 'Đang tra cứu...' : 'Tra cứu tài khoản'}
              </button>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
                <h3 className="font-bold text-lg text-slate-900">Xác nhận liên kết</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-dashed border-slate-100">
                    <span className="text-sm text-slate-500">Ngân hàng</span>
                    <span className="text-sm font-bold text-slate-900">{selectedBank?.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-dashed border-slate-100">
                    <span className="text-sm text-slate-500">Số tài khoản</span>
                    <span className="text-sm font-bold text-slate-900">{accountNo}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-slate-500">Chủ tài khoản</span>
                    <span className="text-sm font-bold text-emerald-600">{accountName}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm font-medium px-4 py-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button
                onClick={handleLink}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {loading ? 'Đang xử lý...' : 'Xác nhận liên kết'}
              </button>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
