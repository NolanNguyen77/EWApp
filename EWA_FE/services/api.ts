import * as mockApi from './mockApi';

// Base URL cho Spring Boot backend (hiện chưa dùng - tất cả delegate sang mockApi)
const BASE_URL = 'http://localhost:8080/api';

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

// ========== AUTH ==========
export const validateEmployee = async (employeeCode: string) => {
    // Khi BE sẵn sàng, chuyển sang gọi fetch() thay vì mockApi
    return mockApi.validateEmployee(employeeCode);
};

export const verifyOtp = async (otp: string) => {
    return mockApi.verifyOtp(otp);
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem('jwtToken');
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem('jwtToken', token);
};

export const clearAuthToken = (): void => {
    localStorage.removeItem('jwtToken');
};

// ========== SPRINT 1: Core ==========
export const getTransactionHistory = async (employeeId: string) => {
    return mockApi.getTransactionHistory(employeeId);
};

export const linkBankAccount = async (employeeId: string, bankInfo: any) => {
    return mockApi.linkBankAccount(employeeId, bankInfo);
};

export const lookupBankAccount = async (bankCode: string, accountNo: string) => {
    return mockApi.lookupBankAccount(bankCode, accountNo);
};

export const processWithdrawal = async (employeeId: string, amount: number) => {
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

export const processTopup = async (employeeId: string, phoneNumber: string, denomination: number) => {
    return mockApi.processTopup(employeeId, phoneNumber, denomination);
};

// ========== SPRINT 2: Thanh toán hóa đơn ==========
export const lookupBill = async (serviceType: string, customerId: string) => {
    return mockApi.lookupBill(serviceType, customerId);
};

export const payBill = async (employeeId: string, billKey: string) => {
    return mockApi.payBill(employeeId, billKey);
};
