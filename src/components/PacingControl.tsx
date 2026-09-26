import React, { useState } from 'react';
import { 
  Gauge, 
  AlertTriangle, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingDown, 
  Clock, 
  Zap, 
  Info,
  DollarSign,
  Flame,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Campaign } from '../types';

export type PacingPeriod = 'daily' | 'weekly' | 'monthly';

export interface PacingControlProps {
  campaigns: Campaign[];
  onTriggerSlowDown?: (period: PacingPeriod, limit: number) => void;
}

export const PacingControl: React.FC<PacingControlProps> = ({
  campaigns,
  onTriggerSlowDown,
}) => {
  const [period, setPeriod] = useState<PacingPeriod>('daily');
  
  // Configurable Caps for each period
  const [caps, setCaps] = useState<Record<PacingPeriod, number>>({
    daily: 2200,      // Daily cap $2,200
    weekly: 14500,    // Weekly cap $14,500
    monthly: 58000,   // Monthly cap $58,000
  });

  // Automated Slow-Down Threshold (%)
  const [warningThreshold, setWarningThreshold] = useState<number>(85); // 85% threshold
  const [autoSlowDownEnabled, setAutoSlowDownEnabled] = useState<boolean>(true);
  const [isSlowDownApplied, setIsSlowDownApplied] = useState<boolean>(false);

  // Compute Current Spend pacing
  // Active daily budget sum
  const activeDailyBudget = campaigns.reduce((acc, c) => c.status === 'active' ? acc + c.dailyBudget : acc, 0); // e.g. ~1890
  // Total spend recorded in current rolling 30d window
  const totalCampaignSpend = campaigns.reduce((acc, c) => acc + c.spend, 0); // ~$24,620

  // Calculate simulated spend for each period based on current pacing
  const currentSpendByPeriod: Record<PacingPeriod, number> = {
    daily: Math.round(activeDailyBudget * 0.94), // ~$1,776 today
    weekly: Math.round(activeDailyBudget * 7 * 0.96), // ~$12,700
    monthly: totalCampaignSpend, // ~$24,620 or scaled
  };

  const currentCap = caps[period];
  const currentSpend = isSlowDownApplied 
    ? Math.round(currentSpendByPeriod[period] * 0.82) 
    : currentSpendByPeriod[period];

  const utilizationPercent = Math.min(Math.round((currentSpend / currentCap) * 100), 100);
  const isApproachingLimit = utilizationPercent >= warningThreshold;
  const isOverLimit = currentSpend >= currentCap;

  const handleApplySlowDown = () => {
    setIsSlowDownApplied(true);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.65 },
    });
    if (onTriggerSlowDown) {
      onTriggerSlowDown(period, currentCap);
    }
  };

  const handleUpdateCap = (newVal: number) => {
    if (newVal > 0) {
      setCaps({
        ...caps,
        [period]: newVal,
      });
    }
  };

  return (
    <section className="glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden space-y-4">
      {/* Background Ambient Glow */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
        isOverLimit 
          ? 'bg-red-600/15' 
          : isApproachingLimit 
          ? 'bg-amber-500/15' 
          : 'bg-blue-600/10'
      }`}></div>

      {/* Top Header & Period Selector */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-semibold border border-blue-500/30 flex items-center gap-1.5">
              <Gauge size={12} className="text-blue-400" />
              Pacing Governance Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Autonomous Spend Cap & Burn Limiter
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Spend Cap Pacing Controls</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
              isOverLimit 
                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                : isApproachingLimit 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isOverLimit ? 'Cap Exceeded' : isApproachingLimit ? 'Approaching Limit' : 'Pacing Normal'}
            </span>
          </h3>
        </div>

        {/* Period Selector Tabs: Daily / Weekly / Monthly */}
        <div className="flex items-center bg-[#0b1326] p-1 rounded-xl border border-white/10 text-xs self-start sm:self-auto shadow-inner">
          {(['daily', 'weekly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPeriod(p);
                setIsSlowDownApplied(false);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                period === p
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Approaching Limit Slow-Down Alert Banner */}
      {isApproachingLimit && (
        <div className={`relative z-10 rounded-xl p-3.5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isSlowDownApplied 
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
            : isOverLimit
            ? 'bg-red-950/40 border-red-500/40 text-red-200'
            : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
        }`}>
          <div className="flex items-start sm:items-center gap-3">
            <div className={`p-2 rounded-lg shrink-0 ${
              isSlowDownApplied 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : isOverLimit 
                ? 'bg-red-500/20 text-red-400 animate-pulse' 
                : 'bg-amber-500/20 text-amber-400 animate-pulse'
            }`}>
              {isSlowDownApplied ? (
                <CheckCircle2 size={18} />
              ) : isOverLimit ? (
                <ShieldAlert size={18} />
              ) : (
                <AlertTriangle size={18} />
              )}
            </div>

            <div>
              <div className="text-xs font-bold flex items-center gap-2">
                <span>
                  {isSlowDownApplied 
                    ? 'Automated Slow-Down In Effect' 
                    : isOverLimit 
                    ? `Warning: ${period.toUpperCase()} Spend Cap Exceeded (${utilizationPercent}%)` 
                    : `Approaching ${period.toUpperCase()} Spend Limit (${utilizationPercent}%)`}
                </span>
                <span className="text-[10px] font-mono opacity-80">
                  Threshold: {warningThreshold}%
                </span>
              </div>
              <p className="text-[11px] opacity-90 mt-0.5">
                {isSlowDownApplied
                  ? 'Autonomous throttler dampened low-yield impression bids by -18% to preserve capital until reset.'
                  : `Current pacing has consumed $${currentSpend.toLocaleString()} of your $${currentCap.toLocaleString()} ${period} cap. Initiate slow-down to avert budget exhaustion.`}
              </p>
            </div>
          </div>

          {!isSlowDownApplied && (
            <button
              onClick={handleApplySlowDown}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-lg shrink-0 transition-all active:scale-95 ${
                isOverLimit
                  ? 'bg-red-600 hover:bg-red-500 shadow-red-950/40'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/40'
              }`}
            >
              <Zap size={14} />
              <span>Throttle & Slow Down</span>
            </button>
          )}
        </div>
      )}

      {/* Progress Bar & Metric Stats */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-baseline justify-between text-xs">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-white text-sm sm:text-base font-mono">
              ${currentSpend.toLocaleString()}
            </span>
            <span className="text-slate-400 font-mono">
              spent / <strong className="text-slate-200">${currentCap.toLocaleString()}</strong> limit
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className={`font-bold ${
              isOverLimit ? 'text-red-400' : isApproachingLimit ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {utilizationPercent}% Consumed
            </span>
            <span className="text-slate-500 text-[11px]">
              (${Math.max(0, currentCap - currentSpend).toLocaleString()} headroom)
            </span>
          </div>
        </div>

        {/* Visual Progress Bar with Threshold Marker */}
        <div className="relative w-full bg-[#0b1326] h-3.5 rounded-full overflow-hidden border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverLimit
                ? 'bg-gradient-to-r from-red-600 to-rose-500'
                : isApproachingLimit
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : 'bg-gradient-to-r from-blue-600 to-emerald-400'
            }`}
            style={{ width: `${utilizationPercent}%` }}
          ></div>

          {/* Threshold indicator line */}
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-white/70 shadow-sm"
            style={{ left: `${warningThreshold}%` }}
            title={`Slow-Down Alert Threshold: ${warningThreshold}%`}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>0%</span>
          <span className="text-amber-400 font-semibold">Slow-Down Trigger: {warningThreshold}%</span>
          <span>100% Cap</span>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/5 text-xs">
        {/* Control 1: Set Cap Limit */}
        <div className="rounded-xl bg-[#0b1326] p-3 border border-white/5 space-y-1.5">
          <label className="text-[11px] text-slate-400 font-semibold block capitalize">
            {period} Spend Cap ($)
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">$</span>
              <input
                type="number"
                min="100"
                step="50"
                value={currentCap}
                onChange={(e) => handleUpdateCap(Number(e.target.value))}
                className="w-full bg-[#171f33] pl-6 pr-2 py-1.5 rounded-lg text-white font-mono border border-white/10 text-xs focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Control 2: Warning Threshold Slider */}
        <div className="rounded-xl bg-[#0b1326] p-3 border border-white/5 space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400 font-semibold">Slow-Down Alert Level</span>
            <span className="text-white font-mono font-bold">{warningThreshold}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            step="5"
            value={warningThreshold}
            onChange={(e) => setWarningThreshold(Number(e.target.value))}
            className="w-full accent-blue-500 cursor-pointer mt-1"
          />
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>60%</span>
            <span>75%</span>
            <span>90%</span>
            <span>95%</span>
          </div>
        </div>

        {/* Control 3: Autonomous Throttle Toggle */}
        <div className="rounded-xl bg-[#0b1326] p-3 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-semibold">Autonomous Pacing Guard</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
              autoSlowDownEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
            }`}>
              {autoSlowDownEnabled ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight mt-1">
            Auto-throttles bidding velocity across Meta, Google & TikTok when threshold is reached.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-300 font-medium">Auto-Rebalance Bids</span>
            <button
              onClick={() => setAutoSlowDownEnabled(!autoSlowDownEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                autoSlowDownEnabled ? 'bg-blue-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                  autoSlowDownEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
