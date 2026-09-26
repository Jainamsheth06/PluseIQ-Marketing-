import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  GitBranch, 
  Sparkles, 
  Settings,
  User
} from 'lucide-react';
import { ViewTab } from '../types';

interface MobileNavProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  recommendationsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  recommendationsCount,
}) => {
  const tabs = [
    { id: 'overview' as ViewTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'campaigns' as ViewTab, label: 'Campaigns', icon: BarChart3 },
    { id: 'attribution' as ViewTab, label: 'Attribution', icon: GitBranch },
    { id: 'insights' as ViewTab, label: 'AI Engine', icon: Sparkles, badge: recommendationsCount },
    { id: 'settings' as ViewTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t border-white/10 bg-[#0b1326]/95 backdrop-blur-xl px-2 py-1 safe-area-pb">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive ? 'text-blue-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon size={20} className={isActive ? 'text-blue-400' : 'text-slate-400'} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[9px] font-bold text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-0.5 rounded-full bg-blue-500"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
