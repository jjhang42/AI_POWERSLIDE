/**
 * Presentation Factory
 * 프레젠테이션 생성 및 관리를 위한 팩토리 패턴
 */

export { PresentationFactory } from "./PresentationFactory";
export { VCPitchDeckTemplate } from "./templates/vc-pitch-deck";
export { ProductDemoTemplate } from "./templates/product-demo";

export type {
  PresentationTemplate,
  ContentPackage,
  PresentationConfig,
  Presentation,
  SectionType,
  TemplateSectionConfig,
} from "./types";
