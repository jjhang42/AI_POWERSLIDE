"use client";

/**
 * ManageSectionTab
 * 섹션 관리 탭 (순서 변경, 삭제)
 */

import React, { useState } from "react";
import { SectionList } from "../SectionList";
import { useEditor } from "@/app/providers/PresentationProvider";
import { AlertTriangle } from "lucide-react";

export function ManageSectionTab() {
  const { deleteSection } = useEditor();
  const [deleteConfirm, setDeleteConfirm] = useState<{
    id: string;
    show: boolean;
  } | null>(null);

  const handleDeleteRequest = (id: string) => {
    setDeleteConfirm({ id, show: true });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      deleteSection(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div>
      <SectionList onDelete={handleDeleteRequest} />

      {/* 삭제 확인 다이얼로그 */}
      {deleteConfirm?.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[160]">
          <div className="bg-card rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  섹션 삭제
                </h3>
                <p className="text-sm text-muted-foreground">
                  이 섹션을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-muted hover:bg-muted/80 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
