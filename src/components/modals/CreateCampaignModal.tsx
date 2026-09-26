import React, { useState } from 'react';
import { X, Sparkles, DollarSign, Target, Layers } from 'lucide-react';
import { Campaign, PlatformId } from '../../types';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (campaign: Omit<Campaign, 'id' | 'spend' | 'revenue' | 'roas' | 'conversions' | 'cpa' | 'ctr'>) => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState<PlatformId>('google');
  const [dailyBudget, setDailyBudget] = useState(250);
  const [targetRoas, setTargetRoas] = useState(4.5);
  const [objective, setObjective] = useState<'sales' | 'leads' | 'retargeting'>('sales');

  if (!isOpen) return null;

  // Predictive calculations
  const predictedMonthlyRev = Math.round(dailyBudget * 30 * targetRoas);
  const predictedMonthlyConversions = Math.round((dailyBudget * 30) / (dailyBudget > 300 ? 12 : 8.5));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name,
      platform,
      status: 'learning',
      dailyBudget,
      targetRoas,
    });
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-white/20 bg-[#131b2e] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Layers size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Deploy Multi-Channel Campaign</h3>
              <p className="text-[11px] text-slate-400">Continuous telemetry pacing & auto-tuning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Campaign Name */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Campaign Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Google PMax — Fall Drop High-Intent Catalog"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl bg-[#0b1326] px-3.5 py-2.5 text-white border border-white/10 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Platform Selector */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Target Ad Network</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'google', label: 'Google Ads' },
                { id: 'meta', label: 'Meta Ads' },
                { id: 'tiktok', label: 'TikTok Ads' },
                { id: 'youtube', label: 'YouTube Video' },
                { id: 'klaviyo', label: 'Klaviyo Flow' },
                { id: 'linkedin', label: 'LinkedIn Ads' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as PlatformId)}
                  className={`p-2 rounded-xl text-center font-medium border transition-all ${
                    platform === p.id
                      ? 'bg-blue-600/30 border-blue-500 text-white font-bold'
                      : 'bg-[#0b1326] border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Budget & Target ROAS Slider */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Daily Budget ($)
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full rounded-xl bg-[#0b1326] px-3.5 py-2 text-white font-mono border border-white/10 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Target ROAS (x)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="15.0"
                value={targetRoas}
                onChange={(e) => setTargetRoas(Number(e.target.value))}
                className="w-full rounded-xl bg-[#0b1326] px-3.5 py-2 text-white font-mono border border-white/10 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Predictive Model Simulation Box */}
          <div className="rounded-xl bg-gradient-to-br from-purple-950/40 to-[#0b1326] p-3.5 border border-purple-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-300 font-bold text-[11px]">
              <Sparkles size={14} />
              <span>Algorithmic Telemetry Projection (30 Days)</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-slate-400">Est. 30D Revenue:</span>
              <span className="font-mono font-bold text-emerald-400">+${predictedMonthlyRev.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Est. Orders Generated:</span>
              <span className="font-mono font-bold text-white">~{predictedMonthlyConversions.toLocaleString()} conversions</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/40"
            >
              Launch Pacing Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
