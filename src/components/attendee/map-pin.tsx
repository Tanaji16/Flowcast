import React from 'react';

interface MapPinProps {
  label: string;
  status: 'low' | 'moderate' | 'critical';
  occupancyPercent: number;
}

export function MapPin({ label, status, occupancyPercent }: MapPinProps) {
  const colors = {
    low: 'bg-emerald-500 ring-emerald-200',
    moderate: 'bg-amber-500 ring-amber-200',
    critical: 'bg-rose-500 ring-rose-200 animate-pulse',
  };

  return (
    <div className="inline-flex flex-col items-center">
      <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow ring-4 ${colors[status]}`}>
        <span>{label}</span>
        <span className="opacity-90">({occupancyPercent}%)</span>
      </div>
      <div className="h-2 w-0.5 bg-slate-400" />
    </div>
  );
}
