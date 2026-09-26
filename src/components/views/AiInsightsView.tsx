import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Flame, 
  Layers, 
  Bot, 
  DollarSign, 
  Cpu, 
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AiRecommendation } from '../../types';

interface AiInsightsViewProps {
  recommendations: AiRecommendation[];
  onApplyRecommendation: (id: string) => void;
  onApplyAll: () => void;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({
  recommendations,
  onApplyRecommendation,
  onApplyAll,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critical' | 'growth' | 'creative'>('all');
  const [sandboxPrompt, setSandboxPrompt] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  const filteredRecs = recommendations.filter((r) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'critical') return r.severity === 'critical';
    if (selectedFilter === 'growth') return r.category === 'growth' || r.category === 'keyword';
    if (selectedFilter === 'creative') return r.category === 'creative';
    return true;
  });

  const appliedCount = recommendations.filter((r) => r.applied).length;
  const unappliedCount = recommendations.length - appliedCount;

  const handleApplyAllWithConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b']
    });
    onApplyAll();
  };

  const handleRunSimulation = (promptText?: string) => {
    const textToSimulate = promptText || sandboxPrompt;
    if (!textToSimulate.trim()) return;

    setIsSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setIsSimulating(false);
      if (textToSimulate.toLowerCase().includes('meta') || textToSimulate.toLowerCase().includes('tiktok')) {
        setSimulationResult(
          'Simulated Outcome: Shifting $5,000 from Meta Audience X into TikTok Spark Ads decreases blended CPA from $8.74 to $7.82 (-10.5%). Incremental volume forecast: +320 conversions over 30 days with no frequency penalty.'
        );
      } else if (textToSimulate.toLowerCase().includes('5.0') || textToSimulate.toLowerCase().includes('roas')) {
        setSimulationResult(
          'Simulated Outcome: To reach 5.0x portfolio ROAS, pull $2,800/week from low-converting Non-Brand Generic terms (current ROAS 2.1x) and concentrate bid weight into Brand Defense and Catalog Retargeting. Overall revenue remains steady ($142k) while net margin expands by +$6,100.'
        );
      } else {
        setSimulationResult(
          `Simulated Outcome for "${textToSimulate}": Neural model projects an estimated +0.32x ROAS lift with a 92% confidence index. Pacing risk is rated LOW across current bidding windows.`
        );
      }
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Batch Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-semibold border border-purple-500/30 flex items-center gap-1.5">
              <Sparkles size={12} className="text-purple-400" />
              Autonomous Engine Active
            </span>
            <span className="text-xs text-slate-400 font-mono">Neural Model: PulseIQ-Orchestrator-v3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            AI Insights & Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time algorithmic prescriptions, capital protection, and revenue growth discoveries.
          </p>
        </div>

        {/* Batch Optimize CTA */}
        {unappliedCount > 0 ? (
          <button
            onClick={handleApplyAllWithConfetti}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl shadow-purple-950/40 hover:brightness-110 active:scale-95 transition-all self-start sm:self-auto"
          >
            <Zap size={16} className="text-amber-300" />
            <span>Apply All {unappliedCount} Safeguards</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-semibold self-start sm:self-auto">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>All Interventions Executed</span>
          </div>
        )}
      </div>

      {/* High-Level Impact Telemetry Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
            <Flame size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Preventable Capital Bleed</div>
            <div className="text-xl font-black text-white font-mono">$6,420<span className="text-xs text-slate-500 font-normal">/mo</span></div>
            <div className="text-[10px] text-red-400">Audience X saturation penalty</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Unlocked Growth Headroom</div>
            <div className="text-xl font-black text-white font-mono">+$28,400<span className="text-xs text-slate-500 font-normal">/mo</span></div>
            <div className="text-[10px] text-emerald-400">High-intent intent clusters</div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <Bot size={20} />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Autonomous Actions</div>
            <div className="text-xl font-black text-white font-mono">{appliedCount} of {recommendations.length} Active</div>
            <div className="text-[10px] text-purple-300">Continuous telemetry scan</div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
        {[
          { id: 'all', label: 'All Interventions' },
          { id: 'critical', label: 'Critical Bleed Safeguards' },
          { id: 'growth', label: 'Growth & Intent Scale' },
          { id: 'creative', label: 'Creative Fatigue' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedFilter === tab.id
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#171f33] text-slate-400 hover:text-white border border-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className={`glass-panel rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
              rec.applied 
                ? 'border-emerald-500/30 bg-emerald-950/10' 
                : rec.severity === 'critical'
                ? 'border-red-500/40 hover:border-red-500/60 shadow-lg shadow-red-950/10'
                : 'border-white/10 hover:border-purple-500/40'
            }`}
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono ${
                    rec.severity === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : rec.severity === 'high'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {rec.severity}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize font-medium bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    {rec.platform} Ads
                  </span>
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  {rec.timestamp}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-white leading-snug">
                {rec.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {rec.description}
              </p>

              {/* Impact Comparison Box */}
              <div className="mt-4 rounded-xl bg-[#0b1326] p-3 border border-white/5 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[10px] text-slate-500">Current Pacing</div>
                  <div className="font-mono text-slate-300 font-bold mt-0.5">{rec.metrics.current}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">{rec.metrics.impactLabel}</div>
                  <div className="font-mono text-emerald-400 font-black mt-0.5">{rec.metrics.impactValue}</div>
                </div>
              </div>
            </div>

            {/* Bottom Action CTA */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 truncate">
                {rec.applied ? 'Automated Rule Running' : 'Ready to execute'}
              </span>

              {rec.applied ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 size={14} />
                  <span>Safeguard Active</span>
                </div>
              ) : (
                <button
                  onClick={() => {
                    confetti({ particleCount: 30, spread: 40 });
                    onApplyRecommendation(rec.id);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95 shadow-md ${
                    rec.severity === 'critical'
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-950/40'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:brightness-110 shadow-purple-950/40'
                  }`}
                >
                  <Zap size={14} />
                  <span>Execute Optimization</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Scenario Simulation Sandbox */}
      <section className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <Cpu size={18} className="text-purple-400" />
          <h3 className="text-base font-bold text-white">
            What-If Scenario Simulation Sandbox
          </h3>
          <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
            Interactive
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Test strategic reallocations and budget shifts before executing live across your ad accounts.
        </p>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            'Shift $5,000 from Meta Audience X into TikTok Spark Ads',
            'How to reach 5.0x portfolio ROAS without sacrificing volume?',
            'What happens if Google PMax budget is scaled +35%?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setSandboxPrompt(prompt);
                handleRunSimulation(prompt);
              }}
              className="text-left text-xs bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 transition-all"
            >
              "{prompt}"
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your what-if scenario (e.g., 'Rebalance $3,000 from YouTube to Google Search')..."
            value={sandboxPrompt}
            onChange={(e) => setSandboxPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRunSimulation()}
            className="flex-1 rounded-xl bg-[#0b1326] px-4 py-2.5 text-xs text-white placeholder-slate-500 border border-white/10 focus:border-purple-500 focus:outline-none"
          />
          <button
            onClick={() => handleRunSimulation()}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shrink-0"
          >
            {isSimulating ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <Send size={14} />
            )}
            <span>Simulate</span>
          </button>
        </div>

        {/* Result Output */}
        {simulationResult && (
          <div className="mt-4 rounded-xl bg-[#171f33] p-4 border border-purple-500/30 text-xs text-slate-200 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <Sparkles size={14} />
              <span>Predictive Intelligence Forecast</span>
            </div>
            <p className="leading-relaxed">{simulationResult}</p>
          </div>
        )}
      </section>
    </div>
  );
};
