
import React from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}

export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange, min = 0, step = 1, suffix = "mm" }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs sm:text-sm font-bold text-slate-600 tracking-tight truncate">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={value === 0 ? "" : value}
          onChange={(e) => {
            const val = e.target.value === "" ? 0 : Number(e.target.value);
            onChange(val);
          }}
          placeholder="0"
          className="w-full min-h-[44px] px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors text-sm font-semibold tabular-nums pr-10 bg-slate-50 focus:bg-white text-slate-900"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 pointer-events-none">
          {suffix}
        </span>
      </div>
    </div>
  );
};
