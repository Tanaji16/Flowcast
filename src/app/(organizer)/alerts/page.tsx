'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Bell, Plus, CheckCircle2, AlertTriangle, Info, Send } from 'lucide-react';

export default function OrganizerAlertsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [alerts, setAlerts] = useState([
    {
      id: 'al-1',
      title: 'Gate 4 North Overcrowding Diversion',
      message: 'Incoming attendees are actively directed to West Concourse Gate 2.',
      severity: 'critical',
      target: 'North Entrance Attendees',
      delivered: '4,280 delivered',
      time: '12m ago',
    },
    {
      id: 'al-2',
      title: 'Lunchtime Overflow Diversion to Pavilion 2',
      message: 'Zero-wait dining passes activated for Pavilion 2 garden dining hub.',
      severity: 'warning',
      target: 'Plenary Hall Attendees',
      delivered: '8,400 delivered',
      time: '45m ago',
    },
    {
      id: 'al-3',
      title: 'Metro Feeder Frequency Increased',
      message: '4 additional electric shuttles deployed for evening peak return.',
      severity: 'info',
      target: 'All Attendees',
      delivered: '14,820 delivered',
      time: '1h 10m ago',
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newSeverity, setNewSeverity] = useState('warning');

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `al-${Date.now()}`,
      title: newTitle,
      message: newMessage,
      severity: newSeverity,
      target: 'All Event Attendees',
      delivered: '14,820 delivered (just now)',
      time: 'Just now',
    };
    setAlerts([created, ...alerts]);
    setModalOpen(false);
    setNewTitle('');
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-2xl text-white tracking-tight">Broadcast Alerts Hub</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dispatch high-priority push notifications and rerouting nudges across mobile and digital signage.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="bg-primary-container text-white self-start sm:self-auto">
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Broadcast</span>
        </Button>
      </div>

      {/* Dispatched Alerts History */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  alert.severity === 'critical'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : alert.severity === 'warning'
                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {alert.severity === 'critical' ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Info className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">{alert.title}</h3>
                  <Badge variant={alert.severity === 'critical' ? 'coral' : alert.severity === 'warning' ? 'amber' : 'teal'}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 mt-1">{alert.message}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                  <span>Target: {alert.target}</span>
                  <span>•</span>
                  <span className="text-secondary font-semibold">✓ {alert.delivered}</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500 self-end sm:self-center">{alert.time}</span>
          </div>
        ))}
      </div>

      {/* Create Alert Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Dispatch New Broadcast Alert"
        description="Pushes urgent crowd instructions to attendee devices"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300">Alert Title</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Hall 3 Exit Flow Diversion"
              className="mt-1 bg-slate-800 border-slate-700 text-white"
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Message Content</label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Provide immediate instructions for attendees to avoid bottlenecks..."
              className="mt-1 w-full rounded-xl bg-slate-800 border border-slate-700 p-3 text-xs text-white"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300">Severity Tier</label>
            <div className="grid grid-cols-3 gap-2 mt-1 text-xs">
              {(['info', 'warning', 'critical'] as const).map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setNewSeverity(sev)}
                  className={`py-2 rounded-xl border capitalize font-semibold cursor-pointer ${
                    newSeverity === sev
                      ? 'bg-primary-container text-white border-primary-container'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Broadcast Now</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
