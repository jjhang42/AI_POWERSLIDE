"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";
import { LanguageSettings } from "./LanguageSettings";
import { AspectRatioSettings } from "./AspectRatioSettings";
import { ExportSettings } from "./ExportSettings";

export function SettingsSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 설정 버튼 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 right-6 z-[150]"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="rounded-full px-4 py-2 bg-card/80 backdrop-blur-md border border-border shadow-lg hover:bg-card/90 transition-all"
        >
          <Settings className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">설정</span>
        </Button>
      </motion.div>

      {/* 배경 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[125]"
          />
        )}
      </AnimatePresence>

      {/* 우측 사이드바 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-[130] overflow-y-auto"
          >
            {/* 헤더 */}
            <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">설정</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="rounded-full w-9 h-9 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* 컨텐츠 */}
            <div className="p-6 space-y-8">
              {/* 언어 설정 */}
              <LanguageSettings />

              {/* 구분선 */}
              <div className="border-t border-border" />

              {/* 화면 비율 설정 */}
              <AspectRatioSettings />

              {/* 구분선 */}
              <div className="border-t border-border" />

              {/* 내보내기 */}
              <ExportSettings />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
