/**
 * Title Slide Template
 * 표지 슬라이드 - 프레젠테이션 시작
 */

import { useState } from "react";
import { EditableText } from "@/components/editor/EditableText";
import { TitleSlideProps } from "@/lib/types/slides";
import { DraggableElement, Position } from "@/components/positioning/DraggableElement";

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
  positions = {},
  onUpdate,
  isPositioningEnabled = false,
  selectedElementId = null,
  onSelectElement,
}: TitleSlideProps & {
  logo?: React.ReactNode;
  onUpdate?: (newProps: Partial<TitleSlideProps>) => void;
  isPositioningEnabled?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
}) {

  const handlePositionChange = (key: string, position: Position) => {
    onUpdate?.({
      positions: {
        ...positions,
        [key]: position,
      },
    });
  };
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
      <DraggableElement
        position={positions?.title || { x: 0, y: 0 }}
        onPositionChange={(pos) => handlePositionChange("title", pos)}
        isSelected={selectedElementId === "title"}
        onSelect={() => onSelectElement?.("title")}
        disabled={!isPositioningEnabled}
      >
        <EditableText
          value={title}
          onChange={(newTitle) => onUpdate?.({ title: newTitle })}
          className={`text-7xl font-black tracking-tight text-center mb-6 max-w-5xl ${textColor}`}
          disabled={isPositioningEnabled}
        />
      </DraggableElement>

      {/* Subtitle */}
      {subtitle && (
        <DraggableElement
          position={positions?.subtitle || { x: 0, y: 0 }}
          onPositionChange={(pos) => handlePositionChange("subtitle", pos)}
          isSelected={selectedElementId === "subtitle"}
          onSelect={() => onSelectElement?.("subtitle")}
          disabled={!isPositioningEnabled}
        >
          <EditableText
            value={subtitle}
            onChange={(newSubtitle) => onUpdate?.({ subtitle: newSubtitle })}
            className={`text-3xl ${textColor || 'text-muted-foreground'} text-center mb-12 max-w-4xl`}
            disabled={isPositioningEnabled}
          />
        </DraggableElement>
      )}

      {/* Author & Date */}
      {(author || date) && (
        <div className="mt-auto text-center space-y-2">
          {author && (
            <DraggableElement
              position={positions?.author || { x: 0, y: 0 }}
              onPositionChange={(pos) => handlePositionChange("author", pos)}
              isSelected={selectedElementId === "author"}
              onSelect={() => onSelectElement?.("author")}
              disabled={!isPositioningEnabled}
            >
              <EditableText
                value={author}
                onChange={(newAuthor) => onUpdate?.({ author: newAuthor })}
                className={`text-xl font-medium ${textColor || 'text-foreground'}`}
                disabled={isPositioningEnabled}
              />
            </DraggableElement>
          )}
          {date && (
            <DraggableElement
              position={positions?.date || { x: 0, y: 0 }}
              onPositionChange={(pos) => handlePositionChange("date", pos)}
              isSelected={selectedElementId === "date"}
              onSelect={() => onSelectElement?.("date")}
              disabled={!isPositioningEnabled}
            >
              <EditableText
                value={date}
                onChange={(newDate) => onUpdate?.({ date: newDate })}
                className={`text-lg ${textColor || 'text-muted-foreground'}`}
                disabled={isPositioningEnabled}
              />
            </DraggableElement>
          )}
        </div>
      )}
    </div>
  );
}
