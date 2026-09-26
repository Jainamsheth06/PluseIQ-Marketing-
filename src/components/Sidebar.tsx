import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  GitBranch, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  TrendingUp, 
  ExternalLink,
  ChevronRight,
  Layers,
  LogOut,
  LogIn,
  UserCheck
} from 'lucide-react';
import { ViewTab, AuthUser } from '../types';

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  recommendationsCount: number;
  user: AuthUser | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'signin' | 'register') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  onCloseMobile,
  recommendationsCount,
  user,
  onLogout,
  onOpenAuth,
}) => {
  const navItems = [
    {
      id: 'overview' as ViewTab,
      label: 'Executive Overview',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Telemetry & Core KPIs',
    },
    {
      id: 'campaigns' as ViewTab,
      label: 'Campaigns Pacing',
      icon: BarChart3,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      desc: 'Cross-Network Controls',
    },
    {
      id: 'attribution' as ViewTab,
      label: 'Attribution & Analytics',
      icon: GitBranch,
      badge: 'Markov',
      badgeColor: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      desc: 'Multi-Touch Journey',
    },
    {
      id: 'insights' as ViewTab,
      label: 'AI Insights Engine',
      icon: Sparkles,
      badge: recommendationsCount > 0 ? `${recommendationsCount} items` : null,
      badgeColor: 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse',
      desc: 'Neural Interventions',
    },
    {
      id: 'settings' as ViewTab,
      label: 'Workspace & Integrations',
      icon: Settings,
      badge: '7 Connected',
      badgeColor: 'bg-slate-700/50 text-slate-300 border border-slate-600/30',
      desc: 'API Governance & Rules',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-white/10 bg-[#0b1326] flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Section: Main Navigation */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Intelligence Navigation
            </div>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onCloseMobile();
                    }}
                    className={`w-full text-left group relative flex items-center justify-between px-3.5 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/25 to-purple-600/15 text-white border border-blue-500/40 shadow-lg shadow-blue-950/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg transition-colors ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div className="truncate">
                        <div className="text-sm font-semibold leading-tight truncate">{item.label}</div>
                        <div className="text-[11px] text-slate-500 leading-none mt-1 truncate">{item.desc}</div>
                      </div>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-blue-500"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Autonomous Safeguards Widget */}
          <div className="rounded-xl border border-white/10 bg-[#171f33]/80 p-3.5">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                Auto-Guardrails
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">ACTIVE</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Target Portfolio ROAS</span>
                <span className="text-white font-mono font-semibold">4.80x</span>
              </div>
              <div className="w-full bg-[#0b1326] rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Current: 4.42x</span>
                <span>Pacing: 92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info: Stitch connection info & User */}
        <div className="border-t border-white/10 pt-3 space-y-3">
          <a
            href="https://stitch.withgoogle.com/projects/16724025183037440447"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#131b2e] hover:bg-[#1a243d] border border-white/5 text-xs text-slate-400 hover:text-white transition-all group"
          >
            <span className="flex items-center gap-1.5 truncate">
              <Layers size={13} className="text-purple-400 shrink-0" />
              <span className="truncate">Stitch Project Specs</span>
            </span>
            <ExternalLink size={12} className="text-slate-500 group-hover:text-purple-400 shrink-0" />
          </a>

          {user ? (
            <div className="flex items-center justify-between gap-2 px-2 py-1 bg-[#171f33]/60 rounded-xl border border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user.role}</div>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Log Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/5 transition-colors shrink-0"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('signin')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold shadow-md transition-all"
            >
              <LogIn size={14} />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
