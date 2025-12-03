import { ReactNode, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}

export const GlassCard = ({ children, className, hover = false, style }: GlassCardProps) => {
  return (
    <div
      style={style}
      className={cn(
        "bg-card/70 backdrop-blur-md border border-border/50 rounded-2xl p-6 transition-all duration-300",
        hover && "hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
};