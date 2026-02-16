import { MarketOpportunityTranslation } from "../types";

export const marketOpportunity: MarketOpportunityTranslation = {
  badge: "Market Size",
  title: "Market Opportunity",
  subtitle: "The Deskless Workforce Market",
  definition: {
    term: "Deskless Workforce",
    explanation: "Workers without computers: construction, retail, logistics, manufacturing, events",
    size: "2.7 billion workers",
    percentage: "80% of global workforce",
  },
  funnel: [
    {
      level: "TAM",
      size: "$50B",
      description: "Global field data & communication market",
    },
    {
      level: "SAM",
      size: "$5B",
      description: "Event & retail operations (Asia-Pacific)",
    },
    {
      level: "SOM",
      size: "$150M",
      description: "Luxury pop-up stores & events (Korea/Japan Year 1)",
    },
  ],
};
