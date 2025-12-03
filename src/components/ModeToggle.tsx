import { Building2, User } from "lucide-react";

interface ModeToggleProps {
  mode: "institution" | "personal";
  onChange: (mode: "institution" | "personal") => void;
}

export const ModeToggle = ({ mode, onChange }: ModeToggleProps) => {
  return (
    <div className="flex items-center gap-2 p-1 bg-card/50 backdrop-blur-sm border border-border rounded-full">
      <button
        onClick={() => onChange("institution")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
          mode === "institution"
            ? "bg-institution text-institution-foreground shadow-lg shadow-institution/50"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Building2 className="w-4 h-4" />
        <span className="text-sm font-medium">Institution</span>
      </button>
      <button
        onClick={() => onChange("personal")}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
          mode === "personal"
            ? "bg-personal text-personal-foreground shadow-lg shadow-personal/50"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">Personal</span>
      </button>
    </div>
  );
};
