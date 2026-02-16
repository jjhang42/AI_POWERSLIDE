/**
 * Translation Types
 * 각 섹션의 번역 데이터 타입 정의
 */

export interface HeroTranslation {
  companyName: string;
  tagline: string; // "Turn Field Voice into Business Intelligence"
  description: string; // "Real-time insights from walkie-talkie conversations. No new hardware."
  marketSize: string; // "$50B"
}

export interface CompetitionTranslation {
  badge: string;
  title: string;
  subtitle: string;
  competitors: Array<{
    name: string;
    logo?: string; // Optional logo path
  }>;
  advantages: string[]; // Max 3 bullets
  realCompetition: string; // "The real competition? Excel & WhatsApp"
}

export interface WhyNowTranslation {
  badge: string;
  title: string;
  subtitle: string;
  visualExample: {
    title: string;
    scenario: string;
    timeline: Array<{
      time: string;
      event: string;
      cost: string;
    }>;
    solution: string;
  };
}

export interface CompanyGoalTranslation {
  badge: string;
  title: string;
  visualFlow: {
    step1: {
      label: string;
      icon: string; // Lucide icon name
      description: string;
    };
    step2: {
      label: string;
      icon: string;
      description: string;
    };
    step3: {
      label: string;
      icon: string;
      description: string;
    };
  };
  tagline: string; // "Human to human. AI does the crappy work."
}

export interface ProductsTranslation {
  badge: string;
  title: string;
  strategy: string;
  items: Array<{
    badge: string;
    name: string;
    tagline?: string;
    subtitle?: string;
    role: string;
    featured?: boolean;
    featuredBadge?: string;
    description: string;
    definition?: string;
    keyValuesTitle?: string;
    keyValues?: Array<{
      title: string;
      description: string;
    }>;
    features?: string[];
  }>;
}

export interface MVPDemoTranslation {
  badge: string;
  title: string;
  subtitle: string;
  disclaimer: string;
  techStack: {
    title: string;
    items: Array<{
      category: string;
      technology: string;
      status: string;
      metric: string;
    }>;
  };
  features: {
    title: string;
    items: Array<{
      title: string;
      status: string;
      description: string;
    }>;
  };
  beta: {
    title: string;
    subtitle: string;
    benefits: string[];
    cta: string;
  };
}

export interface GoToMarketTranslation {
  badge: string;
  title: string;
  subtitle: string;
  beachhead: {
    title: string;
    reason: string;
    points: Array<{
      title: string;
      description: string;
    }>;
  };
  phases: Array<{
    phase: string;
    timeline: string;
    goal: string;
    metrics: string[];
    activities: string[];
  }>;
}

export interface MarketOpportunityTranslation {
  badge: string;
  title: string;
  subtitle: string;
  definition: {
    term: string; // "Deskless Workforce"
    explanation: string;
    size: string; // "2.7 billion workers"
    percentage: string; // "80% of global workforce"
  };
  funnel: Array<{
    level: string; // TAM, SAM, SOM
    size: string;
    description: string;
  }>;
}

export interface CompetitiveMoatTranslation {
  badge: string;
  title: string;
  subtitle: string;
  moats: Array<{
    type: string;
    status: string;
    strength: string;
    description: string;
    details: string[];
  }>;
  competitorResponse: {
    title: string;
    reasons: Array<{
      competitor: string;
      weakness: string;
      explanation: string;
    }>;
  };
}

export interface TeamTranslation {
  badge: string;
  title: string;
  subtitle: string;
  members: Array<{
    role: string;
    name: string;
    credential: string;
    focus: string;
  }>;
}

export interface RoadmapTranslation {
  badge: string;
  title: string;
  subtitle: string;
  milestones: Array<{
    name: string;
    status: 'complete' | 'in-progress' | 'planned';
    date: string;
    target?: string;
  }>;
}

export interface PricingTranslation {
  badge: string;
  title: string;
  investorSummary: {
    model: string; // "Freemium + Enterprise"
    selfService: string; // "$0-99/user/month"
    enterprise: string; // "Custom licensing"
    targetARPU: string; // "$99/user/year (conservative)"
  };
}

export interface DemoTranslation {
  title: string;
  subtitle: string;
  cta: {
    primary: string;
    secondary: string;
  };
  form: {
    fields: {
      name: string;
      email: string;
      company: string;
      phone: string;
      message: string;
    };
    placeholders: {
      name: string;
      email: string;
      company: string;
      phone: string;
      message: string;
    };
    required: string;
    submit: string;
  };
  footer: {
    companyName: string;
    tagline: string;
    copyright: string;
    links: Array<{
      text: string;
      href: string;
    }>;
  };
}

export interface InvestmentAskTranslation {
  badge: string;
  title: string;
  subtitle: string;
  round: {
    type: string; // "Angel Round"
    raising: string; // "$100K-250K"
    structure: string; // "SAFE"
    valuation: string; // "$2M post-money"
    note: string;
  };
  useOfFunds: {
    title: string;
    simplified: Array<{
      category: string;
      percentage: number;
    }>;
  };
  cta: {
    primary: string;
    secondary: string;
    note: string;
  };
}

/**
 * 전체 번역 스키마
 */
export interface TranslationsSchema {
  hero: HeroTranslation;
  competition: CompetitionTranslation;
  whyNow: WhyNowTranslation;
  companyGoal: CompanyGoalTranslation;
  products: ProductsTranslation;
  mvpDemo: MVPDemoTranslation;
  goToMarket: GoToMarketTranslation;
  marketOpportunity: MarketOpportunityTranslation;
  competitiveMoat: CompetitiveMoatTranslation;
  team: TeamTranslation;
  roadmap: RoadmapTranslation;
  pricing: PricingTranslation;
  demo: DemoTranslation;
  investmentAsk: InvestmentAskTranslation;
}

export type Language = "en" | "ko";
export type SectionKey = keyof TranslationsSchema;
