/**
 * Quote Slide Template
 * 인용구 슬라이드
 */

import { Quote } from "lucide-react";

interface QuoteSlideProps {
  quote: string;
  author: string;
  title?: string;
}

export function QuoteSlide({ quote, author, title }: QuoteSlideProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-16 bg-gradient-to-br from-muted/20 to-background">
      {/* Quote Icon */}
      <Quote className="w-16 h-16 text-primary/40 mb-8" />

      {/* Quote Text */}
      <blockquote className="text-4xl font-medium text-center leading-relaxed max-w-4xl mb-8">
        "{quote}"
      </blockquote>

      {/* Author */}
      <div className="text-center">
        <p className="text-2xl font-semibold text-foreground">{author}</p>
        {title && (
          <p className="text-xl text-muted-foreground mt-2">{title}</p>
        )}
      </div>
    </div>
  );
}
