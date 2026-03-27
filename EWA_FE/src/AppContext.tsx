import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Employee } from './types';
import * as mockApi from '@/services/mockApi';

interface AppContextType {
  employee: Employee | null;
  isLoggedIn: boolean;
  login: (employee: Employee) => void;
  logout: () => void;
  refreshEmployee: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);

  const login = useCallback((emp: Employee) => {
    setEmployee(emp);
  }, []);

  const logout = useCallback(() => {
    setEmployee(null);
    localStorage.removeItem('jwtToken');
  }, []);

  // Re-read employee from MOCK_EMPLOYEES to pick up mutations (advancedAmount, linkedBank)
  const refreshEmployee = useCallback(() => {
    if (employee) {
      const fresh = mockApi.getEmployee(employee.id);
      if (fresh) setEmployee({ ...fresh });
    }
  }, [employee]);

  return (
    <AppContext.Provider value={{
      employee,
      isLoggedIn: !!employee,
      login,
      logout,
      refreshEmployee,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
