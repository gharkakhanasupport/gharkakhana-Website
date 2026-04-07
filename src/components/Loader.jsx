import React from 'react';
import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[linear-gradient(to_bottom,#FFF9F2,#f2d4a8)]">
      {/* Background radial glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute h-[28rem] w-[28rem] rounded-full bg-brand-green/15 blur-[80px]"
      />

      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative flex h-36 w-36 items-center justify-center rounded-[2.2rem] border border-brand-brown/10 bg-white/40 shadow-soft backdrop-blur-md"
        >
          {/* Detailed SVG reflecting the Ghar Ka Khana Spoon / Ladle */}
          <svg
            viewBox="0 0 120 120"
            className="h-20 w-20 stroke-brand-green stroke-[3.5] fill-none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Steam lines */}
            {[0, 1, 2].map((i) => (
              <motion.path
                key={i}
                d={`M ${35 + i * 18} 55 C ${28 + i * 18} 45, ${42 + i * 18} 35, ${35 + i * 18} 25 C ${28 + i * 18} 15, ${42 + i * 18} 5, ${35 + i * 18} -5`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: [0, 1, 0], y: [15, -2, -18] }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: i * 0.45,
                }}
              />
            ))}

            {/* Spoon/Ladle (Animated with subtle tilt) */}
            <motion.g
              animate={{ rotate: [-1.5, 2.5, -1.5], y: [0, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '45px', originY: '65px' }}
            >
              {/* The bowl of the ladle */}
              <path d="M 18 65 L 82 65 C 82 98, 18 98, 18 65 Z" className="fill-brand-green/10" />
              {/* The handle of the ladle */}
              <path d="M 80 65 Q 90 20 102 22 A 6 6 0 0 1 108 28 A 6 6 0 0 1 102 34" />
            </motion.g>
          </svg>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
          className="mt-8 text-center"
        >
          <div className="text-[1.15rem] font-bold tracking-tight text-brand-brown">
            Preparing your comfort meal
            <motion.span
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
            >
              ...
            </motion.span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
