import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ReferenceLine,
} from 'recharts';
import { BrainCircuit, Calendar, FileText, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProgressBar } from '../components/ui/SharedComponents';

export default function PredictiveMaintenance() {
  const { predictions, estimatedRemainingDays, riskScore, beltHealth, addToast } = useApp();
  const prediction = predictions[0];

  const handleSchedule = () => {
    addToast('info', 'Maintenance scheduling form opened. (Simulated)');
  };

  const handleReport = () => {
    addToast('success', 'Maintenance report generated successfully. (Simulated)');
  };

  const urgencyColors: Record<string, string> = {
    low: '#16A34A',
    medium: '#D97706',
    high: '#EA580C',
    immediate: '#DC2626',
  };

  const urgencyLabels: Record<string, string> = {
    low: 'Low Urgency',
    medium: 'Moderate Urgency',
    high: 'High Urgency',
    immediate: 'IMMEDIATE ACTION REQUIRED',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="section-title text-xl">Predictive Maintenance</h2>
        <p className="section-subtitle mt-1">Estimate future belt health using current deterioration trends.</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="sim-badge">SIMULATED PREDICTION</div>
          <span className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA] flex items-center gap-1">
            <Info className="w-3 h-3" />
            Engineering validation required for operational decisions
          </span>
        </div>
      </div>

      {/* Main prediction card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5 space-y-3 flex flex-col items-center text-center">
          <p className="kpi-label">Estimated Remaining Operation</p>
          <div className="relative">
            <p
              className="text-6xl font-bold"
              style={{ color: estimatedRemainingDays > 14 ? '#16A34A' : estimatedRemainingDays > 7 ? '#D97706' : '#DC2626' }}
            >
              {estimatedRemainingDays}
            </p>
            <p className="text-base text-[#6B7280] dark:text-[#A1A1AA] font-medium">DAYS</p>
          </div>
          <div className="text-[10px] bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 px-2 py-1 rounded font-medium uppercase tracking-wide">
            Model Estimate
          </div>
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#6B7280] dark:text-[#A1A1AA]">Model Confidence</span>
              <span className="font-semibold text-[#111827] dark:text-white">{prediction.confidence}%</span>
            </div>
            <ProgressBar value={prediction.confidence} color="#3B82F6" height="h-1.5" />
          </div>
        </div>

        <div className="card p-5 space-y-3">
          <p className="kpi-label">Current Status</p>
          <div className="space-y-3">
            {[
              { label: 'Belt Health', value: `${beltHealth}%`, color: beltHealth >= 70 ? '#16A34A' : beltHealth >= 50 ? '#D97706' : '#DC2626' },
              { label: 'Risk Score', value: `${riskScore}/100`, color: riskScore <= 30 ? '#16A34A' : riskScore <= 60 ? '#D97706' : riskScore <= 80 ? '#EA580C' : '#DC2626' },
              { label: 'Urgency', value: urgencyLabels[prediction.urgency], color: urgencyColors[prediction.urgency] },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-[#E5E7EB] dark:border-[#292929] last:border-0">
                <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{label}</span>
                <span className="text-xs font-bold" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5 space-y-3 border-l-4" style={{ borderLeftColor: urgencyColors[prediction.urgency] }}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: urgencyColors[prediction.urgency] }} />
            <p className="section-title text-sm">Recommended Action</p>
          </div>
          <p className="text-sm text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
            {prediction.recommendedAction}
          </p>
          <div className="flex flex-col gap-2">
            <button onClick={handleSchedule} className="flex items-center justify-center gap-1.5 btn-primary text-xs">
              <Calendar className="w-3.5 h-3.5" />
              Schedule Maintenance
            </button>
            <button onClick={handleReport} className="flex items-center justify-center gap-1.5 btn-secondary text-xs">
              <FileText className="w-3.5 h-3.5" />
              Create Maintenance Report
            </button>
          </div>
        </div>
      </div>

      {/* Predicted health chart */}
      <div className="card p-5 space-y-4">
        <div>
          <p className="section-title">Predicted Belt Health</p>
          <p className="section-subtitle text-xs mt-0.5">Historical data vs. model prediction — clearly distinguished</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              type="number"
              domain={[0, prediction.predictedHealthTimeline[prediction.predictedHealthTimeline.length - 1].day]}
              tickFormatter={(v) => `Day ${v}`}
              tick={{ fontSize: 11 }}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '11px' }}
              labelFormatter={(v) => `Day ${v}`}
              formatter={(v: number | string, name: string) => [`${v}%`, name]}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <ReferenceLine y={50} stroke="#D97706" strokeDasharray="4 2" label={{ value: 'Maintenance threshold', position: 'right', fontSize: 9, fill: '#D97706' }} />
            <Line
              data={prediction.predictedHealthTimeline.filter((p) => !p.isPrediction)}
              type="monotone"
              dataKey="health"
              name="Historical Data"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#3B82F6' }}
            />
            <Line
              data={prediction.predictedHealthTimeline.filter((p) => p.isPrediction)}
              type="monotone"
              dataKey="health"
              name="Model Prediction"
              stroke="#F59E0B"
              strokeWidth={2.5}
              strokeDasharray="6 3"
              dot={{ r: 4, fill: '#F59E0B' }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-2 text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">
          <Info className="w-3 h-3 flex-shrink-0" />
          <span>
            Predictions are simulated model estimates. Do not use as the sole basis for operational safety decisions.
            Engineering validation required.
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card p-4 bg-[#F7F8FA] dark:bg-[#111111] border-l-4 border-l-amber-500">
        <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] leading-relaxed">
          <strong className="text-[#111827] dark:text-white">⚠ Important Disclaimer:</strong>{' '}
          Predictions and thresholds shown in this demonstration are simulated and configurable.
          Actual operational decisions require validated engineering models, sensor calibration, and site-specific safety procedures.
          The estimated remaining operation period is a model estimate — not a guaranteed safe operating window.
        </p>
      </div>
    </div>
  );
}
