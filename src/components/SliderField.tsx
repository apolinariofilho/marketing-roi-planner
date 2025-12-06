import { Slider } from "@/components/ui/slider";

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  formatValue?: (value: number) => string;
}

const SliderField = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix = "",
  suffix = "",
  formatValue,
}: SliderFieldProps) => {
  const displayValue = formatValue ? formatValue(value) : `${prefix}${value.toLocaleString('pt-BR')}${suffix}`;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className="text-sm font-bold text-foreground tabular-nums">{displayValue}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={min}
        max={max}
        step={step}
        className="cursor-pointer"
      />
    </div>
  );
};

export default SliderField;
