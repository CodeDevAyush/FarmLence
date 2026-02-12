
import React, { useState, useEffect, useCallback } from 'react';
import { Tab, ScanResult, AppSettings } from './types';
import HomeTab from './components/HomeTab';
import HistoryTab from './components/HistoryTab';
import NetworkTab from './components/NetworkTab';
import SettingsTab from './components/SettingsTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('farmLensSettings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      confidenceThreshold: 0.6,
      autoSaveHistory: true
    };
  });

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('farmLensHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Sync settings to localStorage and Apply Dark Mode
  useEffect(() => {
    localStorage.setItem('farmLensSettings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const addScanToHistory = useCallback((scan: ScanResult) => {
    if (!settings.autoSaveHistory) return;
    
    setHistory(prev => {
      const newHistory = [scan, ...prev];
      localStorage.setItem('farmLensHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [settings.autoSaveHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('farmLensHistory');
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <HomeTab addScanToHistory={addScanToHistory} threshold={settings.confidenceThreshold} />;
      case Tab.HISTORY:
        return <HistoryTab history={history} clearHistory={clearHistory} />;
      case Tab.NETWORK:
        return <NetworkTab />;
      case Tab.SETTINGS:
        return <SettingsTab settings={settings} setSettings={setSettings} />;
      default:
        return <HomeTab addScanToHistory={addScanToHistory} threshold={settings.confidenceThreshold} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-background-light dark:bg-background-dark relative">
      {/* Shared Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 glass-header border-b border-slate-200 dark:border-white/10 px-6 py-4 flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="material-icons-round text-primary text-2xl">eco</span>
          <h1 className="text-xl font-extrabold tracking-tight">FarmLens AI</h1>
        </div>
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400 mt-0.5">
          Sustainable Farming Assistant
        </p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pt-6 pb-28">
        {renderTab()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-background-dark/90 glass-header border-t border-slate-200 dark:border-white/10 px-6 pt-3 pb-8 z-50">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <TabButton 
            active={activeTab === Tab.HOME} 
            icon="home" 
            label="Home" 
            onClick={() => setActiveTab(Tab.HOME)} 
          />
          <TabButton 
            active={activeTab === Tab.HISTORY} 
            icon="history" 
            label="History" 
            onClick={() => setActiveTab(Tab.HISTORY)} 
          />
          <TabButton 
            active={activeTab === Tab.NETWORK} 
            icon="hub" 
            label="Network" 
            onClick={() => setActiveTab(Tab.NETWORK)} 
          />
          <TabButton 
            active={activeTab === Tab.SETTINGS} 
            icon="settings" 
            label="Settings" 
            onClick={() => setActiveTab(Tab.SETTINGS)} 
          />
        </div>
      </nav>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ active, icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}
  >
    <span className={`material-icons-round ${active ? 'scale-110' : 'scale-100'}`}>{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </button>
);

export default App;
