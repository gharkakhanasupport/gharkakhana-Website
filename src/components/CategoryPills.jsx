import { motion } from 'framer-motion';

export function CategoryPills({ categories, active, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect('All')}
        className="relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold tracking-tight transition-all"
      >
        {active === 'All' && (
          <motion.div
            layoutId="activePill"
            className="absolute inset-0 rounded-full bg-brand-green shadow-[0_4px_14px_rgba(95,166,59,0.25)]"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        <span className={`relative z-10 ${active === 'All' ? 'text-white' : 'text-brand-brown/70 hover:text-brand-brown'}`}>
          All
        </span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold tracking-tight transition-all"
        >
          {active === cat && (
            <motion.div
              layoutId="activePill"
              className="absolute inset-0 rounded-full bg-brand-green shadow-[0_4px_14px_rgba(95,166,59,0.25)]"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${active === cat ? 'text-white' : 'text-brand-brown/70 hover:text-brand-brown'}`}>
            {cat}
          </span>
        </button>
      ))}
    </div>
  );
}
