import { cn } from '@/lib/utils';

interface HackMateLogoProfessionalProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

export function HackMateLogoProfessional({ 
  className, 
  size = 'md',
  variant = 'default'
}: HackMateLogoProfessionalProps) {
  return (
    <div className={cn(
      'relative flex-shrink-0 transition-all duration-200',
      sizeClasses[size],
      className
    )}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Professional gradient */}
          <linearGradient id="professional-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>
          
          {/* Subtle shadow */}
          <filter id="professional-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.1"/>
          </filter>
        </defs>
        
        {/* Main hexagon shape */}
        <path 
          d="M50 10 L80 30 L80 70 L50 90 L20 70 L20 30 Z" 
          fill={variant === 'minimal' ? 'none' : 'url(#professional-gradient)'}
          stroke="#3b82f6" 
          strokeWidth="2" 
          filter="url(#professional-shadow)"
        />
        
        {/* Inner accent lines */}
        <g stroke="#60a5fa" strokeWidth="1" opacity="0.6">
          <line x1="35" y1="40" x2="45" y2="40"/>
          <line x1="55" y1="40" x2="65" y2="40"/>
          <line x1="40" y1="60" x2="60" y2="60"/>
        </g>
        
        {/* Professional HM text */}
        <text 
          x="50" 
          y="58" 
          textAnchor="middle" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="18" 
          fontWeight="600" 
          fill="#ffffff"
        >
          HM
        </text>
      </svg>
    </div>
  );
}