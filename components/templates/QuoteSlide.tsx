/**
 * Quote Slide Template
 * 인용구 슬라이드
 */

import { Quote } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { QuoteSlideProps } from "@/lib/types/slides";
import { useDraggableWrapper, WithDraggableProps } from "@/components/positioning/withDraggableElements";

export function QuoteSlide({
  quote,
  author,
  title,
  className = "",
  style,
  backgroundColor = "bg-gradient-to-br from-muted/20 to-background",
  textColor = "",
  positions = {},
  onUpdate,
  isPositioningEnabled = false,
  selectedElementId = null,
  onSelectElement,
}: QuoteSlideProps & WithDraggableProps & {
  onUpdate?: (newProps: Partial<QuoteSlideProps>) => void;
}) {
  // Draggable wrappers
  const quoteDraggable = useDraggableWrapper(
    'quote',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  const authorDraggable = useDraggableWrapper(
    'author',
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

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Quote Icon */}
      <Quote className={`w-16 h-16 ${textColor || 'text-primary/40'} mb-8`} />

      {/* Quote Text */}
      {quoteDraggable.wrapWithDraggable(
        <blockquote className={`text-4xl font-medium text-center leading-relaxed max-w-4xl mb-8 ${textColor}`}>
          "
          <EditableText
            value={quote}
            onChange={(newQuote) => onUpdate?.({ quote: newQuote })}
            className="inline"
            multiline
            disabled={isPositioningEnabled}
          />
          "
        </blockquote>
      )}

      {/* Author */}
      <div className="text-center">
        {authorDraggable.wrapWithDraggable(
          <EditableText
            value={author}
            onChange={(newAuthor) => onUpdate?.({ author: newAuthor })}
            className={`text-2xl font-semibold ${textColor || 'text-foreground'}`}
            disabled={isPositioningEnabled}
          />
        )}
        {title && titleDraggable.wrapWithDraggable(
          <EditableText
            value={title}
            onChange={(newTitle) => onUpdate?.({ title: newTitle })}
            className={`text-xl ${textColor || 'text-muted-foreground'} mt-2`}
            disabled={isPositioningEnabled}
          />
        )}
      </div>
    </div>
  );
}
