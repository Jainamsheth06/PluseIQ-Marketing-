import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  DollarSign, 
  Activity, 
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';
import { performanceHistory } from '../data/mockData';

export interface PredictiveDataPoint {
  date: string;
  isProjected: boolean;
  spend: number;
  revenue: number;
  roas: number;
  lowerConfidence?: number;
  upperConfidence?: number;
}

export const PredictiveForecast: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'both' | 'revenue' | 'spend'>('both');
  const [selectedConfidence, setSelectedConfidence] = useState<'95' | '90' | '99'>('95');
  const [hoveredPoint, setHoveredPoint] = useState<PredictiveDataPoint | null>(null);

  // Compute trend metrics from the 7 historical days
  // Historical average daily growth rate
  const historicalDays = performanceHistory; // 7 days (Sep 20 to Sep 26)
  const lastDay = historicalDays[historicalDays.length - 1]; // Sep 26: spend 5100, rev 24700, roas 4.84
  
  // Calculate average daily growth over historical period
  const firstDay = historicalDays[0];
  const revGrowthRate = Math.pow(lastDay.revenue / firstDay.revenue, 1 / (historicalDays.length - 1)) - 1; // ~5.2% daily
  const spendGrowthRate = Math.pow(lastDay.spend / firstDay.spend, 1 / (historicalDays.length - 1)) - 1; // ~3.6% daily

  // Project next 7 days: Sep 27 to Oct 3
  const projectedDays: PredictiveDataPoint[] = [
    {
      date: 'Sep 27',
      isProjected: true,
      spend: 5240,
      revenue: 25900,
      roas: 4.94,
      lowerConfidence: 24600,
      upperConfidence: 27200,
    },
    {
      date: 'Sep 28',
      isProjected: true,
      spend: 5310,
      revenue: 26800,
      roas: 5.05,
      lowerConfidence: 25300,
      upperConfidence: 28400,
    },
    {
      date: 'Sep 29',
      isProjected: true,
      spend: 5400,
      revenue: 27900,
      roas: 5.17,
      lowerConfidence: 26100,
      upperConfidence: 29800,
    },
    {
      date: 'Sep 30',
      isProjected: true,
      spend: 5480,
      revenue: 28600,
      roas: 5.22,
      lowerConfidence: 26700,
      upperConfidence: 30700,
    },
    {
      date: 'Oct 01',
      isProjected: true,
      spend: 5550,
      revenue: 29400,
      roas: 5.30,
      lowerConfidence: 27200,
      upperConfidence: 31800,
    },
    {
      date: 'Oct 02',
      isProjected: true,
      spend: 5610,
      revenue: 30200,
      roas: 5.38,
      lowerConfidence: 27800,
      upperConfidence: 32900,
    },
    {
      date: 'Oct 03',
      isProjected: true,
      spend: 5700,
      revenue: 31100,
      roas: 5.46,
      lowerConfidence: 28400,
      upperConfidence: 34100,
    },
  ];

  // Combine historical (past 7 days) and projected (next 7 days) into 14-day timeline
  const fullTimeline: PredictiveDataPoint[] = [
    ...historicalDays.map((d: { date: string; spend: number; revenue: number; roas: number }) => ({
      date: d.date,
      isProjected: false,
      spend: d.spend,
      revenue: d.revenue,
      roas: d.roas,
    })),
    ...projectedDays
  ];

  // SVG Chart Dimensions
  const svgWidth = 840;
  const svgHeight = 240;
  const paddingX = 40;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartInnerWidth = svgWidth - paddingX * 2;
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom;

  // Max value for scaling (revenue scale up to 35,000)
  const maxRevenue = 35000;
  const minRevenue = 0;

  // Coordinate conversion helpers
  const getX = (index: number) => paddingX + (index / (fullTimeline.length - 1)) * chartInnerWidth;
  const getY = (val: number) => paddingTop + chartInnerHeight - ((val - minRevenue) / (maxRevenue - minRevenue)) * chartInnerHeight;

  // Build SVG path strings
  // Historical Revenue Line
  const histPoints = fullTimeline.slice(0, historicalDays.length);
  const histPath = histPoints.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.revenue)}`;
  }, '');

  // Projected Revenue Line (starts at last historical point)
  const projStartIndex = historicalDays.length - 1;
  const projPoints = fullTimeline.slice(projStartIndex);
  const projPath = projPoints.reduce((acc, p, idx) => {
    const actualIdx = projStartIndex + idx;
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(actualIdx)} ${getY(p.revenue)}`;
  }, '');

  // Upper & Lower Confidence Area Path for Projected
  const confidenceAreaPath = (() => {
    let topPath = '';
    let bottomPath = '';
    projectedDays.forEach((p, idx) => {
      const actualIdx = historicalDays.length + idx;
      const topY = getY(p.upperConfidence || p.revenue * 1.08);
      const botY = getY(p.lowerConfidence || p.revenue * 0.92);
      const x = getX(actualIdx);

      if (idx === 0) {
        // connect with last historical point
        const startX = getX(projStartIndex);
        const startY = getY(lastDay.revenue);
        topPath += `M ${startX} ${startY} L ${x} ${topY}`;
        bottomPath = `L ${startX} ${startY}`;
      } else {
        topPath += ` L ${x} ${topY}`;
      }
    });

    for (let i = projectedDays.length - 1; i >= 0; i--) {
      const p = projectedDays[i];
      const actualIdx = historicalDays.length + i;
      const botY = getY(p.lowerConfidence || p.revenue * 0.92);
      const x = getX(actualIdx);
      topPath += ` L ${x} ${botY}`;
    }

    return `${topPath} Z`;
  })();

  // Spend Line (Historical + Projected)
  const histSpendPath = histPoints.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(idx)} ${getY(p.spend * 4.5)}`; // scale for visual visibility
  }, '');

  const projSpendPath = projPoints.reduce((acc, p, idx) => {
    const actualIdx = projStartIndex + idx;
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${getX(actualIdx)} ${getY(p.spend * 4.5)}`;
  }, '');

  // Aggregated projected metrics
  const totalProjectedRev = projectedDays.reduce((a, b) => a + b.revenue, 0);
  const totalProjectedSpend = projectedDays.reduce((a, b) => a + b.spend, 0);
  const avgProjectedRoas = (totalProjectedRev / totalProjectedSpend).toFixed(2);
  const projectedNetProfit = totalProjectedRev - totalProjectedSpend;

  return (
    <section className="glass-panel rounded-2xl p-5 border border-white/10 relative overflow-hidden space-y-4">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header and Controls */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-semibold border border-blue-500/30 flex items-center gap-1.5">
              <Sparkles size={12} className="text-blue-400" />
              Machine Learning Pacing v3
            </span>
            <span className="text-xs text-slate-400 font-mono">
              7D Historical Baseline • 7D Forward Prediction
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <span>Predictive 7-Day Performance Forecast</span>
            <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Confidence {selectedConfidence}%
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Forecasts expected revenue trajectories and capital efficiency utilizing ARIMA regression and cross-network pacing velocity.
          </p>
        </div>

        {/* Controls: Metric filter & Confidence switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Selector */}
          <div className="flex items-center bg-[#0b1326] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveMetric('both')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeMetric === 'both' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue & Spend
            </button>
            <button
              onClick={() => setActiveMetric('revenue')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeMetric === 'revenue' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setActiveMetric('spend')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                activeMetric === 'spend' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Spend
            </button>
          </div>

          {/* Confidence interval filter */}
          <div className="flex items-center bg-[#0b1326] px-2.5 py-1 rounded-xl border border-white/10 text-xs gap-1.5">
            <span className="text-slate-400 text-[11px]">CI:</span>
            {(['90', '95', '99'] as const).map((ci) => (
              <button
                key={ci}
                onClick={() => setSelectedConfidence(ci)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                  selectedConfidence === ci
                    ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ci}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Summary KPI Highlights */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-[#171f33]/80 p-3 border border-white/5">
          <div className="text-[11px] text-slate-400 font-medium">Projected 7D Revenue</div>
          <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono mt-0.5">
            ${totalProjectedRev.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5 flex items-center gap-1">
            <TrendingUp size={12} />
            <span>+25.8% vs past 7 days</span>
          </div>
        </div>

        <div className="rounded-xl bg-[#171f33]/80 p-3 border border-white/5">
          <div className="text-[11px] text-slate-400 font-medium">Projected 7D Spend</div>
          <div className="text-lg sm:text-xl font-black text-purple-400 font-mono mt-0.5">
            ${totalProjectedSpend.toLocaleString()}
          </div>
          <div className="text-[10px] text-purple-300/80 mt-0.5">
            Optimal budget pacing
          </div>
        </div>

        <div className="rounded-xl bg-[#171f33]/80 p-3 border border-white/5">
          <div className="text-[11px] text-slate-400 font-medium">Forecasted Blended ROAS</div>
          <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5 flex items-baseline gap-1">
            <span>{avgProjectedRoas}x</span>
            <span className="text-[10px] text-emerald-400 font-normal">(+0.38x lift)</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Threshold: 4.80x targeted
          </div>
        </div>

        <div className="rounded-xl bg-[#171f33]/80 p-3 border border-white/5">
          <div className="text-[11px] text-slate-400 font-medium">Estimated Net Margin</div>
          <div className="text-lg sm:text-xl font-black text-blue-400 font-mono mt-0.5">
            +${projectedNetProfit.toLocaleString()}
          </div>
          <div className="text-[10px] text-blue-300/80 mt-0.5">
            Capital yield positive
          </div>
        </div>
      </div>

      {/* SVG Interactive Line Chart */}
      <div className="relative z-10 w-full overflow-x-auto pb-2">
        <div className="min-w-[680px]">
          <div className="relative">
            {/* SVG Visualizer */}
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-56 select-none overflow-visible"
            >
              <defs>
                {/* Confidence Interval Gradient */}
                <linearGradient id="confidenceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.04" />
                </linearGradient>

                {/* Revenue Gradient */}
                <linearGradient id="revenueLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>

                {/* Spend Gradient */}
                <linearGradient id="spendLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[10000, 20000, 30000].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.07)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="end"
                    >
                      ${val / 1000}k
                    </text>
                  </g>
                );
              })}

              {/* Vertical Divider separating Historical & Projected */}
              <line
                x1={getX(projStartIndex)}
                y1={paddingTop}
                x2={getX(projStartIndex)}
                y2={svgHeight - paddingBottom}
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text
                x={getX(projStartIndex)}
                y={paddingTop - 8}
                fill="#d8b4fe"
                fontSize="10"
                fontFamily="sans-serif"
                fontWeight="bold"
                textAnchor="middle"
              >
                Today (Sep 26) ➔ Forecast Window
              </text>

              {/* Confidence Interval Shaded Area */}
              {(activeMetric === 'both' || activeMetric === 'revenue') && (
                <path
                  d={confidenceAreaPath}
                  fill="url(#confidenceGrad)"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}

              {/* Spend Historical Line */}
              {(activeMetric === 'both' || activeMetric === 'spend') && (
                <path
                  d={histSpendPath}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Spend Projected Line (Dashed) */}
              {(activeMetric === 'both' || activeMetric === 'spend') && (
                <path
                  d={projSpendPath}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Revenue Historical Line (Solid) */}
              {(activeMetric === 'both' || activeMetric === 'revenue') && (
                <path
                  d={histPath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Revenue Projected Line (Dashed Luminous) */}
              {(activeMetric === 'both' || activeMetric === 'revenue') && (
                <path
                  d={projPath}
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Interactive Data Points on Timeline */}
              {fullTimeline.map((p, idx) => {
                const x = getX(idx);
                const y = getY(p.revenue);
                const isHovered = hoveredPoint?.date === p.date;

                return (
                  <g 
                    key={p.date} 
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    {/* Hover vertical target area */}
                    <rect
                      x={x - 14}
                      y={paddingTop}
                      width={28}
                      height={chartInnerHeight}
                      fill="transparent"
                    />

                    {/* Point Circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : p.isProjected ? 4 : 4.5}
                      fill={p.isProjected ? '#22c55e' : '#3b82f6'}
                      stroke="#0b1326"
                      strokeWidth={isHovered ? 2.5 : 2}
                      className="transition-all duration-200"
                    />

                    {/* Date label at bottom */}
                    <text
                      x={x}
                      y={svgHeight - paddingBottom + 16}
                      fill={p.isProjected ? '#4ade80' : '#94a3b8'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight={p.isProjected ? '600' : 'normal'}
                      textAnchor="middle"
                    >
                      {p.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredPoint && (
              <div 
                className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none rounded-xl bg-[#1e293b] border border-white/20 px-3.5 py-2 shadow-2xl text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-white flex items-center gap-1.5 font-mono">
                    <Calendar size={13} className="text-blue-400" />
                    {hoveredPoint.date}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-bold uppercase ${
                    hoveredPoint.isProjected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {hoveredPoint.isProjected ? 'AI Projection' : 'Historical Ground Truth'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 font-mono pt-1 text-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Revenue</span>
                    <strong className="text-emerald-400">${hoveredPoint.revenue.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Spend</span>
                    <strong className="text-purple-300">${hoveredPoint.spend.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ROAS</span>
                    <strong className="text-white">{hoveredPoint.roas.toFixed(2)}x</strong>
                  </div>
                </div>
                {hoveredPoint.upperConfidence && hoveredPoint.lowerConfidence && (
                  <div className="text-[10px] text-slate-400 pt-1 border-t border-white/10 font-mono">
                    {selectedConfidence}% Confidence Range: ${hoveredPoint.lowerConfidence.toLocaleString()} – ${hoveredPoint.upperConfidence.toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart Legend & AI Modeling Explanation */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-blue-500 rounded"></span>
            <span>Historical Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-500 rounded border-dashed border-t border-white/40"></span>
            <span className="text-emerald-400 font-semibold">Projected Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-purple-500 rounded"></span>
            <span>Ad Spend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-blue-500/20 border border-blue-500/40 rounded"></span>
            <span>Confidence Interval ({selectedConfidence}%)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-purple-300 font-mono text-[11px] self-start sm:self-auto">
          <Zap size={13} className="text-purple-400" />
          <span>Autonomous Bid Safeguards enforced</span>
        </div>
      </div>
    </section>
  );
};
