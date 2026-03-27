import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Screen } from './types';
import { AppProvider, useApp } from './AppContext';
import BottomNav from './components/BottomNav';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Withdraw from './screens/Withdraw';
import TopUp from './screens/TopUp';
import History from './screens/History';
import BillPayment from './screens/BillPayment';
import LinkBank from './screens/LinkBank';
import Offers from './screens/Offers';
import Profile from './screens/Profile';

function AppContent() {
  const { isLoggedIn } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  // Force login screen if not logged in
  const activeScreen = isLoggedIn ? currentScreen : 'login';

  // Screens that show the bottom navigation
  const showBottomNav = ['dashboard', 'history', 'offers', 'profile'].includes(activeScreen);

  const handleLogin = () => {
    setCurrentScreen('dashboard');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'login': return <Login onLogin={handleLogin} />;
      case 'dashboard': return <Dashboard onNavigate={setCurrentScreen} />;
      case 'withdraw': return <Withdraw onNavigate={setCurrentScreen} />;
      case 'topup': return <TopUp onNavigate={setCurrentScreen} />;
      case 'history': return <History onNavigate={setCurrentScreen} />;
      case 'bill': return <BillPayment onNavigate={setCurrentScreen} />;
      case 'link-bank': return <LinkBank onNavigate={setCurrentScreen} />;
      case 'offers': return <Offers onNavigate={setCurrentScreen} />;
      case 'profile': return <Profile onNavigate={setCurrentScreen} />;
      default: return <Dashboard onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 font-sans text-slate-900 selection:bg-indigo-100 flex justify-center">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
        
        {showBottomNav && (
          <BottomNav current={activeScreen} onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
