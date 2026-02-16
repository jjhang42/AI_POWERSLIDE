/**
 * Title Slide Template
 * 표지 슬라이드 - 프레젠테이션 시작
 */

interface TitleSlideProps {
  title: string;
  subtitle?: string;
  author?: string;
  date?: string;
  logo?: React.ReactNode;
}

export function TitleSlide({ title, subtitle, author, date, logo }: TitleSlideProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-16">
      {/* Logo */}
      {logo && (
        <div className="mb-8">
          {logo}
        </div>
      )}

      {/* Main Title */}
      <h1 className="text-7xl font-black tracking-tight text-center mb-6 max-w-5xl">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-3xl text-muted-foreground text-center mb-12 max-w-4xl">
          {subtitle}
        </p>
      )}

      {/* Author & Date */}
      {(author || date) && (
        <div className="mt-auto text-center space-y-2">
          {author && (
            <p className="text-xl font-medium text-foreground">{author}</p>
          )}
          {date && (
            <p className="text-lg text-muted-foreground">{date}</p>
          )}
        </div>
      )}
    </div>
  );
}
