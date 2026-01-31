// AuthContext - Quản lý trạng thái đăng nhập
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load session từ AsyncStorage khi app khởi động
    useEffect(() => {
        loadSession();
    }, []);

    const loadSession = async () => {
        try {
            const savedUser = await AsyncStorage.getItem('currentUser');
            if (savedUser) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error('Load session error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData) => {
        try {
            await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error('Save session error:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('currentUser');
            setUser(null);
        } catch (error) {
            console.error('Clear session error:', error);
        }
    };

    const updateUser = async (updates) => {
        const updatedUser = { ...user, ...updates };
        await login(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
