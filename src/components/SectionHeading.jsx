export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignClass}`}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl md:text-5xl">{title}</h2>
        {description ? <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{description}</p> : null}
      </div>
    </div>
  );
}
