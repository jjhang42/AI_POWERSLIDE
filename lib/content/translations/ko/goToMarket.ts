import { GoToMarketTranslation } from "../types";

export const goToMarket: GoToMarketTranslation = {
  badge: "전략",
  title: "시장 진입 전략",
  subtitle: "첫 1,000명 고객 확보 방법",
  beachhead: {
    title: "교두보 시장: 한국 팝업 스토어",
    reason: "왜 이 시장인가?",
    points: [
      {
        title: "높은 사고 빈도",
        description: "팝업은 이벤트당 3-5건의 안전 사고 발생 → 빠른 ROI 검증",
      },
      {
        title: "낮은 전환 비용",
        description: "기존 하드웨어 인프라 없음 → 쉬운 도입",
      },
      {
        title: "바이럴 효과",
        description: "팝업 매니저들이 긴밀한 커뮤니티에서 학습 공유",
      },
      {
        title: "규제 압박",
        description: "새로운 안전 규제로 문서화된 증거 필요",
      },
    ],
  },
  phases: [
    {
      phase: "Phase 1: 베타 검증",
      timeline: "2026년 2-3분기",
      goal: "제품-시장 적합성",
      metrics: [
        "10개 베타 고객",
        "80% 이상 유지율",
        "평균 사용 시간: 주 20시간 이상",
        "NPS 목표: 50+",
      ],
      activities: [
        "서울 팝업 스토어 10곳 모집",
        "주간 피드백 세션",
        "빠른 반복 사이클 (2주 스프린트)",
        "케이스 스터디 구축",
      ],
    },
    {
      phase: "Phase 2: 초기 확장",
      timeline: "2026년 4분기",
      goal: "첫 100명 유료 고객",
      metrics: [
        "100명 유료 고객",
        "$120K ARR",
        "CAC < $500",
        "회수 기간 < 6개월",
      ],
      activities: [
        "추천 프로그램 론칭 (20% 커미션)",
        "팝업 관리 에이전시와 파트너십",
        "콘텐츠 마케팅 (안전 준수 가이드)",
        "건설 현장 파일럿 시작 (5곳)",
      ],
    },
    {
      phase: "Phase 3: 수직 확장",
      timeline: "2027년 1-2분기",
      goal: "다중 수직 성장",
      metrics: [
        "500명 고객 (팝업 + 건설)",
        "$600K ARR",
        "일본 시장 진입",
        "건설 수직: 50개 현장",
      ],
      activities: [
        "건설 산업 영업 리드 채용",
        "일본 시장 진입 (현지 에이전시 파트너십)",
        "산업별 특화 기능 개발",
        "시리즈 A 투자 유치",
      ],
    },
  ],
};
