/**
 * Thank You Slide Template
 * 마무리 슬라이드
 */

import { EditableText } from "@/components/editor/EditableText";
import { ThankYouProps } from "@/lib/types/slides";
import { useDraggableWrapper, WithDraggableProps } from "@/components/positioning/withDraggableElements";

export function ThankYou({
  message = "Thank You",
  contact,
  cta,
  className = "",
  style,
  backgroundColor = "bg-gradient-to-br from-primary/10 via-background to-background",
  textColor = "",
  positions = {},
  onUpdate,
  isPositioningEnabled = false,
  selectedElementId = null,
  onSelectElement,
}: ThankYouProps & WithDraggableProps & {
  onUpdate?: (newProps: Partial<ThankYouProps>) => void;
}) {
  // Draggable wrappers
  const messageDraggable = useDraggableWrapper(
    'message',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  const ctaDraggable = useDraggableWrapper(
    'cta',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  const emailDraggable = useDraggableWrapper(
    'contact_email',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  const websiteDraggable = useDraggableWrapper(
    'contact_website',
    positions,
    onUpdate,
    isPositioningEnabled,
    selectedElementId,
    onSelectElement
  );

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center ${backgroundColor} ${className} p-16`}
      style={style}
    >
      {/* Thank You Message */}
      {messageDraggable.wrapWithDraggable(
        <EditableText
          value={message}
          onChange={(newMessage) => onUpdate?.({ message: newMessage })}
          className={`text-8xl font-black tracking-tight text-center mb-8 ${textColor}`}
          disabled={isPositioningEnabled}
        />
      )}

      {/* CTA */}
      {cta && ctaDraggable.wrapWithDraggable(
        <EditableText
          value={cta}
          onChange={(newCta) => onUpdate?.({ cta: newCta })}
          className={`text-3xl ${textColor || 'text-muted-foreground'} text-center mb-12 max-w-3xl`}
          disabled={isPositioningEnabled}
        />
      )}

      {/* Contact Information */}
      {contact && (
        <div className="mt-auto space-y-3 text-center">
          {contact.email && (
            <div className={`text-xl ${textColor || 'text-foreground'}`}>
              <span className={textColor || 'text-muted-foreground'}>Email:</span>{" "}
              {emailDraggable.wrapWithDraggable(
                <EditableText
                  value={contact.email}
                  onChange={(newEmail) => onUpdate?.({ contact: { ...contact, email: newEmail } })}
                  className="inline"
                  disabled={isPositioningEnabled}
                />
              )}
            </div>
          )}
          {contact.website && (
            <div className={`text-xl ${textColor || 'text-foreground'}`}>
              <span className={textColor || 'text-muted-foreground'}>Web:</span>{" "}
              {websiteDraggable.wrapWithDraggable(
                <EditableText
                  value={contact.website}
                  onChange={(newWebsite) => onUpdate?.({ contact: { ...contact, website: newWebsite } })}
                  className="inline"
                  disabled={isPositioningEnabled}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
