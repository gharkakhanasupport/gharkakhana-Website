import { motion } from 'framer-motion';

/**
 * Unified Toggle Switch
 *
 * @param {boolean}  checked   - Current state
 * @param {function} onChange  - Called with new boolean value
 * @param {boolean}  disabled  - Disable interaction
 * @param {boolean}  loading   - Show pulsing animation
 * @param {boolean}  labeled   - Show ON/OFF label beside toggle
 * @param {string}   label     - Optional accessible label
 * @param {string}   className - Additional wrapper classes
 */
export function Toggle({
  checked = false,
  onChange,
  disabled = false,
  loading = false,
  labeled = false,
  label,
  className = '',
}) {
  const handleClick = () => {
    if (disabled || loading) return;
    onChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled || loading}
      onClick={handleClick}
      className={`group inline-flex items-center gap-2.5 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {/* Track */}
      <span
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 ${
          checked
            ? 'bg-brand-green shadow-[0_2px_8px_rgba(95,166,59,0.3)]'
            : 'bg-brand-brown/20'
        } ${loading ? 'animate-pulse' : ''}`}
        style={{ width: 44, height: 24 }}
      >
        {/* Thumb */}
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="block rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
          style={{
            width: 20,
            height: 20,
            position: 'absolute',
            top: 2,
            left: checked ? 22 : 2,
          }}
          animate={{ left: checked ? 22 : 2 }}
        />
      </span>

      {/* Label */}
      {labeled && (
        <span
          className={`text-xs font-bold uppercase tracking-wider select-none ${
            checked ? 'text-brand-green' : 'text-brand-brown/40'
          }`}
        >
          {checked ? 'ON' : 'OFF'}
        </span>
      )}
    </button>
  );
}
