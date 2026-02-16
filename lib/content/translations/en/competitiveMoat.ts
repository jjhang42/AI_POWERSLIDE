import { CompetitiveMoatTranslation } from "../types";

export const competitiveMoat: CompetitiveMoatTranslation = {
  badge: "Defensibility",
  title: "Competitive Moat",
  subtitle: "Why we'll win against incumbents and new entrants",
  moats: [
    {
      type: "Technology Moat",
      status: "Current",
      strength: "Strong",
      description: "Voice AI optimized for field environments",
      details: [
        "Whisper model fine-tuned on field noise (machinery, wind, crowds)",
        "Real-time processing architecture (<0.5s latency)",
        "Proprietary noise filtering algorithms",
        "6+ months lead over potential competitors",
      ],
    },
    {
      type: "Data Moat",
      status: "Future (Post-PMF)",
      strength: "Growing",
      description: "Network effects from operational data",
      details: [
        "Each customer improves AI accuracy for all users",
        "100 customers → 10,000+ hours of field data",
        "Industry-specific models (construction vs retail)",
        "Data flywheel: More data → Better AI → More customers",
      ],
    },
    {
      type: "Integration Moat",
      status: "In Development",
      strength: "Medium",
      description: "Legacy hardware integration",
      details: [
        "Patent-pending: Legacy radio listening technology",
        "No competitor can integrate with existing walkie-talkies",
        "High switching cost once integrated",
        "Expected patent filing: Q3 2026",
      ],
    },
    {
      type: "Regulatory Moat",
      status: "Current",
      strength: "Strong",
      description: "Compliance-first architecture",
      details: [
        "Immutable logs designed for legal evidence",
        "E2E encryption by default",
        "SOC 2 Type II certification (target: Q4 2026)",
        "First-mover in compliance-ready field communication",
      ],
    },
  ],
  competitorResponse: {
    title: "Why Incumbents Won't Catch Up",
    reasons: [
      {
        competitor: "Motorola / Zebra",
        weakness: "Hardware-first DNA",
        explanation: "Building software-first AI is cultural mismatch. Their margins depend on hardware sales ($500/device). Software-only cannibalizes their business model.",
      },
      {
        competitor: "Slack / Microsoft Teams",
        weakness: "Office-first design",
        explanation: "Voice-first, offline-first, zero-friction UX is opposite of their core product. Field workers won't adopt text-heavy tools.",
      },
      {
        competitor: "New Startups",
        weakness: "Domain knowledge gap",
        explanation: "We have 10+ years field operations experience. Safety compliance, legal evidence, and field UX require deep domain expertise that takes years to build.",
      },
    ],
  },
};
