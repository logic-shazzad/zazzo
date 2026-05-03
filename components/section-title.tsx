type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description
}: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{description}</p>
    </div>
  );
}
