import { motion } from 'framer-motion';

export function TestimonialMarquee({ testimonials }) {
  const loopItems = [...testimonials, ...testimonials];

  return (
    <div className="overflow-hidden rounded-3xl border border-brand-brown/15 bg-brand-cream">
      <motion.div
        className="flex w-max gap-5 px-5 py-6"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
      >
        {loopItems.map((item, index) => (
          <article key={`${item.name}-${index}`} className="w-[320px] rounded-2xl border border-brand-brown/15 bg-brand-beige/40 p-5">
            <p className="text-sm leading-7 text-brand-brown">“{item.quote}”</p>
            <div className="mt-4 text-sm font-semibold text-brand-brown">{item.name}</div>
            <div className="text-xs uppercase tracking-[0.18em] text-brand-brown/70">{item.location}</div>
          </article>
        ))}
      </motion.div>
    </div>
  );
}
