import { GlassCard } from "@/components/GlassCard";
import { LucideIcon } from "lucide-react";

interface SecurityCardProps {
  icon: LucideIcon;
  title: string;
  mode: "institution" | "personal";
}

export const SecurityCard = ({ icon: Icon, title, mode }: SecurityCardProps) => {
  return (
    <GlassCard hover className="text-center">
      <div className={`w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center ${
        mode === "institution" ? "bg-institution/20 shadow-lg shadow-institution/30" : "bg-personal/20 shadow-lg shadow-personal/30"
      }`}>
        <Icon className={`w-7 h-7 ${
          mode === "institution" ? "text-institution" : "text-personal"
        }`} />
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </GlassCard>
  );
};
