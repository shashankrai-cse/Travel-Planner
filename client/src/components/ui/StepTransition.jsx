import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

export const StepTransition = ({ currentStep, direction = 1, children }) => {
  return (
    <div className="relative overflow-hidden w-full min-h-[350px]">
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={currentStep}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StepTransition;
