/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TimeRange, 
  ViewTab, 
  ViewportMode, 
  Campaign, 
  AiRecommendation,
  AuthUser 
} from './types';
import { 
  initialChannels, 
  initialCampaigns, 
  initialRecommendations 
} from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { OverviewView } from './components/views/OverviewView';
import { CampaignsView } from './components/views/CampaignsView';
import { AttributionView } from './components/views/AttributionView';
import { AiInsightsView } from './components/views/AiInsightsView';
import { SettingsView } from './components/views/SettingsView';
import { AuthView } from './components/views/AuthView';
import { CreateCampaignModal } from './components/modals/CreateCampaignModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('responsive');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('pulseiq_active_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
    return null;
  });
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'register'>('signin');
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  // Core App State
  const [channels, setChannels] = useState(initialChannels);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(initialRecommendations);
  const [isBleedFixed, setIsBleedFixed] = useState(false);
  const [autoRebalanceEnabled, setAutoRebalanceEnabled] = useState(true);

  // Auth Handlers
  const handleOpenAuth = (mode: 'signin' | 'register' = 'signin') => {
    setAuthModalMode(mode);
    setActiveTab('auth');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('pulseiq_active_user');
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
    setCurrentUser(null);
    setAuthModalMode('signin');
    setAuthNotice('You have safely signed out of PulseIQ.');
    confetti({ particleCount: 20, spread: 30 });
  };

  const handleLoginSuccess = (user: AuthUser) => {
    try {
      localStorage.setItem('pulseiq_active_user', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage unavailable:', e);
    }
    setCurrentUser(user);
    setAuthNotice(null);
    setActiveTab('overview');
  };

  // Handlers
  const handleAutoFixBleed = () => {
    setIsBleedFixed(true);
    // Pause Meta Audience X campaign
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === 'cmp-02' ? { ...c, status: 'paused' } : c
      )
    );
    // Update Meta channel health to optimal
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === 'meta'
          ? {
              ...ch,
              health: 'optimal',
              healthReason: 'Audience X paused; burn neutralized',
            }
          : ch
      )
    );
    // Mark recommendation 1 as applied
    setRecommendations((prev) =>
      prev.map((r) => (r.id === 'rec-01' ? { ...r, applied: true } : r))
    );

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === 'active' ? 'paused' : 'active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleUpdateBudget = (id: string, newBudget: number) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, dailyBudget: newBudget } : c))
    );
  };

  const handleCreateCampaign = (newCmp: any) => {
    const created: Campaign = {
      id: `cmp-${Date.now()}`,
      name: newCmp.name,
      platform: newCmp.platform,
      status: newCmp.status,
      dailyBudget: newCmp.dailyBudget,
      spend: 0,
      revenue: 0,
      roas: newCmp.targetRoas,
      conversions: 0,
      cpa: 0,
      ctr: 3.2,
      targetRoas: newCmp.targetRoas,
    };
    setCampaigns([created, ...campaigns]);
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleApplyRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, applied: true } : r))
    );
    if (recId === 'rec-01') {
      handleAutoFixBleed();
    }
  };

  const handleApplyAllRecommendations = () => {
    setRecommendations((prev) => prev.map((r) => ({ ...r, applied: true })));
    setIsBleedFixed(true);
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === 'cmp-02' ? { ...c, status: 'paused' } : c
      )
    );
  };

  const unappliedCount = recommendations.filter((r) => !r.applied).length;

  // Render view
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewView
            channels={channels}
            campaigns={campaigns}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            onNavigateTab={setActiveTab}
            onAutoFixBleed={handleAutoFixBleed}
            isBleedFixed={isBleedFixed}
          />
        );
      case 'campaigns':
        return (
          <CampaignsView
            campaigns={campaigns}
            onToggleStatus={handleToggleCampaignStatus}
            onUpdateBudget={handleUpdateBudget}
            onOpenCreateModal={() => setIsCreateCampaignOpen(true)}
            onApplyRecommendation={handleApplyRecommendation}
            autoRebalanceEnabled={autoRebalanceEnabled}
            onToggleAutoRebalance={() => setAutoRebalanceEnabled(!autoRebalanceEnabled)}
          />
        );
      case 'attribution':
        return <AttributionView />;
      case 'insights':
        return (
          <AiInsightsView
            recommendations={recommendations}
            onApplyRecommendation={handleApplyRecommendation}
            onApplyAll={handleApplyAllRecommendations}
          />
        );
      case 'settings':
        return (
          <SettingsView
            user={currentUser}
            onLogout={handleLogout}
            onOpenAuth={handleOpenAuth}
          />
        );
      case 'auth':
        return (
          <AuthView
            initialMode={authModalMode}
            onLoginSuccess={handleLoginSuccess}
            onCancel={currentUser ? () => setActiveTab('overview') : undefined}
          />
        );
      default:
        return null;
    }
  };

  // If not authenticated, present full-screen secure Auth View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col justify-center items-center p-3 sm:p-6 antialiased selection:bg-purple-600 selection:text-white relative overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <AuthView
          initialMode={authModalMode}
          onLoginSuccess={handleLoginSuccess}
          notice={authNotice}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col antialiased">
      {/* Top Header */}
      <Header
        viewportMode={viewportMode}
        setViewportMode={setViewportMode}
        onOpenMobileNav={() => setIsMobileNavOpen(!isMobileNavOpen)}
        isMobileNavOpen={isMobileNavOpen}
        onRunOptimization={handleAutoFixBleed}
        unreadCount={unappliedCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Container according to Viewport Mode */}
      <div className={`flex-1 flex justify-center ${viewportMode === 'mobile' ? 'py-4 sm:py-8 px-2 bg-slate-950/60' : ''}`}>
        <div
          className={`w-full flex transition-all duration-300 ${
            viewportMode === 'mobile'
              ? 'max-w-[400px] border-4 border-slate-700/80 rounded-[40px] shadow-2xl overflow-hidden bg-[#0b1326] min-h-[820px] my-auto'
              : viewportMode === 'laptop'
              ? 'max-w-[1280px] border border-white/10 rounded-2xl shadow-2xl bg-[#0b1326] my-4'
              : 'max-w-[1600px]'
          }`}
        >
          {/* Sidebar Navigation (Hidden in mobile mode or on small screen) */}
          {viewportMode !== 'mobile' && (
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isMobileOpen={isMobileNavOpen}
              onCloseMobile={() => setIsMobileNavOpen(false)}
              recommendationsCount={unappliedCount}
              user={currentUser}
              onLogout={handleLogout}
              onOpenAuth={handleOpenAuth}
            />
          )}

          {/* Main Content Area */}
          <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto pb-20 md:pb-8 min-w-0">
            {renderCurrentView()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation (Shown on mobile screens or when viewportMode is mobile) */}
      <div className={viewportMode === 'mobile' ? 'block' : 'md:hidden'}>
        <MobileNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          recommendationsCount={unappliedCount}
        />
      </div>

      {/* Modals & Drawers */}
      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onCreate={handleCreateCampaign}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
}
