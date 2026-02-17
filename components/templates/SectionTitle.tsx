/**
 * Section Title Template
 * 섹션 구분 슬라이드
 */

import { EditableText } from "@/components/editor/EditableText";
import { SectionTitleProps } from "@/lib/types/slides";
import { useDraggableWrapper, WithDraggableProps } from "@/components/positioning/withDraggableElements";

export function SectionTitle({
  section,
  title,
  description,
  className = "",
  style,
  backgroundColor = "bg-gradient-to-br from-primary/10 via-background to-background",
  textColor = "",
  positions = {},
  onUpdate,
  isPositioningEnabled = false,
  selectedElementId = null,
  onSelectElement,
}: SectionTitleProps & WithDraggableProps & {
  onUpdate?: (newProps: Partial<SectionTitleProps>) => void;
}) {
  // Draggable wrappers
  const sectionDraggable = useDraggableWrapper(
    'section',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  const titleDraggable = useDraggableWrapper(
    'title',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  const descriptionDraggable = useDraggableWrapper(
    'description',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Section Number/Label */}
      {sectionDraggable.wrapWithDraggable(
        <EditableText
          value={section}
          onChange={(newSection) => onUpdate?.({ section: newSection })}
          className={`${textColor || 'text-primary'} text-xl font-bold uppercase tracking-widest mb-4`}
          disabled={isPositioningEnabled}
        />
      )}

      {/* Section Title */}
      {titleDraggable.wrapWithDraggable(
        <EditableText
          value={title}
          onChange={(newTitle) => onUpdate?.({ title: newTitle })}
          className={`text-6xl font-black tracking-tight text-center mb-6 max-w-4xl ${textColor}`}
          disabled={isPositioningEnabled}
        />
      )}

      {/* Description */}
      {description && descriptionDraggable.wrapWithDraggable(
        <EditableText
          value={description}
          onChange={(newDescription) => onUpdate?.({ description: newDescription })}
          className={`text-2xl ${textColor || 'text-muted-foreground'} text-center max-w-3xl`}
          disabled={isPositioningEnabled}
        />
      )}
    </div>
  );
}
