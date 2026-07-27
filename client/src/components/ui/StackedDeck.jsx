import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const StackedDeck = ({ items = [], renderItem, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!items || items.length === 0) return null;

  return (
    <div className={`relative flex items-center justify-center min-h-[380px] py-8 ${className}`}>
      <div className="relative w-full max-w-xl h-[340px] flex items-center justify-center">
        {items.map((item, index) => {
          const isHovered = hoveredIndex === index;
          const offset = index - Math.floor(items.length / 2);
          
          return (
            <motion.div
              key={item._id || item.id || index}
              className="absolute w-[280px] sm:w-[340px] cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                rotate: isHovered ? 0 : offset * 4,
                x: isHovered ? 0 : offset * 22,
                y: isHovered ? -20 : Math.abs(offset) * 8,
                scale: isHovered ? 1.05 : 1 - Math.abs(offset) * 0.05,
                zIndex: isHovered ? 40 : 20 - Math.abs(offset),
              }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {renderItem(item, { isHovered, index })}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StackedDeck;
