import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { AlertItem } from '@/hooks/useAlerts';

export function AlertList({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) {
    return <div className="text-sm text-slate-400">No active alerts recorded.</div>;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="flex items-start justify-between rounded-lg border border-slate-800 bg-slate-900 p-3"
        >
          <div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  alert.severity === 'critical'
                    ? 'danger'
                    : alert.severity === 'warning'
                    ? 'warning'
                    : 'default'
                }
              >
                {alert.severity.toUpperCase()}
              </Badge>
              <h5 className="font-semibold text-slate-200 text-sm">{alert.title}</h5>
            </div>
            <p className="text-xs text-slate-400 mt-1">{alert.message}</p>
          </div>
          <span className="text-[10px] text-slate-500">
            {new Date(alert.created_at).toLocaleTimeString()}
          </span>
        </div>
      ))}
    </div>
  );
}
