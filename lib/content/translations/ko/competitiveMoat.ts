import { CompetitiveMoatTranslation } from "../types";

export const competitiveMoat: CompetitiveMoatTranslation = {
  badge: "방어 가능성",
  title: "경쟁 해자",
  subtitle: "왜 우리가 기존 기업과 신규 진입자를 이길 수 있는가",
  moats: [
    {
      type: "기술 해자",
      status: "현재",
      strength: "강함",
      description: "현장 환경에 최적화된 음성 AI",
      details: [
        "현장 노이즈에 미세 조정된 Whisper 모델 (기계, 바람, 군중)",
        "실시간 처리 아키텍처 (<0.5초 레이턴시)",
        "독점 노이즈 필터링 알고리즘",
        "잠재적 경쟁자 대비 6개월 이상 앞서 있음",
      ],
    },
    {
      type: "데이터 해자",
      status: "미래 (PMF 이후)",
      strength: "성장 중",
      description: "운영 데이터의 네트워크 효과",
      details: [
        "각 고객이 모든 사용자의 AI 정확도 향상",
        "100명 고객 → 10,000시간 이상의 현장 데이터",
        "산업별 특화 모델 (건설 vs 리테일)",
        "데이터 플라이휠: 더 많은 데이터 → 더 나은 AI → 더 많은 고객",
      ],
    },
    {
      type: "통합 해자",
      status: "개발 중",
      strength: "중간",
      description: "레거시 하드웨어 통합",
      details: [
        "특허 출원 중: 레거시 무전기 청취 기술",
        "경쟁사는 기존 무전기와 통합 불가",
        "통합 후 높은 전환 비용",
        "예상 특허 출원: 2026년 3분기",
      ],
    },
    {
      type: "규제 해자",
      status: "현재",
      strength: "강함",
      description: "준수 우선 아키텍처",
      details: [
        "법적 증거용으로 설계된 불변 로그",
        "기본 E2E 암호화",
        "SOC 2 Type II 인증 (목표: 2026년 4분기)",
        "준수 준비 현장 커뮤니케이션 분야 선도",
      ],
    },
  ],
  competitorResponse: {
    title: "왜 기존 기업이 따라잡지 못하는가",
    reasons: [
      {
        competitor: "Motorola / Zebra",
        weakness: "하드웨어 우선 DNA",
        explanation: "소프트웨어 우선 AI 구축은 문화적 불일치. 그들의 마진은 하드웨어 판매($500/기기)에 의존. 소프트웨어 전용은 그들의 비즈니스 모델을 잠식.",
      },
      {
        competitor: "Slack / Microsoft Teams",
        weakness: "사무실 우선 설계",
        explanation: "음성 우선, 오프라인 우선, 무마찰 UX는 그들의 핵심 제품과 정반대. 현장 노동자는 텍스트 중심 도구를 채택하지 않음.",
      },
      {
        competitor: "신규 스타트업",
        weakness: "도메인 지식 격차",
        explanation: "우리는 10년 이상의 현장 운영 경험 보유. 안전 준수, 법적 증거, 현장 UX는 수년이 걸리는 깊은 도메인 전문성 필요.",
      },
    ],
  },
};
