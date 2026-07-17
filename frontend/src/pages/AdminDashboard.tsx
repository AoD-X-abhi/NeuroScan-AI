import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import { Users, BarChart, FileText, Activity, RefreshCw } from 'lucide-react';

interface Prediction {
  id: number;
  user_id: number;
  mri_type: string;
  prediction_class: string;
  confidence: number;
  inference_time: number;
  timestamp: string;
}

interface AdminStats {
  total_users: number;
  total_predictions: number;
  model_stats: { [key: string]: number };
  recent_predictions: Prediction[];
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await apiFetch<AdminStats>('/api/admin/stats');
      setStats(data);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to load admin stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy dark:text-white tracking-tight">
            Admin System Dashboard
          </h1>
          <p className="text-xs text-brand-slate dark:text-slate-400">
            Real-time server telemetry, user registration volumes, and diagnostic models usage
          </p>
        </div>
        <button 
          onClick={fetchStats}
          disabled={isLoading}
          className="p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
          <div className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-800/50 animate-pulse" />
        </div>
      ) : stats ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Users card */}
            <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium flex items-center space-x-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-brand-blue flex items-center justify-center shadow-md">
                <Users className="w-6.5 h-6.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-slate dark:text-slate-400 uppercase tracking-wider block">Total Platform Users</span>
                <span className="text-3xl font-extrabold text-brand-navy dark:text-white mt-1 block">{stats.total_users}</span>
              </div>
            </div>

            {/* Predictions card */}
            <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium flex items-center space-x-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-brand-cyan flex items-center justify-center shadow-md">
                <FileText className="w-6.5 h-6.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-brand-slate dark:text-slate-400 uppercase tracking-wider block">Total AI Predictions</span>
                <span className="text-3xl font-extrabold text-brand-navy dark:text-white mt-1 block">{stats.total_predictions}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Diagnostic Usage Chart */}
            <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium lg:col-span-1 space-y-6">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <BarChart className="w-4.5 h-4.5 text-brand-blue" />
                <span>Model Popularity Stats</span>
              </h3>
              
              <div className="space-y-5 pt-2">
                {Object.entries(stats.model_stats).map(([mri_type, val]) => {
                  const pct = stats.total_predictions > 0 ? (val / stats.total_predictions) * 100 : 0;
                  return (
                    <div key={mri_type} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-brand-navy dark:text-white font-bold">{mri_type.toUpperCase()}</span>
                        <span className="text-brand-slate dark:text-slate-500">{val} runs ({pct.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800/50 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent predictions logs */}
            <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium lg:col-span-2 space-y-6">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Activity className="w-4.5 h-4.5 text-brand-cyan animate-pulse" />
                <span>Recent Platform Activity</span>
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="pb-3">Timestamp</th>
                      <th className="pb-3">Patient ID</th>
                      <th className="pb-3">Model</th>
                      <th className="pb-3">Diagnosis</th>
                      <th className="pb-3">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {stats.recent_predictions.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-100/30 dark:hover:bg-slate-850/10">
                        <td className="py-3 text-brand-slate dark:text-slate-500">
                          {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 font-semibold text-brand-navy dark:text-white">
                          PAT-{String(p.user_id).padStart(4, '0')}-{String(p.id).padStart(4, '0')}
                        </td>
                        <td className="py-3 uppercase font-semibold text-brand-slate dark:text-slate-400">
                          {p.mri_type}
                        </td>
                        <td className="py-3 font-bold text-brand-blue">
                          {p.prediction_class.replace("Demented", " Demented")}
                        </td>
                        <td className="py-3 font-semibold text-brand-navy dark:text-white">
                          {(p.confidence * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
