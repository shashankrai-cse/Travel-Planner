import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({
  children,
  elevated = false,
  className = '',
  hoverEffect = true,
  ...props
}) => {
  const baseClass = elevated ? 'glass-elevated' : 'glass';
  const hoverClass = hoverEffect
    ? 'transition-all duration-300 hover:border-sunset-500/40 hover:shadow-2xl'
    : '';

  return (
    <motion.div
      className={`${baseClass} rounded-2xl p-6 text-white ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
