// Mock Data cho EWApp
// Dữ liệu giả lập nhân viên, ngân hàng, giao dịch, nhà mạng, và hóa đơn

export const MOCK_EMPLOYEES = {
    'NV001': {
        id: 'NV001',
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        grossSalary: 20000000, // 20 triệu
        workingDays: 15, // 15 ngày công thực tế
        advancedAmount: 2020000, // Đã ứng 2tr + 20k phí
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
    // ========== EDGE CASES ==========
    'NV003': {
        // CASE: Đã hết sạch hạn mức (không còn tiền để rút)
        id: 'NV003',
        name: 'Lê Văn C',
        phone: '0912345678',
        grossSalary: 10000000, // 10 triệu
        workingDays: 10, // 10 ngày công
        // Hạn mức max = (10tr/22)*10*50% = 2,272,727 -> làm tròn = 2,272,000
        advancedAmount: 2272000, // Đã ứng hết 100% hạn mức -> Còn lại = 0
        linkedBank: {
            bankCode: 'MB',
            accountNo: '5555666677',
            accountName: 'LE VAN C',
        },
    },
    'NV004': {
        // CASE: Lương rất thấp (hạn mức < mức rút tối thiểu)
        id: 'NV004',
        name: 'Phạm Thị D',
        phone: '0987654321',
        grossSalary: 5000000, // 5 triệu (lương thấp)
        workingDays: 5, // Chỉ làm 5 ngày
        // Hạn mức max = (5tr/22)*5*50% = 568,181 -> làm tròn = 568,000
        advancedAmount: 0, // Chưa ứng
        linkedBank: {
            bankCode: 'ACB',
            accountNo: '9999888877',
            accountName: 'PHAM THI D',
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
    'ACB-9999888877': 'PHAM THI D', // Edge case: User lương thấp
};

// ========== SPRINT 2: Nhà mạng & Nạp tiền ==========
export const MOCK_CARRIERS = {
    VIETTEL: {
        name: 'Viettel',
        prefixes: ['032', '033', '034', '035', '036', '037', '038', '039', '086', '096', '097', '098'],
        color: '#E6232A',
    },
    VINAPHONE: {
        name: 'Vinaphone',
        prefixes: ['081', '082', '083', '084', '085', '088', '091', '094'],
        color: '#005BAA',
    },
    MOBIFONE: {
        name: 'Mobifone',
        prefixes: ['070', '076', '077', '078', '079', '089', '090', '093'],
        color: '#1C75BC',
    },
};

export const TOPUP_DENOMINATIONS = [10000, 20000, 50000, 100000, 200000, 500000];

// ========== SPRINT 2: Hóa đơn (Điện / Nước) ==========
export const MOCK_BILLS = {
    'EVN-PE01234567': {
        customerName: 'Nguyễn Văn A',
        address: '123 Lê Lợi, Q.1, TP.HCM',
        amount: 350000,
        serviceType: 'ELECTRIC',
        provider: 'EVN HCM',
        period: '02/2026',
        status: 'UNPAID',
    },
    'EVN-PE09876543': {
        customerName: 'Trần Thị B',
        address: '456 Nguyễn Huệ, Q.3, TP.HCM',
        amount: 180000,
        serviceType: 'ELECTRIC',
        provider: 'EVN HCM',
        period: '02/2026',
        status: 'UNPAID',
    },
    'WATER-DN001234': {
        customerName: 'Nguyễn Văn A',
        address: '123 Lê Lợi, Q.1, TP.HCM',
        amount: 95000,
        serviceType: 'WATER',
        provider: 'Sawaco',
        period: '02/2026',
        status: 'UNPAID',
    },
    'WATER-DN005678': {
        customerName: 'Phạm Thị D',
        address: '789 CMT8, Q.10, TP.HCM',
        amount: 62000,
        serviceType: 'WATER',
        provider: 'Sawaco',
        period: '02/2026',
        status: 'UNPAID',
    },
    'EVN-PE00000001': {
        customerName: 'Lê Văn C',
        address: '100 Hai Bà Trưng, Q.1',
        amount: 0,
        serviceType: 'ELECTRIC',
        provider: 'EVN HCM',
        period: '02/2026',
        status: 'PAID',
    },
    'EVN-PE99999999': {
        customerName: 'Khách hàng Nợ Lớn',
        address: '999 Đường Vô Tận, Q.12',
        amount: 50000000, // 50 triệu - Vượt hạn mức chắc chắn
        serviceType: 'ELECTRIC',
        provider: 'EVN HCM',
        period: '02/2026',
        status: 'UNPAID',
    },
    'WATER-ZERO-001': {
        customerName: 'Khách hàng Nợ 0đ',
        address: '10 Đường Số 1, Q.7',
        amount: 0,
        serviceType: 'WATER',
        provider: 'Sawaco',
        period: '02/2026',
        status: 'UNPAID', // Chưa thanh toán nhưng nợ 0đ
    },
};

// ========== Lịch sử giao dịch (Sprint 2: thêm field type) ==========
export const MOCK_TRANSACTIONS = {
    'NV001': [
        {
            id: 'TXN001',
            type: 'WITHDRAWAL',
            amount: 1000000,
            fee: 10000,
            netAmount: 1000000,
            status: 'SUCCESS',
            createdAt: '2026-01-28T10:30:00',
            bankName: 'Vietcombank',
        },
        {
            id: 'TXN002',
            type: 'WITHDRAWAL',
            amount: 1000000,
            fee: 10000,
            netAmount: 1000000,
            status: 'SUCCESS',
            createdAt: '2026-01-25T14:15:00',
            bankName: 'Vietcombank',
        },
        {
            id: 'TXN003',
            type: 'TOPUP',
            amount: 50000,
            fee: 0,
            netAmount: 50000,
            status: 'SUCCESS',
            createdAt: '2026-02-01T09:00:00',
            phoneNumber: '0901234567',
            carrier: 'Mobifone',
        },
        {
            id: 'TXN004',
            type: 'BILL_PAYMENT',
            amount: 350000,
            fee: 0,
            netAmount: 350000,
            status: 'SUCCESS',
            createdAt: '2026-02-03T11:20:00',
            serviceType: 'ELECTRIC',
            provider: 'EVN HCM',
            customerId: 'PE01234567',
        },
    ],
    'NV002': [],
    'NV003': [
        {
            id: 'TXN_EDGE_001',
            type: 'WITHDRAWAL',
            amount: 2262000,
            fee: 10000,
            netAmount: 2262000,
            status: 'SUCCESS',
            createdAt: '2026-02-14T10:00:00',
            bankName: 'MB Bank',
        }
    ],
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
