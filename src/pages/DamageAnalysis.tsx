import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Info, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateDamageScore } from '../utils/riskCalculation';
import { StatusBadge, ProgressBar } from '../components/ui/SharedComponents';

const FACTOR_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#3B82F6', '#6B7280'];

export default function DamageAnalysis() {
  const { maxCrackDepth, damages, sensors } = useApp();
  const [selectedDamage, setSelectedDamage] = useState<string | null>(null);

  const damageScore = calculateDamageScore({
    crackDepth: maxCrackDepth,
    crackLength: 86,
    wear: 51,
    misalignment: sensors.misalignment.value,
    temperature: sensors.temperature.value,
  });

  const selectedDmg = selectedDamage ? damages.find((d) => d.id === selectedDamage) : null;

  const totalLength = 2800;
  const markers = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title text-xl">Damage Analysis</h2>
        <p className="section-subtitle mt-1">Analyze detected conveyor belt damage and calculate severity.</p>
        <div className="sim-badge mt-2">SIMULATION / DEMO DATA</div>
      </div>

      {/* Score + Factors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overall damage score */}
        <div className="card p-5 space-y-4">
          <p className="section-title">Damage Score</p>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center border-4"
                style={{
                  borderColor: damageScore.overall >= 80 ? '#DC2626' : damageScore.overall >= 60 ? '#EA580C' : damageScore.overall >= 40 ? '#D97706' : '#16A34A',
                }}>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#111827] dark:text-white">{damageScore.overall}</p>
                  <p className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">/ 100</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-[#111827] dark:text-white">
                {damageScore.overall >= 80 ? 'CRITICAL' : damageScore.overall >= 60 ? 'HIGH' : damageScore.overall >= 40 ? 'MODERATE' : 'LOW'}
              </p>
              <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">
                {damageScore.overall >= 60
                  ? 'Immediate attention required. Schedule maintenance.'
                  : 'Monitor closely and plan maintenance.'}
              </p>
            </div>
          </div>

          {/* Damage factors */}
          <div className="space-y-2.5 border-t border-[#E5E7EB] dark:border-[#292929] pt-3">
            {damageScore.factors.map((f, i) => (
              <div key={f.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#111827] dark:text-white font-medium">{f.name}</span>
                  <span className="text-[#6B7280] dark:text-[#A1A1AA]">{f.score} / 100</span>
                </div>
                <ProgressBar value={f.score} color={FACTOR_COLORS[i]} height="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Damage factor bar chart */}
        <div className="lg:col-span-2 card p-5 space-y-3">
          <p className="section-title">Damage Factor Comparison</p>
          <p className="section-subtitle text-xs">Relative severity of each damage factor (0–100 scale)</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={damageScore.factors} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
                formatter={(v: number | string) => [v, 'Score']}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {damageScore.factors.map((_, i) => (
                  <Cell key={i} fill={FACTOR_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Damage Location Map */}
      <div className="card p-5 space-y-4">
        <p className="section-title">Damage Location Map — CV-04</p>
        <p className="section-subtitle text-xs">Click a marker to view damage details</p>

        {/* Scale bar */}
        <div className="flex justify-between text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">
          {markers.map((pct) => (
            <span key={pct}>{Math.round(pct * totalLength)}m</span>
          ))}
        </div>

        {/* Belt track */}
        <div className="relative h-8">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-4 bg-gray-700 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="belt-animated w-full h-full" />
          </div>

          {damages
            .filter((d) => d.conveyorId === 'CV-04')
            .map((d) => {
              const pct = (d.position / totalLength) * 100;
              const colorMap: Record<string, string> = {
                low: '#16A34A', moderate: '#D97706', high: '#EA580C', critical: '#DC2626',
              };
              const color = colorMap[d.severity] || '#6B7280';
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDamage(selectedDamage === d.id ? null : d.id)}
                  className="absolute -translate-x-1/2 flex flex-col items-center group"
                  style={{ left: `${pct}%`, top: '-4px' }}
                  aria-label={`${d.id} at ${d.position}m`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white dark:border-[#161616] transition-all ${selectedDamage === d.id ? 'scale-150' : 'group-hover:scale-125'}`}
                    style={{ backgroundColor: color }}
                  />
                </button>
              );
            })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 flex-wrap">
          {[['critical', '#DC2626'], ['high', '#EA580C'], ['moderate', '#D97706'], ['low', '#16A34A']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA] capitalize">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Damage list */}
      <div className="card p-5 space-y-3">
        <p className="section-title">Active Damage Events</p>
        <div className="space-y-2">
          {damages
            .filter((d) => d.conveyorId === 'CV-04')
            .map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDamage(selectedDamage === d.id ? null : d.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedDamage === d.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                    : 'border-[#E5E7EB] dark:border-[#292929] hover:bg-[#F7F8FA] dark:hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#A1A1AA]" />
                    <span className="text-sm font-semibold text-[#111827] dark:text-white">{d.id}</span>
                  </div>
                  <StatusBadge status={d.severity} />
                </div>
                <div className="flex items-center gap-3 text-xs text-[#6B7280] dark:text-[#A1A1AA]">
                  <span>Position: {d.position} m</span>
                  <span>Type: <span className="capitalize">{d.type.replace('-', ' ')}</span></span>
                  {d.depth && <span>Depth: {d.depth} mm</span>}
                  <span>Detected: {d.detectedDate}</span>
                </div>
                {selectedDamage === d.id && (
                  <div className="mt-2 pt-2 border-t border-[#E5E7EB] dark:border-[#292929]">
                    <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">
                      <strong className="text-[#111827] dark:text-white">Recommended Action: </strong>
                      {d.recommendedAction}
                    </p>
                  </div>
                )}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
