
import React from 'react';
import { AppSettings } from '../types';

interface SettingsTabProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ settings, setSettings }) => {
  const toggleDarkMode = () => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  const toggleAutoSave = () => setSettings(prev => ({ ...prev, autoSaveHistory: !prev.autoSaveHistory }));
  
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, confidenceThreshold: parseFloat(e.target.value) }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Customize your FarmLens experience.</p>
      </section>

      <div className="space-y-4">
        {/* Dark Mode */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 ios-shadow border border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-slate-500">dark_mode</span>
            </div>
            <div>
              <p className="font-bold">Dark Mode</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Global Theme</p>
            </div>
          </div>
          <button 
            onClick={toggleDarkMode}
            className={`w-14 h-8 rounded-full transition-all duration-300 relative ${settings.darkMode ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 ${settings.darkMode ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>

        {/* Confidence Threshold */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 ios-shadow border border-slate-100 dark:border-white/5 space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-slate-500">adjust</span>
            </div>
            <div>
              <p className="font-bold">Confidence Threshold</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">AI Prediction Filter</p>
            </div>
            <span className="ml-auto font-black text-primary font-mono">
              {(settings.confidenceThreshold * 100).toFixed(0)}%
            </span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="1.0" 
            step="0.05"
            value={settings.confidenceThreshold}
            onChange={handleThresholdChange}
            className="w-full h-1.5 bg-slate-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
            <span>Precision</span>
            <span>Certainty</span>
          </div>
        </div>

        {/* Auto Save */}
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 ios-shadow border border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-slate-500">save</span>
            </div>
            <div>
              <p className="font-bold">Auto-Save History</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Local Persistence</p>
            </div>
          </div>
          <button 
            onClick={toggleAutoSave}
            className={`w-14 h-8 rounded-full transition-all duration-300 relative ${settings.autoSaveHistory ? 'bg-primary' : 'bg-slate-200 dark:bg-white/10'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 ${settings.autoSaveHistory ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      <section className="pt-4 border-t border-slate-100 dark:border-white/5">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] mb-4">About</h3>
        <div className="bg-white dark:bg-white/5 rounded-2xl p-6 ios-shadow border border-slate-100 dark:border-white/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
             <span className="material-icons-round text-primary text-3xl">eco</span>
          </div>
          <h4 className="font-extrabold text-xl">FarmLens AI</h4>
          <p className="text-xs font-bold text-slate-400 mt-1">Version 1.4.2-stable</p>
          <div className="mt-6 p-3 bg-primary/5 rounded-xl">
             <p className="text-xs font-bold text-primary tracking-tight">"Built for sustainable farming 🌱"</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsTab;
