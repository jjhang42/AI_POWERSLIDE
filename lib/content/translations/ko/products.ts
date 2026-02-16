import { ProductsTranslation } from "../types";

export const products: ProductsTranslation = {
  badge: "우리의 솔루션",
  title: "투 프로덕트 전략",
  strategy: "무료로 시작. 자신감 있게 확장.",
  items: [
    {
      badge: "진입점",
      name: "예약 시스템",
      tagline: "고객 진입점",
      role: "무료 시작",
      description:
        "간단한 예약 시스템으로 현장 혼잡을 관리합니다. 비용도, 마찰도 없이—첫날부터 가치를 제공합니다.",
      features: [
        "실시간 혼잡도 예측",
        "매끄러운 예약 관리",
        "현장 팀을 위한 쉬운 온보딩",
      ],
    },
    {
      badge: "핵심 제품",
      name: "BlackVox",
      subtitle: "자신감 있게 확장",
      role: "현장 운영을 위한 음성 AI",
      featured: true,
      featuredBadge: "목표 출시: 2026년 2분기",
      description:
        "현장 음성 커뮤니케이션을 법적 증거와 성과 인사이트로 변환합니다. 비즈니스를 보호하고 운영을 최적화하는 AI 기반 시스템입니다.",
      definition:
        "현장 음성 커뮤니케이션을 법적 증거와 성과 인사이트로 변환합니다. 비즈니스를 보호하고 운영을 최적화하는 AI 기반 시스템입니다.",
      keyValuesTitle: "가치 창출",
      keyValues: [
        {
          title: "신뢰",
          description:
            "사고 발생 시 법적 책임을 방어하는 불변 증거 생성.",
        },
        {
          title: "감사",
          description:
            "계획과 실행의 일치를 AI가 자동으로 검증.",
        },
      ],
    },
  ],
};
