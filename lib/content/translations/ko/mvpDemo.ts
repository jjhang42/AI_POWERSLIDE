import { MVPDemoTranslation } from "../types";

export const mvpDemo: MVPDemoTranslation = {
  badge: "기술",
  title: "검증된 프로토타입",
  subtitle: "핵심 기술 검증 완료, 2026년 2분기 출시",
  disclaimer: "베타 버전 - 사용자 피드백에 따라 기능이 개선될 수 있습니다",
  techStack: {
    title: "기술 스택",
    items: [
      {
        category: "음성 AI",
        technology: "Whisper / Google STT",
        status: "테스트 진행 중",
        metric: "현장 환경에서 90% 이상 정확도",
      },
      {
        category: "실시간 처리",
        technology: "커스텀 파이프라인",
        status: "베타 준비 완료",
        metric: "<0.5초 레이턴시 (목표: 0.3초)",
      },
      {
        category: "데이터 보안",
        technology: "E2E 암호화 + 불변 로그",
        status: "프로덕션 준비 완료",
        metric: "SOC 2 준비 중 (2026년 4분기)",
      },
    ],
  },
  features: {
    title: "핵심 기능 (MVP)",
    items: [
      {
        title: "음성-텍스트 변환 (STT)",
        status: "프로토타입 작동 중",
        description: "현장 노이즈 필터링을 통한 실시간 음성-텍스트 변환",
      },
      {
        title: "불변 로깅",
        status: "프로덕션 준비 완료",
        description: "법적 준수를 위한 변조 방지 감사 추적",
      },
      {
        title: "오프라인 동기화",
        status: "개발 중",
        description: "네트워크 없이 작동, 재연결 시 동기화",
      },
    ],
  },
  beta: {
    title: "베타 프로그램 참여",
    subtitle: "50명의 얼리 어답터로 제한",
    benefits: [
      "베타 기간 중 모든 기능 무료 이용",
      "제품 로드맵에 직접적인 영향력",
      "얼리 어답터 가격 영구 고정 (월 $79)",
      "창업팀의 우선 지원",
    ],
    cta: "베타 액세스 신청",
  },
};
