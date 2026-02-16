import { TemplateType } from "@/components/TemplatesSidebar";
import { ReactNode, CSSProperties } from "react";

// 공통 스타일 인터페이스 (모든 슬라이드에 적용 가능)
export interface SlideStyleConfig {
  className?: string;           // Tailwind 클래스
  style?: CSSProperties;        // 인라인 스타일
  backgroundColor?: string;     // 배경색 (Tailwind 클래스 또는 CSS 값)
  textColor?: string;           // 텍스트 색상 (Tailwind 클래스 또는 CSS 값)
}

// 각 템플릿의 Props 타입 정의
export interface TitleSlideProps extends SlideStyleConfig {
  title: string;
  subtitle: string;
  author: string;
  date: string;
}

export interface SectionTitleProps extends SlideStyleConfig {
  section: string;
  title: string;
  description: string;
}

export interface ContentSlideProps extends SlideStyleConfig {
  title: string;
  content: string;
  align: "left" | "center" | "right";
}

export interface TwoColumnProps extends SlideStyleConfig {
  title: string;
  left: string;
  right: string;
  split: "50-50" | "60-40" | "40-60";
}

export interface BulletPointsProps extends SlideStyleConfig {
  title: string;
  points: string[];
  icon: "check" | "arrow" | "star";
}

export interface QuoteSlideProps extends SlideStyleConfig {
  quote: string;
  author: string;
  title: string;
}

export interface ImageWithCaptionProps extends SlideStyleConfig {
  title: string;
  imageSrc: string;
  imageAlt: string;
  caption: string;
  layout: "contained" | "fullscreen";
}

export interface ThankYouProps extends SlideStyleConfig {
  message: string;
  cta: string;
  contact: {
    email: string;
    website: string;
  };
}

// Union type for all template props
export type TemplateProps =
  | TitleSlideProps
  | SectionTitleProps
  | ContentSlideProps
  | TwoColumnProps
  | BulletPointsProps
  | QuoteSlideProps
  | ImageWithCaptionProps
  | ThankYouProps;

// 확장된 Slide 인터페이스
export interface SlideWithProps {
  id: string;
  type: TemplateType;
  name: string;
  props: TemplateProps; // 각 슬라이드가 자신만의 props 보유
}
