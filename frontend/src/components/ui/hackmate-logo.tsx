import { cn } from '@/lib/utils';

interface HackMateLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export function HackMateLogo({ 
  className, 
  size = 'md', 
  animated = true 
}: HackMateLogoProps) {
  return (
    <div className={cn(
      'relative flex-shrink-0 logo-responsive',
      sizeClasses[size],
      animated && 'animate-neon-pulse hover:animate-pulse-glow',
      className
    )}>
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Enhanced neon glow filters */}
          <filter id="neon-pink" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" values="1 0 1 0 0  0 0 1 0 0  1 0 1 0 0  0 0 0 1 0"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="neon-cyan" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feColorMatrix in="coloredBlur" values="0 1 1 0 0  0 1 1 0 0  0 1 1 0 0  0 0 0 1 0"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background hexagon with dark fill for better contrast */}
        <path 
          d="M200 50 L320 110 L320 230 L200 290 L80 230 L80 110 Z" 
          fill="rgba(0, 0, 0, 0.4)" 
          stroke="#ff1493" 
          strokeWidth="5" 
          filter="url(#neon-pink)"
          className={animated ? 'animate-pulse' : ''}
        />
        
        {/* Inner hexagon (cyan outline) with stronger stroke */}
        <path 
          d="M200 70 L300 120 L300 220 L200 270 L100 220 L100 120 Z" 
          fill="none" 
          stroke="#00ffff" 
          strokeWidth="4" 
          filter="url(#neon-cyan)"
        />
        
        {/* Circuit pattern inside */}
        <g stroke="#00ffff" strokeWidth="2" fill="none" filter="url(#neon-cyan)" className={animated ? 'animate-circuit-glow' : ''}>
          {/* Horizontal lines */}
          <line x1="120" y1="140" x2="160" y2="140"/>
          <line x1="180" y1="140" x2="220" y2="140"/>
          <line x1="240" y1="140" x2="280" y2="140"/>
          
          {/* Vertical connectors */}
          <line x1="160" y1="140" x2="160" y2="160"/>
          <line x1="180" y1="140" x2="180" y2="120"/>
          <line x1="220" y1="140" x2="220" y2="160"/>
          <line x1="240" y1="140" x2="240" y2="120"/>
          
          {/* Connection nodes */}
          <circle cx="160" cy="140" r="3" fill="#00ffff" className={animated ? 'animate-pulse' : ''}/>
          <circle cx="180" cy="140" r="3" fill="#00ffff" className={animated ? 'animate-pulse' : ''}/>
          <circle cx="220" cy="140" r="3" fill="#00ffff" className={animated ? 'animate-pulse' : ''}/>
          <circle cx="240" cy="140" r="3" fill="#00ffff" className={animated ? 'animate-pulse' : ''}/>
        </g>
        
        {/* HACK MATE text banner */}
        <path 
          d="M120 180 L280 180 L270 210 L130 210 Z" 
          fill="#ff1493" 
          stroke="#ff1493" 
          strokeWidth="2" 
          filter="url(#neon-pink)"
        />
        
        {/* HACK MATE text with better visibility */}
        <text 
          x="200" 
          y="200" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontSize="20" 
          fontWeight="bold" 
          fill="#ffffff"
          stroke="#ff1493"
          strokeWidth="0.5"
        >
          HACK MATE
        </text>
        
        {/* JOIN TEAMS WIN IT text */}
        <text 
          x="140" 
          y="235" 
          fontFamily="Arial, sans-serif" 
          fontSize="10" 
          fill="#00ffff" 
          filter="url(#neon-cyan)"
        >
          JOIN TEAMS
        </text>
        <text 
          x="240" 
          y="235" 
          fontFamily="Arial, sans-serif" 
          fontSize="10" 
          fill="#00ffff" 
          filter="url(#neon-cyan)"
        >
          WIN IT
        </text>
        
        {/* HM shield */}
        <path 
          d="M200 240 L210 250 L210 265 L200 270 L190 265 L190 250 Z" 
          fill="none" 
          stroke="#00ffff" 
          strokeWidth="2" 
          filter="url(#neon-cyan)"
        />
        <text 
          x="200" 
          y="260" 
          textAnchor="middle" 
          fontFamily="Arial, sans-serif" 
          fontSize="12" 
          fontWeight="bold" 
          fill="#00ffff"
        >
          HM
        </text>
        
        {/* Lightning bolts */}
        <path 
          d="M175 250 L170 255 L175 260 L170 265" 
          stroke="#00ffff" 
          strokeWidth="2" 
          fill="none" 
          filter="url(#neon-cyan)"
        />
        <path 
          d="M225 250 L230 255 L225 260 L230 265" 
          stroke="#00ffff" 
          strokeWidth="2" 
          fill="none" 
          filter="url(#neon-cyan)"
        />
      </svg>
      
      {/* Additional glow effect for hover */}
      {animated && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
      )}
    </div>
  );
}