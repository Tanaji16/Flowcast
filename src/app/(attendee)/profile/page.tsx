'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { User, ShieldCheck, Clock, Settings, FileText, HelpCircle, LogOut, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('Flowcast Attendee');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [crowdNudges, setCrowdNudges] = useState(true);
  const [dietaryAlerts, setDietaryAlerts] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setUserId(user.id);
          setEmail(user.email || '');
          const metaName = user.user_metadata?.full_name;
          if (metaName) setName(metaName);

          const { data: profile } = await (supabase
            .from('users') as any)
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (profile && (profile as any).full_name) {
            setName((profile as any).full_name);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
      router.push('/login');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      if (userId) {
        const supabase = createClient();
        await (supabase.from('users') as any).upsert({
          id: userId,
          email,
          full_name: name,
          updated_at: new Date().toISOString(),
        });
        await supabase.auth.updateUser({
          data: { full_name: name },
        });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-primary-container text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-primary-container/25">
            {name ? name[0].toUpperCase() : 'A'}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="font-bold text-xl text-on-surface">{name}</h1>
              <Badge variant="teal">Verified Attendee</Badge>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">{email || 'Loading account...'}</p>
            <p className="text-xs text-secondary font-semibold mt-1">
              Pass #{userId ? userId.substring(0, 8).toUpperCase() : 'FC-94821'}
            </p>
          </div>
          <Link href="/trip-summary">
            <Button variant="secondary" size="sm">
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>Trip Summary</span>
            </Button>
          </Link>
        </div>
      </Card>

      <Card className="p-6 space-y-5">
        <h3 className="font-bold text-base text-on-surface">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">Full Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-on-surface">Email Address</label>
            <Input value={email} disabled readOnly className="opacity-75 cursor-not-allowed" />
          </div>
        </div>

        <h3 className="font-bold text-base text-on-surface pt-3 border-t border-surface-container-high">
          Flowcast Nudge Settings
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer">
            <div>
              <span className="text-xs font-bold text-on-surface">Autonomous Congestion Rerouting</span>
              <p className="text-[11px] text-on-surface-variant">Push alerts when scheduled sessions exceed 80% occupancy</p>
            </div>
            <input
              type="checkbox"
              checked={crowdNudges}
              onChange={(e) => setCrowdNudges(e.target.checked)}
              className="w-5 h-5 accent-primary-container cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low cursor-pointer">
            <div>
              <span className="text-xs font-bold text-on-surface">Dietary & Dining Off-Peak Advice</span>
              <p className="text-[11px] text-on-surface-variant">Suggest low-wait food hubs during peak meal breaks</p>
            </div>
            <input
              type="checkbox"
              checked={dietaryAlerts}
              onChange={(e) => setDietaryAlerts(e.target.checked)}
              className="w-5 h-5 accent-secondary cursor-pointer"
            />
          </label>
        </div>

        {saveSuccess && (
          <p className="text-xs text-primary-container font-semibold">Preferences saved successfully.</p>
        )}

        <div className="pt-2 flex justify-between items-center">
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleSignOut}
            className="cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 mr-1" />
            <span>Log Out</span>
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Preferences'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
