'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, CloudRain, ShieldAlert, Bus, Users, Check, RefreshCw } from 'lucide-react';

const PRESETS = [
  { id: 'rain', name: 'Monsoon Downpour', desc: 'Sudden rainstorm forces 6,000 outdoor attendees into indoor halls.', intensity: 1.8, icon: CloudRain },
  { id: 'gate-fault', name: 'Gate 4 Scanner Outage', desc: 'Hardware fault halts 3 of 6 turnstiles during peak morning intake.', intensity: 2.2, icon: ShieldAlert },
  { id: 'metro-delay', name: 'Metro Line 30m Delay', desc: 'Delayed train creates a compressed 2,500 passenger wave at shuttle bay.', intensity: 1.5, icon: Bus },
];

export default function SimulationPage() {
  const [selectedPreset, setSelectedPreset] = useState('rain');
  const [multiplier, setMultiplier] = useState(1.8);
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);

  const handleRunSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSimulationResult({
        timestamp: new Date().toLocaleTimeString(),
        impacts: [
          { zone: 'Main Concourse Lobby', delta: '+42%', projectedOcc: 98, risk: 'critical' },
          { zone: 'Gate 4 North', delta: '+28%', projectedOcc: 94, risk: 'critical' },
          { zone: 'Pavilion 2 Garden Lounge', delta: '+12%', projectedOcc: 46, risk: 'safe' },
          { zone: 'South Metro Feeder', delta: '-15%', projectedOcc: 25, risk: 'safe' },
        ],
        actions: [
          'Dispatch 4 reserve electric shuttles to Supreme Court station immediately.',
          'Trigger push nudge to divert 40% of Concourse footfall to Pavilion 2 covered walkways.',
          'Enable emergency secondary turnstiles at West Concourse Gate 2.',
        ],
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl text-white tracking-tight">Scenario Simulation Engine</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Execute synthetic digital twin stress tests to predict bottlenecks and verify automated mitigation actions.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRESETS.map(({ id, name, desc, intensity, icon: Icon }) => (
          <div
            key={id}
            onClick={() => {
              setSelectedPreset(id);
              setMultiplier(intensity);
            }}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              selectedPreset === id
                ? 'bg-slate-800 border-primary-container ring-1 ring-primary-container shadow-lg'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary-container flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-white">{name}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            <div className="mt-3 text-[11px] font-mono text-slate-300">Surge Factor: {intensity}x</div>
          </div>
        ))}
      </div>

      {/* Control Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <h3 className="font-bold text-base text-white">Simulation Parameters</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Surge Multiplier Intensity</span>
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

        <Button
          onClick={handleRunSimulation}
          disabled={simulating}
          className="bg-primary-container text-white py-3"
        >
          {simulating ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running Discrete Event Simulation...
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
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-white">Projected Impact Analysis</h3>
              <p className="text-xs text-slate-400 mt-0.5">Computed at {simulationResult.timestamp}</p>
            </div>
            <Badge variant="coral">High Risk Detected</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {simulationResult.impacts.map((imp: any) => (
              <div key={imp.zone} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">{imp.zone}</span>
                <div className="text-2xl font-extrabold text-white mt-1">{imp.projectedOcc}%</div>
                <div className="flex justify-between text-[11px] mt-1">
                  <span className="text-primary-container font-bold">{imp.delta}</span>
                  <span className="uppercase text-slate-400 font-semibold">{imp.risk}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="font-bold text-xs text-secondary uppercase tracking-wider">
              Automated AI Algorithmic Mitigations
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              {simulationResult.actions.map((act: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 flex gap-3">
              <Button size="sm" className="bg-secondary text-white">
                Deploy All Mitigations Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
