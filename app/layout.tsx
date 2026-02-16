import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "900"],
  variable: "--font-inter",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "iil | Digitizing the Last Mile of Physical Operations",
  description:
    "iil designs software for humanity and the world. Our software enables real-time decision-making through Human-AI collaboration in physical field operations.",
  keywords: [
    "iil",
    "BlackVox",
    "Field Operations",
    "Physical Operations",
    "AI Collaboration",
    "Reservation System",
    "Risk Management",
    "Liability Data",
    "현장 운영",
    "AI 협업",
  ],
  authors: [{ name: "iil, Inc." }],
  openGraph: {
    title: "iil | Digitizing the Last Mile of Physical Operations",
    description:
      "Our horizons are vast. iil designs software for humanity and the world.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iil | Digitizing the Last Mile of Physical Operations",
    description:
      "Our horizons are vast. iil designs software for humanity and the world.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        className={cn(
          inter.variable,
          robotoMono.variable,
          "font-sans antialiased min-h-screen bg-background"
        )}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
