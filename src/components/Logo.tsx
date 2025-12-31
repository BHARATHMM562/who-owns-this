import { HelpCircle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 44,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <HelpCircle 
          size={iconSizes[size]} 
          className="text-primary animate-pulse-glow" 
        />
        <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
      </div>
      <h1 className={`font-mono font-bold tracking-tight ${sizeClasses[size]}`}>
        <span className="text-foreground">WHO</span>
        <span className="text-primary"> OWNS </span>
        <span className="text-foreground">THIS</span>
        <span className="text-accent">?</span>
      </h1>
    </div>
  );
}
