import { ReactNode } from "react";
import { GlassCard } from "@/components/GlassCard";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  mode: "institution" | "personal";
}

export const FeatureCard = ({ icon: Icon, title, description, mode }: FeatureCardProps) => {
  return (
    <GlassCard hover className="text-center">
      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
        mode === "institution" ? "bg-institution/20" : "bg-personal/20"
      }`}>
        <Icon className={`w-8 h-8 ${
          mode === "institution" ? "text-institution" : "text-personal"
        }`} />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </GlassCard>
  );
};
