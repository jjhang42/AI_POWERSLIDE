import { WhyNowTranslation } from "../types";

export const whyNow: WhyNowTranslation = {
  badge: "Why Now?",
  title: "The Cost of Silence",
  subtitle: "Real luxury pop-up case",
  visualExample: {
    title: "Lost Premium Gift Inventory",
    scenario: "Manager: 'Where are the VIP gift sets worth $1,000 each?'",
    timeline: [
      {
        time: "15 Min",
        event: "3 staff searching. Normal operations halted.",
        cost: "$100",
      },
      {
        time: "1 Hour",
        event: "Customer wait limit. 1 VIP leaves.",
        cost: "$1K",
      },
      {
        time: "3 Hours",
        event: "Found but damaged by humidity. 3 ruined.",
        cost: "$3K",
      },
    ],
    solution: "With BlackVox: Voice captured as legal-grade evidence → AI locates mention in 30 seconds → Problem resolved before any loss",
  },
};
