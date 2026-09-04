import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, Bell, BellOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AlertSeverity } from '../types';
import { useNavigate } from 'react-router-dom';

type Filter = 'all' | AlertSeverity;

const severityConfig = {
  critical: {
    icon: AlertTriangle,
    label: 'Critical',
    bg: 'bg-red-50 dark:bg-red-900/10',
    border: 'border-l-red-600',
    titleColor: 'text-red-700 dark:text-red-400',
    badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  high: {
    icon: AlertCircle,
    label: 'High',
    bg: 'bg-orange-50 dark:bg-orange-900/10',
    border: 'border-l-orange-500',
    titleColor: 'text-orange-700 dark:text-orange-400',
    badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  warning: {
    icon: AlertCircle,
    label: 'Warning',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    border: 'border-l-amber-500',
    titleColor: 'text-amber-700 dark:text-amber-400',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    icon: Info,
    label: 'Info',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-l-blue-500',
    titleColor: 'text-blue-700 dark:text-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
};

export default function Alerts() {
  const { alerts, acknowledgeAlert, notifyMaintenance, notifyControlRoom, emergencyActionsDone, isDamageSimulated } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);
  const unacked = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title text-xl">Alerts & Emergency Center</h2>
        <p className="section-subtitle mt-1">Monitor and respond to system alerts and critical events.</p>
        {unacked > 0 && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
            {unacked} unacknowledged alert{unacked !== 1 ? 's' : ''} require attention
          </div>
        )}
      </div>

      {/* Emergency card — shown when damage is simulated */}
      {isDamageSimulated && (
        <div className="card border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-bold text-red-800 dark:text-red-300">⚠ CRITICAL BELT DAMAGE DETECTED</p>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                Conveyor: CV-04 · Location: 1240 m · Damage: Joint Crack · Crack Depth: 4.8 mm · Risk Score: 91/100
              </p>
              <p className="text-sm font-semibold text-red-800 dark:text-red-300 mt-2">
                Recommended Action: STOP CONVEYOR AND INSPECT IMMEDIATELY
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="text-xs px-3 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold transition-colors">
              STOP CONVEYOR
            </button>
            <button
              onClick={notifyMaintenance}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                emergencyActionsDone.maintenance
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-white dark:bg-[#1a1a1a] border border-red-400 text-red-700 dark:text-red-400 hover:bg-red-50'
              }`}
            >
              {emergencyActionsDone.maintenance ? <CheckCircle className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              {emergencyActionsDone.maintenance ? '✓ Maintenance Notified' : 'NOTIFY MAINTENANCE'}
            </button>
            <button
              onClick={notifyControlRoom}
              className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                emergencyActionsDone.controlRoom
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-white dark:bg-[#1a1a1a] border border-red-400 text-red-700 dark:text-red-400 hover:bg-red-50'
              }`}
            >
              {emergencyActionsDone.controlRoom ? <CheckCircle className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
              {emergencyActionsDone.controlRoom ? '✓ Control Room Alerted' : 'ALERT CONTROL ROOM'}
            </button>
            <button
              onClick={() => navigate('/predictive-maintenance')}
              className="text-xs px-3 py-2 rounded-lg bg-white dark:bg-[#1a1a1a] border border-red-400 text-red-700 dark:text-red-400 hover:bg-red-50 font-medium transition-colors"
            >
              EMERGENCY PROTOCOL
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap">
        {(['all', 'critical', 'high', 'warning', 'info'] as Filter[]).map((f) => {
          const count = f === 'all' ? alerts.length : alerts.filter((a) => a.severity === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize flex items-center gap-1.5 ${
                filter === f ? 'bg-blue-600 text-white' : 'btn-secondary'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${filter === f ? 'bg-white/20' : 'bg-[#E5E7EB] dark:bg-[#292929]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Alert timeline */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <BellOff className="w-10 h-10 text-[#E5E7EB] dark:text-[#292929] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#111827] dark:text-white">No alerts found</p>
            <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">No {filter === 'all' ? '' : filter} alerts at this time.</p>
          </div>
        ) : (
          filtered.map((alert) => {
            const cfg = severityConfig[alert.severity];
            const Icon = cfg.icon;
            return (
              <div
                key={alert.id}
                className={`card border-l-4 ${cfg.border} ${cfg.bg} ${alert.acknowledged ? 'opacity-60' : ''} p-4`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${cfg.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge} uppercase`}>
                        {cfg.label}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">
                        <Clock className="w-3 h-3" />
                        {alert.timestamp}
                      </span>
                      <span className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">·</span>
                      <span className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">{alert.conveyorId}</span>
                      <span className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">·</span>
                      <span className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA]">{alert.category}</span>
                    </div>
                    <p className={`text-sm font-semibold ${cfg.titleColor}`}>{alert.title}</p>
                    <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-1 leading-relaxed">{alert.message}</p>
                  </div>
                  {!alert.acknowledged && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="flex-shrink-0 text-xs px-2.5 py-1 rounded-lg btn-secondary"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.acknowledged && (
                    <div className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Acknowledged
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
