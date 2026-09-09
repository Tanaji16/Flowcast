'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingStep2Page() {
  const router = useRouter();
  const [routePreference, setRoutePreference] = useState<'fast' | 'avoid_crowds' | 'step_free'>('avoid_crowds');
  const [alertCrowded, setAlertCrowded] = useState(true);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#171717] tracking-tight">
            How should Flowcast route you?
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Choose your navigation style.
          </p>
        </div>

        <div className="space-y-2.5">
          <label
            onClick={() => setRoutePreference('fast')}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              routePreference === 'fast'
                ? 'bg-white border-[#171717] shadow-xs'
                : 'bg-[#FAF7F2] border-stone-200 text-stone-600'
            }`}
          >
            <input
              type="radio"
              name="route"
              checked={routePreference === 'fast'}
              onChange={() => {}}
              className="w-4 h-4 accent-[#171717]"
            />
            <span className="text-xs font-bold text-[#171717]">Fastest route</span>
          </label>

          <label
            onClick={() => setRoutePreference('avoid_crowds')}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              routePreference === 'avoid_crowds'
                ? 'bg-white border-[#171717] shadow-xs'
                : 'bg-[#FAF7F2] border-stone-200 text-stone-600'
            }`}
          >
            <input
              type="radio"
              name="route"
              checked={routePreference === 'avoid_crowds'}
              onChange={() => {}}
              className="w-4 h-4 accent-[#171717]"
            />
            <span className="text-xs font-bold text-[#171717]">Avoid crowded areas</span>
          </label>

          <label
            onClick={() => setRoutePreference('step_free')}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              routePreference === 'step_free'
                ? 'bg-white border-[#171717] shadow-xs'
                : 'bg-[#FAF7F2] border-stone-200 text-stone-600'
            }`}
          >
            <input
              type="radio"
              name="route"
              checked={routePreference === 'step_free'}
              onChange={() => {}}
              className="w-4 h-4 accent-[#171717]"
            />
            <span className="text-xs font-bold text-[#171717]">Step-free routes</span>
          </label>
        </div>

        {/* Checkbox */}
        <label
          onClick={() => setAlertCrowded(!alertCrowded)}
          className="flex items-center gap-3 p-3 rounded-xl bg-stone-100/80 cursor-pointer text-xs font-semibold text-stone-700"
        >
          <input
            type="checkbox"
            checked={alertCrowded}
            onChange={() => {}}
            className="w-4 h-4 accent-[#171717]"
          />
          <span>Alert me when an area gets crowded</span>
        </label>

        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="w-full py-3 px-4 rounded-xl bg-[#171717] hover:bg-black text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          Start Flowcast →
        </button>
      </div>
    </div>
  );
}
