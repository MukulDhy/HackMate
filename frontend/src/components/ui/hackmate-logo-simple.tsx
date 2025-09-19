import { cn } from '@/lib/utils';

interface HackMateLogoSimpleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function HackMateLogoSimple({ 
  className, 
  size = 'md', 
  animated = true 
}: HackMateLogoSimpleProps) {
  return (
    <div className={cn(
      'relative flex-shrink-0 logo-responsive',
      sizeClasses[size],
      animated && 'transition-all duration-300 group-hover:animate-neon-pulse',
      className
    )}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Enhanced neon glow filters for better visibility */}
          <filter id="simple-neon-pink" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" values="1 0 1 0 0  0 0 1 0 0  1 0 1 0 0  0 0 0 1 0"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="simple-neon-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" values="0 1 1 0 0  0 1 1 0 0  0 1 1 0 0  0 0 0 1 0"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background fill for better visibility */}
        <path 
          d="M50 10 L80 30 L80 70 L50 90 L20 70 L20 30 Z" 
          fill="rgba(0, 0, 0, 0.3)" 
          stroke="#ff1493" 
          strokeWidth="3" 
          filter="url(#simple-neon-pink)"
          className={animated ? 'animate-pulse' : ''}
        />
        
        {/* Inner accent with stronger stroke */}
        <path 
          d="M50 20 L70 35 L70 65 L50 80 L30 65 L30 35 Z" 
          fill="none" 
          stroke="#00ffff" 
          strokeWidth="2" 
          filter="url(#simple-neon-cyan)"
        />
        
        {/* Simplified HM text with better contrast */}
        <text 
          x="50" 
          y="55" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontSize="18" 
          fontWeight="bold" 
          fill="#ffffff"
          stroke="#00ffff"
          strokeWidth="0.5"
          filter="url(#simple-neon-cyan)"
        >
          HM
        </text>
        
        {/* Small circuit elements */}
        <g stroke="#00ffff" strokeWidth="1" filter="url(#simple-neon-cyan)" className={animated ? 'animate-circuit-glow' : ''}>
          <line x1="35" y1="40" x2="45" y2="40"/>
          <line x1="55" y1="40" x2="65" y2="40"/>
          <circle cx="45" cy="40" r="1" fill="#00ffff" className={animated ? 'animate-pulse' : ''}/>
          <circle cx="55" cy="40" r="1" fill="#00ffff" className={animated ? 'animate-pulse' : ''}/>
        </g>
      </svg>
      
      {/* Hover glow effect */}
      {animated && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
      )}
    </div>
  );
}