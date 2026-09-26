import React, { useState } from 'react';
import { 
  GitBranch, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  Sliders, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Info,
  CheckCircle2,
  PieChart,
  BarChart3
} from 'lucide-react';
import { AttributionModel } from '../../types';
import { attributionModelsData, sampleCustomerPaths } from '../../data/mockData';

export const AttributionView: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<AttributionModel>('markov');
  const [budgetShiftAmount, setBudgetShiftAmount] = useState<number>(5000);
  const [shiftSource, setShiftSource] = useState<'meta' | 'google' | 'tiktok'>('meta');
  const [shiftTarget, setShiftTarget] = useState<'meta' | 'google' | 'tiktok'>('google');

  const activeModelData = attributionModelsData[selectedModel];

  // Models list
  const models: { id: AttributionModel; label: string; badge?: string }[] = [
    { id: 'markov', label: 'Markov Data-Driven', badge: 'Algorithmic' },
    { id: 'first_touch', label: 'First-Touch' },
    { id: 'last_touch', label: 'Last-Touch' },
    { id: 'linear', label: 'Linear' },
    { id: 'time_decay', label: 'Time-Decay (7D)' },
    { id: 'position_based', label: 'Position (40/20/40)' },
  ];

  // Simulated elasticity prediction
  const estimatedLiftRoas = ((budgetShiftAmount * 0.00038) + 0.18).toFixed(2);
  const estimatedIncrementalRev = Math.round(budgetShiftAmount * 4.65);

  return (
    <div className="space-y-6">
      {/* Top Header & Attribution Model Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-semibold border border-purple-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              Algorithmic Shaper v4.2
            </span>
            <span className="text-xs text-slate-400 font-mono">Telemetry Window: 30D Rolling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Cross-Channel Attribution & Deep Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-0.5">
            Multi-touch path analysis weighted across cross-platform impression signals and real customer conversion lags.
          </p>
        </div>

        {/* Model Selector Tabs */}
        <div className="flex flex-wrap items-center bg-[#171f33] p-1.5 rounded-2xl border border-white/10 gap-1 shadow-lg">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedModel === m.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{m.label}</span>
              {m.badge && (
                <span className="text-[9px] bg-purple-400/30 text-purple-200 px-1.5 py-0.2 rounded font-mono">
                  {m.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Model Description Bar */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3 sm:p-4 text-xs text-blue-200 flex items-start gap-3">
        <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
        <div>
          <strong>{activeModelData.name}:</strong> {activeModelData.description}
        </div>
      </div>

      {/* Channel Attribution Share Matrix */}
      <section className="glass-panel rounded-2xl p-5 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart size={18} className="text-blue-400" />
              <span>Conversion & Revenue Credit Distribution</span>
            </h3>
            <p className="text-xs text-slate-400">
              Assigned value under selected model: <span className="text-white font-semibold">{activeModelData.name}</span>
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 self-start sm:self-auto">
            Total Analyzed: 3,842 Conversions
          </span>
        </div>

        {/* Share Distribution Visual Bars */}
        <div className="space-y-4">
          {activeModelData.channelShare.map((ch) => (
            <div key={ch.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{ch.name}</span>
                  <span className="text-slate-400 font-mono">({ch.percentage}%)</span>
                </div>
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-slate-300">{ch.conversions.toLocaleString()} orders</span>
                  <span className="text-emerald-400 font-bold">${ch.revenue.toLocaleString()}</span>
                </div>
              </div>
              <div className="w-full bg-[#0b1326] h-2.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    ch.id === 'google' 
                      ? 'bg-blue-500' 
                      : ch.id === 'meta' 
                      ? 'bg-indigo-500' 
                      : ch.id === 'tiktok' 
                      ? 'bg-teal-400' 
                      : ch.id === 'youtube' 
                      ? 'bg-red-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${ch.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Journey Paths & Multi-Touch Flow */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Common Multi-Touch Paths */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GitBranch size={18} className="text-purple-400" />
                  <span>High-Converting Multi-Touch Sequences</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Top omni-channel customer trajectories leading to verified purchases.
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                Touch Flow
              </span>
            </div>

            <div className="space-y-3">
              {sampleCustomerPaths.map((cp) => (
                <div 
                  key={cp.id}
                  className="rounded-xl bg-[#171f33] p-3.5 border border-white/5 hover:border-white/15 transition-all space-y-2"
                >
                  {/* Sequence Path Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {cp.path.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                          step === 'Purchase'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono'
                            : idx === 0
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-white/5 text-slate-300 border border-white/10'
                        }`}>
                          {step}
                        </span>
                        {idx < cp.path.length - 1 && (
                          <ArrowRight size={12} className="text-slate-500 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Path Stats */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-white/5 font-mono">
                    <span>
                      <strong className="text-white">{cp.conversions}</strong> transactions
                    </span>
                    <span>
                      Revenue: <strong className="text-emerald-400">${cp.revenue.toLocaleString()}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock size={12} />
                      {cp.avgLagDays}d avg time lag
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Average conversion touches: <strong className="text-white">3.4 touchpoints</strong>
            </span>
            <span className="text-purple-300 font-mono">68% multi-device crossover</span>
          </div>
        </div>

        {/* Right Col: Marginal ROAS & Elasticity Simulator */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders size={18} className="text-emerald-400" />
                <span>Elasticity Simulator</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Predictive
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Simulate shifting capital between networks to forecast marginal ROAS yield.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Budget Shift Volume: <span className="text-emerald-400 font-mono">${budgetShiftAmount.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={budgetShiftAmount}
                  onChange={(e) => setBudgetShiftAmount(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>$1,000</span>
                  <span>$10,000</span>
                  <span>$20,000</span>
                </div>
              </div>

              {/* Source & Target Dropdowns */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Shift From (Saturated)</span>
                  <select
                    value={shiftSource}
                    onChange={(e: any) => setShiftSource(e.target.value)}
                    className="w-full bg-[#171f33] border border-white/10 rounded-lg p-2 text-white font-medium"
                  >
                    <option value="meta">Meta Ads (Audience X)</option>
                    <option value="tiktok">TikTok Ads</option>
                    <option value="google">Google Ads</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block mb-1">Shift Into (High Yield)</span>
                  <select
                    value={shiftTarget}
                    onChange={(e: any) => setShiftTarget(e.target.value)}
                    className="w-full bg-[#171f33] border border-white/10 rounded-lg p-2 text-white font-medium"
                  >
                    <option value="google">Google PMax High-Intent</option>
                    <option value="tiktok">TikTok Spark Ads</option>
                    <option value="meta">Meta Retargeting</option>
                  </select>
                </div>
              </div>

              {/* Projected Outcome Card */}
              <div className="rounded-xl bg-gradient-to-br from-emerald-950/40 to-[#171f33] p-3.5 border border-emerald-500/30 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles size={12} />
                  Simulated Algorithmic Forecast
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-300">Projected Incremental Rev</span>
                  <span className="text-base font-black text-white font-mono">+${estimatedIncrementalRev.toLocaleString()}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-300">Expected Blended ROAS</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">+{estimatedLiftRoas}x Lift</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  Protects margin by dampening frequency burn on saturated channels.
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-center">
            <span className="text-[11px] text-slate-400">
              Confidence Score: <strong className="text-white font-mono">94.8%</strong> (Sample: 1.2M events)
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
