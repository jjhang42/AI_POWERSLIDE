"use client";

/**
 * EditorSidebar
 * 좌측 에디터 사이드바 - 섹션 관리 전용
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useEditor } from "@/app/providers/PresentationProvider";
import { SectionList } from "./SectionList";
import { AISectionDialog } from "./AISectionDialog";

export function EditorSidebar() {
  const { isOpen, closeSidebar } = useEditor();
  const [showAIDialog, setShowAIDialog] = useState(false);

  const handleAddSection = () => {
    setShowAIDialog(true);
  };

  const handleGenerateSection = async (prompt: string) => {
    try {
      // AI API 호출하여 섹션 생성
      const response = await fetch("/api/sections/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("섹션 생성 실패");
      }

      const { section } = await response.json();

      // 섹션 저장
      const saveResponse = await fetch("/api/sections/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });

      if (!saveResponse.ok) {
        throw new Error("섹션 저장 실패");
      }

      // 페이지 새로고침하여 새 섹션 표시
      window.location.reload();
    } catch (error) {
      console.error("섹션 생성 오류:", error);
      alert("섹션 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[135]"
            />

            {/* 사이드바 */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[420px] bg-card border-r border-border shadow-2xl z-[140] flex flex-col"
            >
              {/* 헤더 */}
              <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold">섹션 관리</h2>
                <div className="flex items-center gap-2">
                  {/* 섹션 추가 버튼 */}
                  <button
                    onClick={handleAddSection}
                    className="rounded-full w-9 h-9 p-0 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center"
                    aria-label="섹션 추가"
                    title="AI로 섹션 생성"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  {/* 닫기 버튼 */}
                  <button
                    onClick={closeSidebar}
                    className="rounded-full w-9 h-9 p-0 hover:bg-muted transition-colors flex items-center justify-center"
                    aria-label="닫기"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 메인 콘텐츠: 섹션 리스트 */}
              <div className="flex-1 overflow-y-auto p-6">
                <SectionList />
              </div>

              {/* 푸터 */}
              <div className="px-6 py-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  드래그하여 섹션 순서를 변경하세요
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI 섹션 생성 다이얼로그 */}
      <AISectionDialog
        isOpen={showAIDialog}
        onClose={() => setShowAIDialog(false)}
        onGenerate={handleGenerateSection}
      />
    </>
  );
}
