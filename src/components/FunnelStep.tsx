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
      <div className="glass-card p-5 w-full text-center transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">{label}</p>
        <p className="text-4xl font-display font-bold text-foreground tabular-nums">{value.toFixed(0)}</p>
        {percentage !== undefined && (
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary">{percentage}%</span>
            <span className="text-xs text-primary/70">do anterior</span>
          </div>
        )}
      </div>
      {!isLast && (
        <div className="py-3 text-primary">
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </div>
      )}
    </div>
  );
};

export default FunnelStep;
