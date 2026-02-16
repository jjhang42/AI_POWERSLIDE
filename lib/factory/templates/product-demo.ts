/**
 * Product Demo Template
 * 제품 시연용 간소화된 템플릿
 */

import type { PresentationTemplate } from "../types";

export const ProductDemoTemplate: PresentationTemplate = {
  name: "Product Demo",
  description: "Focused product demonstration presentation with key features and pricing",
  aspectRatio: { width: 16, height: 9 },
  languages: ["en", "ko"],
  sections: [
    {
      id: "intro",
      type: "title-slide",
      required: true,
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
      id: "features",
      type: "feature-grid",
    },
    {
      id: "how-it-works",
      type: "content-slide",
    },
    {
      id: "demo",
      type: "video-slide",
    },
    {
      id: "pricing",
      type: "pricing-table",
    },
    {
      id: "case-studies",
      type: "case-study-grid",
    },
  ],
};
