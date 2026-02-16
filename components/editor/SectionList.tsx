"use client";

/**
 * SectionList
 * 모든 섹션 리스트 (정적 + 동적 + AI)
 * 드래그앤드롭으로 순서 변경 가능
 */

import React, { useState, useEffect } from "react";
import { Reorder } from "framer-motion";
import { GripVertical, Trash2, Lock, Layers, Sparkles } from "lucide-react";
import { useEditor, useNavigation } from "@/app/providers/PresentationProvider";

interface SectionItem {
  id: string;
  title: string;
  type: "ai";
  isDeletable: boolean;
  icon?: any;
  badge?: string;
}

interface SectionListProps {
  onDelete?: (id: string) => void;
}

export function SectionList({ onDelete }: SectionListProps = {}) {
  const { sections } = useNavigation();
  const { dynamicSections, deleteSection } = useEditor();
  const [items, setItems] = useState<SectionItem[]>([]);

  // 섹션 리스트 생성
  useEffect(() => {
    const sectionItems: SectionItem[] = sections.map((section) => {
      return {
        id: section.id,
        title: section.title || section.id,
        type: "ai" as const,
        isDeletable: true,
        icon: Sparkles,
        badge: "AI",
      };
    });

    setItems(sectionItems);
  }, [sections, dynamicSections]);

  const handleReorder = async (newOrder: SectionItem[]) => {
    setItems(newOrder);

    try {
      // 섹션 순서 변경 API 호출
      const response = await fetch("/api/sections/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newOrder: newOrder.map((item) => item.id),
        }),
      });

      if (!response.ok) {
        throw new Error("섹션 순서 변경 실패");
      }

      // 성공 시 페이지 새로고침
      window.location.reload();
    } catch (error) {
      console.error("섹션 순서 변경 오류:", error);
      alert("섹션 순서 변경 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      // 외부에서 삭제 로직 제어
      onDelete(id);
    } else {
      // 기본 동작: window.confirm 사용
      if (window.confirm("이 섹션을 삭제하시겠습니까?")) {
        deleteSection(id);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">섹션이 없습니다</p>
        <p className="text-sm text-muted-foreground">
          '+' 버튼을 눌러 새 섹션을 추가하세요
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">
          전체 섹션 ({items.length}개)
        </h3>
        <p className="text-xs text-muted-foreground">
          드래그하여 순서를 변경하거나 삭제할 수 있습니다
        </p>
      </div>

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={handleReorder}
        className="space-y-2"
      >
        {items.map((item, index) => {
          const Icon = item.icon || Layers;

          return (
            <Reorder.Item
              key={item.id}
              value={item}
              className={`border rounded-lg p-3 transition-all ${
                item.isDeletable
                  ? "cursor-move hover:shadow-md bg-card"
                  : "cursor-move hover:shadow-sm bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* 드래그 핸들 */}
                <GripVertical
                  className={`w-5 h-5 flex-shrink-0 ${
                    item.isDeletable ? "text-muted-foreground" : "text-muted-foreground/50"
                  }`}
                />

                {/* 인덱스 */}
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>

                {/* 아이콘 */}
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                    item.type === "ai" ? "bg-purple-50" : "bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      item.type === "ai" ? "text-purple-600" : "text-gray-600"
                    }`}
                  />
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium truncate">
                      {item.title}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        item.type === "ai"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.id}
                  </p>
                </div>

                {/* 액션 버튼 */}
                {item.isDeletable ? (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-2 text-muted-foreground/50 flex-shrink-0" title="삭제 불가">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* 통계 */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {items.length}
          </div>
          <div className="text-xs text-muted-foreground">총 섹션</div>
        </div>
      </div>
    </div>
  );
}
