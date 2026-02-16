/**
 * Two Column Template
 * 2열 레이아웃 - 텍스트/이미지 조합
 */

interface TwoColumnProps {
  title?: string;
  left: React.ReactNode;
  right: React.ReactNode;
  split?: "50-50" | "60-40" | "40-60";
}

export function TwoColumn({ title, left, right, split = "50-50" }: TwoColumnProps) {
  const gridCols = {
    "50-50": "grid-cols-2",
    "60-40": "grid-cols-[60%_40%]",
    "40-60": "grid-cols-[40%_60%]",
  };

  return (
    <div className="w-full h-full flex flex-col p-16">
      {/* Title */}
      {title && (
        <h2 className="text-5xl font-bold tracking-tight mb-8">
          {title}
        </h2>
      )}

      {/* Two Column Content */}
      <div className={`grid ${gridCols[split]} gap-12 flex-1`}>
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          {left}
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center">
          {right}
        </div>
      </div>
    </div>
  );
}
