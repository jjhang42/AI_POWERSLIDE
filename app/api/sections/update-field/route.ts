/**
 * API Route: Update Section Field
 * POST: 섹션의 편집 가능한 필드 값 업데이트
 */

import { NextResponse } from "next/server";
import { updateFieldValue } from "@/lib/editor/sections";

export async function POST(request: Request) {
  try {
    const { id, fieldName, value } = await request.json();

    if (!id || !fieldName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const success = updateFieldValue(id, fieldName, value);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update field" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] Failed to update field:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
