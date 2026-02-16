import { DemoTranslation } from "../types";

export const demo: DemoTranslation = {
  title: "베타 프로그램에 참여하세요",
  subtitle: "현장 운영의 미래를 만들어갈 첫 50명의 얼리 어답터가 되어주세요",
  cta: {
    primary: "베타 참여 (무료)",
    secondary: "투자 덱 요청",
  },
  form: {
    fields: {
      name: "이름",
      email: "이메일",
      company: "회사명",
      phone: "연락처",
      message: "문의 내용",
    },
    placeholders: {
      name: "이름을 입력하세요",
      email: "이메일을 입력하세요",
      company: "회사명을 입력하세요",
      phone: "연락처를 입력하세요",
      message: "문의 내용을 입력하세요",
    },
    required: "*",
    submit: "데모 요청하기",
  },
  footer: {
    companyName: "iil",
    tagline: "물리적 현장 운영의 마지막 마일을 디지털화",
    copyright: "© 2026 iil, Inc. All rights reserved.",
    links: [
      { text: "소개", href: "#about" },
      { text: "제품", href: "#products" },
      { text: "가격", href: "#pricing" },
      { text: "파트너십", href: "#partnership" },
      { text: "문의", href: "#contact" },
    ],
  },
};
