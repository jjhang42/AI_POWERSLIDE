import { DemoTranslation } from "../types";

export const demo: DemoTranslation = {
  title: "Join Our Beta Program",
  subtitle: "Be among the first 50 early adopters to shape the future of field operations",
  cta: {
    primary: "Join Beta (Free)",
    secondary: "Request Investment Deck",
  },
  form: {
    fields: {
      name: "Name",
      email: "Email",
      company: "Company",
      phone: "Phone",
      message: "Message",
    },
    placeholders: {
      name: "Enter your name",
      email: "Enter your email",
      company: "Enter your company name",
      phone: "Enter your phone number",
      message: "Enter your message",
    },
    required: "*",
    submit: "Request Demo",
  },
  footer: {
    companyName: "iil",
    tagline: "Digitizing the Last Mile of Physical Operations",
    copyright: "© 2026 iil, Inc. All rights reserved.",
    links: [
      { text: "About", href: "#about" },
      { text: "Products", href: "#products" },
      { text: "Pricing", href: "#pricing" },
      { text: "Partnership", href: "#partnership" },
      { text: "Contact", href: "#contact" },
    ],
  },
};
