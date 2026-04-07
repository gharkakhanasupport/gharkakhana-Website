import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const buttonStyles = {
  primary:
    'bg-brand-green text-white shadow-[0_12px_24px_rgba(95,166,59,0.28)] hover:-translate-y-0.5 hover:bg-brand-greenDark hover:shadow-[0_16px_28px_rgba(95,166,59,0.34)]',
  secondary:
    'border border-brand-brown/12 bg-white/80 text-brand-brown hover:border-brand-green/35 hover:bg-white hover:text-brand-greenDark',
  ghost: 'text-brand-brown hover:text-brand-greenDark',
};

export const Button = forwardRef(function Button({ as = 'button', to, href, children, variant = 'primary', className = '', onClick, type = 'button' }, ref) {
  const classes = `inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-200 ${buttonStyles[variant]} ${className}`;

  if (as === 'link' && to) {
    return (
      <Link ref={ref} to={to} className={classes}>
        {children}
      </Link>
    );
  }

  if (as === 'anchor' && href) {
    return (
      <a ref={ref} href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button ref={ref} type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
});
