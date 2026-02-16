import { NextResponse } from "next/server";
import { getSections, saveSection } from "@/lib/editor/sections";
import type { Section } from "@/lib/editor/types";

/**
 * POST /api/sections/add
 * 새 섹션 추가
 */
export async function POST(request: Request) {
  try {
    const newSection: Omit<Section, "id" | "order"> = await request.json();
    
    // 현재 섹션 목록 가져오기
    const sections = getSections();
    
    // 새 섹션 ID 및 order 생성
    const timestamp = Date.now();
    const section: Section = {
      ...newSection,
      id: `ai-${timestamp}`,
      order: sections.length,
    };
    
    // 섹션 저장
    const success = saveSection(section);
    
    if (!success) {
      return NextResponse.json(
        { error: "섹션 저장 실패" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, section });
  } catch (error) {
    console.error("[API] 섹션 추가 오류:", error);
    return NextResponse.json(
      { error: "섹션 추가 중 오류 발생" },
      { status: 500 }
    );
  }
}
