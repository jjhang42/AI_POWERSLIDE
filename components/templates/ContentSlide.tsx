/**
 * Content Slide Template
 * 제목 + 본문 텍스트
 */

import { EditableText } from "@/components/editor/EditableText";
import { ContentSlideProps } from "@/lib/types/slides";
import { useDraggableWrapper, WithDraggableProps } from "@/components/positioning/withDraggableElements";

export function ContentSlide({
  title,
  content,
  align = "left",
  className = "",
  style,
  backgroundColor = "",
  textColor = "",
  positions = {},
  onUpdate,
  isPositioningEnabled = false,
  selectedElementId = null,
  onSelectElement,
}: ContentSlideProps & WithDraggableProps & {
  onUpdate?: (newProps: Partial<ContentSlideProps>) => void;
}) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  // Draggable wrappers
  const titleDraggable = useDraggableWrapper(
    'title',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  const contentDraggable = useDraggableWrapper(
    'content',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  return (
    <div
      className={`w-full h-full flex flex-col ${alignClass} ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Title */}
      {titleDraggable.wrapWithDraggable(
        <EditableText
          value={title}
          onChange={(newTitle) => onUpdate?.({ title: newTitle })}
          className={`text-5xl font-bold tracking-tight mb-8 ${textColor}`}
          disabled={isPositioningEnabled}
        />
      )}

      {/* Content */}
      {contentDraggable.wrapWithDraggable(
        typeof content === "string" ? (
          <EditableText
            value={content}
            onChange={(newContent) => onUpdate?.({ content: newContent })}
            className={`text-2xl ${textColor || 'text-muted-foreground'} leading-relaxed max-w-5xl`}
            multiline
            disabled={isPositioningEnabled}
          />
        ) : (
          <div className={`text-2xl ${textColor || 'text-muted-foreground'} leading-relaxed max-w-5xl`}>
            {content}
          </div>
        )
      )}
    </div>
  );
}
