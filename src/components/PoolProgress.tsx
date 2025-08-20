'use client';

import React from 'react';

interface PoolProgressProps {
  current: number;
  target: number;
}

export const PoolProgress: React.FC<PoolProgressProps> = ({ current, target }) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>R{current.toLocaleString()}</span>
        <span>R{target.toLocaleString()}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500 relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full border-2 border-teal-500 transform translate-x-1/2"></div>
        </div>
      </div>
      <div className="text-center">
        <span className="text-lg font-bold text-teal-600">{percentage.toFixed(1)}%</span>
        <span className="text-sm text-gray-500 ml-1">complete</span>
      </div>
    </div>
  );
};