import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  AlertTriangle, ChevronRight, Zap, RotateCcw, Activity, Thermometer,
  Gauge, Wind, Package, MoveHorizontal, MapPin, Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getRiskLevel, getRiskLevelLabel, getRiskColor, getRiskBgClass, getStatusBgClass } from '../utils/riskCalculation';
import { RiskScoreCircle, ProgressBar, StatusBadge, KPICard } from '../components/ui/SharedComponents';
import { SensorPanel } from '../components/ui/SensorPanel';
// Belt health history
const beltHealthTrend = [
  { time: '08:00', health: 91 },
  { time: '10:00', health: 87 },
  { time: '12:00', health: 84 },
  { time: '14:00', health: 79 },
  { time: '16:00', health: 74 },
  { time: '18:00', health: 72 },
];

const riskFactors = [
  { name: 'Crack Depth', pct: 32, score: 82 },
  { name: 'Belt Tension', pct: 18, score: 64 },
  { name: 'Vibration', pct: 14, score: 51 },
  { name: 'Wear', pct: 12, score: 48 },
  { name: 'Misalignment', pct: 10, score: 38 },
  { name: 'Temperature', pct: 8, score: 24 },
];

const sensorIcons: Record<string, React.ElementType> = {
  vibration: Activity,
  temperature: Thermometer,
  beltSpeed: Gauge,
  beltTension: Wind,
  load: Package,
  misalignment: MoveHorizontal,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { riskScore, beltHealth, maxCrackDepth, estimatedRemainingDays, sensors, damages, isDamageSimulated, simulateDamage, resetSimulation } = useApp();
  const [selectedDamage, setSelectedDamage] = useState<string | null>(null);

  const riskLevel = getRiskLevel(riskScore);

  const activeDamages = damages.filter((d) => d.conveyorId === 'CV-04' && d.status === 'active');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="section-title text-xl">Conveyor Health Overview</h2>
            <span className="sim-badge text-[10px]">SIMULATION / DEMO DATA</span>
          </div>
          <p className="section-subtitle">Real-time monitoring and predictive analysis of conveyor belt systems.</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-sm font-medium text-[#111827] dark:text-white">CV-04</span>
            <span className="text-[#E5E7EB] dark:text-[#292929]">|</span>
            <span className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">Iron Ore Processing Unit</span>
            <span className="text-[#E5E7EB] dark:text-[#292929]">|</span>
            <StatusBadge status="operational" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDamageSimulated ? (
            <button onClick={resetSimulation} className="btn-secondary flex items-center gap-2 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Simulation
            </button>
          ) : (
            <button
              onClick={simulateDamage}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              Simulate Damage Increase
            </button>
          )}
        </div>
      </div>

      {/* Critical damage banner */}
      {isDamageSimulated && (
        <div className="card border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-300">⚠ CRITICAL BELT DAMAGE DETECTED</p>
              <p className="text-xs text-red-700 dark:text-red-400">CV-04 · Location: 1240 m · Crack Depth: {maxCrackDepth} mm · Risk: {riskScore}/100</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="text-xs px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
              STOP CONVEYOR
            </button>
            <button className="btn-secondary text-xs">View Alerts</button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Risk Score */}
        <div className="card p-5 flex flex-col items-center gap-3 card-hover">
          <p className="kpi-label self-start">Overall Risk Score</p>
          <RiskScoreCircle score={riskScore} level={riskLevel} size="md" />
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getRiskBgClass(riskLevel)}`}>
            {getRiskLevelLabel(riskLevel).toUpperCase()}
          </span>
        </div>

        {/* Belt Health */}
        <KPICard
          title="Belt Health"
          value={`${beltHealth}%`}
          status={beltHealth >= 70 ? 'normal' : beltHealth >= 50 ? 'warning' : 'critical'}
          description={beltHealth >= 70 ? 'Acceptable Condition' : beltHealth >= 50 ? 'Needs Monitoring' : 'Poor Condition'}
        >
          <ProgressBar
            value={beltHealth}
            color={beltHealth >= 70 ? '#16A34A' : beltHealth >= 50 ? '#D97706' : '#DC2626'}
            height="h-2.5"
          />
        </KPICard>

        {/* Max Crack Depth */}
        <KPICard
          title="Max Crack Depth"
          value={maxCrackDepth}
          unit="mm"
          status={maxCrackDepth < 2 ? 'normal' : maxCrackDepth < 4 ? 'warning' : 'critical'}
          description={maxCrackDepth < 2 ? 'Within limits' : maxCrackDepth < 4 ? 'Warning — inspect soon' : 'Critical — immediate action'}
        />

        {/* Estimated Remaining */}
        <KPICard
          title="Est. Remaining Operation"
          value={estimatedRemainingDays}
          unit="Days"
          status={estimatedRemainingDays > 14 ? 'normal' : estimatedRemainingDays > 7 ? 'warning' : 'critical'}
          description="Model Estimate — Engineering validation required"
        />
      </div>

      {/* Risk Score + Health Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Risk breakdown */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-title">Risk Score</p>
              <p className="section-subtitle text-xs mt-0.5">Weighted factor analysis</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold" style={{ color: getRiskColor(riskLevel) }}>{riskScore}</p>
              <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">/ 100</p>
            </div>
          </div>

          <div className="space-y-3">
            {riskFactors.map((f) => (
              <div key={f.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#111827] dark:text-white font-medium">{f.name}</span>
                  <span className="text-[#6B7280] dark:text-[#A1A1AA]">{f.pct}% weight</span>
                </div>
                <ProgressBar
                  value={f.score}
                  color={f.score >= 70 ? '#DC2626' : f.score >= 50 ? '#EA580C' : f.score >= 30 ? '#D97706' : '#16A34A'}
                  height="h-1.5"
                />
              </div>
            ))}
          </div>

          {/* Risk legend */}
          <div className="border-t border-[#E5E7EB] dark:border-[#292929] pt-3">
            <p className="text-xs font-medium text-[#6B7280] dark:text-[#A1A1AA] mb-2">Risk Interpretation</p>
            <div className="grid grid-cols-2 gap-1.5">
              {(['healthy', 'monitor', 'high-risk', 'critical'] as const).map((l) => (
                <div key={l} className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium ${getRiskBgClass(l)}`}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getRiskColor(l) }} />
                  {getRiskLevelLabel(l)}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/damage-analysis')}
            className="btn-secondary w-full flex items-center justify-center gap-1.5 text-xs"
          >
            View Detailed Risk Analysis <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Belt health trend */}
        <div className="lg:col-span-2 card p-5 space-y-4">
          <div>
            <p className="section-title">Belt Health Trend</p>
            <p className="section-subtitle text-xs mt-0.5">Simulated belt health score over time</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={beltHealthTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(v: any) => [`${v}%`, 'Health Score']}
              />
              <ReferenceLine y={70} stroke="#D97706" strokeDasharray="4 2" label={{ value: 'Warning', position: 'right', fontSize: 10, fill: '#D97706' }} />
              <Line
                type="monotone"
                dataKey="health"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 4, fill: '#3B82F6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sensors + Conveyor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sensor cards */}
        <div className="space-y-3">
          <p className="section-title">Sensor Overview</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(sensors).map(([key, sensor]) => {
              const Icon = sensorIcons[key] || Activity;
              return <SensorPanel key={key} sensor={sensor} icon={Icon} />;
            })}
          </div>
        </div>

        {/* Conveyor damage map */}
        <div className="space-y-3">
          <p className="section-title">Damage Locations — CV-04</p>
          <ConveyorDamageMap
            damages={damages.filter((d) => d.conveyorId === 'CV-04')}
            totalLength={2800}
            selectedId={selectedDamage}
            onSelect={setSelectedDamage}
          />
          {selectedDamage && (() => {
            const d = damages.find((x) => x.id === selectedDamage);
            if (!d) return null;
            return (
              <div className="card p-3 border-l-4 border-l-orange-500 space-y-1.5">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold text-[#111827] dark:text-white">{d.id}</p>
                  <StatusBadge status={d.severity} />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-[#6B7280] dark:text-[#A1A1AA]">Position</span>
                  <span className="font-medium text-[#111827] dark:text-white">{d.position} m</span>
                  <span className="text-[#6B7280] dark:text-[#A1A1AA]">Type</span>
                  <span className="font-medium text-[#111827] dark:text-white capitalize">{d.type.replace('-', ' ')}</span>
                  {d.depth && <>
                    <span className="text-[#6B7280] dark:text-[#A1A1AA]">Depth</span>
                    <span className="font-medium text-[#111827] dark:text-white">{d.depth} mm</span>
                  </>}
                  {d.length && <>
                    <span className="text-[#6B7280] dark:text-[#A1A1AA]">Length</span>
                    <span className="font-medium text-[#111827] dark:text-white">{d.length} mm</span>
                  </>}
                </div>
                <p className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA] pt-1 border-t border-[#E5E7EB] dark:border-[#292929]">
                  {d.recommendedAction}
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

interface DamageMarkerProps {
  id: string;
  position: number;
  totalLength: number;
  severity: string;
  isSelected: boolean;
  onClick: () => void;
}

function DamageMarker({ id, position, totalLength, severity, isSelected, onClick }: DamageMarkerProps) {
  const pct = (position / totalLength) * 100;
  const colors: Record<string, string> = {
    low: '#16A34A',
    moderate: '#D97706',
    high: '#EA580C',
    critical: '#DC2626',
  };
  const color = colors[severity] || '#6B7280';

  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 flex flex-col items-center group"
      style={{ left: `${pct}%`, top: 0 }}
      aria-label={`Damage ${id} at ${position}m`}
    >
      <div
        className={`w-3 h-3 rounded-full border-2 border-white dark:border-[#161616] transition-all ${isSelected ? 'scale-150' : 'group-hover:scale-125'}`}
        style={{ backgroundColor: color }}
      />
      <div className={`absolute top-5 text-[9px] font-bold whitespace-nowrap px-1.5 py-0.5 rounded transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        style={{ color, backgroundColor: `${color}20` }}>
        {id}
      </div>
    </button>
  );
}

function ConveyorDamageMap({ damages, totalLength, selectedId, onSelect }: {
  damages: { id: string; position: number; severity: string }[];
  totalLength: number;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const markers = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="card p-4 space-y-3">
      <div className="flex justify-between text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">
        <span className="font-medium">DRIVE PULLEY</span>
        <span className="font-medium">TAIL PULLEY</span>
      </div>

      {/* Belt */}
      <div className="relative h-6 my-6">
        {/* Belt track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-3 bg-gray-700 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="belt-animated w-full h-full" />
        </div>
        {/* Damage markers */}
        {damages.map((d) => (
          <DamageMarker
            key={d.id}
            id={d.id}
            position={d.position}
            totalLength={totalLength}
            severity={d.severity}
            isSelected={selectedId === d.id}
            onClick={() => onSelect(selectedId === d.id ? null : d.id)}
          />
        ))}
      </div>

      {/* Scale */}
      <div className="relative h-4">
        <div className="absolute left-0 right-0 flex justify-between">
          {markers.map((pct) => (
            <div key={pct} className="flex flex-col items-center">
              <div className="w-px h-2 bg-[#E5E7EB] dark:bg-[#292929]" />
              <span className="text-[9px] text-[#6B7280] dark:text-[#A1A1AA]">{Math.round(pct * totalLength)}m</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA] flex items-center gap-1">
        <Info className="w-3 h-3" />
        Click a marker to view damage details
      </p>
    </div>
  );
}
