/**
 * Bullet Points Template
 * 제목 + 목록
 */

import { Check, ChevronRight, Circle } from "lucide-react";
import { EditableText } from "@/components/editor/EditableText";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { BulletPointsProps } from "@/lib/types/slides";

export function BulletPoints({
  title,
  points,
  icon = "chevron",
  className = "",
  style,
  backgroundColor = "",
  textColor = "",
  onUpdate
}: BulletPointsProps & {
  onUpdate?: (newProps: Partial<BulletPointsProps>) => void;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const Icon = {
    check: Check,
    chevron: ChevronRight,
    circle: Circle,
  }[icon];

  const handleItemChange = (index: number, newValue: string) => {
    const newPoints = [...points];
    newPoints[index] = newValue;
    onUpdate?.({ points: newPoints });
  };

  const handleAddItem = () => {
    onUpdate?.({ points: [...points, "New point"] });
  };

  const handleDeleteItem = (index: number) => {
    const newPoints = points.filter((_, i) => i !== index);
    onUpdate?.({ points: newPoints });
  };

  return (
    <div
      className={`w-full h-full flex flex-col ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Title */}
      <EditableText
        value={title}
        onChange={(newTitle) => onUpdate?.({ title: newTitle })}
        className={`text-5xl font-bold tracking-tight mb-12 ${textColor}`}
      />

      {/* Bullet Points */}
      <div className="space-y-6 flex-1">
        {points.map((point, index) => (
          <div
            key={index}
            className="flex items-start gap-4 group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <Icon className={`w-8 h-8 ${textColor || 'text-primary'} flex-shrink-0 mt-1`} />
            <EditableText
              value={point}
              onChange={(newValue) => handleItemChange(index, newValue)}
              className={`text-2xl ${textColor || 'text-foreground'} leading-relaxed flex-1`}
            />
            {hoveredIndex === index && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteItem(index)}
                className="transition-opacity h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="mt-4 opacity-60 hover:opacity-100 transition-opacity"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Point
        </Button>
      </div>
    </div>
  );
}
