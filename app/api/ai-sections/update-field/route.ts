/**
 * API Route: Update AI Section Field
 * POST: 편집 가능한 필드 값 업데이트
 */

import { NextResponse } from 'next/server';
import { getAISections, saveAISections } from '@/lib/editor/aiSections';

export async function POST(request: Request) {
  try {
    const { id, fieldName, value } = await request.json();

    if (!id || !fieldName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sections = getAISections();
    const index = sections.findIndex((s) => s.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    if (!sections[index].editableFields[fieldName]) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      );
    }

    // 필드 값 업데이트
    sections[index].editableFields[fieldName].value = value;
    sections[index].metadata.updatedAt = Date.now();

    saveAISections(sections);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Failed to update field:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
