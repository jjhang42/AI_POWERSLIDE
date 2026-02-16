"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";
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
import { useState } from "react";

interface FloatingInspectorProps {
  slide: SlideWithProps | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (newProps: Partial<any>) => void;
}

export function FloatingInspector({
  slide,
  isOpen,
  onClose,
  onUpdate,
}: FloatingInspectorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!slide || !isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 20, scale: 0.95 }}
        transition={{
          type: "tween",
          ease: [0.25, 0.1, 0.25, 1],
          duration: 0.3,
        }}
        className="fixed right-6 top-24 w-80 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0"
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </Button>
            <div>
              <p className="text-sm font-semibold">Inspector</p>
              <p className="text-xs text-muted-foreground">{slide.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {renderQuickEdit(slide, onUpdate)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard Hint */}
        <div className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border bg-muted/20">
          Press <kbd className="px-1 py-0.5 bg-background rounded border">⌘I</kbd> to toggle
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function renderQuickEdit(slide: SlideWithProps, onUpdate: (newProps: Partial<any>) => void) {
  const props = slide.props;

  switch (slide.type) {
    case "TitleSlide":
      return <TitleSlideQuickEdit props={props as TitleSlideProps} onUpdate={onUpdate} />;
    case "SectionTitle":
      return <SectionTitleQuickEdit props={props as SectionTitleProps} onUpdate={onUpdate} />;
    case "ContentSlide":
      return <ContentSlideQuickEdit props={props as ContentSlideProps} onUpdate={onUpdate} />;
    case "BulletPoints":
      return <BulletPointsQuickEdit props={props as BulletPointsProps} onUpdate={onUpdate} />;
    case "QuoteSlide":
      return <QuoteSlideQuickEdit props={props as QuoteSlideProps} onUpdate={onUpdate} />;
    case "ImageWithCaption":
      return <ImageWithCaptionQuickEdit props={props as ImageWithCaptionProps} onUpdate={onUpdate} />;
    case "ThankYou":
      return <ThankYouQuickEdit props={props as ThankYouProps} onUpdate={onUpdate} />;
    default:
      return null;
  }
}

// Compact form components
function TitleSlideQuickEdit({ props, onUpdate }: { props: TitleSlideProps; onUpdate: (newProps: Partial<TitleSlideProps>) => void }) {
  return (
    <>
      <div>
        <Label className="text-xs">Title</Label>
        <Input
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Subtitle</Label>
        <Input
          value={props.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Author</Label>
        <Input
          value={props.author}
          onChange={(e) => onUpdate({ author: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
    </>
  );
}

function SectionTitleQuickEdit({ props, onUpdate }: { props: SectionTitleProps; onUpdate: (newProps: Partial<SectionTitleProps>) => void }) {
  return (
    <>
      <div>
        <Label className="text-xs">Section</Label>
        <Input
          value={props.section}
          onChange={(e) => onUpdate({ section: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Title</Label>
        <Input
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
    </>
  );
}

function ContentSlideQuickEdit({ props, onUpdate }: { props: ContentSlideProps; onUpdate: (newProps: Partial<ContentSlideProps>) => void }) {
  return (
    <>
      <div>
        <Label className="text-xs">Title</Label>
        <Input
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Content</Label>
        <Textarea
          value={typeof props.content === "string" ? props.content : ""}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="mt-1 text-sm"
          rows={4}
        />
      </div>
    </>
  );
}

function BulletPointsQuickEdit({ props, onUpdate }: { props: BulletPointsProps; onUpdate: (newProps: Partial<BulletPointsProps>) => void }) {
  return (
    <>
      <div>
        <Label className="text-xs">Title</Label>
        <Input
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Points (one per line)</Label>
        <Textarea
          value={props.points.join("\n")}
          onChange={(e) => onUpdate({ points: e.target.value.split("\n") })}
          className="mt-1 text-sm"
          rows={6}
        />
      </div>
    </>
  );
}

function QuoteSlideQuickEdit({ props, onUpdate }: { props: QuoteSlideProps; onUpdate: (newProps: Partial<QuoteSlideProps>) => void }) {
  return (
    <>
      <div>
        <Label className="text-xs">Quote</Label>
        <Textarea
          value={props.quote}
          onChange={(e) => onUpdate({ quote: e.target.value })}
          className="mt-1 text-sm"
          rows={3}
        />
      </div>
      <div>
        <Label className="text-xs">Author</Label>
        <Input
          value={props.author}
          onChange={(e) => onUpdate({ author: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
    </>
  );
}

function ImageWithCaptionQuickEdit({ props, onUpdate }: { props: ImageWithCaptionProps; onUpdate: (newProps: Partial<ImageWithCaptionProps>) => void }) {
  return (
    <>
      <div>
        <Label className="text-xs">Title</Label>
        <Input
          value={props.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Image URL</Label>
        <Input
          value={props.imageSrc}
          onChange={(e) => onUpdate({ imageSrc: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Caption</Label>
        <Textarea
          value={props.caption}
          onChange={(e) => onUpdate({ caption: e.target.value })}
          className="mt-1 text-sm"
          rows={2}
        />
      </div>
    </>
  );
}

function ThankYouQuickEdit({ props, onUpdate }: { props: ThankYouProps; onUpdate: (newProps: Partial<ThankYouProps>) => void }) {
  return (
    <>
      <div>
        <Label className="text-xs">Message</Label>
        <Input
          value={props.message}
          onChange={(e) => onUpdate({ message: e.target.value })}
          className="mt-1 h-8 text-sm"
        />
      </div>
      <div>
        <Label className="text-xs">Email</Label>
        <Input
          value={props.contact.email}
          onChange={(e) => onUpdate({ contact: { ...props.contact, email: e.target.value } })}
          className="mt-1 h-8 text-sm"
        />
      </div>
    </>
  );
}
