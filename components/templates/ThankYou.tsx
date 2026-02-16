/**
 * Thank You Slide Template
 * 마무리 슬라이드
 */

interface ThankYouProps {
  message?: string;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  cta?: string;
}

export function ThankYou({
  message = "Thank You",
  contact,
  cta
}: ThankYouProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-16">
      {/* Thank You Message */}
      <h1 className="text-8xl font-black tracking-tight text-center mb-8">
        {message}
      </h1>

      {/* CTA */}
      {cta && (
        <p className="text-3xl text-muted-foreground text-center mb-12 max-w-3xl">
          {cta}
        </p>
      )}

      {/* Contact Information */}
      {contact && (
        <div className="mt-auto space-y-3 text-center">
          {contact.email && (
            <p className="text-xl text-foreground">
              <span className="text-muted-foreground">Email:</span> {contact.email}
            </p>
          )}
          {contact.phone && (
            <p className="text-xl text-foreground">
              <span className="text-muted-foreground">Phone:</span> {contact.phone}
            </p>
          )}
          {contact.website && (
            <p className="text-xl text-foreground">
              <span className="text-muted-foreground">Web:</span> {contact.website}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
