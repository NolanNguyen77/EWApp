import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as mockApi from './mockApi';

// For Android emulator, use 10.0.2.2 instead of localhost
// For iOS simulator, localhost works
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';

export interface Employee {
    id: string;
    name: string;
    phone: string;
    grossSalary: number;
    workingDays: number;
    advancedAmount: number;
    linkedBank: {
        bankCode: string;
        accountNo: string;
        accountName: string;
    } | null;
}

export interface AuthResponse {
    token: string;
    employee: Employee;
}

export const validateEmployee = async (employeeCode: string): Promise<{ success: boolean; data?: Employee; error?: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeCode }),
        });
        if (!response.ok) {
            const errData = await response.json();
            return { success: false, error: errData.message || 'Mã nhân viên không tồn tại' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (e: any) {
        console.error('API Error:', e);
        return { success: false, error: 'Lỗi mạng, vui lòng thử lại sau.' };
    }
};

export const verifyOtp = async (employeeCode: string, otp: string): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
    try {
        const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeCode, otp }),
        });

        if (!response.ok) {
            const errData = await response.json();
            return { success: false, error: errData.message || 'OTP không hợp lệ' };
        }

        const data = await response.json();
        return { success: true, data };
    } catch (e: any) {
        return { success: false, error: 'Lỗi mạng, vui lòng thử lại sau.' };
    }
};

export const getAuthToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem('jwtToken');
};

export const setAuthToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem('jwtToken', token);
};

export const clearAuthToken = async (): Promise<void> => {
    await AsyncStorage.removeItem('jwtToken');
};

// Delegate sang mockApi để có đầy đủ logic nghiệp vụ (KYC, trừ hạn mức, lịch sử)
export const getTransactionHistory = async (employeeId: string): Promise<{ success: boolean; data: any[] }> => {
    return mockApi.getTransactionHistory(employeeId);
};

export const linkBankAccount = async (employeeId: string, bankInfo: any): Promise<{ success: boolean; error?: string }> => {
    return mockApi.linkBankAccount(employeeId, bankInfo);
};

export const lookupBankAccount = async (bankCode: string, accountNo: string): Promise<{ success: boolean; accountName?: string; error?: string }> => {
    return mockApi.lookupBankAccount(bankCode, accountNo);
};

export const processWithdrawal = async (employeeId: string, amount: number): Promise<{ success: boolean; data?: any; error?: string }> => {
    return mockApi.processWithdrawal(employeeId, amount);
};

export const calculateLimit = (employee: Employee): number => {
    return mockApi.calculateLimit(employee);
};

export const calculateFee = (amount: number): number => {
    const FEE_THRESHOLD = 1000000;
    const FEE_LOW = 10000;
    const FEE_HIGH = 20000;
    return amount < FEE_THRESHOLD ? FEE_LOW : FEE_HIGH;
};

// ========== SPRINT 2: Nạp tiền điện thoại ==========
export const detectCarrier = (phoneNumber: string) => {
    return mockApi.detectCarrier(phoneNumber);
};

export const processTopup = async (employeeId: string, phoneNumber: string, denomination: number): Promise<{ success: boolean; data?: any; error?: string }> => {
    return mockApi.processTopup(employeeId, phoneNumber, denomination);
};

// ========== SPRINT 2: Thanh toán hóa đơn ==========
export const lookupBill = async (serviceType: string, customerId: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    return mockApi.lookupBill(serviceType, customerId);
};

export const payBill = async (employeeId: string, billKey: string): Promise<{ success: boolean; data?: any; error?: string }> => {
    return mockApi.payBill(employeeId, billKey);
};
