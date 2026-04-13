import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiInfo } from 'react-icons/fi';

/**
 * DemoBanner — Slim persistent top bar for demo mode
 *
 * Shows a message + dismiss button. Dismiss state persists in sessionStorage.
 */
export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('gkk_demo_banner_dismissed');
    if (stored === 'true') setDismissed(true);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('gkk_demo_banner_dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-center gap-3 bg-brand-green/10 border-b border-brand-green/20 px-4 py-2.5">
            <FiInfo className="h-3.5 w-3.5 text-brand-green shrink-0" />
            <p className="text-xs font-semibold text-brand-green">
              You're viewing a demo — some features are coming soon
            </p>
            <button
              onClick={handleDismiss}
              className="shrink-0 rounded-full p-1 text-brand-green/50 hover:text-brand-green hover:bg-brand-green/10 transition-colors"
              aria-label="Dismiss demo banner"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
