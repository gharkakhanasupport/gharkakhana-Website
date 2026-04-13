import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';

/**
 * Demo Mode "Coming Soon" Overlay
 *
 * Wraps children with a semi-transparent overlay when active.
 * All interactive elements beneath become non-interactive.
 *
 * @param {boolean} active   - Whether to show the overlay
 * @param {string}  title    - Heading text (default: "Coming Soon")
 * @param {string}  subtitle - Body text
 * @param {ReactNode} children - Content to overlay
 */
export function DemoOverlay({
  active = false,
  title = 'Coming Soon',
  subtitle = 'This feature will be available shortly.',
  children,
  className = '',
}) {
  if (!active) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      {/* Underlying content — disabled */}
      <div className="pointer-events-none opacity-50 select-none">
        {children}
      </div>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-brand-brown/40 backdrop-blur-[2px]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 }}
          className="rounded-2xl bg-white/90 px-8 py-6 text-center shadow-soft border border-white/50 max-w-[280px]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-cream/80 text-brand-brown/40 mb-3">
            <FiLock className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-brand-brown tracking-tight">{title}</h3>
          <p className="mt-1.5 text-xs text-brand-brown/50 leading-relaxed">{subtitle}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
