
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
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold text-slate-500 tracking-tight">{label}</label>
      <div className="relative">
        <input
          type="number"
          min={min}
          step={step}
          value={value === 0 ? "" : value}
          onChange={(e) => {
            const val = e.target.value === "" ? 0 : Number(e.target.value);
            onChange(val);
          }}
          placeholder="0"
          className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-semibold pr-10 bg-slate-50 focus:bg-white"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase pointer-events-none">
          {suffix}
        </span>
      </div>
    </div>
  );
};
