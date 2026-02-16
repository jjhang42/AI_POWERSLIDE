/**
 * API Route: Sections
 * GET: 모든 섹션 가져오기
 */

import { NextResponse } from "next/server";
import { getSections } from "@/lib/editor/sections";

export async function GET() {
  try {
    const sections = getSections();
    return NextResponse.json(sections);
  } catch (error) {
    console.error("[API] Failed to get sections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
