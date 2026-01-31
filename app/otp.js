// Màn hình Xác thực OTP
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react-native';
import { verifyOtp } from '../services/mockApi';
import { useAuth } from '../context/AuthContext';

export default function OtpScreen() {
    const router = useRouter();
    const { employeeData } = useLocalSearchParams();
    const { login } = useAuth();

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRefs = useRef([]);

    const employee = employeeData ? JSON.parse(employeeData) : null;

    const handleOtpChange = (value, index) => {
        if (!/^\d*$/.test(value)) return; // Chỉ cho phép số

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Tự động chuyển sang ô tiếp theo
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Tự động submit khi nhập đủ 6 số
        if (newOtp.every(digit => digit) && index === 5) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (otpCode) => {
        setIsLoading(true);
        setError('');

        try {
            const result = await verifyOtp(otpCode);

            if (result.success) {
                // Lưu session và chuyển về Home
                await login(employee);
                router.replace('/');
            } else {
                setError(result.error);
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (err) {
            setError('Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <StatusBar barStyle="dark-content" />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Back Button */}
                <TouchableOpacity
                    className="flex-row items-center px-6 py-4"
                    onPress={() => router.back()}
                >
                    <ArrowLeft color="#334155" size={24} />
                    <Text className="text-slate-700 font-medium ml-2">Quay lại</Text>
                </TouchableOpacity>

                <View className="flex-1 px-6 pt-8">
                    {/* Header */}
                    <View className="mb-12">
                        <View className="w-16 h-16 bg-success-50 rounded-2xl items-center justify-center mb-6">
                            <ShieldCheck color="#10B981" size={32} />
                        </View>
                        <Text className="font-heading text-3xl text-slate-900 mb-2">
                            Xác thực OTP
                        </Text>
                        <Text className="font-body text-slate-500 text-base">
                            Nhập mã OTP 6 số đã được gửi đến số điện thoại{' '}
                            <Text className="font-semibold text-slate-700">
                                {employee?.phone?.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')}
                            </Text>
                        </Text>
                    </View>

                    {/* OTP Input Boxes */}
                    <View className="flex-row justify-between mb-6">
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                className={`w-12 h-14 bg-white border-2 rounded-xl text-center text-2xl font-bold text-slate-900 ${error ? 'border-red-400' : digit ? 'border-primary' : 'border-slate-200'
                                    }`}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Error Message */}
                    {error ? (
                        <View className="flex-row items-center mb-4">
                            <AlertCircle color="#EF4444" size={16} />
                            <Text className="text-red-500 text-sm ml-1 font-medium">{error}</Text>
                        </View>
                    ) : null}

                    {/* Demo hint */}
                    <View className="bg-success-50 p-4 rounded-xl mb-8 border border-success-100">
                        <Text className="text-emerald-700 text-sm font-medium">
                            💡 Demo: Mã OTP là <Text className="font-bold">123456</Text>
                        </Text>
                    </View>

                    {/* Loading indicator */}
                    {isLoading && (
                        <View className="items-center py-4">
                            <ActivityIndicator size="large" color="#4F46E5" />
                            <Text className="text-slate-500 mt-2">Đang xác thực...</Text>
                        </View>
                    )}

                    {/* Resend OTP */}
                    <TouchableOpacity className="items-center py-4">
                        <Text className="text-primary font-medium">
                            Không nhận được mã? <Text className="font-bold">Gửi lại</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
