/**
 * Section Title Template
 * 섹션 구분 슬라이드
 */

interface SectionTitleProps {
  section: string;
  title: string;
  description?: string;
}

export function SectionTitle({ section, title, description }: SectionTitleProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-16">
      {/* Section Number/Label */}
      <div className="text-primary text-xl font-bold uppercase tracking-widest mb-4">
        {section}
      </div>

      {/* Section Title */}
      <h2 className="text-6xl font-black tracking-tight text-center mb-6 max-w-4xl">
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-2xl text-muted-foreground text-center max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
}
