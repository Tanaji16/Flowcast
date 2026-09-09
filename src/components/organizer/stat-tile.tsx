import React from 'react';

interface StatTileProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
}

export function StatTile({ label, value, change, isPositive }: StatTileProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="mt-2 text-2xl font-bold text-slate-100">{value}</div>
      {change && (
        <span
          className={`text-xs font-semibold ${
            isPositive ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {change} vs baseline
        </span>
      )}
    </div>
  );
}
