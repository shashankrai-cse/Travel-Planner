import React from 'react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-white/10 text-mist-300 border-white/15',
    sunset: 'bg-sunset-500/20 text-sunset-500 border-sunset-500/30',
    gold: 'bg-gold-400/20 text-gold-400 border-gold-400/30',
    horizon: 'bg-horizon-600/20 text-horizon-600 border-horizon-600/30',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-mono tracking-wider border backdrop-blur-md ${variants[variant] || variants.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
