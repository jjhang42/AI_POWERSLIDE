/**
 * VC Pitch Deck Template
 * 표준 벤처캐피탈 피치덱 템플릿 (14개 섹션)
 */

import type { PresentationTemplate } from "../types";

export const VCPitchDeckTemplate: PresentationTemplate = {
  name: "VC Pitch Deck",
  description: "Standard venture capital pitch deck with 14 comprehensive sections",
  aspectRatio: { width: 16, height: 9 },
  languages: ["en", "ko"],
  sections: [
    {
      id: "hero",
      type: "title-slide",
      required: true,
    },
    {
      id: "why-now",
      type: "content-slide",
    },
    {
      id: "problem",
      type: "content-slide",
    },
    {
      id: "solution",
      type: "content-slide",
    },
    {
      id: "products",
      type: "feature-grid",
    },
    {
      id: "how-it-works",
      type: "content-slide",
    },
    {
      id: "market-size",
      type: "metrics-slide",
    },
    {
      id: "competition",
      type: "comparison-table",
    },
    {
      id: "competitive-advantage",
      type: "content-slide",
    },
    {
      id: "business-model",
      type: "content-slide",
    },
    {
      id: "pricing",
      type: "pricing-table",
    },
    {
      id: "traction",
      type: "metrics-slide",
    },
    {
      id: "team",
      type: "people-grid",
    },
    {
      id: "investment",
      type: "content-slide",
      required: true,
    },
  ],
};
