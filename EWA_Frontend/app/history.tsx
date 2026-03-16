// Màn hình Lịch sử Giao dịch (Sprint 2: phân loại theo type)
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { ArrowLeft, DollarSign, Calendar, Filter, Wallet, Smartphone, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTransactionHistory } from '../services/api';

// Helper: Lấy metadata theo loại giao dịch
const getTransactionMeta = (type: string) => {
    switch (type) {
        case 'TOPUP':
            return {
                label: 'Nạp tiền ĐT',
                sublabel: 'Mobile Top-up',
                iconBg: 'bg-orange-100',
                iconColor: '#F97316',
                accentColor: 'text-orange-600',
                badgeBg: 'bg-orange-100',
                badgeText: 'text-orange-700',
                Icon: Smartphone,
            };
        case 'BILL_PAYMENT':
            return {
                label: 'Thanh toán HĐ',
                sublabel: 'Bill Payment',
                iconBg: 'bg-violet-100',
                iconColor: '#7C3AED',
                accentColor: 'text-violet-600',
                badgeBg: 'bg-violet-100',
                badgeText: 'text-violet-700',
                Icon: FileText,
            };
        case 'WITHDRAWAL':
        default:
            return {
                label: 'Rút lương',
                sublabel: 'Bank Transfer',
                iconBg: 'bg-emerald-100',
                iconColor: '#10B981',
                accentColor: 'text-emerald-600',
                badgeBg: 'bg-emerald-100',
                badgeText: 'text-emerald-700',
                Icon: Wallet,
            };
    }
};

export default function HistoryScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<string | null>(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        if (!user) return;

        setIsLoading(true);
        const result = await getTransactionHistory(user.id);
        if (result.success) {
            setTransactions(result.data);
        }
        setIsLoading(false);
    };

    const filteredTransactions = filterType
        ? transactions.filter((t) => t.type === filterType)
        : transactions;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'SUCCESS': return 'bg-emerald-100 text-emerald-700';
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'FAILED': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'SUCCESS': return 'Thành công';
            case 'PENDING': return 'Đang xử lý';
            case 'FAILED': return 'Thất bại';
            default: return status;
        }
    };

    // Thông tin phụ theo loại giao dịch
    const getExtraInfo = (item: any) => {
        switch (item.type) {
            case 'TOPUP':
                return `${item.carrier || ''} • ${item.phoneNumber || ''}`;
            case 'BILL_PAYMENT':
                return `${item.provider || ''} • MKH: ${item.customerId || ''}`;
            case 'WITHDRAWAL':
                return item.bankName || '';
            default:
                return '';
        }
    };

    const renderTransaction = ({ item }) => {
        const meta = getTransactionMeta(item.type);
        const TxnIcon = meta.Icon;
        const extraInfo = getExtraInfo(item);

        return (
            <View className="bg-white p-4 rounded-xl border border-slate-100 mb-3">
                <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-row items-center gap-3">
                        <View className={`${meta.iconBg} p-2 rounded-full`}>
                            <TxnIcon color={meta.iconColor} size={20} />
                        </View>
                        <View>
                            <Text className="text-slate-800 font-semibold">{meta.label}</Text>
                            {extraInfo ? (
                                <Text className="text-slate-400 text-xs">{extraInfo}</Text>
                            ) : (
                                <Text className="text-slate-400 text-xs">{item.id}</Text>
                            )}
                        </View>
                    </View>
                    <View className={`px-2 py-1 rounded-full ${getStatusColor(item.status).split(' ')[0]}`}>
                        <Text className={`text-xs font-medium ${getStatusColor(item.status).split(' ')[1]}`}>
                            {getStatusText(item.status)}
                        </Text>
                    </View>
                </View>

                <View className="bg-slate-50 p-3 rounded-lg">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-500 text-sm">Số tiền</Text>
                        <Text className="text-slate-800 font-semibold">{formatCurrency(item.amount)}</Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-slate-500 text-sm">Phí giao dịch</Text>
                        <Text className={item.fee === 0 ? 'text-emerald-600 font-semibold' : 'text-slate-600'}>
                            {item.fee === 0 ? 'Miễn phí' : formatCurrency(item.fee)}
                        </Text>
                    </View>
                    {item.type === 'WITHDRAWAL' && (
                        <>
                            <View className="h-px bg-slate-200 my-2" />
                            <View className="flex-row justify-between">
                                <Text className="text-slate-500 text-sm">Thực nhận</Text>
                                <Text className="text-emerald-600 font-bold">{formatCurrency(item.netAmount)}</Text>
                            </View>
                        </>
                    )}
                </View>

                <View className="flex-row items-center mt-3">
                    <Calendar color="#94A3B8" size={14} />
                    <Text className="text-slate-400 text-xs ml-1">{formatDate(item.createdAt)}</Text>
                </View>
            </View>
        );
    };

    // Filter buttons
    const filterOptions = [
        { key: null, label: 'Tất cả' },
        { key: 'WITHDRAWAL', label: 'Rút tiền', color: '#10B981' },
        { key: 'TOPUP', label: 'Nạp ĐT', color: '#F97316' },
        { key: 'BILL_PAYMENT', label: 'Hóa đơn', color: '#7C3AED' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
                <View className="flex-row items-center gap-3">
                    <TouchableOpacity onPress={() => router.back()}>
                        <ArrowLeft color="#334155" size={24} />
                    </TouchableOpacity>
                    <Text className="font-heading text-lg text-slate-900">Lịch sử giao dịch</Text>
                </View>
            </View>

            {/* Filter Tabs */}
            <View className="flex-row px-6 py-3 gap-2 bg-white border-b border-slate-100">
                {filterOptions.map((opt) => (
                    <TouchableOpacity
                        key={opt.key || 'all'}
                        className={`px-4 py-2 rounded-full border ${
                            filterType === opt.key
                                ? 'bg-slate-800 border-slate-800'
                                : 'bg-white border-slate-200'
                        }`}
                        onPress={() => setFilterType(opt.key)}
                    >
                        <Text className={`text-sm font-medium ${
                            filterType === opt.key ? 'text-white' : 'text-slate-600'
                        }`}>
                            {opt.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#4F46E5" />
                </View>
            ) : filteredTransactions.length === 0 ? (
                <View className="flex-1 items-center justify-center px-6">
                    <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-4">
                        <DollarSign color="#CBD5E1" size={40} />
                    </View>
                    <Text className="text-slate-800 font-semibold text-lg mb-2">Chưa có giao dịch</Text>
                    <Text className="text-slate-500 text-center">
                        {filterType
                            ? 'Không có giao dịch nào thuộc loại này'
                            : 'Các giao dịch của bạn sẽ xuất hiện ở đây'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredTransactions}
                    renderItem={renderTransaction}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 24 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}
