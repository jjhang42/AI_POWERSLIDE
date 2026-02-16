import {
  TitleSlide,
  SectionTitle,
  ContentSlide,
  TwoColumn,
  BulletPoints,
  QuoteSlide,
  ImageWithCaption,
  ThankYou,
} from "./index";
import {
  Heading1,
  Square,
  FileText,
  Columns2,
  List,
  Quote,
  Image as ImageIcon,
  Smile,
  LucideIcon,
} from "lucide-react";

/**
 * 모든 템플릿 타입 정의
 */
export type TemplateType =
  | "TitleSlide"
  | "SectionTitle"
  | "ContentSlide"
  | "TwoColumn"
  | "BulletPoints"
  | "QuoteSlide"
  | "ImageWithCaption"
  | "ThankYou";

/**
 * 템플릿 등록 정보 인터페이스
 */
export interface TemplateRegistryEntry {
  type: TemplateType;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  icon: LucideIcon;
  defaultProps: any;
}

/**
 * 템플릿 레지스트리
 * AI가 새로운 템플릿을 추가할 때 이 객체만 수정하면 됩니다.
 */
export const TEMPLATE_REGISTRY: Record<TemplateType, TemplateRegistryEntry> = {
  TitleSlide: {
    type: "TitleSlide",
    name: "Title Slide",
    description: "Presentation cover with title and author",
    component: TitleSlide,
    icon: Heading1,
    defaultProps: {
      title: "New Presentation",
      subtitle: "Subtitle here",
      author: "Your Name",
      date: new Date().toLocaleDateString(),
    },
  },
  SectionTitle: {
    type: "SectionTitle",
    name: "Section Title",
    description: "Divider slide for new sections",
    component: SectionTitle,
    icon: Square,
    defaultProps: {
      section: "Section 1",
      title: "Section Title",
      description: "Section description",
    },
  },
  ContentSlide: {
    type: "ContentSlide",
    name: "Content Slide",
    description: "Simple slide with title and content",
    component: ContentSlide,
    icon: FileText,
    defaultProps: {
      title: "Content Title",
      content: "Content goes here...",
      align: "left",
    },
  },
  TwoColumn: {
    type: "TwoColumn",
    name: "Two Column",
    description: "Split layout with two columns",
    component: TwoColumn,
    icon: Columns2,
    defaultProps: {
      title: "Two Column Layout",
      left: "Left column content",
      right: "Right column content",
      split: "50-50",
    },
  },
  BulletPoints: {
    type: "BulletPoints",
    name: "Bullet Points",
    description: "List of key points with icons",
    component: BulletPoints,
    icon: List,
    defaultProps: {
      title: "Key Points",
      points: ["Point 1", "Point 2", "Point 3"],
      icon: "chevron",
    },
  },
  QuoteSlide: {
    type: "QuoteSlide",
    name: "Quote",
    description: "Highlighted quote with attribution",
    component: QuoteSlide,
    icon: Quote,
    defaultProps: {
      quote: "Your quote here",
      author: "Author Name",
      title: "Title/Position",
    },
  },
  ImageWithCaption: {
    type: "ImageWithCaption",
    name: "Image with Caption",
    description: "Image slide with title and caption",
    component: ImageWithCaption,
    icon: ImageIcon,
    defaultProps: {
      title: "Image Title",
      imageSrc: "https://via.placeholder.com/800x600",
      imageAlt: "Placeholder image",
      caption: "Image caption",
      layout: "contained",
    },
  },
  ThankYou: {
    type: "ThankYou",
    name: "Thank You",
    description: "Closing slide with contact info",
    component: ThankYou,
    icon: Smile,
    defaultProps: {
      message: "Thank You",
      cta: "Questions?",
      contact: {
        email: "contact@example.com",
        website: "www.example.com",
      },
    },
  },
};

/**
 * 사이드바에 표시될 템플릿 목록
 */
export const TEMPLATES = Object.values(TEMPLATE_REGISTRY);
