import React from 'react';
import Button from './Button';

export const EmptyState = ({
  caption = "NO RESULTS FOUND",
  title = "No packages matching your filter",
  actionText,
  onAction,
}) => {
  return (
    <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto my-8 flex flex-col items-center">
      <span className="font-mono text-caption text-gold-400 tracking-wider uppercase mb-2">
        {caption}
      </span>
      <h3 className="font-display text-display-md text-white mb-4">{title}</h3>
      {actionText && onAction && (
        <Button variant="secondary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
