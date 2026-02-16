import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

/**
 * POST /api/sections/generate
 * AI로 새 섹션 생성
 */
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "프롬프트가 필요합니다" },
        { status: 400 }
      );
    }

    // Anthropic API 클라이언트 초기화
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error("ANTHROPIC_API_KEY가 설정되지 않았습니다");
      return NextResponse.json(
        { error: "AI 서비스 설정이 필요합니다" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // AI에게 섹션 생성 요청
    const systemPrompt = `당신은 React/Next.js 프레젠테이션 섹션을 생성하는 전문가입니다.

사용자의 요청을 분석하여 다음 형식의 JSON을 생성하세요:

{
  "metadata": {
    "title": "섹션 제목",
    "description": "섹션 설명",
    "category": "카테고리 (선택사항)"
  },
  "code": "React 컴포넌트 코드 (JSX)",
  "editableFields": {
    "fieldName": {
      "type": "text" | "textarea" | "color" | "image" | "number",
      "label": "필드 라벨",
      "value": "기본값"
    }
  },
  "dependencies": ["필요한 라이브러리 배열 (선택사항)"]
}

중요 규칙:
1. code는 완전한 React 컴포넌트 JSX 문자열이어야 합니다
2. Tailwind CSS를 사용하여 스타일링하세요
3. framer-motion을 사용하여 애니메이션을 추가하세요
4. lucide-react 아이콘을 사용할 수 있습니다
5. editableFields는 사용자가 나중에 수정할 수 있는 텍스트/색상/이미지 필드입니다
6. 모든 텍스트 콘텐츠는 editableFields에 포함되어야 합니다
7. 반드시 유효한 JSON만 반환하세요 (마크다운 코드 블록 없이)
8. code 내부의 문자열은 반드시 이스케이프 처리하세요

예시 응답:
{
  "metadata": {
    "title": "팀 소개",
    "description": "팀원 프로필 소개 섹션",
    "category": "팀"
  },
  "code": "<Section className=\\"py-20 bg-background\\">\\n  <div className=\\"container mx-auto px-6\\">\\n    <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className=\\"text-4xl font-bold text-center mb-12\\">{editableFields.title.value}</motion.h2>\\n    <div className=\\"grid grid-cols-3 gap-8\\">\\n      {/* 팀원 카드 */}\\n    </div>\\n  </div>\\n</Section>",
  "editableFields": {
    "title": {
      "type": "text",
      "label": "섹션 제목",
      "value": "우리 팀"
    },
    "subtitle": {
      "type": "textarea",
      "label": "부제목",
      "value": "열정적인 팀원들을 소개합니다"
    }
  }
}`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // AI 응답 파싱
    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("예상치 못한 응답 형식");
    }

    let aiResponse;
    try {
      // JSON 파싱 (마크다운 코드 블록 제거)
      const jsonText = content.text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      aiResponse = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("AI 응답 파싱 실패:", content.text);
      throw new Error("AI 응답을 파싱할 수 없습니다");
    }

    // Section 객체 생성
    const timestamp = Date.now();
    const section = {
      metadata: {
        ...aiResponse.metadata,
        isDefault: false,
        isDeletable: true,
        createdAt: timestamp,
        updatedAt: timestamp,
        aiModel: "claude-sonnet-4-20250514",
      },
      code: aiResponse.code,
      editableFields: aiResponse.editableFields || {},
      dependencies: aiResponse.dependencies || [],
    };

    return NextResponse.json({ success: true, section });
  } catch (error) {
    console.error("[API] 섹션 생성 오류:", error);
    return NextResponse.json(
      {
        error: "섹션 생성 중 오류 발생",
        details: error instanceof Error ? error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
