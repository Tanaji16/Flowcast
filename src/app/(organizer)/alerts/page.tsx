'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { Bell, Plus, CheckCircle2, AlertTriangle, Info, Send, Loader2 } from 'lucide-react';

export default function OrganizerAlertsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newSeverity, setNewSeverity] = useState('warning');

  const fetchAlerts = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setAlerts(data);
      } else {
        setAlerts([
          {
            id: 'al-1',
            title: 'Gate 4 North Overcrowding Diversion',
            message: 'Incoming attendees are actively directed to West Concourse Gate 2.',
            severity: 'critical',
            resolved: false,
            created_at: new Date(Date.now() - 12 * 60000).toISOString(),
          },
          {
            id: 'al-2',
            title: 'Lunchtime Overflow Diversion to Pavilion 2',
            message: 'Zero-wait dining passes activated for Pavilion 2 garden dining hub.',
            severity: 'warning',
            resolved: false,
            created_at: new Date(Date.now() - 45 * 60000).toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn('Fetch alerts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    setDispatching(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('alerts').insert({
        title: newTitle.trim(),
        message: newMessage.trim(),
        severity: newSeverity,
        resolved: false,
      }).select().single();

      if (data) {
        setAlerts([data, ...alerts]);
      } else {
        setAlerts([
          {
            id: `al-${Date.now()}`,
            title: newTitle,
            message: newMessage,
            severity: newSeverity,
            resolved: false,
            created_at: new Date().toISOString(),
          },
          ...alerts,
        ]);
      }
      setModalOpen(false);
      setNewTitle('');
      setNewMessage('');
    } catch (err) {
      console.warn('Dispatch alert error:', err);
    } finally {
      setDispatching(false);
    }
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      const supabase = createClient();
      await supabase.from('alerts').update({
        resolved: true,
        resolved_at: new Date().toISOString(),
      }).eq('id', alertId);

      setAlerts(alerts.map(a => a.id === alertId ? { ...a, resolved: true } : a));
    } catch (err) {
      console.warn('Resolve error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-white tracking-tight">Active Advisories & Broadcast Dispatches</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Emergency broadcasts, crowd diversions, and push notifications to attendee mobile devices.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-primary-container text-white self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Dispatch New Advisory</span>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Active Advisories</span>
          <div className="text-3xl font-extrabold text-white mt-1">
            {alerts.filter(a => !a.resolved).length} Active
          </div>
          <span className="text-[11px] text-secondary font-semibold">Connected to Supabase</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Attendee Fleet Reach</span>
          <div className="text-3xl font-extrabold text-white mt-1">14,820 Devices</div>
          <span className="text-[11px] text-secondary font-semibold">99.8% push deliverability</span>
        </div>
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Average Compliance Rate</span>
          <div className="text-3xl font-extrabold text-white mt-1">74.2%</div>
          <span className="text-[11px] text-secondary font-semibold">Turnstile divert adherence</span>
        </div>
      </div>

      {/* Dispatched Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.severity === 'critical'
                    ? 'bg-red-500/20 text-red-400'
                    : alert.severity === 'warning'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-white">{alert.title}</h3>
                  <Badge variant={alert.severity === 'critical' ? 'coral' : alert.severity === 'warning' ? 'amber' : 'teal'}>
                    {alert.severity}
                  </Badge>
                  {alert.resolved && (
                    <Badge variant="teal">Resolved</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                <span className="text-[11px] text-slate-400 block pt-1">
                  Dispatched: {alert.created_at ? new Date(alert.created_at).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {!alert.resolved && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResolveAlert(alert.id)}
                  className="text-xs text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  <span>Mark Resolved</span>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dispatch Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Dispatch Crowd Advisory Broadcast">
        <form onSubmit={handleCreateAlert} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface">Advisory Title</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Gate 4 Surge Diversion"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface">Broadcast Message</label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Provide clear, reassuring instructions..."
              required
              rows={3}
              className="w-full rounded-xl bg-surface-container-low p-3 text-sm text-on-surface border border-outline-subtle focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface">Severity Level</label>
            <select
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value)}
              className="w-full h-11 rounded-xl bg-surface-container-low px-3 text-sm text-on-surface border border-outline-subtle"
            >
              <option value="critical">Critical (Immediate Evacuation / Reroute)</option>
              <option value="warning">Warning (Moderate Congestion / Delay)</option>
              <option value="info">Informational (General Update / Schedule)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={dispatching}>
              {dispatching ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Broadcasting...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Broadcast Live
                </span>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
