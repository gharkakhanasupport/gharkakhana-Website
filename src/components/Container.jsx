import { forwardRef } from 'react';

export const Container = forwardRef(function Container({ children, className = '' }, ref) {
  return (
    <div ref={ref} className={`site-container ${className}`}>
      {children}
    </div>
  );
});
