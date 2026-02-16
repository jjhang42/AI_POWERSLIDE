import { NextResponse } from "next/server";
import { reorderSections } from "@/lib/editor/sections";

/**
 * POST /api/sections/reorder
 * 섹션 순서 변경
 */
export async function POST(request: Request) {
  try {
    const { newOrder } = await request.json();

    if (!Array.isArray(newOrder)) {
      return NextResponse.json(
        { error: "newOrder must be an array of section IDs" },
        { status: 400 }
      );
    }

    const success = reorderSections(newOrder);

    if (!success) {
      return NextResponse.json(
        { error: "섹션 순서 변경 실패" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] 섹션 순서 변경 오류:", error);
    return NextResponse.json(
      { error: "섹션 순서 변경 중 오류 발생" },
      { status: 500 }
    );
  }
}
