import { GlassCard } from "@/components/GlassCard";
import { LucideIcon } from "lucide-react";

interface StepCardProps {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  mode: "institution" | "personal";
}

export const StepCard = ({ step, icon: Icon, title, description, mode }: StepCardProps) => {
  return (
    <GlassCard hover className="relative">
      <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
        mode === "institution" 
          ? "bg-gradient-to-br from-institution to-institution-glow text-institution-foreground" 
          : "bg-gradient-to-br from-personal to-personal-glow text-personal-foreground"
      }`}>
        {step}
      </div>
      <div className="flex items-start gap-4 pt-2">
        <div className={`p-3 rounded-xl ${
          mode === "institution" ? "bg-institution/20" : "bg-personal/20"
        }`}>
          <Icon className={`w-6 h-6 ${
            mode === "institution" ? "text-institution" : "text-personal"
          }`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </GlassCard>
  );
};
