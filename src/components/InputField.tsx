import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFieldProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

const InputField = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  min = 0,
  max,
  step = 1,
}: InputFieldProps) => {
  return (
    <div className="space-y-2 animate-fade-in">
      <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`${prefix ? "pl-10" : ""} ${suffix ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputField;
