import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LandingPage } from './pages/LandingPage';
import { AuthPages } from './pages/AuthPages';
import { DashboardHome } from './pages/DashboardHome';
import { MriAnalysis } from './pages/MriAnalysis';
import { PredictionHistory } from './pages/PredictionHistory';
import { AiAssistant } from './pages/AiAssistant';
import { Settings } from './pages/Settings';
import { AdminDashboard } from './pages/AdminDashboard';

import { 
  Brain, 
  LayoutDashboard, 
  Activity, 
  History, 
  MessageCircle, 
  Settings as SettingsIcon, 
  ShieldCheck, 
  LogOut, 
  Sun, 
  Moon, 
  Search, 
  User, 
  Menu
} from 'lucide-react';

const DashboardLayout: React.FC<{ 
  activePage: string; 
  onNavigate: (page: string) => void;
  selectedMriType: 'brain' | 'alzheimer' | 'spine' | null;
  setSelectedMriType: (type: 'brain' | 'alzheimer' | 'spine' | null) => void;
  children: React.ReactNode;
}> = ({ activePage, onNavigate, selectedMriType, setSelectedMriType, children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    onNavigate('landing');
  };

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analysis', label: 'MRI Analysis', icon: Activity },
    { id: 'history', label: 'Record History', icon: History },
    { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Telemetry', icon: ShieldCheck });
  }

  const handleNavClick = (pageId: string) => {
    if (pageId === 'analysis') {
      setSelectedMriType(selectedMriType || 'brain');
    }
    onNavigate(pageId);
  };

  return (
    <div className="min-h-screen flex bg-brand-lightBg dark:bg-brand-darkBg transition-colors duration-300">
      {/* Sidebar */}
      <aside className={`border-r border-slate-200/50 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between p-5 z-20 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white shadow-lg shadow-brand-blue/20">
              <Brain className="w-5.5 h-5.5" />
            </div>
            {sidebarOpen && (
              <span className="text-base font-bold tracking-tight text-brand-navy dark:text-white">
                NeuroScan <span className="text-brand-blue">AI</span>
              </span>
            )}
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id || (item.id === 'analysis' && activePage === 'analysis');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3.5 p-3 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/15' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-brand-navy dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3.5 p-3 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Sign Out</span>}
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 transition-all"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            
            {/* Search bar */}
            <div className="relative max-w-xs hidden sm:block">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search patient records..."
                className="w-full pl-10 pr-4 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-950/40 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-blue/30 text-xs transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 transition-all"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>

            {/* Profile badge */}
            <div className="flex items-center space-x-3.5 border-l border-slate-200 dark:border-slate-800 pl-4">
              <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white flex items-center justify-center font-bold text-sm shadow-md">
                {user?.full_name ? user.full_name[0] : <User className="w-4 h-4" />}
              </div>
              <div className="hidden md:block text-left text-xs">
                <span className="font-bold text-brand-navy dark:text-white block truncate max-w-[120px]">{user?.full_name}</span>
                <span className="text-[10px] text-brand-blue font-semibold uppercase tracking-wider block">{user?.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute inset-0 medical-grid-bg dark:medical-grid-bg-dark opacity-30 pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedMriType, setSelectedMriType] = useState<'brain' | 'alzheimer' | 'spine' | null>(null);

  // Sync state with auth status on initial mount
  React.useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setCurrentPage('home');
      } else {
        if (currentPage !== 'login' && currentPage !== 'register') {
          setCurrentPage('landing');
        }
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-lightBg dark:bg-brand-darkBg space-y-6">
        <div className="relative">
          <LoaderSpinner />
          <div className="absolute inset-0 bg-brand-blue/15 rounded-full blur-2xl pointer-events-none" />
        </div>
        <div className="text-center">
          <span className="text-lg font-bold text-brand-navy dark:text-white block tracking-tight">NeuroScan AI Portal</span>
          <span className="text-xs text-brand-slate dark:text-slate-400 mt-1 block">Establishing secure medical database socket...</span>
        </div>
      </div>
    );
  }

  const handleSelectModule = (type: 'brain' | 'alzheimer' | 'spine') => {
    setSelectedMriType(type);
    setCurrentPage('analysis');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  // Unauthenticated routing
  if (!isAuthenticated) {
    if (currentPage === 'login' || currentPage === 'register') {
      return <AuthPages initialMode={currentPage === 'login' ? 'login' : 'register'} onNavigate={handleNavigate} />;
    }
    return <LandingPage onNavigate={handleNavigate} />;
  }

  // Authenticated routing
  return (
    <DashboardLayout 
      activePage={currentPage} 
      onNavigate={handleNavigate}
      selectedMriType={selectedMriType}
      setSelectedMriType={setSelectedMriType}
    >
      {currentPage === 'home' && <DashboardHome onSelectModule={handleSelectModule} onNavigate={handleNavigate} />}
      {currentPage === 'analysis' && selectedMriType && (
        <MriAnalysis mriType={selectedMriType} onNavigateHome={() => handleNavigate('home')} />
      )}
      {currentPage === 'history' && <PredictionHistory />}
      {currentPage === 'chat' && <AiAssistant />}
      {currentPage === 'settings' && <Settings />}
      {currentPage === 'admin' && <AdminDashboard />}
    </DashboardLayout>
  );
};

const LoaderSpinner: React.FC = () => {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-blue to-brand-cyan text-white flex items-center justify-center shadow-lg shadow-brand-blue/20">
        <Brain className="w-7 h-7 animate-pulse" />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
