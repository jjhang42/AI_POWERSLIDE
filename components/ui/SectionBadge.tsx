import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning";
  className?: string;
}

export function SectionBadge({
  children,
  variant = "default",
  className,
}: SectionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "success" && "bg-success/10 text-success",
        variant === "warning" && "bg-accent/10 text-accent",
        className
      )}
    >
      {children}
    </span>
  );
}
