import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  ShoppingCart, 
  AlertTriangle, 
  ArrowUpRight, 
  ChevronRight, 
  Layers, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  Zap,
  Sparkles,
  BarChart2,
  Download,
  FileText,
  Printer,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';
import { TimeRange, ChannelPerformance, Campaign } from '../../types';
import { performanceHistory } from '../../data/mockData';
import { PredictiveForecast } from '../PredictiveForecast';
import { 
  generateStakeholderReportPdf, 
  downloadReportAsFile, 
  downloadReportCsv 
} from '../../utils/generatePdfReport';

interface OverviewViewProps {
  channels: ChannelPerformance[];
  campaigns: Campaign[];
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  onNavigateTab: (tab: any) => void;
  onAutoFixBleed: () => void;
  isBleedFixed: boolean;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  channels,
  campaigns,
  timeRange,
  setTimeRange,
  onNavigateTab,
  onAutoFixBleed,
  isBleedFixed,
}) => {
  const [selectedChartMetric, setSelectedChartMetric] = useState<'revenue' | 'spend' | 'roas'>('revenue');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const notifyExport = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Multiplier for time range calculations
  const multiplier = timeRange === '24h' ? 0.05 : timeRange === '7d' ? 0.35 : timeRange === 'qtd' ? 2.8 : timeRange === 'ytd' ? 10.5 : 1.0;

  const totalSpend = Math.round(channels.reduce((acc, c) => acc + c.spend, 0) * multiplier);
  const totalRevenue = Math.round(channels.reduce((acc, c) => acc + c.revenue, 0) * multiplier);
  const totalConversions = Math.round(channels.reduce((acc, c) => acc + c.conversions, 0) * multiplier);
  const blendedRoas = (totalRevenue / (totalSpend || 1)).toFixed(2);
  const blendedCpa = (totalSpend / (totalConversions || 1)).toFixed(2);
  const aov = (totalRevenue / (totalConversions || 1)).toFixed(2);

  const timeFilterOptions: { id: TimeRange; label: string }[] = [
    { id: '24h', label: '24H' },
    { id: '7d', label: '7D' },
    { id: '30d', label: '30D' },
    { id: 'qtd', label: 'QTD' },
    { id: 'ytd', label: 'YTD' },
  ];

  return (
    <div className="space-y-6">
      {/* Context Bar & Segmented Time Filter */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span>Portfolio Intelligence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span className="text-slate-400">Telemetry Pacing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
            Marketing Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Cross-platform multi-channel performance, decoded in real-time.
          </p>
        </div>

        {/* Header Actions: Time Filter Pills & Download PDF Report Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Time Filter Pills */}
          <div className="flex items-center bg-[#171f33] p-1 rounded-xl border border-white/10">
            {timeFilterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTimeRange(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  timeRange === opt.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Download Report Multi-Action Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-950/40 border border-white/10 transition-all group"
              title="Download or print an executive stakeholder report"
            >
              <Download size={15} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>Export Report</span>
              <ChevronDown size={13} className={`text-blue-200 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#171f33] border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-white/5">
                  <div className="text-xs font-bold text-white">Executive Export</div>
                  <div className="text-[10px] text-slate-400">Choose format for stakeholders</div>
                </div>

                <div className="py-1 space-y-1">
                  {/* Option 1: Direct File Download (HTML format - 100% reliable inside any iframe/browser) */}
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      downloadReportAsFile({
                        timeRange,
                        channels,
                        campaigns,
                        totalRevenue,
                        totalSpend,
                        blendedRoas,
                        totalConversions,
                        blendedCpa,
                        aov,
                        isBleedFixed,
                      });
                      notifyExport('Report file downloaded! Open it in any browser to view or print as PDF.');
                    }}
                    className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-white/5 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 shrink-0 mt-0.5">
                      <FileText size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Download PDF / HTML Report</div>
                      <div className="text-[10px] text-slate-400">Formatted executive brief ready for print or saving</div>
                    </div>
                  </button>

                  {/* Option 2: Print Dialog */}
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      generateStakeholderReportPdf({
                        timeRange,
                        channels,
                        campaigns,
                        totalRevenue,
                        totalSpend,
                        blendedRoas,
                        totalConversions,
                        blendedCpa,
                        aov,
                        isBleedFixed,
                      });
                      notifyExport('Print dialog triggered. If blocked by browser, use Download option.');
                    }}
                    className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-white/5 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 shrink-0 mt-0.5">
                      <Printer size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Direct Print / Save as PDF</div>
                      <div className="text-[10px] text-slate-400">Triggers system browser print menu</div>
                    </div>
                  </button>

                  {/* Option 3: CSV Spreadsheet Export */}
                  <button
                    onClick={() => {
                      setIsExportMenuOpen(false);
                      downloadReportCsv({
                        timeRange,
                        channels,
                        campaigns,
                        totalRevenue,
                        totalSpend,
                        blendedRoas,
                        totalConversions,
                        blendedCpa,
                        aov,
                        isBleedFixed,
                      });
                      notifyExport('CSV dataset exported! Compatible with Excel and Google Sheets.');
                    }}
                    className="w-full flex items-start gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-white/5 transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30 shrink-0 mt-0.5">
                      <FileSpreadsheet size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Export CSV Spreadsheet</div>
                      <div className="text-[10px] text-slate-400">Raw telemetry, channel metrics, and campaign KPIs</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Export Feedback Toast Banner */}
      {exportNotice && (
        <div className="rounded-xl bg-blue-950/80 border border-blue-500/40 p-3 flex items-center justify-between gap-3 text-xs text-blue-200 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button 
            onClick={() => setExportNotice(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded"
          >
            ✕
          </button>
        </div>
      )}

      {/* Critical Bleed Alert Banner (Matched from Stitch screen 7 & 5) */}
      {!isBleedFixed ? (
        <div className="relative overflow-hidden rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/70 via-[#1e1724]/90 to-[#171f33] p-4 sm:p-5 shadow-xl shadow-red-950/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-400 ring-1 ring-red-500/30">
                <AlertTriangle size={22} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    High Capital Inefficiency Alert
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                    $6,420 Bleed
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  Your Meta Ads are bleeding money on Audience X
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Audience X CPA surged to <span className="text-red-300 font-semibold font-mono">$48.20</span> (target $18.50) due to 4.8x saturation. 
                  Recommended action: Auto-pause audience & redistribute into Google PMax SKU tier 1.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center shrink-0">
              <button
                onClick={onAutoFixBleed}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-red-950/50 transition-all active:scale-95"
              >
                <Zap size={14} />
                <span>Auto-Pause Audience X</span>
              </button>
              <button
                onClick={() => onNavigateTab('insights')}
                className="hidden sm:flex items-center gap-1 rounded-xl bg-white/5 hover:bg-white/10 px-3 py-2.5 text-xs font-semibold text-slate-300 transition-all border border-white/10"
              >
                <span>Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 sm:p-4 text-xs text-emerald-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>
              <strong>Safeguard Applied:</strong> Audience segment X was automatically paused. Rebalancing $240/day into top-performing Google PMax.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80">Saved ~$6,420/mo</span>
        </div>
      )}

      {/* Core KPI Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Metric 1: Revenue */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Blended Revenue</span>
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            ${totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <TrendingUp size={14} />
            <span>+18.4%</span>
            <span className="text-[10px] text-slate-500 font-normal">vs prev period</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-60"></div>
        </div>

        {/* Metric 2: ROAS */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Blended ROAS</span>
            <div className="p-1 rounded-lg bg-blue-500/10 text-blue-400">
              <Percent size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight flex items-baseline gap-1">
            <span>{blendedRoas}x</span>
            <span className="text-[11px] font-normal text-slate-500">/ 4.80x goal</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-blue-400">
            <TrendingUp size={14} />
            <span>+12.1%</span>
            <span className="text-[10px] text-slate-500 font-normal">efficiency</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-60"></div>
        </div>

        {/* Metric 3: Total Spend */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Ad Spend</span>
            <div className="p-1 rounded-lg bg-purple-500/10 text-purple-400">
              <BarChart2 size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            ${totalSpend.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-purple-400">
            <TrendingDown size={14} />
            <span>-4.2%</span>
            <span className="text-[10px] text-slate-500 font-normal">pacing controlled</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-60"></div>
        </div>

        {/* Metric 4: Conversions */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Conversions</span>
            <div className="p-1 rounded-lg bg-teal-500/10 text-teal-400">
              <ShoppingCart size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            {totalConversions.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-teal-400">
            <TrendingUp size={14} />
            <span>+9.8%</span>
            <span className="text-[10px] text-slate-500 font-normal">attributed</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-400 opacity-60"></div>
        </div>

        {/* Metric 5: Blended CPA */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Blended CPA</span>
            <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            ${blendedCpa}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-400">
            <TrendingDown size={14} />
            <span>-7.2%</span>
            <span className="text-[10px] text-slate-500 font-normal">cheaper CPA</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 opacity-60"></div>
        </div>

        {/* Metric 6: Avg Order Value */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Average Order (AOV)</span>
            <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-400">
              <DollarSign size={14} />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
            ${aov}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-indigo-400">
            <TrendingUp size={14} />
            <span>+3.5%</span>
            <span className="text-[10px] text-slate-500 font-normal">basket size</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-400 opacity-60"></div>
        </div>
      </section>

      {/* Main Charts & Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue vs Spend Trend Chart */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Revenue & Spend Pacing Telemetry</span>
                  <span className="text-[11px] font-mono font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Live Stream
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daily pacing across all 6 connected ad networks and retention engines.
                </p>
              </div>

              {/* Metric Selector Tabs */}
              <div className="flex items-center bg-[#0b1326] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setSelectedChartMetric('revenue')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    selectedChartMetric === 'revenue' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setSelectedChartMetric('spend')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    selectedChartMetric === 'spend' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Spend
                </button>
                <button
                  onClick={() => setSelectedChartMetric('roas')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    selectedChartMetric === 'roas' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ROAS
                </button>
              </div>
            </div>

            {/* Custom Interactive SVG Visualizer */}
            <div className="relative h-64 w-full mt-4 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-white/10">
              {performanceHistory.map((item, idx) => {
                const maxRev = 26000;
                const revHeight = (item.revenue / maxRev) * 100;
                const spendHeight = (item.spend / 6000) * 100;
                const isSelected = selectedChartMetric === 'revenue';

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-[#1e293b] border border-white/20 rounded-lg px-2.5 py-1 text-[11px] shadow-2xl pointer-events-none whitespace-nowrap">
                      <span className="font-bold text-white font-mono">${item.revenue.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400">Spend: ${item.spend} • {item.roas}x ROAS</span>
                    </div>

                    {/* Bars comparison */}
                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${revHeight}%` }}
                        className={`w-3 sm:w-5 rounded-t-md transition-all duration-300 group-hover:brightness-125 ${
                          selectedChartMetric === 'revenue' 
                            ? 'bg-gradient-to-t from-blue-600 to-indigo-400 shadow-lg shadow-blue-900/40' 
                            : 'bg-blue-600/40'
                        }`}
                      ></div>

                      {/* Spend Bar */}
                      <div
                        style={{ height: `${spendHeight}%` }}
                        className={`w-2.5 sm:w-4 rounded-t-md transition-all duration-300 group-hover:brightness-125 ${
                          selectedChartMetric === 'spend'
                            ? 'bg-gradient-to-t from-purple-600 to-pink-400 shadow-lg shadow-purple-900/40'
                            : 'bg-purple-600/30'
                        }`}
                      ></div>
                    </div>

                    <span className="text-[10px] sm:text-xs font-mono text-slate-400 mt-2 truncate">
                      {item.date}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend & Summary Info */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 mt-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-500"></div>
                  <span>Net Revenue Generated</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-purple-500"></div>
                  <span>Ad Spend Incurred</span>
                </div>
              </div>
              <div className="font-mono text-emerald-400 text-[11px]">
                Avg Efficiency: 4.60x ROAS
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Autonomous bid adjustments executed today: <strong className="text-white">18 bids tuned</strong>
            </span>
            <button
              onClick={() => onNavigateTab('campaigns')}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>Manage Campaigns</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Col: Conversion Funnel Visualizer */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Unified Growth Funnel</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                Full-Funnel
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Aggregate conversion progression through discovery to transaction.
            </p>

            {/* Funnel Steps */}
            <div className="space-y-3">
              {[
                { label: 'Top-of-Funnel Impressions', value: '1.24M', drop: '100%', pct: 100, color: 'bg-blue-500' },
                { label: 'Qualified Ad Clicks (CTR 3.4%)', value: '84,200', drop: '6.8% CTR', pct: 68, color: 'bg-indigo-500' },
                { label: 'Add to Cart Sessions', value: '18,540', drop: '22.0%', pct: 45, color: 'bg-purple-500' },
                { label: 'Checkout Initiated', value: '7,210', drop: '38.9%', pct: 28, color: 'bg-fuchsia-500' },
                { label: 'Completed Purchases', value: '3,842', drop: '53.3% CVR', pct: 18, color: 'bg-emerald-500' },
              ].map((step, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{step.label}</span>
                    <span className="font-mono text-white font-bold">{step.value}</span>
                  </div>
                  <div className="w-full bg-[#0b1326] h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className={`h-full rounded-full ${step.color} transition-all duration-500`}
                      style={{ width: `${step.pct}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right font-mono">
                    Conversion Rate: {step.drop}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-center">
            <span className="text-[11px] text-slate-400">
              Blended Funnel Velocity: <strong className="text-white">2.8 days avg to purchase</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 7-Day Machine Learning Predictive Forecast Section */}
      <PredictiveForecast />

      {/* Cross-Platform Performance Breakdown Table */}
      <section className="glass-panel rounded-2xl p-5 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Cross-Channel Telemetry Breakdown</span>
              <span className="text-[11px] font-mono text-slate-400">({channels.length} Networks)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Comparative ROAS, spend pacing, and health diagnostics across all integrated channels.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('attribution')}
            className="self-start sm:self-auto text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
          >
            <span>View Multi-Touch Attribution Matrix</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Responsive Table / Cards */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Channel</th>
                <th className="pb-3 font-semibold">Spend</th>
                <th className="pb-3 font-semibold">Revenue</th>
                <th className="pb-3 font-semibold">ROAS</th>
                <th className="pb-3 font-semibold">Conversions</th>
                <th className="pb-3 font-semibold">CPA</th>
                <th className="pb-3 font-semibold">Health Status</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {channels.map((channel) => (
                <tr key={channel.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                        style={{ backgroundColor: `${channel.color}25`, color: channel.color }}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {channel.icon === 'video' ? 'movie' : channel.icon === 'search' ? 'search' : channel.icon === 'target' ? 'adjust' : 'insights'}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs sm:text-sm">{channel.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">CTR {channel.ctr}%</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 pr-3 font-mono font-semibold text-white">
                    ${channel.spend.toLocaleString()}
                  </td>

                  <td className="py-3.5 pr-3 font-mono font-semibold text-emerald-400">
                    ${channel.revenue.toLocaleString()}
                  </td>

                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        channel.roas >= 4.0 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : channel.roas >= 2.5 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {channel.roas.toFixed(2)}x
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 pr-3 font-mono text-slate-200">
                    {channel.conversions.toLocaleString()}
                  </td>

                  <td className="py-3.5 pr-3 font-mono text-slate-300">
                    ${channel.cpa.toFixed(2)}
                  </td>

                  <td className="py-3.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        channel.health === 'optimal' ? 'bg-emerald-400' : channel.health === 'warning' ? 'bg-amber-400 animate-pulse' : 'bg-red-500 animate-ping'
                      }`}></span>
                      <span className="text-[11px] text-slate-300 capitalize truncate max-w-[140px]" title={channel.healthReason}>
                        {channel.healthReason || channel.health}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => onNavigateTab('campaigns')}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium border border-white/10 transition-all"
                    >
                      Pacing
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
