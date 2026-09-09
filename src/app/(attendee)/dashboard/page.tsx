'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Clock, MapPin, Check, QrCode, ArrowRight, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [userName, setUserName] = useState('Tanaji');
  const [hasRerouted, setHasRerouted] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const metaName = user.user_metadata?.full_name;
          if (metaName) setUserName(metaName.split(' ')[0]);
        }
      } catch (err) {
        console.warn('User load note:', err);
      }
    }
    loadUser();
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* 1. WHERE AM I? */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#171717] tracking-tight">
          Hi, {userName} 👋
        </h1>
        <p className="text-xs font-semibold text-stone-500 flex items-center gap-1 mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-[#0F9B8E]" />
          Bharat Mandapam · New Delhi
        </p>
      </div>

      {/* 2. WHERE DO I NEED TO GO? (Next Session Card) */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider">
          <span>Next Session</span>
          <span className="text-[#0F9B8E] flex items-center gap-1 font-semibold normal-case">
            <span className="w-2 h-2 rounded-full bg-[#0F9B8E] animate-pulse" />
            Starts in 25 min
          </span>
        </div>

        <div className="pt-1">
          <span className="text-xl font-black text-[#171717]">10:30 AM</span>
          <h2 className="text-lg font-bold text-[#171717] mt-0.5">
            Opening Keynote & Event Welcome
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Hall A · 8 min walk from current location
          </p>
        </div>
      </div>

      {/* 3. IS THERE A BETTER ROUTE? (THE HERO AI INTERVENTION) */}
      {!hasRerouted ? (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#FF6B57]/30 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B57]/15 text-[#FF6B57] flex items-center justify-center font-bold text-lg shrink-0">
              ⚠️
            </div>
            <div>
              <h3 className="font-bold text-base text-[#171717]">
                Gate 4 is crowded
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Turnstiles backed up. You may wait <strong className="text-[#FF6B57]">24 min</strong>.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-stone-200/60 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#171717] block">Gate 2 takes only 2 min</span>
              <span className="text-stone-500 text-[11px]">Walk 300m west · Zero turnstile queue</span>
            </div>
            <span className="font-bold text-[#0F9B8E] bg-[#0F9B8E]/10 px-2.5 py-1 rounded-full text-xs">
              Save 20 min →
            </span>
          </div>

          <button
            type="button"
            onClick={() => setHasRerouted(true)}
            className="w-full py-3 px-4 rounded-xl bg-[#171717] hover:bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Take faster route (Gate 2)</span>
            <ArrowRight className="w-4 h-4 text-[#0F9B8E]" />
          </button>
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0F9B8E]/10 border-2 border-[#0F9B8E]/40 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F9B8E] text-white flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#171717]">
                Using faster route (Gate 2)
              </h3>
              <p className="text-xs text-[#0F9B8E] font-semibold mt-0.5">
                2 min wait · 20 minutes saved!
              </p>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Your entry pass is upgraded to West Concourse Gate 2. Head directly to Express Lane 1.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowPass(true)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F9B8E] text-white font-bold text-xs hover:bg-[#0F9B8E]/90 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>View entry pass</span>
            </button>
            <button
              type="button"
              onClick={() => setHasRerouted(false)}
              title="Reset simulation"
              className="py-2.5 px-3 rounded-xl bg-white border border-stone-200 text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* TODAY'S SCHEDULE */}
      <div className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <h3 className="font-bold text-sm text-[#171717]">Today&apos;s Schedule</h3>
          <Link href="/itinerary" className="text-xs font-semibold text-[#0F9B8E] hover:underline">
            All sessions →
          </Link>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2]">
            <div className="flex items-center gap-3">
              <span className="font-black text-[#171717]">10:30</span>
              <span className="font-bold text-[#171717]">Opening Keynote</span>
            </div>
            <span className="text-stone-500 font-medium">Hall A</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2]">
            <div className="flex items-center gap-3">
              <span className="font-black text-[#171717]">12:00</span>
              <span className="font-bold text-[#171717]">Technical Workshop</span>
            </div>
            <span className="text-stone-500 font-medium">Hall B</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F2]">
            <div className="flex items-center gap-3">
              <span className="font-black text-[#171717]">01:30</span>
              <span className="font-bold text-[#171717]">Lunch & Networking</span>
            </div>
            <span className="text-stone-500 font-medium">Dining Hall</span>
          </div>
        </div>
      </div>

      {/* Digital Pass Modal */}
      {showPass && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 border border-stone-200">
            <div className="w-12 h-12 rounded-full bg-[#0F9B8E]/10 text-[#0F9B8E] flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-[#0F9B8E] uppercase tracking-wider block">
                Expedited Entry Pass
              </span>
              <h4 className="font-bold text-base text-[#171717] mt-0.5">
                West Concourse Gate 2
              </h4>
              <p className="text-xs text-stone-500">Scan at turnstile for 2 min entrance</p>
            </div>

            <div className="p-4 bg-[#FAF7F2] rounded-2xl inline-block border border-stone-200">
              <QrCode className="w-36 h-36 text-[#171717] mx-auto" />
              <span className="text-xs font-mono font-bold text-stone-600 block mt-2">
                #FC-GATE2-FAST
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowPass(false)}
              className="w-full py-2.5 rounded-xl bg-[#171717] text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
