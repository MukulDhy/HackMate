

import React, { useState } from 'react';

// Types
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoaderProps> = ({ size = 'md', color = 'red-100', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className={`absolute inset-0 rounded-full border-2 border-${color} animate-ping`}></div>
      <div className={`absolute inset-2 rounded-full border-2 border-${color} animate-ping`} style={{ animationDelay: '0.5s' }}></div>
      <div className={`absolute inset-4 rounded-full bg-${color} animate-pulse`}></div>
    </div>
  );
};