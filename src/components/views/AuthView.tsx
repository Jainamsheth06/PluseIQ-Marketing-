import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  Building, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Laptop, 
  Eye, 
  EyeOff,
  Flame,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthUser } from '../../types';

interface AuthViewProps {
  initialMode?: 'signin' | 'register';
  onLoginSuccess: (user: AuthUser) => void;
  onCancel?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  initialMode = 'signin',
  onLoginSuccess,
  onCancel,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [company, setCompany] = useState('');
  const [adSpend, setAdSpend] = useState('$50,000 – $150,000 / month');
  const [rememberMe, setRememberMe] = useState(true);

  // Quick Demo User Preset
  const handleQuickDemoFill = (role: 'Admin' | 'Growth Lead') => {
    if (role === 'Admin') {
      setEmail('alex.sterling@apexretail.io');
      setPassword('PulseIQ@Secure2026!');
      setFirstName('Alex');
      setLastName('Sterling');
      setCompany('Apex Retail Global');
    } else {
      setEmail('elena.rostova@apexretail.io');
      setPassword('PulseIQ@Secure2026!');
      setFirstName('Elena');
      setLastName('Rostova');
      setCompany('Apex Retail Global');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });

      const user: AuthUser = {
        name: authMode === 'register' ? `${firstName || 'Growth'} ${lastName || 'Operator'}`.trim() : (email.includes('alex') ? 'Alex Sterling' : (email.split('@')[0] || 'Alex Sterling')),
        email: email || 'alex.sterling@apexretail.io',
        role: authMode === 'register' ? 'Growth Lead' : 'Admin',
        avatar: email.includes('elena') 
          ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        company: company || 'Apex Retail Global',
      };

      onLoginSuccess(user);
    }, 700);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-5xl rounded-3xl border border-white/10 bg-[#0f172a]/95 backdrop-blur-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Col: Brand & Value Prop Hero (from Stitch screen 2) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#171f33] via-[#0f172a] to-[#1e1333] p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
          {/* Ambient Glow background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 shadow-lg shadow-purple-950/40">
                <span className="material-symbols-outlined text-white text-[22px]">insights</span>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight flex items-center gap-1">
                  Pulse<span className="text-blue-400">IQ</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-mono">Digital Marketing Intelligence</span>
              </div>
            </div>

            {/* Headline from Stitch spec */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Engine v4.2 Live
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Decide faster.<br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Scale profitably.
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect Meta, Google Ads & TikTok campaigns to automatically roast budget inefficiencies and accelerate high-ROAS revenue channels in real time.
              </p>
            </div>

            {/* Proof Badges (from Stitch spec) */}
            <div className="space-y-2.5 pt-2">
              <div className="rounded-xl bg-[#0b1326]/80 p-3 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Blended ROAS Average</div>
                    <div className="text-sm font-bold text-white font-mono">4.82x (+18.7%)</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Portfolio Peak</span>
              </div>

              <div className="rounded-xl bg-[#0b1326]/80 p-3 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Autonomous Budget Guard</div>
                    <div className="text-sm font-bold text-white font-mono">$6,420/mo saved</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-purple-300">Auto-Bleed Kill</span>
              </div>
            </div>
          </div>

          {/* Footer security tag */}
          <div className="relative z-10 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              SOC2 Type II • Enterprise
            </span>
            <span className="font-mono text-[10px]">Stitch #16724025183037440447</span>
          </div>
        </div>

        {/* Right Col: Sign In / Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div>
            {/* Top Switcher: Sign In vs Create Account */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 bg-[#0b1326] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setAuthMode('signin')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    authMode === 'signin'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`px-4 py-2 rounded-lg font-bold transition-all ${
                    authMode === 'register'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              )}
            </div>

            {/* Title & Subtitle */}
            <div className="mt-6 mb-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                {authMode === 'signin' ? 'Welcome back to PulseIQ' : 'Start your 14-day free trial'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'signin'
                  ? 'Enter your marketing credentials to access live overview telemetry'
                  : 'Connect ad channels and audit budget waste immediately. No credit card required.'}
              </p>
            </div>

            {/* Social / OAuth Quick Sign-in Buttons (Stitch spec) */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  handleQuickDemoFill('Admin');
                  confetti({ particleCount: 25, spread: 40 });
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#171f33] hover:bg-[#1f2b45] p-2.5 text-xs font-semibold text-white border border-white/10 transition-all group"
              >
                <Globe size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Google Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleQuickDemoFill('Growth Lead');
                  confetti({ particleCount: 25, spread: 40 });
                }}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#171f33] hover:bg-[#1f2b45] p-2.5 text-xs font-semibold text-white border border-white/10 transition-all group"
              >
                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                  f
                </div>
                <span>Meta Business</span>
              </button>
            </div>

            <div className="relative flex items-center justify-center mb-4">
              <div className="w-full border-t border-white/10"></div>
              <span className="absolute bg-[#0f172a] px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                or continue with email
              </span>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* If Register: First Name & Last Name */}
              {authMode === 'register' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">First Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Alex"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full rounded-xl bg-[#0b1326] pl-9 pr-3 py-2.5 text-white border border-white/10 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Last Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Sterling"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl bg-[#0b1326] px-3.5 py-2.5 text-white border border-white/10 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#0b1326] pl-9 pr-3 py-2.5 text-white border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* If Register: Company & Estimated Ad Spend */}
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Company / Brand Name</label>
                    <div className="relative">
                      <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="e.g. Apex Retail Global"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full rounded-xl bg-[#0b1326] pl-9 pr-3 py-2.5 text-white border border-white/10 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Estimated Monthly Ad Spend</label>
                    <select
                      value={adSpend}
                      onChange={(e) => setAdSpend(e.target.value)}
                      className="w-full rounded-xl bg-[#0b1326] px-3.5 py-2.5 text-white border border-white/10 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="$10,000 – $50,000 / month">$10,000 – $50,000 / month</option>
                      <option value="$50,000 – $150,000 / month">$50,000 – $150,000 / month</option>
                      <option value="$150,000 – $500,000 / month">$150,000 – $500,000 / month</option>
                      <option value="$500,000+ / month (Enterprise)">$500,000+ / month (Enterprise)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">
                    {authMode === 'signin' ? 'Password' : 'Create Secure Password'}
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to registered email.')}
                      className="text-[11px] text-purple-400 hover:text-purple-300 font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-[#0b1326] pl-9 pr-10 py-2.5 text-white border border-white/10 focus:border-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              {authMode === 'signin' && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 text-xs">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded accent-blue-600 cursor-pointer"
                    />
                    <span>Remember session for 30 days</span>
                  </label>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-3 text-sm font-bold text-white shadow-xl shadow-purple-950/40 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin text-sm">⏳</span> Authenticating Telemetry...
                  </span>
                ) : (
                  <>
                    <span>
                      {authMode === 'signin'
                        ? 'Sign In to Dashboard'
                        : 'Create Account & Launch Dashboard'}
                    </span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Demo Helper box from Stitch screen 2 */}
          <div className="rounded-xl border border-dashed border-purple-500/30 bg-purple-500/10 p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-purple-200">
              <Sparkles size={14} className="text-purple-400 shrink-0" />
              <span>Demo credentials ready (Alex Sterling - Admin)</span>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Admin')}
                className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-white text-[11px] font-semibold transition-all"
              >
                Auto-Fill Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Growth Lead')}
                className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-white text-[11px] font-semibold transition-all"
              >
                Auto-Fill Growth
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
