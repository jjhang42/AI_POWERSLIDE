/**
 * AI 생성 섹션 관리
 */

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'ai-sections.json');

/**
 * AI-Generated Section 데이터 구조
 */
export interface AISectionData {
  id: string;
  type: 'ai-generated';
  metadata: {
    title: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    aiModel?: string;
  };
  code: string; // React 컴포넌트 코드
  editableFields: Record<string, {
    type: 'text' | 'textarea' | 'color' | 'image' | 'number';
    label: string;
    value: any;
  }>;
  dependencies?: string[]; // npm packages needed
  cssClasses?: string; // Tailwind classes
}

/**
 * AI 섹션 목록 가져오기 (서버 사이드)
 */
export function getAISections(): AISectionData[] {
  if (typeof window !== 'undefined') {
    // 클라이언트에서는 API 호출 필요
    return [];
  }

  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('[AI Sections] Failed to read:', error);
    return [];
  }
}

/**
 * AI 섹션 저장 (서버 사이드)
 */
export function saveAISections(sections: AISectionData[]): void {
  if (typeof window !== 'undefined') {
    throw new Error('Cannot save on client side');
  }

  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(sections, null, 2));
  } catch (error) {
    console.error('[AI Sections] Failed to save:', error);
    throw error;
  }
}

/**
 * 클라이언트에서 AI 섹션 가져오기 (API 라우트 사용)
 */
export async function fetchAISections(): Promise<AISectionData[]> {
  try {
    const response = await fetch('/api/ai-sections');
    if (!response.ok) {
      throw new Error('Failed to fetch AI sections');
    }
    return await response.json();
  } catch (error) {
    console.error('[AI Sections] Failed to fetch:', error);
    return [];
  }
}

/**
 * 필드 값 업데이트 (클라이언트)
 */
export async function updateAIFieldValue(
  id: string,
  fieldName: string,
  value: any
): Promise<boolean> {
  try {
    const response = await fetch('/api/ai-sections/update-field', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, fieldName, value }),
    });
    return response.ok;
  } catch (error) {
    console.error('[AI Sections] Failed to update field:', error);
    return false;
  }
}
