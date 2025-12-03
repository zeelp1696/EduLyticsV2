import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  mode?: 'institution' | 'personal' | 'neutral';
  glow?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  mode = 'neutral',
  glow = false,
}: GlassCardProps) {
  const glowClasses = {
    institution: glow ? 'shadow-institution/50' : 'shadow-institution/30',
    personal: glow ? 'shadow-personal/50' : 'shadow-personal/30',
    neutral: 'shadow-lg',
  };

  return (
    <div
      className={`
        rounded-2xl
        bg-card backdrop-blur-lg
        border border-border/50
        transition-all duration-300
        ${glowClasses[mode]}
        hover:shadow-2xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}
