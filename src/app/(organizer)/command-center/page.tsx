'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CommandCenterPage() {
  // Scenario state: 'normal' | 'surge' | 'balanced'
  const [scenario, setScenario] = useState<'normal' | 'surge' | 'balanced'>('surge');

  // Gate occupancy and wait times based on scenario
  const gateData = {
    normal: {
      g1: { occ: 42, wait: '3 min', color: 'bg-[#0F9B8E]' },
      g4: { occ: 64, wait: '8 min', color: 'bg-[#0F9B8E]' },
      g2: { occ: 31, wait: '2 min', color: 'bg-[#0F9B8E]' },
    },
    surge: {
      g1: { occ: 42, wait: '3 min', color: 'bg-[#0F9B8E]' },
      g4: { occ: 96, wait: '24 min', color: 'bg-[#FF6B57]' },
      g2: { occ: 31, wait: '2 min', color: 'bg-[#0F9B8E]' },
    },
    balanced: {
      g1: { occ: 42, wait: '3 min', color: 'bg-[#0F9B8E]' },
      g4: { occ: 52, wait: '4 min', color: 'bg-[#0F9B8E]' },
      g2: { occ: 64, wait: '3 min', color: 'bg-[#0F9B8E]' },
    },
  }[scenario];

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
            Command Center
          </span>
          <h1 className="text-xl font-black text-[#171717]">
            Bharat Mandapam
          </h1>
          <p className="text-xs text-stone-500">Live venue status</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-[#0F9B8E]">
          <span className="w-2 h-2 rounded-full bg-[#0F9B8E] animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {/* VENUE OVERVIEW (Simple 3-Gate Grid) */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
            VENUE OVERVIEW
          </span>
        </div>

        {/* Top: Gate 1 */}
        <div className="flex justify-center">
          <div className="w-36 p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-center space-y-1">
            <span className="text-xs font-bold text-stone-700 block">Gate 1</span>
            <div className="text-lg">🟢</div>
            <div className="text-sm font-black text-[#171717]">{gateData.g1.occ}%</div>
            <div className="text-[11px] text-stone-500">{gateData.g1.wait}</div>
          </div>
        </div>

        {/* Bottom Row: Gate 4 (Left) and Gate 2 (Right) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Gate 4 */}
          <div
            className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
              scenario === 'surge'
                ? 'bg-[#FF6B57]/10 border-[#FF6B57] ring-2 ring-[#FF6B57]/30'
                : 'bg-[#FAF7F2] border-stone-200'
            }`}
          >
            <span className="text-xs font-bold text-stone-700 block">Gate 4</span>
            <div className="text-lg">{scenario === 'surge' ? '🔴' : '🟢'}</div>
            <div
              className={`text-xl font-black ${
                scenario === 'surge' ? 'text-[#FF6B57]' : 'text-[#171717]'
              }`}
            >
              {gateData.g4.occ}%
            </div>
            <div className="text-xs font-semibold text-stone-600">{gateData.g4.wait} wait</div>
          </div>

          {/* Gate 2 */}
          <div
            className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${
              scenario === 'balanced'
                ? 'bg-[#0F9B8E]/10 border-[#0F9B8E]'
                : 'bg-[#FAF7F2] border-stone-200'
            }`}
          >
            <span className="text-xs font-bold text-stone-700 block">Gate 2</span>
            <div className="text-lg">🟢</div>
            <div className="text-xl font-black text-[#171717]">{gateData.g2.occ}%</div>
            <div className="text-xs font-semibold text-stone-600">{gateData.g2.wait} wait</div>
          </div>
        </div>

        {/* Live Status Message */}
        <div className="text-center pt-2">
          {scenario === 'surge' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B57]/15 text-[#FF6B57] text-xs font-bold">
              <span>⚠️ Gate 4 is overcrowded (96%)</span>
            </div>
          )}
          {scenario === 'balanced' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F9B8E]/15 text-[#0F9B8E] text-xs font-bold">
              <span>✅ Crowd balanced! Foot traffic redirected to Gate 2</span>
            </div>
          )}
          {scenario === 'normal' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-600 text-xs font-bold">
              <span>All gates operating within normal capacity</span>
            </div>
          )}
        </div>
      </div>

      {/* DEMO ACTION BUTTONS */}
      <div className="space-y-3">
        {scenario !== 'surge' && (
          <button
            type="button"
            onClick={() => setScenario('surge')}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-300 text-[#171717] font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>[ Simulate Crowd Surge ]</span>
          </button>
        )}

        {scenario === 'surge' && (
          <button
            type="button"
            onClick={() => setScenario('balanced')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#0F9B8E] hover:bg-[#0F9B8E]/90 text-white font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>[ Balance Crowd ]</span>
          </button>
        )}

        {scenario === 'balanced' && (
          <button
            type="button"
            onClick={() => setScenario('normal')}
            className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs transition-colors cursor-pointer"
          >
            Reset to Normal Flow
          </button>
        )}
      </div>

      {/* Link to Attendee Companion */}
      <div className="text-center pt-4">
        <Link
          href="/dashboard"
          className="text-xs font-bold text-[#0F9B8E] hover:underline"
        >
          View how attendees see this on their phones →
        </Link>
      </div>
    </div>
  );
}
