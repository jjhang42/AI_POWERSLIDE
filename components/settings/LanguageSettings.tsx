"use client";

import { useLanguage } from "@/app/providers/PresentationProvider";
import { Button } from "@/components/ui/button";
import { Globe, Languages } from "lucide-react";

export function LanguageSettings() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: "ko" | "en") => {
    console.log(`[LanguageSettings] Button clicked, changing to: ${lang}`);
    console.log(`[LanguageSettings] Current language: ${language}`);
    console.log(`[LanguageSettings] setLanguage function:`, setLanguage);
    setLanguage(lang);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">언어 / Language</h3>
      </div>

      <div className="flex gap-2">
        <Button
          variant={language === "ko" ? "default" : "outline"}
          onClick={() => handleLanguageChange("ko")}
          className="flex-1 h-12"
        >
          <Languages className="w-4 h-4 mr-2" />
          한국어
        </Button>
        <Button
          variant={language === "en" ? "default" : "outline"}
          onClick={() => handleLanguageChange("en")}
          className="flex-1 h-12"
        >
          <Globe className="w-4 h-4 mr-2" />
          English
        </Button>
      </div>
    </section>
  );
}
