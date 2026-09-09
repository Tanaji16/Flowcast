'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OnboardingStep1Page() {
  const router = useRouter();
  const [priorities, setPriorities] = useState({
    keynote: true,
    technical: true,
    networking: false,
    food: false,
  });

  const toggle = (key: keyof typeof priorities) => {
    setPriorities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#171717] tracking-tight">
            What matters to you?
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Choose what Flowcast should prioritize.
          </p>
        </div>

        <div className="space-y-2.5">
          <label
            onClick={() => toggle('keynote')}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              priorities.keynote
                ? 'bg-white border-[#171717] shadow-xs'
                : 'bg-[#FAF7F2] border-stone-200 text-stone-600'
            }`}
          >
            <input
              type="checkbox"
              checked={priorities.keynote}
              onChange={() => {}}
              className="w-4 h-4 accent-[#171717]"
            />
            <span className="text-xs font-bold text-[#171717]">
              Keynote & important sessions
            </span>
          </label>

          <label
            onClick={() => toggle('technical')}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              priorities.technical
                ? 'bg-white border-[#171717] shadow-xs'
                : 'bg-[#FAF7F2] border-stone-200 text-stone-600'
            }`}
          >
            <input
              type="checkbox"
              checked={priorities.technical}
              onChange={() => {}}
              className="w-4 h-4 accent-[#171717]"
            />
            <span className="text-xs font-bold text-[#171717]">
              Technical sessions
            </span>
          </label>

          <label
            onClick={() => toggle('networking')}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              priorities.networking
                ? 'bg-white border-[#171717] shadow-xs'
                : 'bg-[#FAF7F2] border-stone-200 text-stone-600'
            }`}
          >
            <input
              type="checkbox"
              checked={priorities.networking}
              onChange={() => {}}
              className="w-4 h-4 accent-[#171717]"
            />
            <span className="text-xs font-bold text-[#171717]">
              Networking
            </span>
          </label>

          <label
            onClick={() => toggle('food')}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
              priorities.food
                ? 'bg-white border-[#171717] shadow-xs'
                : 'bg-[#FAF7F2] border-stone-200 text-stone-600'
            }`}
          >
            <input
              type="checkbox"
              checked={priorities.food}
              onChange={() => {}}
              className="w-4 h-4 accent-[#171717]"
            />
            <span className="text-xs font-bold text-[#171717]">
              Food & breaks
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={() => router.push('/onboarding/step-2')}
          className="w-full py-3 px-4 rounded-xl bg-[#171717] hover:bg-black text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
