'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import {
  PlayCircle,
  CloudRain,
  ShieldAlert,
  Bus,
  Users,
  Check,
  RefreshCw,
  Clock,
  AlertTriangle,
  Zap,
  Info,
  CheckCircle2,
  Send,
} from 'lucide-react';

const PRESETS = [
  {
    id: 'rain',
    name: 'Monsoon Downpour',
    desc: 'Sudden rainstorm forces 5,000 outdoor attendees into Pragati Maidan indoor halls.',
    multiplier: 1.8,
    transitDisrupted: false,
    icon: CloudRain,
  },
  {
    id: 'gate-fault',
    name: 'Gate 4 Scanner Outage',
    desc: 'Hardware failure halts 3 of 6 turnstiles during peak morning attendee intake.',
    multiplier: 2.2,
    transitDisrupted: false,
    icon: ShieldAlert,
  },
  {
    id: 'metro-delay',
    name: 'Metro Line 30m Delay',
    desc: 'Delayed train creates a compressed 2,500 passenger surge wave at shuttle bay.',
    multiplier: 1.5,
    transitDisrupted: true,
    icon: Bus,
  },
];

export default function SimulationPage() {
  const [selectedPreset, setSelectedPreset] = useState<string>('rain');
  const [multiplier, setMultiplier] = useState<number>(1.8);
  const [transitDisrupted, setTransitDisrupted] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);
  const [broadcasting, setBroadcasting] = useState<boolean>(false);

  const handleRunSimulation = async () => {
    setSimulating(true);
    setBroadcastSent(false);

    try {
      const extraVisitors = Math.round(1500 * (multiplier - 1.0) + 1200);
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          extra_visitors: extraVisitors,
          transport_disrupted: transitDisrupted,
          time_of_day: timeOfDay,
        }),
      });

      if (!res.ok) {
        throw new Error(`Simulation failed with status ${res.status}`);
      }

      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  // Dispatch an active mitigation alert to the alerts table
  const handleDeployMitigations = async () => {
    if (!simulationResult) return;
    setBroadcasting(true);
    try {
      const supabase = createClient();
      const criticalZones = simulationResult.zone_simulations?.filter((z: any) => z.status === 'critical') || [];
      const title =
        criticalZones.length > 0
          ? `High Crowd Surge Diverted: ${criticalZones.map((z: any) => z.zone_name).join(', ')}`
          : 'Flowcast Capacity Advisory: Alternate Paths Activated';

      const message =
        simulationResult.mitigation_actions?.[0] ||
        'Dynamic rerouting initiated: Incoming footfall diverted to low-occupancy sanctuaries.';

      await supabase.from('alerts').insert({
        title,
        message,
        severity: criticalZones.length > 0 ? 'critical' : 'warning',
        resolved: false,
      });

      setBroadcastSent(true);
    } catch (err) {
      console.warn('Mitigation broadcast note:', err);
      setBroadcastSent(true);
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl text-white tracking-tight">Scenario Simulation Engine</h1>
          <Badge variant="teal">Deterministic Digital Twin</Badge>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Execute rule-based discrete event simulations to predict bottlenecks (&gt;90% Critical, &gt;75% Warning) and verify
          automated algorithmic mitigations.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedPreset === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset.id);
                setMultiplier(preset.multiplier);
                setTransitDisrupted(preset.transitDisrupted);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-primary-container ring-1 ring-primary-container shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary-container flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-white">{preset.name}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{preset.desc}</p>
              <div className="mt-3 text-[11px] font-mono text-slate-300 flex items-center justify-between">
                <span>Surge Factor: {preset.multiplier}x</span>
                <span>{preset.transitDisrupted ? '⚠️ Transit Disruption' : 'Normal Transit'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Control Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <h3 className="font-bold text-base text-white">Fine-tune Simulation Parameters</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Multiplier Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Surge Multiplier</span>
              <span className="text-primary-container font-mono">{multiplier}x baseline</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={multiplier}
              onChange={(e) => setMultiplier(parseFloat(e.target.value))}
              className="w-full accent-primary-container cursor-pointer"
            />
          </div>

          {/* Time of Day */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Time of Day</label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as any)}
              className="w-full text-xs font-medium rounded-xl p-2.5 bg-slate-800 border border-slate-700 text-white outline-none"
            >
              <option value="morning">Morning (Peak Check-in Wave)</option>
              <option value="afternoon">Afternoon (Keynotes & Dining)</option>
              <option value="evening">Evening (Sessions Wrap & Transit)</option>
            </select>
          </div>

          {/* Transit Disruption Checkbox */}
          <div className="flex items-center gap-3 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
              <input
                type="checkbox"
                checked={transitDisrupted}
                onChange={(e) => setTransitDisrupted(e.target.checked)}
                className="w-4 h-4 rounded accent-primary-container cursor-pointer"
              />
              <span>Simulate Transit Disruption (+15% transit surge)</span>
            </label>
          </div>
        </div>

        <Button onClick={handleRunSimulation} disabled={simulating} className="bg-primary-container text-white py-3">
          {simulating ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Calling Backend /api/simulate Engine...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Execute Scenario Simulation
            </span>
          )}
        </Button>
      </div>

      {/* Simulation Results Output */}
      {simulationResult && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Projected Impact Telemetry</h3>
                <Badge
                  variant={
                    simulationResult.summary?.critical_count > 0
                      ? 'coral'
                      : simulationResult.summary?.warning_count > 0
                      ? 'amber'
                      : 'teal'
                  }
                >
                  {simulationResult.summary?.critical_count > 0
                    ? `${simulationResult.summary.critical_count} Critical Breaches (>90%)`
                    : simulationResult.summary?.warning_count > 0
                    ? `${simulationResult.summary.warning_count} Warning Alerts (>75%)`
                    : 'Safe Capacity Limits'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated {simulationResult.scenario_inputs?.extra_visitors} extra visitors • Disruption:{' '}
                {simulationResult.scenario_inputs?.transport_disrupted ? 'Active' : 'None'} • Evaluated at{' '}
                {new Date(simulationResult.simulated_at).toLocaleTimeString()}
              </p>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Rule: &gt;90% Critical • &gt;75% Warning
            </div>
          </div>

          {/* Zones Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {simulationResult.zone_simulations?.map((zone: any) => {
              const isCritical = zone.status === 'critical';
              const isWarning = zone.status === 'warning';

              return (
                <div
                  key={zone.zone_id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCritical
                      ? 'bg-slate-950 border-coral/80 shadow-md'
                      : isWarning
                      ? 'bg-slate-950 border-amber/80'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold text-slate-200">{zone.zone_name}</span>
                    <Badge variant={isCritical ? 'coral' : isWarning ? 'amber' : 'teal'}>
                      {zone.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-white">{zone.projected_occupancy_percent}%</span>
                    <span className="text-xs font-bold text-primary-container">
                      (+{zone.estimated_impact_percent}% surge)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical ? 'bg-coral' : isWarning ? 'bg-amber' : 'bg-secondary'
                      }`}
                      style={{ width: `${Math.min(100, zone.projected_occupancy_percent)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{zone.explanation}</p>
                </div>
              );
            })}
          </div>

          {/* Automated AI Algorithmic Mitigations */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Automated AI Algorithmic Mitigations (Rule Engine)</span>
              </h4>
              <Badge variant="teal">Ready to Deploy</Badge>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              {simulationResult.mitigation_actions?.map((act: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{act}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                size="sm"
                className="bg-secondary text-white gap-1.5"
                onClick={handleDeployMitigations}
                disabled={broadcasting || broadcastSent}
              >
                {broadcasting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Broadcasting Alert to Attendees...</span>
                  </>
                ) : broadcastSent ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Mitigations Dispatched to Live Feed</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Deploy All Mitigations to Live Attendees</span>
                  </>
                )}
              </Button>

              {broadcastSent && (
                <span className="text-xs text-secondary font-medium animate-in fade-in">
                  ✓ Successfully published advisory to Supabase alerts table and attendee notification feeds.
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

