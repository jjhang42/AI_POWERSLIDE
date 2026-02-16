import { MVPDemoTranslation } from "../types";

export const mvpDemo: MVPDemoTranslation = {
  badge: "Technology",
  title: "Proven Prototype",
  subtitle: "Core technology validated, launching Q2 2026",
  disclaimer: "Beta version - Features subject to refinement based on user feedback",
  techStack: {
    title: "Technology Stack",
    items: [
      {
        category: "Voice AI",
        technology: "Whisper / Google STT",
        status: "Testing in progress",
        metric: "90%+ accuracy in field conditions",
      },
      {
        category: "Real-time Processing",
        technology: "Custom pipeline",
        status: "Beta ready",
        metric: "<0.5s latency (target: 0.3s)",
      },
      {
        category: "Data Security",
        technology: "E2E encryption + Immutable logs",
        status: "Production ready",
        metric: "SOC 2 prep (Q4 2026)",
      },
    ],
  },
  features: {
    title: "Core Features (MVP)",
    items: [
      {
        title: "Voice-to-Text (STT)",
        status: "Working prototype",
        description: "Real-time speech-to-text conversion with field noise filtering",
      },
      {
        title: "Immutable Logging",
        status: "Production ready",
        description: "Tamper-proof audit trail for legal compliance",
      },
      {
        title: "Offline Sync",
        status: "In development",
        description: "Works without network, syncs when reconnected",
      },
    ],
  },
  beta: {
    title: "Join Beta Program",
    subtitle: "Limited to 50 early adopters",
    benefits: [
      "Free access to all features during beta",
      "Direct influence on product roadmap",
      "Lock in early adopter pricing ($79/mo forever)",
      "Priority support from founding team",
    ],
    cta: "Apply for Beta Access",
  },
};
