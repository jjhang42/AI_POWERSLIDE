import { InvestmentAskTranslation } from "../types";

export const investmentAsk: InvestmentAskTranslation = {
  badge: "투자 기회",
  title: "투자 제안",
  subtitle: "현장 운영의 미래를 함께 만들어갑니다",
  round: {
    type: "엔젤 라운드",
    raising: "$100K-250K",
    structure: "SAFE",
    valuation: "$2M 포스트머니",
    note: "보수적 밸류에이션. 실행에 집중, 과장 없음.",
  },
  useOfFunds: {
    title: "자금 사용 계획",
    simplified: [
      { category: "제품 개발", percentage: 40 },
      { category: "시장 진출", percentage: 30 },
      { category: "운영", percentage: 20 },
      { category: "법무 및 관리", percentage: 10 },
    ],
  },
  cta: {
    primary: "투자 덱 요청",
    secondary: "미팅 일정 잡기",
    note: "NDA 체결 후 상세 재무 모델 제공",
  },
};
