import { HackMateLogo } from './hackmate-logo';
import { HackMateLogoSimple } from './hackmate-logo-simple';
import { GlassCard } from './glass-card';

export function LogoShowcase() {
  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h2 className="font-orbitron font-bold text-3xl mb-4">HackMate Logo Showcase</h2>
        <p className="text-muted-foreground">Responsive logo variations with neon animations</p>
      </div>
      
      {/* Full Logo Variations */}
      <GlassCard className="p-8">
        <h3 className="font-orbitron font-semibold text-xl mb-6 text-center">Full Logo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center justify-items-center">
          <div className="text-center space-y-2">
            <HackMateLogo size="sm" />
            <p className="text-sm text-muted-foreground">Small (sm)</p>
          </div>
          <div className="text-center space-y-2">
            <HackMateLogo size="md" />
            <p className="text-sm text-muted-foreground">Medium (md)</p>
          </div>
          <div className="text-center space-y-2">
            <HackMateLogo size="lg" />
            <p className="text-sm text-muted-foreground">Large (lg)</p>
          </div>
          <div className="text-center space-y-2">
            <HackMateLogo size="xl" />
            <p className="text-sm text-muted-foreground">Extra Large (xl)</p>
          </div>
        </div>
      </GlassCard>
      
      {/* Simple Logo Variations */}
      <GlassCard className="p-8">
        <h3 className="font-orbitron font-semibold text-xl mb-6 text-center">Simple Logo (Navbar)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
          <div className="text-center space-y-2">
            <HackMateLogoSimple size="sm" />
            <p className="text-sm text-muted-foreground">Small (sm)</p>
          </div>
          <div className="text-center space-y-2">
            <HackMateLogoSimple size="md" />
            <p className="text-sm text-muted-foreground">Medium (md)</p>
          </div>
          <div className="text-center space-y-2">
            <HackMateLogoSimple size="lg" />
            <p className="text-sm text-muted-foreground">Large (lg)</p>
          </div>
        </div>
      </GlassCard>
      
      {/* Animation States */}
      <GlassCard className="p-8">
        <h3 className="font-orbitron font-semibold text-xl mb-6 text-center">Animation States</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          <div className="text-center space-y-2">
            <HackMateLogo size="lg" animated={false} />
            <p className="text-sm text-muted-foreground">Static (no animation)</p>
          </div>
          <div className="text-center space-y-2">
            <HackMateLogo size="lg" animated={true} />
            <p className="text-sm text-muted-foreground">Animated (hover me!)</p>
          </div>
        </div>
      </GlassCard>
      
      {/* Responsive Demo */}
      <GlassCard className="p-8">
        <h3 className="font-orbitron font-semibold text-xl mb-6 text-center">Responsive Behavior</h3>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">The logo automatically scales down on smaller screens:</p>
          <div className="flex justify-center">
            <HackMateLogo size="xl" className="logo-responsive" />
          </div>
          <p className="text-sm text-muted-foreground">
            Try resizing your browser window to see the responsive scaling in action
          </p>
        </div>
      </GlassCard>
    </div>
  );
}