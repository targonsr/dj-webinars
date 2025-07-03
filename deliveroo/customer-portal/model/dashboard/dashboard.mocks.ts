import type { DashboardStat, QuickAction, RecentRequest, RoutePerformance, Metrics, ServiceFeature, CompanyFeature, SuccessStory, Statistic } from './index'
import {
  TruckIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  CheckCircleIcon,
  MapIcon
} from '@heroicons/vue/24/outline'

export const mockDashboardStats: DashboardStat[] = [
  {
    name: 'Active Shipments',
    value: '12',
    icon: TruckIcon,
    color: 'text-blue-600'
  },
  {
    name: 'Stored Items',
    value: '45',
    icon: BuildingStorefrontIcon,
    color: 'text-green-600'
  },
  {
    name: 'Pending Requests',
    value: '3',
    icon: ClockIcon,
    color: 'text-yellow-600'
  },
  {
    name: 'Completed This Month',
    value: '28',
    icon: CheckCircleIcon,
    color: 'text-purple-600'
  }
]

export const mockQuickActions: QuickAction[] = [
  {
    name: 'New Transportation Request',
    description: 'Book a new shipment',
    icon: TruckIcon,
    href: '/dashboard/transportation/new'
  },
  {
    name: 'New Warehousing Request',
    description: 'Request storage space',
    icon: BuildingStorefrontIcon,
    href: '/dashboard/warehousing/new'
  },
  {
    name: 'Track Shipment',
    description: 'Check shipment status',
    icon: MapIcon,
    href: '/dashboard/tracking'
  }
]

export const mockRecentRequests: RecentRequest[] = [
  {
    id: 'TR-2024-001',
    type: 'Transportation',
    status: 'In Transit',
    route: 'Warsaw → Berlin',
    date: new Date('2024-01-15')
  },
  {
    id: 'WH-2024-002',
    type: 'Warehousing',
    status: 'Stored',
    route: 'Krakow Warehouse',
    date: new Date('2024-01-14')
  },
  {
    id: 'TR-2024-003',
    type: 'Transportation',
    status: 'Delivered',
    route: 'Gdansk → Hamburg',
    date: new Date('2024-01-13')
  }
]

export const mockMetrics: Metrics = {
  totalShipments: 156,
  onTimeDelivery: 94.2,
  totalCost: 45750,
  storageVolume: 2340
}

export const mockRoutePerformance: RoutePerformance[] = [
  {
    route: 'Warsaw → Berlin',
    shipments: 45,
    onTimePercentage: 96,
    avgCost: 850,
    totalRevenue: 38250
  },
  {
    route: 'Krakow → Vienna',
    shipments: 32,
    onTimePercentage: 91,
    avgCost: 720,
    totalRevenue: 23040
  },
  {
    route: 'Gdansk → Hamburg',
    shipments: 28,
    onTimePercentage: 98,
    avgCost: 950,
    totalRevenue: 26600
  },
  {
    route: 'Wroclaw → Prague',
    shipments: 22,
    onTimePercentage: 89,
    avgCost: 650,
    totalRevenue: 14300
  },
  {
    route: 'Poznan → Amsterdam',
    shipments: 29,
    onTimePercentage: 93,
    avgCost: 1200,
    totalRevenue: 34800
  }
]

export const mockServices: ServiceFeature[] = [
  {
    name: 'Road Transportation',
    description: 'Europe-wide freight delivery with real-time tracking and guaranteed delivery times.',
    icon: 'TruckIcon',
    features: [
      'Full & partial loads',
      'Express delivery',
      'Temperature controlled',
      'Hazardous materials'
    ]
  },
  {
    name: 'Warehousing Solutions',
    description: 'Secure storage facilities with advanced inventory management systems.',
    icon: 'BuildingStorefrontIcon',
    features: [
      'Climate controlled',
      'Inventory management',
      'Pick & pack services',
      'Cross-docking'
    ]
  },
  {
    name: 'Customs Clearance',
    description: 'Simplified cross-border procedures and documentation handling.',
    icon: 'ShieldCheckIcon',
    features: [
      'EU compliance',
      'Documentation support',
      'Fast processing',
      'Expert guidance'
    ]
  },
  {
    name: 'Technology Platform',
    description: 'Advanced tracking and management systems for complete visibility.',
    icon: 'CpuChipIcon',
    features: [
      'Real-time tracking',
      'Digital documentation',
      'API integration',
      'Mobile access'
    ]
  }
]

export const mockFeatures: CompanyFeature[] = [
  {
    name: 'European Coverage',
    description: 'Extensive network covering all major European routes with dedicated hubs in key locations.',
    icon: 'GlobeEuropeAfricaIcon'
  },
  {
    name: 'Reliability & Speed',
    description: '99%+ on-time delivery rate with express options for urgent shipments.',
    icon: 'ClockIcon'
  },
  {
    name: 'Advanced Technology',
    description: 'State-of-the-art tracking systems and digital platforms for complete transparency.',
    icon: 'CpuChipIcon'
  },
  {
    name: 'Trusted Partner',
    description: 'Years of experience with industry-leading safety standards and compliance.',
    icon: 'ShieldCheckIcon'
  }
]

export const mockSuccessStories: SuccessStory[] = [
  {
    id: 1,
    company: 'TechCorp Manufacturing',
    industry: 'Electronics Manufacturing',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    testimonial: 'Deliveroo transformed our supply chain efficiency. Their real-time tracking and reliable delivery schedules helped us reduce inventory costs by 30% while improving customer satisfaction.',
    metrics: {
      improvement: '30%',
      delivery: '99.2%'
    },
    contact: {
      name: 'Anna Kowalski',
      position: 'Supply Chain Director',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    caseStudyLink: '/case-studies/techcorp'
  },
  {
    id: 2,
    company: 'AutoParts Europe',
    industry: 'Automotive Parts',
    logo: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    testimonial: 'The cross-border logistics expertise of Deliveroo enabled us to expand into 5 new European markets. Their customs clearance service is exceptional.',
    metrics: {
      improvement: '25%',
      delivery: '98.8%'
    },
    contact: {
      name: 'Marcus Weber',
      position: 'Logistics Manager',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    caseStudyLink: '/case-studies/autoparts'
  },
  {
    id: 3,
    company: 'FreshFood Distribution',
    industry: 'Food & Beverage',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    testimonial: 'Temperature-controlled transportation and warehousing solutions from Deliveroo helped us maintain product quality while expanding our distribution network across Central Europe.',
    metrics: {
      improvement: '40%',
      delivery: '99.5%'
    },
    contact: {
      name: 'Sofia Novak',
      position: 'Operations Director',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
    },
    caseStudyLink: '/case-studies/freshfood'
  }
]

export const mockStatistics: Statistic[] = [
  { name: 'Countries Served', value: 25, suffix: '+' },
  { name: 'Deliveries Completed', value: 100000, suffix: '+' },
  { name: 'Satisfied Customers', value: 1000, suffix: '+' },
  { name: 'Warehouse Capacity', value: 50000, suffix: ' m²' }
]