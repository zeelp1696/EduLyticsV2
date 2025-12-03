import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  mode?: "institution" | "personal";
  className?: string;
  showGlow?: boolean;
}

export const ProgressBar = ({ 
  value, 
  mode = "institution", 
  className,
  showGlow = true 
}: ProgressBarProps) => {
  const colorClass = mode === "institution" ? "bg-institution" : "bg-personal";
  const glowClass = mode === "institution" 
    ? "shadow-[0_0_10px_rgba(0,123,255,0.6)]" 
    : "shadow-[0_0_10px_rgba(0,200,150,0.6)]";

  return (
    <div className={cn("w-full h-2 bg-secondary rounded-full overflow-hidden", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          colorClass,
          showGlow && glowClass
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
