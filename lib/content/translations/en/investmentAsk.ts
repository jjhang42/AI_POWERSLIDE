import { InvestmentAskTranslation } from "../types";

export const investmentAsk: InvestmentAskTranslation = {
  badge: "Investment Opportunity",
  title: "The Ask",
  subtitle: "Join us in building the future of field operations",
  round: {
    type: "Angel Round",
    raising: "$100K-250K",
    structure: "SAFE",
    valuation: "$2M post-money valuation",
    note: "Conservative valuation. Focused on execution, not hype.",
  },
  useOfFunds: {
    title: "Use of Funds",
    simplified: [
      { category: "Product Development", percentage: 40 },
      { category: "Go-to-Market", percentage: 30 },
      { category: "Operations", percentage: 20 },
      { category: "Legal & Admin", percentage: 10 },
    ],
  },
  cta: {
    primary: "Request Investment Deck",
    secondary: "Schedule Meeting",
    note: "Full financial model available upon NDA",
  },
};
