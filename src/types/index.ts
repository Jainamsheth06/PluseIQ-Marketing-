export type TimeRange = '24h' | '7d' | '30d' | 'qtd' | 'ytd';

export type AttributionModel = 
  | 'markov' 
  | 'first_touch' 
  | 'last_touch' 
  | 'linear' 
  | 'time_decay' 
  | 'position_based';

export type PlatformId = 'google' | 'meta' | 'tiktok' | 'youtube' | 'klaviyo' | 'linkedin';

export interface ChannelPerformance {
  id: PlatformId;
  name: string;
  icon: string;
  color: string;
  spend: number;
  revenue: number;
  roas: number;
  conversions: number;
  cpa: number;
  ctr: number;
  trend: number;
  health: 'optimal' | 'warning' | 'critical';
  healthReason?: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: PlatformId;
  status: 'active' | 'paused' | 'learning' | 'optimizing';
  dailyBudget: number;
  spend: number;
  revenue: number;
  roas: number;
  conversions: number;
  cpa: number;
  ctr: number;
  targetRoas: number;
  aiRecommendation?: {
    action: 'increase_budget' | 'reduce_budget' | 'pause' | 'refresh_creative';
    description: string;
    impact: string;
  };
}

export interface AiRecommendation {
  id: string;
  title: string;
  category: 'efficiency' | 'growth' | 'creative' | 'keyword';
  severity: 'critical' | 'high' | 'medium' | 'opportunity';
  description: string;
  platform: PlatformId;
  metrics: {
    current: string;
    target: string;
    impactLabel: string;
    impactValue: string;
  };
  recommendedAction: string;
  applied: boolean;
  timestamp: string;
}

export interface CustomerPath {
  id: string;
  path: string[];
  touchCount: number;
  conversions: number;
  revenue: number;
  avgLagDays: number;
}

export interface WorkspaceIntegration {
  id: string;
  name: string;
  category: string;
  icon: string;
  status: 'connected' | 'syncing' | 'error' | 'disconnected';
  lastSynced: string;
  account: string;
  dataPoints: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Admin' | 'Growth Lead' | 'Media Buyer' | 'Analyst' | 'Viewer';
  status: 'active' | 'invited';
}

export interface AuthUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
  company?: string;
}

export type ViewTab = 'overview' | 'campaigns' | 'attribution' | 'insights' | 'settings' | 'auth';
export type ViewportMode = 'responsive' | 'laptop' | 'mobile';
