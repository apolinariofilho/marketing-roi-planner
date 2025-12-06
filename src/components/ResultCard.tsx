import { ReactNode } from "react";

interface ResultCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  highlight?: boolean;
  variant?: "default" | "success" | "warning" | "destructive";
  size?: "default" | "large";
}

const ResultCard = ({ label, value, icon, highlight, variant = "default", size = "default" }: ResultCardProps) => {
  const variantStyles = {
    default: "border-border bg-card",
    success: "border-success/40 bg-success/10",
    warning: "border-warning/40 bg-warning/10",
    destructive: "border-destructive/40 bg-destructive/10",
  };

  const valueStyles = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    destructive: "text-destructive",
  };

  const iconBg = {
    default: "bg-secondary",
    success: "bg-success/20",
    warning: "bg-warning/20",
    destructive: "bg-destructive/20",
  };

  return (
    <div
      className={`glass-card p-5 animate-fade-in transition-all duration-300 hover:scale-[1.02] ${
        variantStyles[variant]
      } ${highlight ? "glow-primary border-primary/40" : ""}`}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className={`p-3 rounded-xl ${iconBg[variant]} ${valueStyles[variant]}`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">{label}</p>
          <p className={`${size === "large" ? "text-3xl" : "text-2xl"} font-display font-bold tabular-nums ${valueStyles[variant]}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
