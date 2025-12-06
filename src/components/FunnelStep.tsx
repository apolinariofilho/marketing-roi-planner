import { ArrowDown } from "lucide-react";

interface FunnelStepProps {
  label: string;
  value: number;
  percentage?: number;
  isLast?: boolean;
}

const FunnelStep = ({ label, value, percentage, isLast }: FunnelStepProps) => {
  return (
    <div className="flex flex-col items-center animate-slide-in">
      <div className="glass-card p-4 w-full text-center transition-all duration-300 hover:border-primary/50">
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground">{value.toFixed(0)}</p>
        {percentage !== undefined && (
          <p className="text-xs text-primary mt-1">{percentage}% do anterior</p>
        )}
      </div>
      {!isLast && (
        <div className="py-2 text-primary animate-pulse">
          <ArrowDown className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default FunnelStep;
