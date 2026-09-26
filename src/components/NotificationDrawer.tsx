import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'alert' | 'optimization' | 'info';
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'alert',
      title: 'Meta Audience X Bleed Detected',
      desc: 'CPA escalated to $48.20 (target $18.50). 4.8x saturation threshold reached.',
      time: '12m ago',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'optimization',
      title: 'Google PMax Budget Rebalanced',
      desc: 'Autonomous engine increased pacing cap by +$90/d to capture evening search volume.',
      time: '45m ago',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'optimization',
      title: 'TikTok Spark Ads Viral Momentum',
      desc: 'CTR hit 3.89%. Scaled daily allocation to prevent early inventory cap.',
      time: '2h ago',
      read: true,
    },
    {
      id: 'notif-4',
      type: 'info',
      title: 'Shopify Lakehouse Sync Completed',
      desc: '3,842 attributed order signals ingested into Markov attribution engine.',
      time: '3h ago',
      read: true,
    },
  ]);

  if (!isOpen) return null;

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-sm sm:max-w-md h-full bg-[#131b2e] border-l border-white/10 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-blue-400" />
            <h3 className="text-sm font-bold text-white">Live Telemetry Feed</h3>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
              Real-Time
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-[11px] text-slate-400 hover:text-white"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-xl border transition-all ${
                n.read 
                  ? 'bg-[#171f33]/60 border-white/5 opacity-80' 
                  : 'bg-[#171f33] border-blue-500/30 shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  n.type === 'alert'
                    ? 'bg-red-500/20 text-red-400'
                    : n.type === 'optimization'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {n.type === 'alert' ? (
                    <AlertTriangle size={16} />
                  ) : n.type === 'optimization' ? (
                    <Zap size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-snug">{n.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 text-center">
          <button
            onClick={() => {
              onNavigateTab('insights');
              onClose();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg transition-all"
          >
            <span>Inspect Neural Engine Rules</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
