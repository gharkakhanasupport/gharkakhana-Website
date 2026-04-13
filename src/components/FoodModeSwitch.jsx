import { motion } from 'framer-motion';

const MODES = [
  { key: 'all', label: 'All', emoji: '🍽️', activeColor: 'bg-brand-green' },
  { key: 'veg', label: 'Veg', emoji: '🥬', activeColor: 'bg-green-500' },
  { key: 'nonveg', label: 'Non-Veg', emoji: '🍗', activeColor: 'bg-red-500' },
];

export function FoodModeSwitch({ active, onChange }) {
  return (
    <div className="inline-flex items-center rounded-full bg-brand-cream/60 border border-brand-brown/10 p-1">
      {MODES.map((mode) => {
        const isActive = active === mode.key;
        return (
          <button
            key={mode.key}
            onClick={() => onChange(mode.key)}
            className="relative rounded-full px-4 py-2 text-sm font-bold tracking-tight transition-all"
          >
            {isActive && (
              <motion.div
                layoutId="foodModePill"
                className={`absolute inset-0 rounded-full ${mode.activeColor} shadow-[0_4px_14px_rgba(0,0,0,0.15)]`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 flex items-center gap-1.5 ${
                isActive ? 'text-white' : 'text-brand-brown/60 hover:text-brand-brown'
              }`}
            >
              <span className="text-sm">{mode.emoji}</span>
              {mode.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
