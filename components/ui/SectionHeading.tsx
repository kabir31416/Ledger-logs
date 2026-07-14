interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "paper" | "ink";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "paper",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const subtle = tone === "ink" ? "text-paper/60" : "text-ink/60";
  const heading = tone === "ink" ? "text-paper" : "text-ink";
  const eyebrowColor = tone === "ink" ? "text-attention" : "text-primary";

  return (
    <div className={`max-w-2xl ${isCenter ? "mx-auto text-center" : "text-left"}`}>
      {eyebrow && (
        <p className={`mb-3 font-amount text-xs font-semibold uppercase tracking-[0.2em] ${eyebrowColor}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-3xl font-semibold sm:text-4xl ${heading}`}>{title}</h2>
      {description && <p className={`mt-4 text-base leading-relaxed ${subtle}`}>{description}</p>}
    </div>
  );
}
