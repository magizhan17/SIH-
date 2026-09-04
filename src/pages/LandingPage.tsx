import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ScanLine, BrainCircuit, Zap, BarChart3, ChevronRight, Shield, Cpu, Radio } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-[#0B0B0B] flex flex-col">
      {/* Minimal top bar */}
      <header className="px-8 py-4 flex items-center justify-between border-b border-[#E5E7EB] dark:border-[#292929] bg-white dark:bg-[#0B0B0B]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-bold text-sm text-[#111827] dark:text-white">CBH Monitor</span>
            <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA] ml-2">by NMDC</span>
          </div>
        </div>
        <div className="sim-badge">SIMULATION / DEMO DATA</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Hero */}
        <div className="max-w-3xl w-full text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-medium mb-6">
            <Radio className="w-3 h-3" />
            Ministry of Steel · NMDC
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-[#111827] dark:text-white leading-tight mb-5">
            Intelligent Conveyor Belt
            <br />
            <span className="text-blue-600">Health Monitoring</span>
          </h1>

          <p className="text-base text-[#6B7280] dark:text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed mb-10">
            AI-powered predictive monitoring for safer and more reliable iron ore conveyor operations.
            Detect cracks, measure depth, calculate risk, and prevent failures before they happen.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              Open Monitoring Dashboard
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/predictive-maintenance')}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-[#161616] border border-[#E5E7EB] dark:border-[#292929] text-[#111827] dark:text-white rounded-lg font-medium hover:bg-[#F7F8FA] dark:hover:bg-[#1e1e1e] transition-colors text-sm"
            >
              View System Overview
            </button>
          </div>
        </div>

        {/* Conveyor Illustration */}
        <div className="w-full max-w-3xl mb-16">
          <ConveyorIllustration />
        </div>

        {/* Feature Cards */}
        <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Radio, title: 'IoT Sensors', desc: 'Vibration, temperature, tension & more' },
            { icon: ScanLine, title: 'Laser Inspection', desc: 'Crack depth measurement' },
            { icon: BarChart3, title: 'AI Analytics', desc: 'Real-time damage scoring' },
            { icon: BrainCircuit, title: 'Predictive Maintenance', desc: 'Estimate remaining operation' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-4 flex flex-col items-center text-center gap-2 card-hover">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-[#111827] dark:text-white">{title}</p>
              <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer disclaimer */}
      <footer className="px-8 py-4 border-t border-[#E5E7EB] dark:border-[#292929] text-center">
        <p className="text-[11px] text-[#6B7280] dark:text-[#A1A1AA] max-w-2xl mx-auto">
          <Shield className="w-3 h-3 inline mr-1" />
          Predictions and thresholds shown in this demonstration are simulated and configurable.
          Actual operational decisions require validated engineering models, sensor calibration, and site-specific safety procedures.
        </p>
      </footer>
    </div>
  );
}

// Simple SVG conveyor belt illustration
function ConveyorIllustration() {
  return (
    <div className="card p-6 overflow-hidden">
      <div className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA] text-center mb-4 font-medium uppercase tracking-wider">
        System Architecture Overview
      </div>
      <div className="flex flex-col gap-3">
        {/* Top row: sensors/inputs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {['IoT Sensors', 'Laser Scanner', 'PLC / SCADA'].map((label) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {label}
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-[#6B7280] dark:text-[#A1A1AA]">
            <div className="w-px h-6 bg-[#E5E7EB] dark:bg-[#292929]" />
            <ChevronRight className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Belt visualization */}
        <div className="relative bg-[#F7F8FA] dark:bg-[#111111] rounded-lg p-4 border border-[#E5E7EB] dark:border-[#292929]">
          <div className="flex items-center gap-2">
            {/* Drive pulley */}
            <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0 border-2 border-gray-300 dark:border-gray-500" />

            {/* Belt */}
            <div className="flex-1 relative h-6">
              <div className="absolute inset-0 bg-gray-800 dark:bg-gray-700 rounded-sm flex items-center overflow-hidden">
                <div className="belt-animated w-full h-full opacity-30" />
              </div>
              {/* Crack marker */}
              <div className="absolute top-1/2 left-[45%] -translate-y-1/2 flex flex-col items-center">
                <div className="w-0.5 h-3 bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              </div>
            </div>

            {/* Tail pulley */}
            <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0 border-2 border-gray-300 dark:border-gray-500" />
          </div>

          {/* Labels */}
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">DRIVE PULLEY</span>
            <span className="text-[10px] text-red-500 font-medium">▲ DAMAGE DETECTED</span>
            <span className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">TAIL PULLEY</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-[#6B7280] dark:text-[#A1A1AA]">
            <div className="w-px h-6 bg-[#E5E7EB] dark:bg-[#292929]" />
            <ChevronRight className="w-4 h-4 rotate-90" />
          </div>
        </div>

        {/* Outputs */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {['Risk Score', 'Damage Score', 'Maintenance Alert', 'Emergency Notification'].map((label) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
