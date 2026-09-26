import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  ArrowUpRight, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Pause, 
  Play, 
  AlertCircle,
  Copy,
  ChevronDown,
  CheckCircle2
} from 'lucide-react';
import { Campaign, PlatformId } from '../../types';
import { PacingControl } from '../PacingControl';

interface CampaignsViewProps {
  campaigns: Campaign[];
  onToggleStatus: (id: string) => void;
  onUpdateBudget: (id: string, newBudget: number) => void;
  onOpenCreateModal: () => void;
  onApplyRecommendation: (campaignId: string) => void;
  autoRebalanceEnabled: boolean;
  onToggleAutoRebalance: () => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  onToggleStatus,
  onUpdateBudget,
  onOpenCreateModal,
  onApplyRecommendation,
  autoRebalanceEnabled,
  onToggleAutoRebalance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [tempBudget, setTempBudget] = useState<number>(0);

  // Platform filters
  const platforms = [
    { id: 'all', label: 'All Networks' },
    { id: 'google', label: 'Google Ads' },
    { id: 'meta', label: 'Meta Ads' },
    { id: 'tiktok', label: 'TikTok' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'linkedin', label: 'LinkedIn' },
  ];

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || c.platform === selectedPlatform;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const totalDailyPacing = campaigns.reduce((acc, c) => c.status === 'active' ? acc + c.dailyBudget : acc, 0);
  const activeCount = campaigns.filter((c) => c.status === 'active').length;

  const handleStartEditBudget = (c: Campaign) => {
    setEditingBudgetId(c.id);
    setTempBudget(c.dailyBudget);
  };

