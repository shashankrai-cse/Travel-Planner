import React from 'react';

export const LoadingSkeleton = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass rounded-2xl p-6 h-64 flex flex-col justify-between animate-pulse"
        >
          <div className="h-6 bg-white/15 rounded-md w-3/4 mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
          </div>
          <div className="h-10 bg-white/15 rounded-full w-1/3 mt-6" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
