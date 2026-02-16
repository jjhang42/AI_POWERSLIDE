/**
 * Title Slide Template
 * 표지 슬라이드 - 프레젠테이션 시작
 */

import { EditableText } from "@/components/editor/EditableText";
import { TitleSlideProps } from "@/lib/types/slides";

export function TitleSlide({
  title,
  subtitle,
  author,
  date,
  logo,
  className = "",
  style,
  backgroundColor = "bg-gradient-to-br from-background via-background to-muted/20",
  textColor = "",
  onUpdate
}: TitleSlideProps & {
  logo?: React.ReactNode;
  onUpdate?: (newProps: Partial<TitleSlideProps>) => void;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Logo */}
      {logo && (
        <div className="mb-8">
          {logo}
        </div>
      )}

      {/* Main Title */}
      <EditableText
        value={title}
        onChange={(newTitle) => onUpdate?.({ title: newTitle })}
        className={`text-7xl font-black tracking-tight text-center mb-6 max-w-5xl ${textColor}`}
      />

      {/* Subtitle */}
      {subtitle && (
        <EditableText
          value={subtitle}
          onChange={(newSubtitle) => onUpdate?.({ subtitle: newSubtitle })}
          className={`text-3xl ${textColor || 'text-muted-foreground'} text-center mb-12 max-w-4xl`}
        />
      )}

      {/* Author & Date */}
      {(author || date) && (
        <div className="mt-auto text-center space-y-2">
          {author && (
            <EditableText
              value={author}
              onChange={(newAuthor) => onUpdate?.({ author: newAuthor })}
              className={`text-xl font-medium ${textColor || 'text-foreground'}`}
            />
          )}
          {date && (
            <EditableText
              value={date}
              onChange={(newDate) => onUpdate?.({ date: newDate })}
              className={`text-lg ${textColor || 'text-muted-foreground'}`}
            />
          )}
        </div>
      )}
    </div>
  );
}
