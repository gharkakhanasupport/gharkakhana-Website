import { Reveal } from './Reveal';

export function PolicySection({ heading, items, delay = 0 }) {
  return (
    <Reveal delay={delay} className="rounded-3xl border border-brand-brown/15 bg-brand-cream p-6 md:p-8">
      <h3 className="text-xl font-semibold text-brand-brown">{heading}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-brand-brown/80 md:text-base">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-2 w-2 rounded-full bg-brand-green" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
