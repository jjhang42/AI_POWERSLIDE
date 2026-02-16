/**
 * Thank You Slide Template
 * 마무리 슬라이드
 */

import { EditableText } from "@/components/editor/EditableText";
import { ThankYouProps } from "@/lib/types/slides";

export function ThankYou({
  message = "Thank You",
  contact,
  cta,
  className = "",
  style,
  backgroundColor = "bg-gradient-to-br from-primary/10 via-background to-background",
  textColor = "",
  onUpdate
}: ThankYouProps & {
  onUpdate?: (newProps: Partial<ThankYouProps>) => void;
}) {
  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Thank You Message */}
      <EditableText
        value={message}
        onChange={(newMessage) => onUpdate?.({ message: newMessage })}
        className={`text-8xl font-black tracking-tight text-center mb-8 ${textColor}`}
      />

      {/* CTA */}
      {cta && (
        <EditableText
          value={cta}
          onChange={(newCta) => onUpdate?.({ cta: newCta })}
          className={`text-3xl ${textColor || 'text-muted-foreground'} text-center mb-12 max-w-3xl`}
        />
      )}

      {/* Contact Information */}
      {contact && (
        <div className="mt-auto space-y-3 text-center">
          {contact.email && (
            <div className={`text-xl ${textColor || 'text-foreground'}`}>
              <span className={textColor || 'text-muted-foreground'}>Email:</span>{" "}
              <EditableText
                value={contact.email}
                onChange={(newEmail) => onUpdate?.({ contact: { ...contact, email: newEmail } })}
                className="inline"
              />
            </div>
          )}
          {contact.website && (
            <div className={`text-xl ${textColor || 'text-foreground'}`}>
              <span className={textColor || 'text-muted-foreground'}>Web:</span>{" "}
              <EditableText
                value={contact.website}
                onChange={(newWebsite) => onUpdate?.({ contact: { ...contact, website: newWebsite } })}
                className="inline"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
