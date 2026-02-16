import { SectionBadge } from "./SectionBadge";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  badgeVariant?: "default" | "success" | "warning";
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  badge,
  badgeVariant,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-16",
        align === "center" && "text-center",
        align === "left" && "text-left",
        className
      )}
    >
      {badge && (
        <div className="mb-4">
          <SectionBadge variant={badgeVariant}>{badge}</SectionBadge>
        </div>
      )}

      <h2 className="text-display-2 mb-6">{title}</h2>

      {subtitle && (
        <p className="text-body-large text-muted-foreground max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
