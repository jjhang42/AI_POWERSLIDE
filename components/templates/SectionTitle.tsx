/**
 * Section Title Template
 * 섹션 구분 슬라이드
 */

import { EditableText } from "@/components/editor/EditableText";
import { SectionTitleProps } from "@/lib/types/slides";

export function SectionTitle({
  section,
  title,
  description,
  className = "",
  style,
  backgroundColor = "bg-gradient-to-br from-primary/10 via-background to-background",
  textColor = "",
  onUpdate
}: SectionTitleProps & {
  onUpdate?: (newProps: Partial<SectionTitleProps>) => void;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Section Number/Label */}
      <EditableText
        value={section}
        onChange={(newSection) => onUpdate?.({ section: newSection })}
        className={`${textColor || 'text-primary'} text-xl font-bold uppercase tracking-widest mb-4`}
      />

      {/* Section Title */}
      <EditableText
        value={title}
        onChange={(newTitle) => onUpdate?.({ title: newTitle })}
        className={`text-6xl font-black tracking-tight text-center mb-6 max-w-4xl ${textColor}`}
      />

      {/* Description */}
      {description && (
        <EditableText
          value={description}
          onChange={(newDescription) => onUpdate?.({ description: newDescription })}
          className={`text-2xl ${textColor || 'text-muted-foreground'} text-center max-w-3xl`}
        />
      )}
    </div>
  );
}
