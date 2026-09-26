import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Key, 
  Users, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle,
  ExternalLink,
  Plus,
  Sliders,
  Database,
  LogOut,
  LogIn,
  UserCheck
} from 'lucide-react';
import { WorkspaceIntegration, TeamMember, AuthUser } from '../../types';
import { workspaceIntegrations as initialIntegrations, teamMembers as initialMembers } from '../../data/mockData';

interface SettingsViewProps {
  user?: AuthUser | null;
  onLogout?: () => void;
  onOpenAuth?: (mode?: 'signin' | 'register') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onLogout,
  onOpenAuth,
}) => {
  const [integrations, setIntegrations] = useState<WorkspaceIntegration[]>(initialIntegrations);
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // Safeguard toggles
  const [budgetCapLimit, setBudgetCapLimit] = useState(20);
  const [roasFloor, setRoasFloor] = useState('2.20');
  const [autoKillHighCpa, setAutoKillHighCpa] = useState(true);

  // Invite member state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Media Buyer' | 'Analyst' | 'Growth Lead'>('Media Buyer');

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, lastSynced: 'Just now' } : item
        )
      );
      setSyncingId(null);
    }, 1000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText('pk_live_94820194820194820194829104');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText('https://api.pulseiq.ai/v1/telemetry/webhook/wh_921049182');
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      role: inviteRole,
      status: 'invited',
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    setIsInviteOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Enterprise Governance
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span className="text-xs text-slate-400 font-mono">Workspace ID: ws_apex_global_84</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
          Workspace Settings & Integrations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Govern API connections, autonomous safeguards, and team role-based access.
        </p>
      </div>

      {/* Current Active User Session Profile Card */}
      <section className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {user ? (
          <div className="flex items-center gap-3.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-purple-500/40 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{user.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {user.role}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Authenticated
                </span>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</div>
              <div className="text-[11px] text-slate-500 mt-1">Company: {user.company || 'Apex Retail Global'}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Not Signed In</h3>
              <p className="text-xs text-slate-400">Sign in to sync your personal campaigns and custom rules.</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {user ? (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold transition-all"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth && onOpenAuth('signin')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => onOpenAuth && onOpenAuth('register')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section 1: Connected Ad Channels & Data Lakehouse */}
      <section className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database size={18} className="text-blue-400" />
              <span>Integrated Ad Channels & Data Sources</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live ingest pipelines pushing telemetry into the PulseIQ Algorithmic Engine.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 self-start sm:self-auto">
            7 of 7 Connected (99.98% uptime)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-[#171f33] p-4 border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                      <span className="material-symbols-outlined text-[20px]">
                        {item.icon === 'shopping_bag' ? 'shopping_cart' : item.icon === 'mail' ? 'mail' : item.icon === 'database' ? 'database' : 'hub'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs sm:text-sm">{item.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{item.category}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Live
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 mt-2 truncate font-mono">
                  {item.account}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                <span>Synced {item.lastSynced}</span>
                <button
                  onClick={() => handleSync(item.id)}
                  disabled={syncingId === item.id}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-medium"
                >
                  <RefreshCw size={12} className={syncingId === item.id ? 'animate-spin' : ''} />
                  <span>{syncingId === item.id ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Autonomous AI Rules & Safeguards */}
      <section className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <span>Autonomous AI Rules & Safeguards</span>
          </h3>
          <p className="text-xs text-slate-400">
            Set hard boundary conditions that the automated agent must strictly enforce without exception.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Rule 1: Max Budget Shift Rate */}
          <div className="rounded-xl bg-[#171f33] p-4 border border-white/5 space-y-2">
            <span className="font-bold text-white block">Maximum 24h Budget Shift Cap</span>
            <p className="text-slate-400 text-[11px]">
              Limits autonomous rebalancing to prevent abrupt volatility in platform bidding algorithms.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="number"
                value={budgetCapLimit}
                onChange={(e) => setBudgetCapLimit(Number(e.target.value))}
                className="w-20 bg-[#0b1326] px-2.5 py-1 rounded text-white font-mono border border-white/10 text-xs"
              />
              <span className="font-mono text-slate-300">% max shift / day</span>
            </div>
          </div>

          {/* Rule 2: Minimum ROAS Floor */}
          <div className="rounded-xl bg-[#171f33] p-4 border border-white/5 space-y-2">
            <span className="font-bold text-white block">Portfolio ROAS Floor Guard</span>
            <p className="text-slate-400 text-[11px]">
              Automatically pauses any campaign that sustains a 48h rolling ROAS below this floor.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={roasFloor}
                onChange={(e) => setRoasFloor(e.target.value)}
                className="w-20 bg-[#0b1326] px-2.5 py-1 rounded text-white font-mono border border-white/10 text-xs"
              />
              <span className="font-mono text-slate-300">x minimum ROAS</span>
            </div>
          </div>

          {/* Rule 3: Auto-Kill Bleed */}
          <div className="rounded-xl bg-[#171f33] p-4 border border-white/5 space-y-2 flex flex-col justify-between">
            <div>
              <span className="font-bold text-white block">Auto-Kill Audience Frequency Bleed</span>
              <p className="text-slate-400 text-[11px]">
                Instantly pauses ad sets whose CPA surges &gt;100% target at frequency &gt;4.0x.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-300 font-semibold">{autoKillHighCpa ? 'Enabled' : 'Disabled'}</span>
              <button
                onClick={() => setAutoKillHighCpa(!autoKillHighCpa)}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  autoKillHighCpa ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                    autoKillHighCpa ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Team Access Governance */}
      <section className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users size={18} className="text-purple-400" />
              <span>Team Access & Roles</span>
            </h3>
            <p className="text-xs text-slate-400">
              Manage operators authorized to override autonomous bids and execute campaign budgets.
            </p>
          </div>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition-all"
          >
            <Plus size={14} />
            <span>Invite Member</span>
          </button>
        </div>

        {/* Invite Modal / Box */}
        {isInviteOpen && (
          <form onSubmit={handleInvite} className="p-3.5 rounded-xl bg-[#171f33] border border-blue-500/30 flex flex-wrap gap-2 items-center text-xs">
            <input
              type="email"
              placeholder="operator@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 min-w-[200px] bg-[#0b1326] px-3 py-1.5 rounded-lg text-white border border-white/10"
              required
            />
            <select
              value={inviteRole}
              onChange={(e: any) => setInviteRole(e.target.value)}
              className="bg-[#0b1326] px-3 py-1.5 rounded-lg text-white border border-white/10"
            >
              <option value="Media Buyer">Media Buyer</option>
              <option value="Growth Lead">Growth Lead</option>
              <option value="Analyst">Analyst</option>
            </select>
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg"
            >
              Send Invite
            </button>
            <button
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="px-3 py-1.5 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {members.map((m) => (
            <div key={m.id} className="rounded-xl bg-[#171f33] p-3.5 border border-white/5 flex items-center gap-3">
              <img
                src={m.avatar}
                alt={m.name}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
              />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-white text-xs truncate">{m.name}</div>
                <div className="text-[10px] text-slate-400 truncate font-mono">{m.email}</div>
                <span className="inline-block mt-1 text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-white/5 text-blue-300 border border-white/5">
                  {m.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: API Keys & Webhook Telemetry */}
      <section className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Key size={18} className="text-amber-400" />
            <span>API Credentials & Webhook Endpoints</span>
          </h3>
          <p className="text-xs text-slate-400">
            Secure tokens for streaming custom telemetry and headless conversions into PulseIQ.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* API Key */}
          <div className="rounded-xl bg-[#171f33] p-3.5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-white">Live Workspace Production Key</span>
              <div className="font-mono text-[11px] text-slate-400 mt-0.5">
                pk_live_••••••••••••••••••••••••94829104
              </div>
            </div>
            <button
              onClick={handleCopyKey}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 self-start sm:self-auto font-mono text-xs"
            >
              {copiedKey ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
            </button>
          </div>

          {/* Webhook Endpoint */}
          <div className="rounded-xl bg-[#171f33] p-3.5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-semibold text-white">Real-time Telemetry Webhook Ingest URL</span>
              <div className="font-mono text-[11px] text-slate-400 mt-0.5 break-all">
                https://api.pulseiq.ai/v1/telemetry/webhook/wh_921049182
              </div>
            </div>
            <button
              onClick={handleCopyWebhook}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 self-start sm:self-auto font-mono text-xs shrink-0"
            >
              {copiedWebhook ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copiedWebhook ? 'Copied' : 'Copy URL'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
