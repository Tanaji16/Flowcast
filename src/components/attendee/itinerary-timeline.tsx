import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ItineraryItem } from '@/types/attendee.types';

export function ItineraryTimeline({ items }: { items: ItineraryItem[] }) {
  return (
    <div className="relative border-l-2 border-blue-200 ml-4 pl-6 space-y-6 dark:border-blue-900">
      {items.map((item) => (
        <div key={item.id} className="relative">
          <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-600 dark:border-slate-900" />
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {item.startTime} - {item.endTime}
              </span>
              <Badge
                variant={
                  item.congestionStatus === 'high'
                    ? 'danger'
                    : item.congestionStatus === 'moderate'
                    ? 'warning'
                    : 'success'
                }
              >
                {item.congestionStatus.toUpperCase()} CROWD
              </Badge>
            </div>
            <h4 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{item.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.location}</p>
            {item.isAlternativeSuggested && (
              <div className="mt-3 rounded-md bg-amber-50 p-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                ⚡ Alternative route suggested to avoid peak congestion.
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