  const handleSaveBudget = (id: string) => {
    if (tempBudget > 0) {
      onUpdateBudget(id, tempBudget);
    }
    setEditingBudgetId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Autonomous Auto-Tune Pill */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Growth Engine • Multi-Channel Pacing
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs text-emerald-400 font-semibold font-mono">Real-time Telemetry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Multi-Channel Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Continuous cross-platform pacing, predictive bidding, and ROAS governance.
          </p>
        </div>

        {/* Quick Action: Autonomous Bid Rebalancing Card */}
        <div className="flex items-center gap-3 bg-[#171f33] px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Autonomous Bid Rebalancing</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${autoRebalanceEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300'}`}>
                {autoRebalanceEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Efficiency Target: 4.80x ROAS</span>
          </div>
          <button
            onClick={onToggleAutoRebalance}
            className={`ml-2 relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              autoRebalanceEnabled ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                autoRebalanceEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Pacing Run-Rate Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <div className="text-xs text-slate-400">Active Pacing Budget</div>
          <div className="text-lg sm:text-2xl font-black text-white font-mono mt-1">
            ${totalDailyPacing.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/day</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            94.2% pacing efficiency
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <div className="text-xs text-slate-400">Campaigns In Market</div>
          <div className="text-lg sm:text-2xl font-black text-white font-mono mt-1">
            {activeCount} <span className="text-xs text-slate-500 font-normal">of {campaigns.length} Active</span>
          </div>
          <div className="text-[11px] text-blue-400 mt-1">
            4 networks running
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <div className="text-xs text-slate-400">Avg Channel ROAS</div>
          <div className="text-lg sm:text-2xl font-black text-white font-mono mt-1">
            4.42x
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            +0.4x vs last 7 days
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10">
          <div className="text-xs text-slate-400">Optimization Guard</div>
          <div className="text-lg sm:text-2xl font-black text-white font-mono mt-1">
            Strict
          </div>
          <div className="text-[11px] text-purple-400 mt-1">
            2.50x ROAS floor enabled
          </div>
        </div>
      </section>

      {/* Spend Cap & Pacing Control with Automated Slow-Down Alerts */}
      <PacingControl campaigns={campaigns} />

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns, SKUs, or objectives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-[#171f33] pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 border border-white/10 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Platform Pills */}
          <div className="flex items-center overflow-x-auto pb-1 sm:pb-0 gap-1 bg-[#171f33] p-1 rounded-xl border border-white/10">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPlatform(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedPlatform === p.id
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA: Create New Campaign */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-900/40 transition-all active:scale-95 shrink-0"
        >
          <Plus size={16} />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* Campaigns Listing: Responsive Desktop Table / Mobile Cards */}
      <section className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Campaign Name</th>
                <th className="py-3 px-4 font-semibold">Daily Budget</th>
                <th className="py-3 px-4 font-semibold">Spend</th>
                <th className="py-3 px-4 font-semibold">Conversions</th>
                <th className="py-3 px-4 font-semibold">CPA</th>
                <th className="py-3 px-4 font-semibold">ROAS</th>
                <th className="py-3 px-4 font-semibold">AI Recommendation</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCampaigns.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Status Toggle */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleStatus(c.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        c.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : c.status === 'learning'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                      <span className="capitalize">{c.status}</span>
                    </button>
                  </td>

                  {/* Name & Network */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-bold text-white text-xs truncate" title={c.name}>
                      {c.name}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="capitalize text-blue-400 font-semibold">{c.platform}</span>
                      <span>•</span>
                      <span>CTR {c.ctr}%</span>
                    </div>
                  </td>

                  {/* Editable Daily Budget */}
                  <td className="py-3.5 px-4 font-mono">
                    {editingBudgetId === c.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempBudget}
                          onChange={(e) => setTempBudget(Number(e.target.value))}
                          className="w-20 bg-[#0b1326] px-2 py-1 text-xs text-white border border-blue-500 rounded font-mono"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveBudget(c.id)}
                          className="px-2 py-1 bg-blue-600 text-white text-[10px] rounded font-bold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEditBudget(c)}
                        className="group flex items-center gap-1 font-bold text-white hover:text-blue-400"
                        title="Click to edit daily budget"
                      >
                        <span>${c.dailyBudget}/d</span>
                        <span className="text-[10px] text-slate-500 group-hover:text-blue-400">✎</span>
                      </button>
                    )}
                  </td>

                  {/* Spend */}
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    ${c.spend.toLocaleString()}
                  </td>

                  {/* Conversions */}
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {c.conversions.toLocaleString()}
                  </td>

                  {/* CPA */}
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    ${c.cpa.toFixed(2)}
                  </td>

                  {/* ROAS */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 font-mono">
                      <span className={`font-bold ${c.roas >= c.targetRoas ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {c.roas.toFixed(2)}x
                      </span>
                      <span className="text-[10px] text-slate-500">
                        (tgt {c.targetRoas}x)
                      </span>
                    </div>
                  </td>

                  {/* AI Recommendation */}
                  <td className="py-3.5 px-4 max-w-sm">
                    {c.aiRecommendation ? (
                      <button
                        onClick={() => onApplyRecommendation(c.id)}
                        className="text-left w-full group p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 transition-all"
                      >
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-300">
                          <Sparkles size={12} className="text-purple-400" />
                          <span>{c.aiRecommendation.impact}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[200px]">
                          {c.aiRecommendation.description}
                        </div>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Pacing within bounds</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onToggleStatus(c.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                      title={c.status === 'active' ? 'Pause Campaign' : 'Resume Campaign'}
                    >
                      {c.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile & Tablet Card Layout (Matches Stitch Screen 5 mobile spec) */}
        <div className="lg:hidden divide-y divide-white/5">
          {filteredCampaigns.map((c) => (
            <div key={c.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${c.status === 'active' ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      {c.platform}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-0.5 leading-snug">
                    {c.name}
                  </h4>
                </div>

                <button
                  onClick={() => onToggleStatus(c.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                    c.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {c.status === 'active' ? 'Active' : 'Paused'}
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#0b1326] p-2.5 rounded-xl border border-white/5 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-500">Budget/d</div>
                  <div className="font-bold text-white">${c.dailyBudget}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">ROAS</div>
                  <div className={`font-bold ${c.roas >= c.targetRoas ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {c.roas.toFixed(2)}x
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">CPA</div>
                  <div className="font-bold text-slate-300">${c.cpa.toFixed(2)}</div>
                </div>
              </div>

              {/* Mobile AI Recommendation pill if any */}
              {c.aiRecommendation && (
                <div 
                  onClick={() => onApplyRecommendation(c.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-xs cursor-pointer active:scale-98 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-purple-400 shrink-0" />
                    <span className="text-purple-200 text-[11px] font-semibold">{c.aiRecommendation.impact}</span>
                  </div>
                  <span className="text-[10px] bg-purple-600 text-white font-bold px-2 py-0.5 rounded-md">
                    Apply
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
