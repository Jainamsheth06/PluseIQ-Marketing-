import React, { useState } from 'react';
import { 
  Laptop, 
  Smartphone, 
  Monitor, 
  Bell, 
  Sparkles, 
  ChevronDown, 
  ExternalLink, 
  Menu, 
  X,
  CheckCircle2,
  AlertTriangle,
  LogOut,
  LogIn,
  UserPlus,
  User
} from 'lucide-react';
import { ViewportMode, AuthUser } from '../types';

interface HeaderProps {
  viewportMode: ViewportMode;
  setViewportMode: (mode: ViewportMode) => void;
  onOpenMobileNav: () => void;
  isMobileNavOpen: boolean;
  onRunOptimization: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  user: AuthUser | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'signin' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewportMode,
  setViewportMode,
  onOpenMobileNav,
  isMobileNavOpen,
  onRunOptimization,
  unreadCount,
  onOpenNotifications,
  user,
  onLogout,
  onOpenAuth,
}) => {
  const [workspace, setWorkspace] = useState('Apex Retail Group — Global');
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const workspaces = [
    'Apex Retail Group — Global',
    'Nordic Apparel Co — EU',
    'Lumina Health D2C — US',
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0b1326]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        {/* Left: Brand & Stitch Project Tag */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={onOpenMobileNav}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            aria-label="Toggle Navigation"
          >
            {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-lg shadow-purple-900/30">
              <span className="material-symbols-outlined text-white text-[20px]">insights</span>
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1">
                  Pulse<span className="text-blue-400">IQ</span>
                </span>
                <span className="hidden xl:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Telemetry
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                <span>Stitch #16724025183037440447</span>
              </div>
            </div>
          </div>

          {/* Workspace Switcher */}
          <div className="relative ml-2 sm:ml-4 hidden lg:block">
            <button
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="flex items-center gap-2 rounded-lg bg-[#171f33] px-3 py-1.5 text-xs font-medium text-slate-200 border border-white/5 hover:border-white/15 transition-all"
            >
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="truncate max-w-[180px]">{workspace}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isWorkspaceMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-[#171f33] border border-white/10 shadow-2xl p-1.5 z-50">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Select Workspace
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws}
                    onClick={() => {
                      setWorkspace(ws);
                      setIsWorkspaceMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
                      workspace === ws 
                        ? 'bg-blue-600/20 text-blue-300 font-semibold' 
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <span className="truncate">{ws}</span>
                    {workspace === ws && <CheckCircle2 size={14} className="text-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Viewport Simulator Switcher + Optimization CTA + Notifications */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Viewport Mode Switcher (Fully responsive helper requested by user) */}
          <div className="hidden sm:flex items-center bg-[#131b2e] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setViewportMode('responsive')}
              title="Auto Responsive Viewport"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                viewportMode === 'responsive'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor size={14} />
              <span className="hidden md:inline">Auto</span>
            </button>
            <button
              onClick={() => setViewportMode('laptop')}
              title="Laptop Preview Mode (1280px)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                viewportMode === 'laptop'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop size={14} />
              <span className="hidden md:inline">Laptop</span>
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              title="Mobile Device Preview (390px)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                viewportMode === 'mobile'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone size={14} />
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Quick AI Autonomous Action */}
          <button
            onClick={onRunOptimization}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-purple-950/40 hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles size={14} className="animate-spin text-amber-300" style={{ animationDuration: '4s' }} />
            <span className="hidden sm:inline">Auto-Rebalance</span>
            <span className="sm:hidden">Optimize</span>
          </button>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#171f33] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#0b1326]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile & Auth / Logout Menu */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-xl bg-[#171f33] p-1.5 pr-2.5 border border-white/10 hover:border-white/20 transition-all"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-6 w-6 rounded-lg object-cover ring-1 ring-white/20"
                  />
                  <span className="hidden xl:inline text-xs font-semibold text-white max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} className="text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#171f33] border border-white/10 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-white/5">
                      <div className="font-bold text-white text-xs truncate">{user.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono truncate">{user.email}</div>
                      <div className="mt-1 inline-block text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {user.role}
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-medium transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Sign Out (Logout)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="flex items-center gap-1.5 rounded-xl bg-[#171f33] hover:bg-[#1f2b45] px-3 py-1.5 text-xs font-semibold text-white border border-white/10 transition-all"
                >
                  <LogIn size={14} />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-blue-900/40 transition-all"
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
