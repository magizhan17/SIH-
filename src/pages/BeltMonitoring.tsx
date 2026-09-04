import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine,
} from 'recharts';
import { Activity, Thermometer, Gauge, Wind, Package, MoveHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tensionTrend, vibrationTrend, temperatureTrend, speedTrend } from '../data/sensors';
import { StatusBadge } from '../components/ui/SharedComponents';
import { getStatusBgClass } from '../utils/riskCalculation';
import { SensorPanel } from '../components/ui/SensorPanel';
type TimeFilter = '1h' | '6h' | '24h' | '7d';

const filterLabels: Record<TimeFilter, string> = {
  '1h': 'Last 1 Hour',
  '6h': 'Last 6 Hours',
  '24h': 'Last 24 Hours',
  '7d': 'Last 7 Days',
};

const sensorIcons: Record<string, React.ElementType> = {
  vibration: Activity,
  temperature: Thermometer,
  beltSpeed: Gauge,
  beltTension: Wind,
  load: Package,
  misalignment: MoveHorizontal,
};

export default function BeltMonitoring() {
  const { sensors } = useApp();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('1h');

  const charts = [
    { title: 'Belt Tension', data: tensionTrend, unit: 'kN', color: '#3B82F6', warning: 90, critical: 110 },
    { title: 'Vibration', data: vibrationTrend, unit: 'mm/s', color: '#F59E0B', warning: 5, critical: 8 },
    { title: 'Temperature', data: temperatureTrend, unit: '°C', color: '#EF4444', warning: 70, critical: 90 },
    { title: 'Belt Speed', data: speedTrend, unit: 'm/s', color: '#10B981', warning: 5.5, critical: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title text-xl">Belt Monitoring</h2>
        <p className="section-subtitle mt-1">Monitor real-time conveyor operating parameters.</p>
        <div className="sim-badge mt-2">SIMULATION / DEMO DATA</div>
      </div>

      {/* Sensor status cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(sensors).map(([key, s]) => {
          const Icon = sensorIcons[key] || Activity;
          return <SensorPanel key={key} sensor={s} icon={Icon} />;
        })}
      </div>

      {/* Time filter */}
      <div className="flex gap-2">
        {(Object.keys(filterLabels) as TimeFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              timeFilter === f
                ? 'bg-blue-600 text-white'
                : 'btn-secondary'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {charts.map((c) => (
          <div key={c.title} className="card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-title text-base">{c.title}</p>
                <p className="section-subtitle text-xs">{c.unit} · {filterLabels[timeFilter]}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={c.data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                  formatter={(v: number | string) => [`${v} ${c.unit}`, c.title]}
                />
                <ReferenceLine y={c.warning} stroke="#D97706" strokeDasharray="4 2" label={{ value: 'Warn', position: 'right', fontSize: 9, fill: '#D97706' }} />
                <ReferenceLine y={c.critical} stroke="#DC2626" strokeDasharray="4 2" label={{ value: 'Crit', position: 'right', fontSize: 9, fill: '#DC2626' }} />
                <Line type="monotone" dataKey="value" stroke={c.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">
              Thresholds shown are configurable engineering/site parameters.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
