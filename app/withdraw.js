// Màn hình Rút tiền
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { ArrowLeft, Wallet, AlertCircle, Check, CreditCard } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { calculateLimit, calculateFee, processWithdrawal } from '../services/mockApi';
import { MOCK_EMPLOYEES } from '../data/mockData';

export default function WithdrawScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuth();

    const [amount, setAmount] = useState('');
    const [limit, setLimit] = useState(0);
    const [fee, setFee] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            const freshEmployee = MOCK_EMPLOYEES[user.id];
            if (freshEmployee) {
                setLimit(calculateLimit(freshEmployee));
            }
        }
    }, [user]);

    useEffect(() => {
        const numAmount = parseInt(amount.replace(/\D/g, '')) || 0;
        setFee(numAmount > 0 ? calculateFee(numAmount) : 0);
        setError('');
    }, [amount]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN').format(value);
    };

    const handleAmountChange = (text) => {
        // Chỉ cho phép số
        const numericValue = text.replace(/\D/g, '');
        setAmount(numericValue);
    };

    const getDisplayAmount = () => {
        if (!amount) return '';
        return formatCurrency(parseInt(amount));
    };

    const numericAmount = parseInt(amount) || 0;
    const totalDeduction = numericAmount + fee;
    const netReceived = numericAmount - fee;
    const isOverLimit = totalDeduction > limit;
    const canWithdraw = numericAmount > 0 && !isOverLimit && user?.linkedBank;

    const handleWithdraw = async () => {
        if (!canWithdraw) return;

        setError('');
        setIsProcessing(true);

        try {
            const result = await processWithdrawal(user.id, numericAmount);

            if (result.success) {
                setSuccess(true);
                // Cập nhật user với hạn mức mới
                const updatedEmployee = MOCK_EMPLOYEES[user.id];
                await updateUser(updatedEmployee);

                // Hiển thị thông báo thành công
                setTimeout(() => {
                    Alert.alert(
                        'Rút tiền thành công! 🎉',
                        `Số tiền ${formatCurrency(numericAmount)}đ đã được chuyển về tài khoản của bạn.`,
                        [{ text: 'OK', onPress: () => router.back() }]
                    );
                }, 500);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setIsProcessing(false);
        }
    };

    const quickAmounts = [500000, 1000000, 2000000, 3000000];

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View className="flex-row items-center px-6 py-4 bg-white border-b border-slate-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <ArrowLeft color="#334155" size={24} />
                </TouchableOpacity>
                <Text className="font-heading text-lg text-slate-900 ml-3">Rút tiền</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>

                    {/* Available Limit */}
                    <View className="bg-primary rounded-xl p-4 mb-6">
                        <Text className="text-primary-100 text-sm mb-1">Hạn mức khả dụng</Text>
                        <Text className="text-white font-heading text-2xl">{formatCurrency(limit)} ₫</Text>
                    </View>

                    {/* Bank Account Check */}
                    {!user?.linkedBank && (
                        <TouchableOpacity
                            className="bg-amber-50 p-4 rounded-xl border border-amber-200 mb-6 flex-row items-center"
                            onPress={() => router.push('/link-bank')}
                        >
                            <CreditCard color="#F59E0B" size={24} />
                            <View className="ml-3 flex-1">
                                <Text className="text-amber-800 font-semibold">Chưa liên kết ngân hàng</Text>
                                <Text className="text-amber-600 text-sm">Nhấn để liên kết tài khoản nhận tiền</Text>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Amount Input */}
                    <View className="mb-4">
                        <Text className="font-medium text-slate-700 text-sm mb-2">Số tiền muốn rút</Text>
                        <View className={`flex-row items-center bg-white border rounded-xl px-4 ${isOverLimit ? 'border-red-400' : 'border-slate-200'}`}>
                            <TextInput
                                className="flex-1 py-4 text-2xl font-bold text-slate-900"
                                placeholder="0"
                                placeholderTextColor="#CBD5E1"
                                value={getDisplayAmount()}
                                onChangeText={handleAmountChange}
                                keyboardType="number-pad"
                            />
                            <Text className="text-slate-400 font-medium text-lg">VND</Text>
                        </View>
                        {isOverLimit && (
                            <View className="flex-row items-center mt-2">
                                <AlertCircle color="#EF4444" size={16} />
                                <Text className="text-red-500 text-sm ml-1">Số tiền + phí vượt quá hạn mức</Text>
                            </View>
                        )}
                    </View>

                    {/* Quick Amount Buttons */}
                    <View className="flex-row flex-wrap gap-2 mb-6">
                        {quickAmounts.map((quickAmount) => (
                            <TouchableOpacity
                                key={quickAmount}
                                className={`px-4 py-2 rounded-lg border ${parseInt(amount) === quickAmount
                                        ? 'bg-primary border-primary'
                                        : 'bg-white border-slate-200'
                                    }`}
                                onPress={() => setAmount(quickAmount.toString())}
                            >
                                <Text className={`font-medium ${parseInt(amount) === quickAmount ? 'text-white' : 'text-slate-700'
                                    }`}>
                                    {formatCurrency(quickAmount)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Fee Breakdown */}
                    {numericAmount > 0 && (
                        <View className="bg-white p-4 rounded-xl border border-slate-100 mb-6">
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-slate-500">Số tiền rút</Text>
                                <Text className="text-slate-800 font-medium">{formatCurrency(numericAmount)} ₫</Text>
                            </View>
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-slate-500">Phí giao dịch</Text>
                                <Text className="text-slate-800 font-medium">{formatCurrency(fee)} ₫</Text>
                            </View>
                            <View className="h-px bg-slate-200 mb-3" />
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-slate-500">Tổng trừ hạn mức</Text>
                                <Text className={`font-bold ${isOverLimit ? 'text-red-500' : 'text-slate-800'}`}>
                                    {formatCurrency(totalDeduction)} ₫
                                </Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-slate-500">Thực nhận</Text>
                                <Text className="text-emerald-600 font-bold text-lg">{formatCurrency(netReceived)} ₫</Text>
                            </View>
                        </View>
                    )}

                    {/* Fee Info */}
                    <View className="bg-slate-100 p-3 rounded-xl mb-6">
                        <Text className="text-slate-600 text-sm">
                            💡 Phí: Dưới 1 triệu <Text className="font-bold">10,000đ</Text>, từ 1 triệu <Text className="font-bold">20,000đ</Text>
                        </Text>
                    </View>

                    {/* Error Message */}
                    {error && (
                        <View className="flex-row items-center mb-4 bg-red-50 p-3 rounded-xl">
                            <AlertCircle color="#EF4444" size={18} />
                            <Text className="text-red-500 text-sm ml-2 font-medium flex-1">{error}</Text>
                        </View>
                    )}

                    {/* Withdraw Button */}
                    <TouchableOpacity
                        className={`py-4 rounded-xl items-center flex-row justify-center ${canWithdraw && !isProcessing ? 'bg-emerald-500' : 'bg-slate-300'
                            }`}
                        onPress={handleWithdraw}
                        disabled={!canWithdraw || isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color="white" />
                        ) : success ? (
                            <>
                                <Check color="white" size={24} />
                                <Text className="text-white font-bold text-lg ml-2">Thành công!</Text>
                            </>
                        ) : (
                            <>
                                <Wallet color="white" size={24} />
                                <Text className="text-white font-bold text-lg ml-2">Rút tiền ngay</Text>
                            </>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
