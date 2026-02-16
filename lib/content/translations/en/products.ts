import { ProductsTranslation } from "../types";

export const products: ProductsTranslation = {
  badge: "Our Solution",
  title: "Two-Product Strategy",
  strategy: "Get started free. Scale with confidence.",
  items: [
    {
      badge: "Entry Point",
      name: "Reservation System",
      tagline: "Customer Entry Point",
      role: "Start Free",
      description:
        "Manage on-site congestion with a simple reservation system. No cost, no friction—just value from day one.",
      features: [
        "Real-time congestion prediction",
        "Seamless reservation management",
        "Easy onboarding for field teams",
      ],
    },
    {
      badge: "Core Product",
      name: "BlackVox",
      subtitle: "Scale with Confidence",
      role: "Voice AI for Field Operations",
      featured: true,
      featuredBadge: "Target Launch: Q2 2026",
      description:
        "Transforms field voice communication into legal evidence and performance insights. The AI-powered system that protects your business and optimizes operations.",
      definition:
        "Transforms field voice communication into legal evidence and performance insights. The AI-powered system that protects your business and optimizes operations.",
      keyValuesTitle: "Value Creation",
      keyValues: [
        {
          title: "Trust",
          description:
            "Create immutable evidence to defend legal responsibilities in case of incidents.",
        },
        {
          title: "Audit",
          description:
            "AI automatically verifies alignment between plans and execution.",
        },
      ],
    },
  ],
};
