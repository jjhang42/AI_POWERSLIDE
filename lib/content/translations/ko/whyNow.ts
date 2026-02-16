import { WhyNowTranslation } from "../types";

export const whyNow: WhyNowTranslation = {
  badge: "왜 지금인가?",
  title: "침묵의 대가",
  subtitle: "럭셔리 팝업스토어 실제 사례",
  visualExample: {
    title: "프리미엄 선물세트 분실",
    scenario: "매니저: '개당 100만원 VIP 선물세트 어디 있어요?'",
    timeline: [
      {
        time: "15분 후",
        event: "직원 3명이 찾는 중. 정상 업무 중단.",
        cost: "10만원",
      },
      {
        time: "1시간 후",
        event: "고객 대기 한계. VIP 1명 이탈.",
        cost: "100만원",
      },
      {
        time: "3시간 후",
        event: "발견했지만 습도로 3개 파손.",
        cost: "300만원",
      },
    ],
    solution: "BlackVox 사용 시: 30초 안에 음성 기록 검색 → 문제 즉시 해결 → 손실 제로",
  },
};
