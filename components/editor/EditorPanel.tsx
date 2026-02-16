"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { SlideWithProps } from "@/lib/types/slides";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  TitleSlideProps,
  SectionTitleProps,
  ContentSlideProps,
  BulletPointsProps,
  QuoteSlideProps,
  ImageWithCaptionProps,
  ThankYouProps,
} from "@/lib/types/slides";

interface EditorPanelProps {
  slide: SlideWithProps | null;
  onClose: () => void;
  onUpdate: (newProps: Partial<any>) => void;
}

export function EditorPanel({ slide, onClose, onUpdate }: EditorPanelProps) {
  if (!slide) return null;

  // 슬라이드 타입에 따라 다른 폼 렌더링
  const renderForm = () => {
    switch (slide.type) {
      case "TitleSlide":
        return <TitleSlideForm props={slide.props as TitleSlideProps} onUpdate={onUpdate} />;
      case "SectionTitle":
        return <SectionTitleForm props={slide.props as SectionTitleProps} onUpdate={onUpdate} />;
      case "ContentSlide":
        return <ContentSlideForm props={slide.props as ContentSlideProps} onUpdate={onUpdate} />;
      case "BulletPoints":
        return <BulletPointsForm props={slide.props as BulletPointsProps} onUpdate={onUpdate} />;
      case "QuoteSlide":
        return <QuoteSlideForm props={slide.props as QuoteSlideProps} onUpdate={onUpdate} />;
      case "ImageWithCaption":
        return <ImageWithCaptionForm props={slide.props as ImageWithCaptionProps} onUpdate={onUpdate} />;
      case "ThankYou":
        return <ThankYouForm props={slide.props as ThankYouProps} onUpdate={onUpdate} />;
      default:
        return <GenericForm props={slide.props} onUpdate={onUpdate} />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{
          type: "tween",
          ease: [0.25, 0.1, 0.25, 1],
          duration: 0.3
        }}
        className="fixed right-0 top-0 h-full w-96 bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Edit Slide</h2>
            <p className="text-sm text-muted-foreground">{slide.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {renderForm()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// 각 템플릿별 폼 컴포넌트들
function TitleSlideForm({ props, onUpdate }: { props: TitleSlideProps; onUpdate: (newProps: Partial<TitleSlideProps>) => void }) {
  return (
    <>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={props.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={props.author}
          onChange={(e) => onUpdate({ author: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          value={props.date}
          onChange={(e) => onUpdate({ date: e.target.value })}
          className="mt-1"
        />
      </div>
    </>
  );
}

function SectionTitleForm({ props, onUpdate }: { props: SectionTitleProps; onUpdate: (newProps: Partial<SectionTitleProps>) => void }) {
  return (
    <>
      <div>
        <Label htmlFor="section">Section</Label>
        <Input
          id="section"
          value={props.section}
          onChange={(e) => onUpdate({ section: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={props.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="mt-1"
        />
      </div>
    </>
  );
}

function ContentSlideForm({ props, onUpdate }: { props: ContentSlideProps; onUpdate: (newProps: Partial<ContentSlideProps>) => void }) {
  return (
    <>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={typeof props.content === "string" ? props.content : ""}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="mt-1"
          rows={6}
        />
      </div>
    </>
  );
}

function BulletPointsForm({ props, onUpdate }: { props: BulletPointsProps; onUpdate: (newProps: Partial<BulletPointsProps>) => void }) {
  return (
    <>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Points (one per line)</Label>
        <Textarea
          value={props.points.join("\n")}
          onChange={(e) => onUpdate({ points: e.target.value.split("\n") })}
          className="mt-1"
          rows={8}
        />
      </div>
    </>
  );
}

function QuoteSlideForm({ props, onUpdate }: { props: QuoteSlideProps; onUpdate: (newProps: Partial<QuoteSlideProps>) => void }) {
  return (
    <>
      <div>
        <Label htmlFor="quote">Quote</Label>
        <Textarea
          id="quote"
          value={props.quote}
          onChange={(e) => onUpdate({ quote: e.target.value })}
          className="mt-1"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={props.author}
          onChange={(e) => onUpdate({ author: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="title">Title/Position</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1"
        />
      </div>
    </>
  );
}

function ImageWithCaptionForm({ props, onUpdate }: { props: ImageWithCaptionProps; onUpdate: (newProps: Partial<ImageWithCaptionProps>) => void }) {
  return (
    <>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="imageSrc">Image URL</Label>
        <Input
          id="imageSrc"
          value={props.imageSrc}
          onChange={(e) => onUpdate({ imageSrc: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="imageAlt">Image Alt Text</Label>
        <Input
          id="imageAlt"
          value={props.imageAlt}
          onChange={(e) => onUpdate({ imageAlt: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="caption">Caption</Label>
        <Textarea
          id="caption"
          value={props.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          className="mt-1"
        />
      </div>
    </>
  );
}

function ThankYouForm({ props, onUpdate }: { props: ThankYouProps; onUpdate: (newProps: Partial<ThankYouProps>) => void }) {
  return (
    <>
      <div>
        <Label htmlFor="message">Message</Label>
        <Input
          id="message"
          value={props.message}
          onChange={(e) => onUpdate({ message: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="cta">Call to Action</Label>
        <Textarea
          id="cta"
          value={props.cta}
          onChange={(e) => onUpdate({ cta: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={props.contact.email}
          onChange={(e) => onUpdate({ contact: { ...props.contact, email: e.target.value } })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={props.contact.website}
          onChange={(e) => onUpdate({ contact: { ...props.contact, website: e.target.value } })}
          className="mt-1"
        />
      </div>
    </>
  );
}

function GenericForm({ props, onUpdate }: { props: any; onUpdate: (newProps: Partial<any>) => void }) {
  return (
    <div>
      <Label>Properties (JSON)</Label>
      <Textarea
        value={JSON.stringify(props, null, 2)}
        onChange={(e) => {
          try {
            const parsed = JSON.parse(e.target.value);
            onUpdate(parsed);
          } catch (e) {
            // Invalid JSON, don't update
          }
        }}
        className="mt-1 font-mono text-sm"
        rows={15}
      />
    </div>
  );
}
