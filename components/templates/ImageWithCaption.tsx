/**
 * Image with Caption Template
 * 이미지 + 캡션
 */

import Image from "next/image";

interface ImageWithCaptionProps {
  title?: string;
  imageSrc: string;
  imageAlt: string;
  caption?: string;
  layout?: "full" | "contained";
}

export function ImageWithCaption({
  title,
  imageSrc,
  imageAlt,
  caption,
  layout = "contained"
}: ImageWithCaptionProps) {
  return (
    <div className="w-full h-full flex flex-col p-16">
      {/* Title */}
      {title && (
        <h2 className="text-5xl font-bold tracking-tight mb-8">
          {title}
        </h2>
      )}

      {/* Image Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className={`relative ${layout === "full" ? "w-full h-full" : "max-w-4xl max-h-[600px]"} rounded-lg overflow-hidden shadow-2xl`}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain"
          />
        </div>

        {/* Caption */}
        {caption && (
          <p className="text-xl text-muted-foreground text-center mt-6 max-w-3xl">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
