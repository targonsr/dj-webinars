export interface DashboardStat {
  name: string;
  value: string;
  icon: any; // Vue component
  color: string;
}

export interface QuickAction {
  name: string;
  description: string;
  icon: any; // Vue component
  href: string;
}

export interface RecentRequest {
  id: string;
  type: string;
  status: string;
  route: string;
  date: Date;
}

export interface RoutePerformance {
  route: string;
  shipments: number;
  onTimePercentage: number;
  avgCost: number;
  totalRevenue: number;
}

export interface Metrics {
  totalShipments: number;
  onTimeDelivery: number;
  totalCost: number;
  storageVolume: number;
}

export interface ServiceFeature {
  name: string;
  description: string;
  icon: any;
  features: string[];
}

export interface CompanyFeature {
  name: string;
  description: string;
  icon: any;
}

export interface SuccessStory {
  id: number;
  company: string;
  industry: string;
  logo: string;
  testimonial: string;
  metrics: {
    improvement: string;
    delivery: string;
  };
  contact: {
    name: string;
    position: string;
    avatar: string;
  };
  caseStudyLink: string;
}

export interface Statistic {
  name: string;
  value: number;
  suffix?: string;
}