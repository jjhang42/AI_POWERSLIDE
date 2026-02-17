/**
 * Image with Caption Template
 * 이미지 + 캡션
 */

import Image from "next/image";
import { EditableText } from "@/components/editor/EditableText";
import { ImageWithCaptionProps } from "@/lib/types/slides";
import { useDraggableWrapper, WithDraggableProps } from "@/components/positioning/withDraggableElements";

export function ImageWithCaption({
  title,
  imageSrc,
  imageAlt,
  caption,
  layout = "contained",
  className = "",
  style,
  backgroundColor = "",
  textColor = "",
  positions = {},
  onUpdate,
  isPositioningEnabled = false,
  selectedElementId = null,
  onSelectElement,
}: ImageWithCaptionProps & WithDraggableProps & {
  onUpdate?: (newProps: Partial<ImageWithCaptionProps>) => void;
}) {
  // Draggable wrappers
  const titleDraggable = useDraggableWrapper(
    'title',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  const captionDraggable = useDraggableWrapper(
    'caption',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  return (
    <div
      className={`w-full h-full flex flex-col ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Title */}
      {title && titleDraggable.wrapWithDraggable(
        <EditableText
          value={title}
          onChange={(newTitle) => onUpdate?.({ title: newTitle })}
          className={`text-5xl font-bold tracking-tight mb-8 ${textColor}`}
          disabled={isPositioningEnabled}
        />
      )}

      {/* Image Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className={`relative ${layout === "fullscreen" ? "w-full h-full" : "max-w-4xl max-h-[600px]"} rounded-lg overflow-hidden shadow-2xl`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
          />
        </div>

        {/* Caption */}
        {caption && captionDraggable.wrapWithDraggable(
          <EditableText
            value={caption}
            onChange={(newCaption) => onUpdate?.({ caption: newCaption })}
            className={`text-xl ${textColor || 'text-muted-foreground'} text-center mt-6 max-w-3xl`}
            disabled={isPositioningEnabled}
          />
        )}
      </div>
    </div>
  );
}
