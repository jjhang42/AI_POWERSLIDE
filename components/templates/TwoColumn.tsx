/**
 * Two Column Template
 * 2열 레이아웃 - 텍스트/이미지 조합
 */

import { EditableText } from "@/components/editor/EditableText";
import { TwoColumnProps } from "@/lib/types/slides";

export function TwoColumn({
  title,
  left,
  right,
  split = "50-50",
  className = "",
  style,
  backgroundColor = "",
  textColor = "",
  onUpdate
}: TwoColumnProps & {
  onUpdate?: (newProps: Partial<TwoColumnProps>) => void;
}) {
  const gridCols = {
    "50-50": "grid-cols-2",
    "60-40": "grid-cols-[60%_40%]",
    "40-60": "grid-cols-[40%_60%]",
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Title */}
      {title && (
        <EditableText
          value={title}
          onChange={(newTitle) => onUpdate?.({ title: newTitle })}
          className={`text-5xl font-bold tracking-tight mb-8 ${textColor}`}
        />
      )}

      {/* Two Column Content */}
      <div className={`grid ${gridCols[split]} gap-12 flex-1`}>
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          {typeof left === "string" ? (
            <EditableText
              value={left}
              onChange={(newLeft) => onUpdate?.({ left: newLeft })}
              className={`text-2xl ${textColor || 'text-foreground'} leading-relaxed`}
              multiline
            />
          ) : (
            left
          )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center">
          {typeof right === "string" ? (
            <EditableText
              value={right}
              onChange={(newRight) => onUpdate?.({ right: newRight })}
              className={`text-2xl ${textColor || 'text-foreground'} leading-relaxed`}
              multiline
            />
          ) : (
            right
          )}
        </div>
      </div>
    </div>
  );
}
