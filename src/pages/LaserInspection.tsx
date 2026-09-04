import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ScanLine, Play, History, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/ui/SharedComponents';

export default function LaserInspection() {
  const { laserScans, currentScan, addToast, isDamageSimulated } = useApp();
  const [showHistory, setShowHistory] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleStartScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      addToast('success', 'Laser scan completed. Results are ready for review. (Simulated)');
    }, 2000);
  };

  const scan = currentScan;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="section-title text-xl">Laser Crack Inspection</h2>
        <p className="section-subtitle mt-1">Measure conveyor belt crack depth using laser-based inspection.</p>
        <div className="sim-badge mt-2">SIMULATED LASER DATA</div>
      </div>

      {/* How it works card */}
      <div className="card p-4 border-l-4 border-l-blue-500 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA]">
          Laser inspection scans the conveyor belt surface and identifies surface profile changes that can be used to estimate crack depth and damage severity.
          The system uses structured light triangulation to generate a cross-section depth profile.
        </p>
      </div>

      {/* Laser visualization + results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Laser viz */}
        <div className="card p-5 space-y-4">
          <p className="section-title">Belt Cross-Section View</p>
          <LaserVisualization crackDepth={scan.crackDepth} crackWidth={scan.crackWidth} isScanning={isScanning} />
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Crack Depth', value: `${scan.crackDepth} mm` },
              { label: 'Crack Width', value: `${scan.crackWidth} mm` },
              { label: 'Crack Length', value: `${scan.crackLength} mm` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#F7F8FA] dark:bg-[#111111] rounded-lg p-2.5">
                <p className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA] uppercase tracking-wide">{label}</p>
                <p className="text-sm font-bold text-[#111827] dark:text-white mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scan results */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="section-title">Inspection Results</p>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              scan.severity === 'critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
              scan.severity === 'high' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' :
              'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
            }`}>
              {scan.severity === 'critical' || scan.severity === 'high' ? '⚠ DAMAGE DETECTED' : 'DAMAGE DETECTED'}
            </span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Scan ID', value: scan.id },
              { label: 'Belt Position', value: `${scan.position} m` },
              { label: 'Crack Width', value: `${scan.crackWidth} mm` },
              { label: 'Crack Depth', value: `${scan.crackDepth} mm` },
              { label: 'Crack Length', value: `${scan.crackLength} mm` },
              { label: 'Inspection Date', value: scan.date },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#292929] last:border-0">
                <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{label}</span>
                <span className="text-xs font-semibold text-[#111827] dark:text-white">{value}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 border-b border-[#E5E7EB] dark:border-[#292929]">
              <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">Severity</span>
              <StatusBadge status={scan.severity} />
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">Model Confidence</span>
              <span className="text-xs font-semibold text-[#111827] dark:text-white">{scan.confidence}%</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="flex-1 flex items-center justify-center gap-1.5 btn-primary text-xs"
            >
              {isScanning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Scanning…
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Start New Scan
                </>
              )}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 btn-secondary text-xs"
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          </div>

          <p className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">
            Model confidence reflects simulated classification quality, not a validated safety certification.
          </p>
        </div>
      </div>

      {/* Crack depth profile */}
      <div className="card p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="section-title">Crack Depth Profile — {scan.id}</p>
            <p className="section-subtitle text-xs mt-0.5">Surface depth profile across crack location</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">Max Depth</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{scan.crackDepth} mm</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={scan.depthProfile} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="crackGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="position" tick={{ fontSize: 11 }} label={{ value: 'Position (mm)', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#6B7280' }} />
            <YAxis tick={{ fontSize: 11 }} label={{ value: 'Depth (mm)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#6B7280' }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
              formatter={(v: number | string) => [`${v} mm`, 'Crack Depth']}
              labelFormatter={(l) => `Position: ${l} mm`}
            />
            <ReferenceLine y={2.0} stroke="#D97706" strokeDasharray="4 2" label={{ value: 'Warning Threshold (configurable)', position: 'right', fontSize: 9, fill: '#D97706' }} />
            <ReferenceLine y={4.0} stroke="#DC2626" strokeDasharray="4 2" label={{ value: 'Critical Threshold (configurable)', position: 'right', fontSize: 9, fill: '#DC2626' }} />
            <Area type="monotone" dataKey="depth" stroke="#EF4444" strokeWidth={2} fill="url(#crackGrad)" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">
          ⚙ Thresholds shown are configurable site/engineering parameters. Values do not represent universal safety standards.
        </p>
      </div>

      {/* Scan History */}
      {showHistory && (
        <div className="card p-5 space-y-4">
          <p className="section-title">Scan History</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] dark:border-[#292929]">
                  {['Scan ID', 'Date', 'Conveyor', 'Location', 'Max Depth', 'Severity', 'Status'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 text-[#6B7280] dark:text-[#A1A1AA] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {laserScans.map((s) => (
                  <tr key={s.id} className="border-b border-[#E5E7EB] dark:border-[#292929] hover:bg-[#F7F8FA] dark:hover:bg-[#1a1a1a] transition-colors">
                    <td className="py-2.5 px-3 font-medium text-[#111827] dark:text-white">{s.id}</td>
                    <td className="py-2.5 px-3 text-[#6B7280] dark:text-[#A1A1AA]">{s.date}</td>
                    <td className="py-2.5 px-3 text-[#6B7280] dark:text-[#A1A1AA]">{s.conveyorId}</td>
                    <td className="py-2.5 px-3 text-[#6B7280] dark:text-[#A1A1AA]">{s.position} m</td>
                    <td className="py-2.5 px-3 font-medium text-[#111827] dark:text-white">{s.crackDepth} mm</td>
                    <td className="py-2.5 px-3"><StatusBadge status={s.severity} /></td>
                    <td className="py-2.5 px-3"><StatusBadge status={s.status.replace('-', '') === 'actionrequired' ? 'critical' : s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function LaserVisualization({ crackDepth, crackWidth, isScanning }: { crackDepth: number; crackWidth: number; isScanning: boolean }) {
  const normalizedDepth = Math.min(crackDepth / 6, 1);
  const depthPx = Math.round(normalizedDepth * 30);

  return (
    <div className="bg-[#F7F8FA] dark:bg-[#111111] rounded-lg p-4 space-y-4">
      {/* Laser beam */}
      <div className="flex flex-col items-center gap-1">
        <div className="text-[10px] font-mono text-[#6B7280] dark:text-[#A1A1AA] uppercase tracking-wider">LASER SENSOR</div>
        <div className={`w-px h-8 ${isScanning ? 'bg-blue-500 animate-pulse' : 'bg-blue-400'}`} />
        <div className={`text-[10px] ${isScanning ? 'text-blue-500' : 'text-blue-400'}`}>↓</div>
      </div>

      {/* Belt surface */}
      <div className="relative">
        {/* Top belt surface */}
        <div className="h-3 bg-gray-600 dark:bg-gray-700 rounded-t-sm" />

        {/* Crack visualization */}
        <div className="relative flex">
          <div className="flex-1 h-6 bg-gray-600 dark:bg-gray-700" />
          {/* Crack */}
          <div
            className="relative bg-black dark:bg-[#0B0B0B]"
            style={{ width: `${Math.min(crackWidth * 3, 80)}px` }}
          >
            <svg width="100%" height={24 + depthPx} className="absolute top-0 left-0">
              <path
                d={`M 0 0 L ${Math.max(crackWidth * 1.5, 40)} 0 L ${Math.max(crackWidth * 1.5, 40)} ${depthPx} Q ${Math.max(crackWidth * 0.75, 20)} ${24 + depthPx} 0 ${depthPx} Z`}
                fill="#1a1a1a"
                stroke="#EF4444"
                strokeWidth="1"
              />
              {/* Depth indicator */}
              <line x1={Math.max(crackWidth * 0.75, 20)} y1="0" x2={Math.max(crackWidth * 0.75, 20)} y2={depthPx} stroke="#EF4444" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </div>
          <div className="flex-1 h-6 bg-gray-600 dark:bg-gray-700" />
        </div>

        {/* Bottom belt */}
        <div className="h-3 bg-gray-500 dark:bg-gray-600 rounded-b-sm" />
      </div>

      {/* Labels */}
      <div className="flex justify-center">
        <div className="text-center">
          <div className="text-[10px] text-red-500 font-medium">↑ Detected Crack</div>
          <div className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">Depth: {crackDepth} mm | Width: {crackWidth} mm</div>
        </div>
      </div>

      {isScanning && (
        <div className="text-center text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
          Scanning in progress…
        </div>
      )}
    </div>
  );
}
