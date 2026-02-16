/**
 * API Route: AI Sections
 * GET: AI 섹션 목록 조회
 */

import { NextResponse } from 'next/server';
import { getAISections } from '@/lib/editor/aiSections';

export async function GET() {
  try {
    const sections = getAISections();
    return NextResponse.json(sections);
  } catch (error) {
    console.error('[API] Failed to get AI sections:', error);
    return NextResponse.json([], { status: 500 });
  }
}
