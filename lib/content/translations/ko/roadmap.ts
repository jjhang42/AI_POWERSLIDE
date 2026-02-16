import { RoadmapTranslation } from "../types";

export const roadmap: RoadmapTranslation = {
  badge: "로드맵",
  title: "제품 로드맵 및 마일스톤",
  subtitle: "MVP부터 제품-시장 적합성까지의 경로",
  milestones: [
    {
      name: "MVP 완료",
      status: "complete",
      date: "2026년 1분기",
      target: "5명의 테스트 사용자와 작동 프로토타입 검증",
    },
    {
      name: "베타 론칭",
      status: "in-progress",
      date: "2026년 2분기",
      target: "베타 고객 10명",
    },
    {
      name: "첫 100명 고객 확보",
      status: "planned",
      date: "2026년 4분기",
      target: "$120K ARR",
    },
  ],
};
