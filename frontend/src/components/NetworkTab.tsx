
import React, { useState, useEffect } from 'react';
import { NetworkStatus } from '../types';

const NetworkTab: React.FC = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: false,
    modelReady: false,
    latency: null,
    lastChecked: Date.now()
  });
  const [isPinging, setIsPinging] = useState(false);

  const checkStatus = async () => {
    setIsPinging(true);
    const start = Date.now();
    try {
      // Pinging the root endpoint as requested
      const response = await fetch('http://127.0.0.1:8000/', { method: 'GET' });
      const latency = Date.now() - start;
      if (response.ok) {
        setStatus({
          isConnected: true,
          modelReady: true,
          latency,
          lastChecked: Date.now()
        });
      } else {
        throw new Error();
      }
    } catch (e) {
      setStatus({
        isConnected: false,
        modelReady: false,
        latency: null,
        lastChecked: Date.now()
      });
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section>
        <h2 className="text-2xl font-bold">System Status</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Live monitoring of AI backend services.</p>
      </section>

      <div className="grid grid-cols-1 gap-4">
        <StatusCard 
          icon="dns" 
          label="Backend Server" 
          status={status.isConnected ? 'Online' : 'Offline'} 
          isActive={status.isConnected} 
        />
        <StatusCard 
          icon="psychology" 
          label="AI Model Engine" 
          status={status.modelReady ? 'Ready' : 'Not Loaded'} 
          isActive={status.modelReady} 
        />
        <StatusCard 
          icon="speed" 
          label="Response Latency" 
          status={status.latency ? `${status.latency} ms` : 'N/A'} 
          isActive={status.isConnected} 
        />
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 ios-shadow border border-slate-100 dark:border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center">
              <span className="material-icons-round text-slate-400">update</span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-widest">Auto-Refresh</p>
              <p className="text-sm font-bold">Every 5 seconds</p>
            </div>
          </div>
          <div className={`w-3 h-3 rounded-full ${isPinging ? 'bg-primary animate-pulse' : 'bg-slate-200'}`}></div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase">Last Successful Ping</span>
            <span className="font-mono text-slate-600 dark:text-slate-400">
              {new Date(status.lastChecked).toLocaleTimeString()}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full">
            <div className={`h-full bg-primary rounded-full transition-all duration-1000 ${isPinging ? 'w-full' : 'w-0'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatusCardProps {
  icon: string;
  label: string;
  status: string;
  isActive: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({ icon, label, status, isActive }) => (
  <div className="bg-white dark:bg-white/5 rounded-2xl p-5 ios-shadow border border-slate-100 dark:border-white/5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-white/10 text-slate-400'}`}>
      <span className="material-icons-round text-2xl">{icon}</span>
    </div>
    <div>
      <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</h5>
      <p className={`text-lg font-extrabold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
        {status}
      </p>
    </div>
    <div className="ml-auto">
      <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-primary shadow-[0_0_12px_rgba(70,236,19,0.5)]' : 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.5)]'}`}></div>
    </div>
  </div>
);

export default NetworkTab;
