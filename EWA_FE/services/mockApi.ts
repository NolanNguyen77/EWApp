// Mock API Services cho EWApp
// Giả lập các API call với delay để mô phỏng network

import {
    MOCK_EMPLOYEES,
    MOCK_BANK_ACCOUNTS,
    MOCK_TRANSACTIONS,
    MOCK_CARRIERS,
    MOCK_BILLS,
    BUSINESS_CONSTANTS
} from '../data/mockData';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Lấy thông tin nhân viên trực tiếp (sync, không delay)
 */
export const getEmployee = (employeeId: string) => {
    return MOCK_EMPLOYEES[employeeId] || null;
};

/**
 * Validate mã nhân viên
 * @param {string} employeeCode - Mã nhân viên (vd: NV001)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const validateEmployee = async (employeeCode) => {
    await delay(500); // Giả lập network

    const employee = MOCK_EMPLOYEES[employeeCode.toUpperCase()];

    if (employee) {
        return { success: true, data: employee };
    }

    return { success: false, error: 'Mã nhân viên không tồn tại' };
};

/**
 * Xác thực OTP
 * @param {string} otp - Mã OTP 6 số
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyOtp = async (otp) => {
    await delay(300);

    if (otp === BUSINESS_CONSTANTS.DEV_OTP) {
        return { success: true };
    }

    return { success: false, error: 'Mã OTP không đúng' };
};

/**
 * Tính hạn mức khả dụng
 * Công thức: (Gross / 22) * Ngày công * 50% - Đã ứng
 * @param {object} employee - Thông tin nhân viên
 * @returns {number} Hạn mức (làm tròn xuống nghìn đồng)
 */
export const calculateLimit = (employee) => {
    const { grossSalary, workingDays } = employee;
    const { STANDARD_WORKING_DAYS, ADVANCE_PERCENTAGE } = BUSINESS_CONSTANTS;

    // Tự động trừ tổng của tất cả các loại giao dịch (Rút Bank + Nạp ĐT + Hóa đơn)
    const transactions = MOCK_TRANSACTIONS[employee.id] || [];
    const totalUsed = transactions.reduce((sum, txn) => {
        if (txn.status === 'SUCCESS' || txn.status === 'PENDING') {
            return sum + txn.amount + (txn.fee || 0);
        }
        return sum;
    }, 0);

    const dailyRate = grossSalary / STANDARD_WORKING_DAYS;
    const earnedAmount = dailyRate * workingDays * ADVANCE_PERCENTAGE;
    
    // Lấy số lớn hơn giữa tổng giao dịch thực tế và mock stat cứng (nhằm hỗ trợ tốt file mockData)
    const actualUsed = Math.max(totalUsed, employee.advancedAmount || 0);
    const availableLimit = earnedAmount - actualUsed;

    // Làm tròn xuống đơn vị nghìn đồng
    return Math.floor(availableLimit / 1000) * 1000;
};

/**
 * Tra cứu tên chủ tài khoản ngân hàng
 * @param {string} bankCode - Mã ngân hàng (VCB, TCB...)
 * @param {string} accountNo - Số tài khoản
 * @returns {Promise<{success: boolean, accountName?: string, error?: string}>}
 */
export const lookupBankAccount = async (bankCode, accountNo) => {
    await delay(800); // Giả lập gọi API ngân hàng

    const key = `${bankCode}-${accountNo}`;
    const accountName = MOCK_BANK_ACCOUNTS[key];

    if (accountName) {
        return { success: true, accountName };
    }

    return { success: false, error: 'Không tìm thấy tài khoản' };
};

/**
 * Tính phí rút tiền
 * @param {number} amount - Số tiền rút
 * @returns {number} Phí
 */
export const calculateFee = (amount) => {
    const { FEE_THRESHOLD, FEE_LOW, FEE_HIGH } = BUSINESS_CONSTANTS;
    return amount < FEE_THRESHOLD ? FEE_LOW : FEE_HIGH;
};

