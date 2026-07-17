import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, Key, Eye, EyeOff, Volume2, Globe, Trash2, CheckCircle } from 'lucide-react';
import { apiFetch } from '../utils/api';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPw, setShowPw] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [lang, setLang] = useState('en');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!password || !newPassword || !confirmPassword) {
      setErrorMsg("Please fill out all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    setIsUpdating(true);
    // Simulate updating API call
    setTimeout(() => {
      setIsUpdating(false);
      setSuccessMsg("Security password updated successfully.");
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 800);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure you want to permanently delete your account? This will purge all your prediction records and is completely irreversible.")) {
      try {
        await apiFetch('/api/auth/me', {
          method: 'DELETE'
        });
        alert("Account successfully deleted.");
        logout();
      } catch (e: any) {
        setErrorMsg(e.message || "Failed to delete account");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-navy dark:text-white tracking-tight">
            Settings & Configurations
          </h1>
          <p className="text-xs text-brand-slate dark:text-slate-400">
            Manage your credentials, notification toggles, language, and theme choices
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4.5 h-4.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium md:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <Shield className="w-4.5 h-4.5 text-brand-blue" />
            <span>Profile Details</span>
          </h3>
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <span className="text-brand-slate dark:text-slate-500 block">Full Name</span>
              <span className="font-bold text-brand-navy dark:text-white mt-0.5 block">{user?.full_name}</span>
            </div>
            <div>
              <span className="text-brand-slate dark:text-slate-500 block">Email Address</span>
              <span className="font-bold text-brand-navy dark:text-white mt-0.5 block">{user?.email}</span>
            </div>
            <div>
              <span className="text-brand-slate dark:text-slate-500 block">Role Credentials</span>
              <span className="font-bold uppercase text-brand-blue mt-0.5 block">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Change password & System Configs */}
        <div className="md:col-span-2 space-y-8">
          {/* Security details */}
          <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium space-y-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Key className="w-4.5 h-4.5 text-brand-cyan" />
              <span>Update Password</span>
            </h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Current Password</label>
                  <input 
                    type={showPw ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
                <div className="space-y-1.5 flex items-end">
                  <button 
                    type="button" 
                    onClick={() => setShowPw(!showPw)}
                    className="flex items-center space-x-2 text-slate-500 hover:text-brand-navy dark:hover:text-white font-semibold py-2.5 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    <span>{showPw ? "Hide Passwords" : "Reveal Passwords"}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 dark:text-slate-400">New Password</label>
                  <input 
                    type={showPw ? "text" : "password"} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-600 dark:text-slate-400">Confirm New Password</label>
                  <input 
                    type={showPw ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isUpdating}
                className="py-3 px-6 rounded-xl bg-brand-blue hover:bg-brand-blue/95 disabled:bg-slate-400 text-white font-bold tracking-wide transition-all shadow-md"
              >
                {isUpdating ? "Saving..." : "Save Password"}
              </button>
            </form>
          </div>

          {/* Preferences details */}
          <div className="p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 shadow-premium space-y-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Volume2 className="w-4.5 h-4.5 text-purple-500" />
              <span>Platform Customizations</span>
            </h3>
            
            <div className="space-y-4 text-xs">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-slate-800/30">
                <div>
                  <span className="font-bold text-brand-navy dark:text-white block">Visual Appearance Theme</span>
                  <span className="text-[10px] text-brand-slate dark:text-slate-500">Toggle between Light and Dark medical interface modes</span>
                </div>
                <button 
                  onClick={toggleTheme}
                  className="px-4 py-2 rounded-xl bg-slate-150 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-all"
                >
                  {theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-slate-800/30">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <div>
                    <span className="font-bold text-brand-navy dark:text-white block">Language Preference</span>
                    <span className="text-[10px] text-brand-slate dark:text-slate-500">Select language for medical charts and reports</span>
                  </div>
                </div>
                <select 
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-brand-navy dark:text-white font-bold cursor-pointer"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              {/* Email Alerts Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-slate-200/30 dark:border-slate-800/30">
                <div>
                  <span className="font-bold text-brand-navy dark:text-white block">Email Alerts</span>
                  <span className="text-[10px] text-brand-slate dark:text-slate-500">Receive analysis reports and statistics via email</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-blue border-slate-300 focus:ring-brand-blue cursor-pointer"
                />
              </div>

              {/* System Alerts Toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="font-bold text-brand-navy dark:text-white block">System Alerts</span>
                  <span className="text-[10px] text-brand-slate dark:text-slate-500">Enable in-app notifications on model completions</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={systemAlerts}
                  onChange={(e) => setSystemAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-blue border-slate-300 focus:ring-brand-blue cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Delete Account */}
          <div className="p-8 rounded-3xl border border-red-500/20 bg-red-500/5 shadow-premium flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-red-500 flex items-center space-x-2">
                <Trash2 className="w-4.5 h-4.5" />
                <span>Danger Zone: Decommission Account</span>
              </h4>
              <p className="text-[10px] text-brand-slate dark:text-slate-500 mt-1 max-w-md">
                Decommissioning your account permanently purges all registration profiles, prediction records, chat logs, and generated PDF reports. This is irreversible.
              </p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all shadow-md"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
