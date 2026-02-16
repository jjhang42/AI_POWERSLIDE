/**
 * Bullet Points Template
 * 제목 + 목록
 */

import { Check, ChevronRight, Circle } from "lucide-react";

interface BulletPointsProps {
  title: string;
  points: string[];
  icon?: "check" | "chevron" | "circle";
}

export function BulletPoints({ title, points, icon = "chevron" }: BulletPointsProps) {
  const Icon = {
    check: Check,
    chevron: ChevronRight,
    circle: Circle,
  }[icon];

  return (
    <div className="w-full h-full flex flex-col p-16">
      {/* Title */}
      <h2 className="text-5xl font-bold tracking-tight mb-12">
        {title}
      </h2>

      {/* Bullet Points */}
      <div className="space-y-6 flex-1">
        {points.map((point, index) => (
          <div key={index} className="flex items-start gap-4">
            <Icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
            <p className="text-2xl text-foreground leading-relaxed">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
