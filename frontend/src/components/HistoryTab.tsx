
import React from 'react';
import { ScanResult } from '../types';

interface HistoryTabProps {
  history: ScanResult[];
  clearHistory: () => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({ history, clearHistory }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Scan History</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review your previous detections.</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="Clear All History"
          >
            <span className="material-icons-round">delete_sweep</span>
          </button>
        )}
      </section>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
            <span className="material-icons-round text-4xl text-slate-300">history</span>
          </div>
          <p className="font-bold text-lg">No scans yet</p>
          <p className="text-sm max-w-[200px] mt-1">Detected plant diseases will appear here for tracking.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-white/5 rounded-2xl p-4 ios-shadow flex items-center gap-4 border border-slate-100 dark:border-white/5 active:scale-[0.98] transition-transform"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800">
                <img src={item.image} alt={item.cropName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-bold text-sm truncate">{item.cropName}</h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-xs font-semibold mb-2 truncate ${item.hasIssue ? 'text-red-500' : 'text-green-500'}`}>
                  {item.diseaseName}
                </p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 tracking-tighter">
                    <span className="material-icons-round text-xs">analytics</span>
                    <span>{(item.confidence * 100).toFixed(0)}% Conf.</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${item.hasIssue ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {item.hasIssue ? 'Alert' : 'Clean'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
