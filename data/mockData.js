// Mock Data cho Sprint 1 EWApp
// Dữ liệu giả lập nhân viên, ngân hàng, và giao dịch

export const MOCK_EMPLOYEES = {
    'NV001': {
        id: 'NV001',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        grossSalary: 20000000, // 20 triệu
        workingDays: 15, // 15 ngày công thực tế
        advancedAmount: 2000000, // Đã ứng trước 2 triệu
        linkedBank: null, // Chưa liên kết ngân hàng
    },
    'NV002': {
        id: 'NV002',
        name: 'Trần Thị B',
        phone: '0909876543',
        grossSalary: 15000000,
        workingDays: 20,
        advancedAmount: 0,
        linkedBank: {
            bankCode: 'VCB',
            accountNo: '1234567890',
            accountName: 'TRAN THI B',
        },
    },
};

export const MOCK_BANKS = [
    { code: 'VCB', name: 'Vietcombank', logo: '🏦' },
    { code: 'TCB', name: 'Techcombank', logo: '🏛️' },
    { code: 'MB', name: 'MB Bank', logo: '🏢' },
    { code: 'ACB', name: 'ACB', logo: '🏣' },
    { code: 'VPB', name: 'VPBank', logo: '🏤' },
];

// Mock danh sách tài khoản ngân hàng (để tra cứu tên chủ thẻ)
export const MOCK_BANK_ACCOUNTS = {
    'VCB-1234567890': 'TRAN THI B',
    'VCB-0987654321': 'NGUYEN VAN A',
    'TCB-1111222233': 'NGUYEN VAN A',
    'MB-5555666677': 'LE VAN C',
};

export const MOCK_TRANSACTIONS = {
    'NV001': [
        {
            id: 'TXN001',
            amount: 1000000,
            fee: 10000,
            netAmount: 990000,
            status: 'SUCCESS',
            createdAt: '2026-01-28T10:30:00',
            bankName: 'Vietcombank',
        },
        {
            id: 'TXN002',
            amount: 1000000,
            fee: 10000,
            netAmount: 990000,
            status: 'SUCCESS',
            createdAt: '2026-01-25T14:15:00',
            bankName: 'Vietcombank',
        },
    ],
    'NV002': [],
};

// Hằng số nghiệp vụ
export const BUSINESS_CONSTANTS = {
    STANDARD_WORKING_DAYS: 22, // Số ngày công chuẩn
    ADVANCE_PERCENTAGE: 0.5, // Tỷ lệ được ứng trước (50%)
    FEE_THRESHOLD: 1000000, // Ngưỡng tính phí
    FEE_LOW: 10000, // Phí < 1 triệu
    FEE_HIGH: 20000, // Phí >= 1 triệu
    DEV_OTP: '123456', // OTP cố định cho môi trường Dev
};
