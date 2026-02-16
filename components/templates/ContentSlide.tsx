/**
 * Content Slide Template
 * 제목 + 본문 텍스트
 */

interface ContentSlideProps {
  title: string;
  content: string | React.ReactNode;
  align?: "left" | "center";
}

export function ContentSlide({ title, content, align = "left" }: ContentSlideProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`w-full h-full flex flex-col ${alignClass} p-16`}>
      {/* Title */}
      <h2 className="text-5xl font-bold tracking-tight mb-8">
        {title}
      </h2>

      {/* Content */}
      <div className="text-2xl text-muted-foreground leading-relaxed max-w-5xl">
        {typeof content === "string" ? <p>{content}</p> : content}
      </div>
    </div>
  );
}
