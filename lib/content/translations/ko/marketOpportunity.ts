import { MarketOpportunityTranslation } from "../types";

export const marketOpportunity: MarketOpportunityTranslation = {
  badge: "시장 규모",
  title: "시장 기회",
  subtitle: "데스크리스 워크포스 시장",
  definition: {
    term: "데스크리스 워크포스 (Deskless Workforce)",
    explanation: "컴퓨터 없이 일하는 근로자: 건설, 유통, 물류, 제조, 이벤트",
    size: "27억 근로자",
    percentage: "전 세계 노동력의 80%",
  },
  funnel: [
    {
      level: "TAM",
      size: "$50B",
      description: "글로벌 현장 데이터 및 커뮤니케이션 시장",
    },
    {
      level: "SAM",
      size: "$5B",
      description: "이벤트 및 유통 운영 (아시아-태평양)",
    },
    {
      level: "SOM",
      size: "$150M",
      description: "럭셔리 팝업스토어 및 이벤트 (한국/일본 1년차)",
    },
  ],
};
