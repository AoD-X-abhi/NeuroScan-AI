import React from 'react';
import { Activity, Shield, Brain, HeartPulse, Sparkles, LogIn, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-300">
      <div className="absolute inset-0 medical-grid-bg dark:medical-grid-bg-dark opacity-70 pointer-events-none" />
      
      {/* Top Navbar */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white shadow-lg shadow-brand-blue/20">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-navy to-slate-800 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            NeuroScan <span className="text-brand-blue">AI</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('login')}
            className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-blue dark:hover:text-white transition-colors duration-200"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate('register')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-blue to-brand-blue/90 hover:from-brand-blue/90 hover:to-brand-blue text-sm font-semibold text-white shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/35 transition-all duration-200 flex items-center space-x-2"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-brand-blue dark:text-brand-cyan text-xs font-semibold tracking-wide uppercase mb-8 border border-brand-blue/20 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Diagnostics</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-navy dark:text-white leading-[1.1] mb-6 max-w-4xl mx-auto">
          AI-Powered MRI Analysis & <br />
          <span className="bg-gradient-to-r from-brand-blue to-brand-cyan bg-clip-text text-transparent">
            Intelligent Diagnostic Assistant
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-brand-slate dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unlock state-of-the-art computational workflows for brain tumors, Alzheimer's staging, and lumbar spinal stenosis, equipped with saliency spot mapping.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <button 
            onClick={() => onNavigate('register')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold shadow-xl shadow-brand-blue/30 hover:shadow-brand-blue/40 transition-all duration-200 flex items-center justify-center space-x-2.5"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <LogIn className="w-5 h-5 text-slate-500" />
            <span>Portal Login</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          <div className="p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/55 dark:bg-slate-900/55 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-brand-blue flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-3">Brain Tumor Classifier</h3>
            <p className="text-brand-slate dark:text-slate-400 text-sm leading-relaxed">
              Detects glioma, meningioma, and pituitary adenomas. Computes volumetric localization highlights.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/55 dark:bg-slate-900/55 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-brand-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-3">Alzheimer's Staging</h3>
            <p className="text-brand-slate dark:text-slate-400 text-sm leading-relaxed">
              Assesses MRI volume changes to stage impairment levels from mild, very mild, to moderate dementia.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/55 dark:bg-slate-900/55 shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-3">Spine MRI Analysis</h3>
            <p className="text-brand-slate dark:text-slate-400 text-sm leading-relaxed">
              Identifies spinal stenosis, tracking herniated discs and thecal sac constrictions at vertebrae L1-L5.
            </p>
          </div>
        </section>

        {/* Diagnostic Trust Section */}
        <section className="bg-slate-100/50 dark:bg-slate-900/35 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between text-left space-y-6 md:space-y-0">
          <div className="max-w-md">
            <div className="flex items-center space-x-2 text-brand-blue mb-4">
              <Shield className="w-5 h-5" />
              <span className="font-bold text-xs uppercase tracking-wider">Clinical Trust</span>
            </div>
            <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-2">Diagnostic Integrity First</h2>
            <p className="text-sm text-brand-slate dark:text-slate-400 leading-relaxed">
              NeuroScan AI matches image features to localized anatomical markers using Grad-CAM, ensuring all AI decisions are transparent and auditable.
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-3xl font-extrabold text-brand-blue">99.1%</div>
              <div className="text-xs text-brand-slate dark:text-slate-400 font-semibold">Brain Accuracy</div>
            </div>
            <div className="w-px h-12 bg-slate-300 dark:bg-slate-800" />
            <div className="text-center">
              <div className="text-3xl font-extrabold text-brand-cyan">10K+</div>
              <div className="text-xs text-brand-slate dark:text-slate-400 font-semibold">Spine Trained</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-brand-slate dark:text-slate-500">
        <p>&copy; {new Date().getFullYear()} NeuroScan AI. All rights reserved. For research and clinical assistance only.</p>
      </footer>
    </div>
  );
};
