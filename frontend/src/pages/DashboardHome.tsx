import React from 'react';
import { Brain, Activity, HeartPulse, Sparkles, ArrowRight, ShieldCheck, ClipboardList, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardHomeProps {
  onSelectModule: (module: 'brain' | 'alzheimer' | 'spine') => void;
  onNavigate: (page: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onSelectModule, onNavigate }) => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Card */}
      <div className="relative p-8 rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-tr from-brand-navy to-slate-900 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-cyan text-xs font-semibold tracking-wide uppercase mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Imaging System Online</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Welcome, {user?.full_name || "Doctor"}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            NeuroScan AI gives you access to state-of-the-art diagnostics and localized saliency mapping. Choose a diagnostic module below to begin analysis.
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={() => onNavigate('chat')}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white transition-all shadow-md flex items-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Query AI Assistant</span>
            </button>
            <button 
              onClick={() => onNavigate('history')}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all"
            >
              View Record History
            </button>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Modules */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-brand-navy dark:text-white mb-6 flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-brand-blue" />
          <span>Diagnostic MRI Modules</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brain Card */}
          <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/75 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-brand-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-6.5 h-6.5" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-2">Brain Tumor</h3>
              <p className="text-brand-slate dark:text-slate-400 text-xs leading-relaxed mb-6">
                Assesses T1-weighted contrast brain MRI scans. Classifies lesions into glioma, meningioma, pituitary adenoma, or normal, with Grad-CAM spot maps.
              </p>
            </div>
            <button 
              onClick={() => onSelectModule('brain')}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Analyze Brain Scan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Alzheimer's Card */}
          <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/75 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-brand-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6.5 h-6.5" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-2">Alzheimer's Disease</h3>
              <p className="text-brand-slate dark:text-slate-400 text-xs leading-relaxed mb-6">
                Evaluates brain structural volume loss. Classifies stage impairment levels from non-demented to moderate dementia, isolating localized atrophy.
              </p>
            </div>
            <button 
              onClick={() => onSelectModule('alzheimer')}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Stage Alzheimer's MRI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Spine Card */}
          <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/75 dark:bg-slate-900/75 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <HeartPulse className="w-6.5 h-6.5" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-2">Spine MRI</h3>
              <p className="text-brand-slate dark:text-slate-400 text-xs leading-relaxed mb-6">
                Analyzes sagittal T2 spine scans. Classifies disc herniations, ligamentum hypertrophy, and cauda equina compression along vertebrae L1-L5.
              </p>
            </div>
            <button 
              onClick={() => onSelectModule('spine')}
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>Analyze Spinal Scan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Notice card */}
      <div className="p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-900/30 flex items-start space-x-4">
        <div className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue mt-0.5">
          <ClipboardList className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-brand-navy dark:text-white mb-1">Standard Clinical Workflow Instructions</h4>
          <p className="text-xs text-brand-slate dark:text-slate-400 leading-relaxed">
            Select a diagnostic module, drag and drop T1/T2 MRI images (PNG, JPG, JPEG), and click 'Run AI Prediction'. The system generates classifications and overlays the Grad-CAM saliency highlights. Serialize report outputs to hospital PDF sheets for clinical record archives.
          </p>
        </div>
      </div>
    </div>
  );
};
