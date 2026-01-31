// Màn hình Đăng nhập bằng Mã Nhân Viên
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { User, ArrowRight, AlertCircle } from 'lucide-react-native';
import { validateEmployee } from '../services/mockApi';

export default function LoginScreen() {
    const router = useRouter();
    const [employeeCode, setEmployeeCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (!employeeCode.trim()) {
            setError('Vui lòng nhập mã nhân viên');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const result = await validateEmployee(employeeCode);

            if (result.success) {
                // Chuyển sang màn OTP, truyền data employee
                router.push({
                    pathname: '/otp',
                    params: { employeeData: JSON.stringify(result.data) }
                });
            } else {
                setError(result.error);
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
                <View className="flex-1 px-6 pt-16">
                    {/* Header */}
                    <View className="mb-12">
                        <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mb-6">
                            <User color="#4F46E5" size={32} />
                        </View>
                        <Text className="font-heading text-3xl text-slate-900 mb-2">
                            Đăng nhập
                        </Text>
                        <Text className="font-body text-slate-500 text-base">
                            Nhập mã nhân viên để tiếp tục sử dụng dịch vụ ứng lương
                        </Text>
                    </View>

                    {/* Input */}
                    <View className="mb-6">
                        <Text className="font-medium text-slate-700 text-sm mb-2">
                            Mã nhân viên
                        </Text>
                        <View className={`flex-row items-center bg-white border rounded-xl px-4 py-4 ${error ? 'border-red-400' : 'border-slate-200'}`}>
                            <TextInput
                                className="flex-1 text-lg font-medium text-slate-900"
                                placeholder="VD: NV001"
                                placeholderTextColor="#94A3B8"
                                value={employeeCode}
                                onChangeText={(text) => {
                                    setEmployeeCode(text.toUpperCase());
                                    setError('');
                                }}
                                autoCapitalize="characters"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <View className="flex-row items-center mt-2">
                                <AlertCircle color="#EF4444" size={16} />
                                <Text className="text-red-500 text-sm ml-1 font-medium">{error}</Text>
                            </View>
                        ) : null}
                    </View>

                    {/* Demo hint */}
                    <View className="bg-primary-50 p-4 rounded-xl mb-8 border border-primary-100">
                        <Text className="text-primary-700 text-sm font-medium">
                            💡 Demo: Nhập <Text className="font-bold">NV001</Text> hoặc <Text className="font-bold">NV002</Text>
                        </Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className={`flex-row items-center justify-center py-4 rounded-xl ${isLoading ? 'bg-primary-400' : 'bg-primary'}`}
                        onPress={handleContinue}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text className="text-white font-bold text-lg mr-2">Tiếp tục</Text>
                                <ArrowRight color="white" size={20} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
