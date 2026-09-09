'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export function SimulationPanel() {
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleSimulate = async () => {
    setRunning(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: 'rain_burst', intensity: 1.5 }),
      });
      const data = await res.json();
      setOutput(JSON.stringify(data, null, 2));
    } catch (e) {
      setOutput('Simulation execution failed.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
      <h3 className="font-semibold text-slate-100">Scenario Stress Simulator</h3>
      <p className="text-xs text-slate-400">
        Run what-if simulations to calculate ripple effects of adverse weather, gate closures, or transport delays.
      </p>
      <Button onClick={handleSimulate} disabled={running}>
        {running ? 'Calculating Simulation...' : 'Execute Stress Simulation'}
      </Button>
      {output && (
        <pre className="p-3 bg-slate-950 text-emerald-400 text-xs rounded border border-slate-800 overflow-x-auto">
          {output}
        </pre>
      )}
    </div>
  );
}
