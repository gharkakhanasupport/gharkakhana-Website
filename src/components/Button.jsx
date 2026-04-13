import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const variantStyles = {
  primary:
    'bg-brand-green text-white shadow-[0_12px_24px_rgba(95,166,59,0.28)] hover:-translate-y-0.5 hover:bg-brand-greenDark hover:shadow-[0_16px_28px_rgba(95,166,59,0.34)] active:scale-[0.97] active:shadow-[0_8px_16px_rgba(95,166,59,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_12px_24px_rgba(95,166,59,0.28)]',
  secondary:
    'border border-brand-brown/12 bg-white/80 text-brand-brown hover:border-brand-green/35 hover:bg-white hover:text-brand-greenDark active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-brand-brown/12 disabled:hover:text-brand-brown',
  danger:
    'bg-error/10 text-error border border-error/20 hover:bg-error hover:text-white hover:border-error active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-error/10 disabled:hover:text-error',
  ghost:
    'text-brand-brown hover:text-brand-greenDark hover:bg-brand-green/5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed',
  icon:
    'flex items-center justify-center rounded-full bg-white/50 border border-brand-brown/10 text-brand-brown hover:bg-white hover:text-brand-green active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-8 py-3.5 text-base gap-2.5',
};

const iconSizeStyles = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

function Spinner({ className = '' }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Button = forwardRef(function Button(
  {
    as = 'button',
    to,
    href,
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    onClick,
    type = 'button',
    disabled = false,
    loading = false,
    icon,
    ...rest
  },
  ref
) {
  const isIcon = variant === 'icon';
  const baseClasses = isIcon
    ? `inline-flex transition duration-200 ${variantStyles.icon} ${iconSizeStyles[size]} ${className}`
    : `inline-flex items-center justify-center rounded-full font-semibold transition duration-200 ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      {loading && <Spinner className={children ? 'mr-1' : ''} />}
      {!loading && icon && <span className="shrink-0">{icon}</span>}
      {children}
    </>
  );

  const isDisabled = disabled || loading;

  if (as === 'link' && to) {
    return (
      <Link ref={ref} to={to} className={baseClasses} {...rest}>
        {content}
      </Link>
    );
  }

  if (as === 'anchor' && href) {
    return (
      <a ref={ref} href={href} className={baseClasses} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button ref={ref} type={type} onClick={onClick} disabled={isDisabled} className={baseClasses} {...rest}>
      {content}
    </button>
  );
});
