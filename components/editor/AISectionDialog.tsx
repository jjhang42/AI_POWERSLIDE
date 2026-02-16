"use client";

/**
 * AISectionDialog
 * AI로 새 섹션 생성
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";

interface AISectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string) => Promise<void>;
}

export function AISectionDialog({
  isOpen,
  onClose,
  onGenerate,
}: AISectionDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      await onGenerate(prompt.trim());
      setPrompt("");
      onClose();
    } catch (error) {
      console.error("섹션 생성 실패:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* 다이얼로그 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl z-[201]"
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">AI로 섹션 생성</h2>
                  <p className="text-sm text-muted-foreground">
                    원하는 섹션을 설명하면 자동으로 생성됩니다
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full w-10 h-10 hover:bg-muted transition-colors flex items-center justify-center"
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 본문 */}
            <div className="p-6 space-y-4">
              {/* 프롬프트 입력 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  섹션 설명
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="예: 우리 제품의 3가지 핵심 기능을 소개하는 섹션을 만들어주세요. 각 기능마다 아이콘, 제목, 설명이 있어야 합니다."
                  className="w-full h-32 px-4 py-3 bg-muted/50 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isGenerating}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  💡 Tip: 구체적으로 설명할수록 원하는 결과를 얻을 수 있습니다
                </p>
              </div>

              {/* 예시 프롬프트 */}
              <div className="space-y-2">
                <p className="text-sm font-medium">예시:</p>
                <div className="space-y-1">
                  {[
                    "팀 소개 섹션 - 3명의 팀원 프로필 (이름, 역할, 한 줄 소개)",
                    "가격 비교표 섹션 - Free, Pro, Enterprise 3가지 플랜",
                    "고객 후기 섹션 - 3개의 후기 카드 (이름, 회사, 후기 내용)",
                  ].map((example, i) => (
                    <button
                      key={i}
                      onClick={() => setPrompt(example)}
                      className="block w-full text-left px-3 py-2 text-sm bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors"
                      disabled={isGenerating}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 푸터 */}
            <div className="flex items-center justify-between p-6 border-t border-border">
              <p className="text-xs text-muted-foreground">
                ⌘ + Enter 또는 Ctrl + Enter로 생성
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg hover:bg-muted transition-colors"
                  disabled={isGenerating}
                >
                  취소
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      생성하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