/**
 * Thực hiện rút tiền
 * @param {string} employeeId - Mã nhân viên
 * @param {number} amount - Số tiền rút
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const processWithdrawal = async (employeeId, amount) => {
    await delay(1000); // Giả lập xử lý thanh toán

    const employee = MOCK_EMPLOYEES[employeeId];
    if (!employee) {
        return { success: false, error: 'Nhân viên không tồn tại' };
    }

    const limit = calculateLimit(employee);
    const fee = calculateFee(amount);
    const totalDeduction = amount + fee;

    if (totalDeduction > limit) {
        return {
            success: false,
            error: `Số tiền rút + phí (${totalDeduction.toLocaleString()}đ) vượt quá hạn mức (${limit.toLocaleString()}đ)`
        };
    }

    // Cập nhật mock data (trong thực tế sẽ gọi API backend)
    employee.advancedAmount += totalDeduction;

    // Tạo transaction mới (Sprint 2: thêm type)
    const newTransaction = {
        id: `TXN${Date.now()}`,
        type: 'WITHDRAWAL',
        amount,
        fee,
        netAmount: amount, // Thực nhận = Số tiền nhập (phí trừ vào hạn mức, không trừ vào tiền nhận)
        status: 'SUCCESS',
        createdAt: new Date().toISOString(),
        bankName: employee.linkedBank?.bankCode || 'N/A',
    };

    // Thêm vào lịch sử
    if (!MOCK_TRANSACTIONS[employeeId]) {
        MOCK_TRANSACTIONS[employeeId] = [];
    }
    MOCK_TRANSACTIONS[employeeId].unshift(newTransaction);

    return {
        success: true,
        data: {
            transaction: newTransaction,
            newLimit: calculateLimit(employee),
        },
    };
};

/**
 * Lấy lịch sử giao dịch
 * @param {string} employeeId - Mã nhân viên
 * @returns {Promise<{success: boolean, data: array}>}
 */
export const getTransactionHistory = async (employeeId) => {
    await delay(300);

    const transactions = MOCK_TRANSACTIONS[employeeId] || [];
    return { success: true, data: transactions };
};

/**
 * Liên kết tài khoản ngân hàng
 * @param {string} employeeId - Mã nhân viên
 * @param {object} bankInfo - Thông tin ngân hàng {bankCode, accountNo, accountName}
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const linkBankAccount = async (employeeId, bankInfo) => {
    await delay(500);

    const employee = MOCK_EMPLOYEES[employeeId];
    if (!employee) {
        return { success: false, error: 'Nhân viên không tồn tại' };
    }

    // Validate tên chủ thẻ khớp với tên nhân viên
    // So sánh nguyên từ (whole word), không phải substring
    const employeeNameNormalized = employee.name.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const accountNameNormalized = bankInfo.accountName.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const employeeFirstName = employeeNameNormalized.split(' ').pop(); // tên riêng (từ cuối)
    const accountNameWords = accountNameNormalized.split(' ');         // tách từng từ

    if (!accountNameWords.includes(employeeFirstName)) {
        return {
            success: false,
            error: 'Tên chủ tài khoản không khớp với tên nhân viên'
        };
    }

    // Lưu liên kết
    employee.linkedBank = bankInfo;

    return { success: true };
};

// ========== SPRINT 2: Nạp tiền điện thoại ==========

/**
 * Nhận diện nhà mạng từ số điện thoại
 * @param {string} phoneNumber - Số điện thoại (10 số)
 * @returns {{ carrierKey: string, carrier: object } | null}
 */
export const detectCarrier = (phoneNumber) => {
    // Chuẩn hóa: bỏ khoảng trắng, dấu gạch
    const cleaned = phoneNumber.replace(/[\s\-\.]/g, '');

    // Lấy 3 số đầu (bỏ +84 hoặc 84 nếu có)
    let prefix = cleaned;
    if (prefix.startsWith('+84')) {
        prefix = '0' + prefix.slice(3);
    } else if (prefix.startsWith('84') && prefix.length > 10) {
        prefix = '0' + prefix.slice(2);
    }
    prefix = prefix.substring(0, 3);

    for (const [key, carrier] of Object.entries(MOCK_CARRIERS)) {
        if (carrier.prefixes.includes(prefix)) {
            return { carrierKey: key, carrier };
        }
    }

    return null;
};

