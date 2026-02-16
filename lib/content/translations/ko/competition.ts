import { CompetitionTranslation } from "../types";

export const competition: CompetitionTranslation = {
  badge: "실제 경쟁",
  title: "업계 리더와의 비교",
  subtitle: "하드웨어 종속 vs. 소프트웨어 우선",
  competitors: [
    { name: "모토로라 솔루션즈", logo: "/logos/motorola.svg" },
    { name: "제브라 테크놀로지스", logo: "/logos/zebra.svg" },
    { name: "레거시 무선 시스템" },
  ],
  advantages: [
    "하드웨어 비용 $0 vs. 기기당 $500+",
    "단순 음성 전송이 아닌 AI 기반 인사이트 제공",
    "1시간 이내 배포 vs. 2-4주 설정 시간",
  ],
  realCompetition: "진짜 경쟁자는? 엑셀 스프레드시트와 카카오톡 단체방입니다.",
};
