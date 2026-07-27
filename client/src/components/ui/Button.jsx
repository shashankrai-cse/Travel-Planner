import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-sunset-500 text-white hover:bg-sunset-500/90 shadow-lg shadow-sunset-500/25 active:scale-[0.98]',
    secondary:
      'glass text-white hover:bg-white/20 border border-white/20 active:scale-[0.98]',
    ghost: 'text-mist-300 hover:text-white hover:bg-white/10 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-xs font-mono tracking-wider',
    md: 'px-6 py-2.5 text-sm font-body',
    lg: 'px-8 py-3.5 text-base font-body font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
