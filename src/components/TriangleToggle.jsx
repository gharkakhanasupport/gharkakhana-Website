import { motion } from 'framer-motion';

const MODES = [
  { key: 'all', label: 'All', emoji: '🍽️', color: '#5FA63B', desc: 'Veg & Non-Veg' },
  { key: 'veg', label: 'Veg', emoji: '🥬', color: '#22c55e', desc: 'Pure Veg' },
  { key: 'nonveg', label: 'Non-Veg', emoji: '🍗', color: '#ef4444', desc: 'Non-Veg' },
];

// Triangle vertex positions (scaled down)
const VERTICES = [
  { x: 40, y: 8 },   // top center — All
  { x: 8, y: 64 },   // bottom left — Veg
  { x: 72, y: 64 },  // bottom right — Non-Veg
];

export function TriangleToggle({ active, onChange }) {
  const activeIdx = MODES.findIndex((m) => m.key === active);
  const activeVertex = VERTICES[activeIdx >= 0 ? activeIdx : 0];
  const activeMode = MODES[activeIdx >= 0 ? activeIdx : 0];

  return (
    <div className="flex items-center gap-3">
      {/* Triangle SVG */}
      <div className="relative" style={{ width: 80, height: 74 }}>
        <svg width="80" height="74" viewBox="0 0 80 74" fill="none" className="absolute inset-0">
          {/* Triangle edges */}
          <line x1={VERTICES[0].x} y1={VERTICES[0].y} x2={VERTICES[1].x} y2={VERTICES[1].y} stroke="rgba(47,42,61,0.1)" strokeWidth="2" strokeLinecap="round" />
          <line x1={VERTICES[1].x} y1={VERTICES[1].y} x2={VERTICES[2].x} y2={VERTICES[2].y} stroke="rgba(47,42,61,0.1)" strokeWidth="2" strokeLinecap="round" />
          <line x1={VERTICES[2].x} y1={VERTICES[2].y} x2={VERTICES[0].x} y2={VERTICES[0].y} stroke="rgba(47,42,61,0.1)" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* Animated glow behind active node */}
        <motion.div
          animate={{
            left: activeVertex.x - 20,
            top: activeVertex.y - 20,
            backgroundColor: activeMode.color + '18',
            boxShadow: `0 0 24px 8px ${activeMode.color}15`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute h-10 w-10 rounded-full"
          style={{ pointerEvents: 'none' }}
        />

        {/* Vertex nodes */}
        {MODES.map((mode, idx) => {
          const v = VERTICES[idx];
          const isActive = active === mode.key;
          return (
            <motion.button
              key={mode.key}
              onClick={() => onChange(mode.key)}
              animate={{
                scale: isActive ? 1.15 : 1,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute flex items-center justify-center rounded-full cursor-pointer z-10"
              style={{
                width: 28,
                height: 28,
                left: v.x - 14,
                top: v.y - 14,
              }}
              title={mode.desc}
            >
              {/* Background circle */}
              <motion.div
                animate={{
                  backgroundColor: isActive ? mode.color : '#ffffff',
                  borderColor: isActive ? mode.color : 'rgba(47,42,61,0.12)',
                  boxShadow: isActive
                    ? `0 4px 16px ${mode.color}40`
                    : '0 2px 8px rgba(47,42,61,0.06)',
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 rounded-full border-2"
              />
              {/* Emoji / indicator */}
              <span className="relative z-10 text-[11px]">
                {isActive ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    {mode.emoji}
                  </motion.span>
                ) : (
                  <motion.div
                    animate={{ backgroundColor: mode.color + '50' }}
                    className="h-1.5 w-1.5 rounded-full"
                  />
                )}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Active label */}
      <motion.div
        key={active}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col"
      >
        <span
          className="text-sm font-bold tracking-tight"
          style={{ color: activeMode.color }}
        >
          {activeMode.label}
        </span>
        <span className="text-[11px] text-brand-brown/50 font-medium">
          {activeMode.desc}
        </span>
      </motion.div>
    </div>
  );
}
