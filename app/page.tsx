"use client";

import { useState, useEffect } from "react";
import { SlideCanvas } from "@/components/SlideCanvas";
import { SimpleSettingsSidebar } from "@/components/SimpleSettingsSidebar";
import { AspectRatio } from "@/components/AspectRatioSelector";
import { TemplatesSidebar, Slide, TemplateType } from "@/components/TemplatesSidebar";
import {
  TitleSlide,
  SectionTitle,
  ContentSlide,
  TwoColumn,
  BulletPoints,
  QuoteSlide,
  ImageWithCaption,
  ThankYou,
} from "@/components/templates";

// Default props for each template
const DEFAULT_PROPS: Record<TemplateType, any> = {
  TitleSlide: {
    title: "Your Presentation Title",
    subtitle: "Subtitle goes here",
    author: "Your Name",
    date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  },
  SectionTitle: {
    section: "Section 1",
    title: "Section Title",
    description: "Brief description of this section",
  },
  ContentSlide: {
    title: "Content Title",
    content: "Your content goes here. You can write anything you want to present.",
    align: "left" as const,
  },
  TwoColumn: {
    title: "Two Column Layout",
    left: <div className="text-2xl">Left content goes here</div>,
    right: <div className="text-2xl">Right content goes here</div>,
    split: "50-50" as const,
  },
  BulletPoints: {
    title: "Key Points",
    points: [
      "First important point",
      "Second important point",
      "Third important point",
      "Fourth important point",
    ],
    icon: "check" as const,
  },
  QuoteSlide: {
    quote: "Insert an inspiring quote here that resonates with your message.",
    author: "Author Name",
    title: "Title or Position",
  },
  ImageWithCaption: {
    title: "Image Title",
    imageSrc: "/placeholder.jpg",
    imageAlt: "Image description",
    caption: "Image caption goes here",
    layout: "contained" as const,
  },
  ThankYou: {
    message: "Thank You!",
    cta: "Let's connect and discuss further",
    contact: {
      email: "hello@example.com",
      website: "www.example.com",
    },
  },
};

const TEMPLATE_NAMES: Record<TemplateType, string> = {
  TitleSlide: "Title Slide",
  SectionTitle: "Section Title",
  ContentSlide: "Content Slide",
  TwoColumn: "Two Column",
  BulletPoints: "Bullet Points",
  QuoteSlide: "Quote",
  ImageWithCaption: "Image with Caption",
  ThankYou: "Thank You",
};

export default function Home() {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Add new slide
  const handleAddSlide = (type: TemplateType) => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}-${Math.random()}`,
      type,
      name: TEMPLATE_NAMES[type],
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length); // Move to new slide
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    // Adjust current slide index
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(Math.max(0, newSlides.length - 1));
    }
  };

  // Select slide
  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (slides.length === 0) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Home":
          e.preventDefault();
          setCurrentSlideIndex(0);
          break;
        case "End":
          e.preventDefault();
          setCurrentSlideIndex(slides.length - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [slides.length]);

  // Render current slide
  const renderSlide = () => {
    if (slides.length === 0) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
          <div className="text-center space-y-4">
            <h1 className="text-8xl font-black tracking-tighter">iil</h1>
            <p className="text-2xl text-muted-foreground">
              Click Templates to add slides
            </p>
          </div>
        </div>
      );
    }

    const currentSlide = slides[currentSlideIndex];
    const props = DEFAULT_PROPS[currentSlide.type];

    switch (currentSlide.type) {
      case "TitleSlide":
        return <TitleSlide {...props} />;
      case "SectionTitle":
        return <SectionTitle {...props} />;
      case "ContentSlide":
        return <ContentSlide {...props} />;
      case "TwoColumn":
        return <TwoColumn {...props} />;
      case "BulletPoints":
        return <BulletPoints {...props} />;
      case "QuoteSlide":
        return <QuoteSlide {...props} />;
      case "ImageWithCaption":
        return <ImageWithCaption {...props} />;
      case "ThankYou":
        return <ThankYou {...props} />;
      default:
        return null;
    }
  };

  return (
    <main className="relative">
      <SlideCanvas aspectRatio={aspectRatio} isFullscreen={isFullscreen}>
        {renderSlide()}
      </SlideCanvas>

      {/* Slide Counter */}
      {slides.length > 0 && !isFullscreen && (
        <div className="fixed bottom-6 right-6 z-40 px-4 py-2 bg-black/70 text-white text-sm font-mono rounded-lg backdrop-blur-sm">
          {currentSlideIndex + 1} / {slides.length}
        </div>
      )}

      <TemplatesSidebar
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onAddSlide={handleAddSlide}
        onSelectSlide={handleSelectSlide}
        onDeleteSlide={handleDeleteSlide}
      />

      <SimpleSettingsSidebar
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        isFullscreen={isFullscreen}
        onFullscreenChange={setIsFullscreen}
      />
    </main>
  );
}
