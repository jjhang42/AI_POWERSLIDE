/**
 * Template Types
 * 범용 템플릿 컴포넌트의 타입 정의
 */

/**
 * 지원하는 섹션 템플릿 타입
 */
export type SectionType =
  // 제목 슬라이드
  | "title-slide"
  // 콘텐츠 슬라이드
  | "content-slide"
  // 그리드 레이아웃 (팀, 특징 등)
  | "people-grid"
  | "feature-grid"
  // 비교 테이블
  | "comparison-table"
  // 타임라인
  | "timeline-slide"
  // 차트/메트릭
  | "metrics-slide"
  | "chart-slide"
  // 가격표
  | "pricing-table"
  // 비디오/데모
  | "video-slide"
  // 케이스 스터디
  | "case-study-grid"
  // 커스텀 (고유 패턴)
  | "custom";

/**
 * 기본 섹션 Props
 * 모든 템플릿 컴포넌트가 받는 공통 Props
 */
export interface BaseSectionProps {
  sectionId: string;
  metadata?: {
    id: string;
    title?: string;
    group?: string;
  };
}

/**
 * 헤더 콘텐츠
 * 대부분의 섹션에서 사용하는 공통 헤더 구조
 */
export interface SectionHeader {
  badge?: string;
  title: string;
  subtitle?: string;
}

/**
 * GridTemplate Props
 * people-grid, feature-grid 등에서 사용
 */
export interface GridTemplateProps<T = GridItem> extends BaseSectionProps {
  content: SectionHeader & {
    items: T[];
    columns?: 2 | 3 | 4;
  };
}

export interface GridItem {
  icon?: string;
  title: string;
  subtitle?: string;
  description: string;
  [key: string]: any; // 확장성을 위한 추가 필드
}

/**
 * TableTemplate Props
 * comparison-table 등에서 사용
 */
export interface TableTemplateProps extends BaseSectionProps {
  content: SectionHeader & {
    headers: string[];
    rows: TableRow[];
    highlightColumn?: number; // 강조할 열 인덱스
    verdict?: string; // 결론 텍스트
  };
}

export interface TableRow {
  [key: string]: string | boolean | number;
}

/**
 * TimelineTemplate Props
 * timeline-slide 등에서 사용
 */
export interface TimelineTemplateProps extends BaseSectionProps {
  content: SectionHeader & {
    items: TimelineItem[];
    orientation?: "horizontal" | "vertical";
  };
}

export interface TimelineItem {
  title: string;
  subtitle?: string;
  description: string;
  status?: "completed" | "in-progress" | "planned";
  date?: string;
  milestone?: string;
  [key: string]: any;
}

/**
 * 템플릿 컴포넌트 타입
 * React 컴포넌트로 렌더링 가능한 타입
 */
export type TemplateComponent<T = any> = React.ComponentType<T>;

/**
 * 템플릿 레지스트리 항목
 */
export interface TemplateRegistryEntry {
  type: SectionType;
  component: TemplateComponent;
  description?: string;
  requiredFields?: string[];
}
