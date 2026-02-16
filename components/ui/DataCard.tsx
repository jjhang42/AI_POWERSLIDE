"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataCardProps {
  value: string;
  valueColor?: "primary" | "success" | "destructive" | "accent";
  title: string;
  description: string;
  footer?: React.ReactNode;
  className?: string;
}

export function DataCard({
  value,
  valueColor = "primary",
  title,
  description,
  footer,
  className,
}: DataCardProps) {
  const colorClasses = {
    primary: "text-primary",
    success: "text-success",
    destructive: "text-destructive",
    accent: "text-accent",
  };

  return (
    <motion.div
      className={cn(
        "p-10 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group",
        className
      )}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={cn("text-data-large mb-4", colorClasses[valueColor])}>
        {value}
      </div>

      <h3 className="text-headline mb-4">{title}</h3>

      <p className="text-body text-muted-foreground mb-6">{description}</p>

      {footer && (
        <div className="pt-6 border-t border-border">{footer}</div>
      )}
    </motion.div>
  );
}
