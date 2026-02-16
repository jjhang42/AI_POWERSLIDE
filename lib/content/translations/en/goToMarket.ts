import { GoToMarketTranslation } from "../types";

export const goToMarket: GoToMarketTranslation = {
  badge: "Strategy",
  title: "Go-to-Market Strategy",
  subtitle: "How we'll acquire our first 1,000 customers",
  beachhead: {
    title: "Beachhead Market: Korean Pop-up Stores",
    reason: "Why this market?",
    points: [
      {
        title: "High incident frequency",
        description: "Pop-ups see 3-5 safety incidents per event → Fast ROI validation",
      },
      {
        title: "Low switching cost",
        description: "No existing hardware infrastructure → Easy adoption",
      },
      {
        title: "Viral effect",
        description: "Pop-up managers share learnings in tight-knit communities",
      },
      {
        title: "Regulatory pressure",
        description: "New safety regulations require documented evidence",
      },
    ],
  },
  phases: [
    {
      phase: "Phase 1: Beta Validation",
      timeline: "2026 Q2-Q3",
      goal: "Product-Market Fit",
      metrics: [
        "10 beta customers",
        "80%+ retention rate",
        "Average usage: 20+ hours/week",
        "NPS target: 50+",
      ],
      activities: [
        "Recruit 10 pop-up stores in Seoul",
        "Weekly feedback sessions",
        "Rapid iteration cycle (2-week sprints)",
        "Build case studies",
      ],
    },
    {
      phase: "Phase 2: Initial Scaling",
      timeline: "2026 Q4",
      goal: "First 100 Paying Customers",
      metrics: [
        "100 paid customers",
        "$120K ARR",
        "CAC < $500",
        "Payback period < 6 months",
      ],
      activities: [
        "Launch referral program (20% commission)",
        "Partner with pop-up management agencies",
        "Content marketing (safety compliance guides)",
        "Start construction pilot (5 sites)",
      ],
    },
    {
      phase: "Phase 3: Vertical Expansion",
      timeline: "2027 Q1-Q2",
      goal: "Multi-vertical Growth",
      metrics: [
        "500 customers (pop-up + construction)",
        "$600K ARR",
        "Launch in Japan market",
        "Construction vertical: 50 sites",
      ],
      activities: [
        "Hire construction industry sales lead",
        "Japan market entry (partner with local agencies)",
        "Build industry-specific features",
        "Fundraise Series A",
      ],
    },
  ],
};