/**
 * Nạp tiền điện thoại
 * @param {string} employeeId - Mã nhân viên
 * @param {string} phoneNumber - Số điện thoại
 * @param {number} denomination - Mệnh giá nạp
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const processTopup = async (employeeId, phoneNumber, denomination) => {
    await delay(1000); // Giả lập gọi API Payoo/VNPAY

    const employee = MOCK_EMPLOYEES[employeeId];
    if (!employee) {
        return { success: false, error: 'Nhân viên không tồn tại' };
    }

    const limit = calculateLimit(employee);

    // Phí nạp tiền = 0đ (miễn phí)
    if (denomination > limit) {
        return {
            success: false,
            error: `Mệnh giá nạp (${denomination.toLocaleString()}đ) vượt quá hạn mức khả dụng (${limit.toLocaleString()}đ)`
        };
    }

    // Nhận diện nhà mạng
    const carrierInfo = detectCarrier(phoneNumber);

    // Trừ hạn mức
    employee.advancedAmount += denomination;

    // Tạo transaction mới
    const newTransaction = {
        id: `TXN${Date.now()}`,
        type: 'TOPUP',
        amount: denomination,
        fee: 0,
        netAmount: denomination,
        status: 'SUCCESS',
        createdAt: new Date().toISOString(),
        phoneNumber: phoneNumber,
        carrier: carrierInfo ? carrierInfo.carrier.name : 'Không xác định',
    };

    // Thêm vào lịch sử
    if (!MOCK_TRANSACTIONS[employeeId]) {
        MOCK_TRANSACTIONS[employeeId] = [];
    }
    MOCK_TRANSACTIONS[employeeId].unshift(newTransaction);

    return {
        success: true,
        data: {
            transaction: newTransaction,
            newLimit: calculateLimit(employee),
        },
    };
};

// ========== SPRINT 2: Thanh toán hóa đơn ==========

/**
 * Tra cứu hóa đơn theo loại dịch vụ và mã khách hàng
 * @param {string} serviceType - 'ELECTRIC' | 'WATER'
 * @param {string} customerId - Mã khách hàng (VD: PE01234567)
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const lookupBill = async (serviceType, customerId) => {
    await delay(800); // Giả lập gọi API EVN/Sawaco

    // Xây dựng key tra cứu
    const prefix = serviceType === 'ELECTRIC' ? 'EVN' : 'WATER';
    const key = `${prefix}-${customerId}`;

    const bill = MOCK_BILLS[key];

    if (!bill) {
        return { success: false, error: 'Không tìm thấy hóa đơn với mã khách hàng này' };
    }

    if (bill.status === 'PAID') {
        return { success: false, error: 'Hóa đơn này đã được thanh toán trước đó' };
    }

    return {
        success: true,
        data: {
            billKey: key,
            ...bill,
        },
    };
};

/**
 * Thanh toán hóa đơn
 * @param {string} employeeId - Mã nhân viên
 * @param {string} billKey - Key của hóa đơn trong MOCK_BILLS
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const payBill = async (employeeId, billKey) => {
    await delay(1000); // Giả lập xử lý thanh toán

    const employee = MOCK_EMPLOYEES[employeeId];
    if (!employee) {
        return { success: false, error: 'Nhân viên không tồn tại' };
    }

    const bill = MOCK_BILLS[billKey];
    if (!bill) {
        return { success: false, error: 'Hóa đơn không tồn tại' };
    }

    if (bill.status === 'PAID') {
        return { success: false, error: 'Hóa đơn này đã được thanh toán' };
    }

    const limit = calculateLimit(employee);

    // Phí thanh toán hóa đơn = 0đ (miễn phí)
    if (bill.amount > limit) {
        return {
            success: false,
            error: `Số tiền hóa đơn (${bill.amount.toLocaleString()}đ) vượt quá hạn mức khả dụng (${limit.toLocaleString()}đ)`
        };
    }

    // Trừ hạn mức
    employee.advancedAmount += bill.amount;

    // Đánh dấu hóa đơn đã thanh toán
    bill.status = 'PAID';

    // Tạo transaction mới
    const newTransaction = {
        id: `TXN${Date.now()}`,
        type: 'BILL_PAYMENT',
        amount: bill.amount,
        fee: 0,
        netAmount: bill.amount,
        status: 'SUCCESS',
        createdAt: new Date().toISOString(),
        serviceType: bill.serviceType,
        provider: bill.provider,
        customerId: billKey.split('-').slice(1).join('-'),
    };

    // Thêm vào lịch sử
    if (!MOCK_TRANSACTIONS[employeeId]) {
        MOCK_TRANSACTIONS[employeeId] = [];
    }
    MOCK_TRANSACTIONS[employeeId].unshift(newTransaction);

    return {
        success: true,
        data: {
            transaction: newTransaction,
            newLimit: calculateLimit(employee),
            bill: { ...bill },
        },
    };
};
