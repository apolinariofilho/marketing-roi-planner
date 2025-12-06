import { ReactNode } from "react";

interface ResultCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  highlight?: boolean;
  variant?: "default" | "success" | "warning" | "destructive";
}

const ResultCard = ({ label, value, icon, highlight, variant = "default" }: ResultCardProps) => {
  const variantStyles = {
    default: "border-border",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
  };

  const valueStyles = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  return (
    <div
      className={`glass-card p-4 animate-fade-in transition-all duration-300 hover:scale-[1.02] ${
        variantStyles[variant]
      } ${highlight ? "glow-primary" : ""}`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`p-2 rounded-lg bg-secondary ${valueStyles[variant]}`}>
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={`text-xl font-display font-semibold ${valueStyles[variant]}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
