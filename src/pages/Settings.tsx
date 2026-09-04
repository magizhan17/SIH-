import React, { useState } from 'react';
import { Save, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingFieldProps {
  label: string;
  description?: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}

function SettingField({ label, description, value, unit, onChange, min = 0, max = 100 }: SettingFieldProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#E5E7EB] dark:border-[#292929] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#111827] dark:text-white">{label}</p>
        {description && <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-20 text-sm px-2 py-1.5 rounded-lg border border-[#E5E7EB] dark:border-[#292929] bg-white dark:bg-[#1a1a1a] text-[#111827] dark:text-white text-center"
        />
        <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA] w-8">{unit}</span>
      </div>
    </div>
  );
}

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <div className="card p-5 space-y-1">
      <p className="section-title mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function Settings() {
  const { settings, updateSettings } = useApp();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof typeof local>(key: K, value: typeof local[K]) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSettings(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="section-title text-xl">System Settings</h2>
          <p className="section-subtitle mt-1">Configure system parameters, thresholds, and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            saved ? 'bg-green-600 text-white' : 'btn-primary'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? '✓ Saved' : 'Save Settings'}
        </button>
      </div>

      {/* Engineering disclaimer */}
      <div className="card p-4 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/10 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
          <strong>Important:</strong> Thresholds are configurable engineering/site parameters.
          These values do not represent universal safety standards. All threshold values must be validated by qualified engineers
          and tailored to your specific site, belt type, material, and operating conditions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Conveyor Config */}
        <SettingSection title="Conveyor Configuration">
          <div className="space-y-0">
            {[
              { label: 'Default Conveyor', field: 'CV-04', type: 'text', unit: '' },
              { label: 'Belt Total Length', field: '2800', type: 'text', unit: 'm' },
              { label: 'Max Belt Speed', field: '6.5', type: 'text', unit: 'm/s' },
              { label: 'Rated Load Capacity', field: '2500', type: 'text', unit: 'kg' },
            ].map(({ label, field, unit }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#E5E7EB] dark:border-[#292929] last:border-0">
                <p className="text-sm text-[#111827] dark:text-white">{label}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#111827] dark:text-white bg-[#F7F8FA] dark:bg-[#1a1a1a] px-3 py-1 rounded-lg">{field}</span>
                  {unit && <span className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </SettingSection>

        {/* Risk Thresholds */}
        <SettingSection title="Risk Score Thresholds">
          <SettingField
            label="Warning Risk Score"
            description="Alert when risk score exceeds this value"
            value={local.warningRiskScore}
            unit="/ 100"
            onChange={(v) => set('warningRiskScore', v)}
            min={1} max={99}
          />
          <SettingField
            label="Critical Risk Score"
            description="Trigger critical alert at this score"
            value={local.criticalRiskScore}
            unit="/ 100"
            onChange={(v) => set('criticalRiskScore', v)}
            min={1} max={100}
          />
        </SettingSection>

        {/* Crack Depth */}
        <SettingSection title="Laser Inspection Thresholds">
          <SettingField
            label="Crack Depth Warning Threshold"
            description="Configurable site parameter — not a universal standard"
            value={local.crackDepthWarning}
            unit="mm"
            onChange={(v) => set('crackDepthWarning', v)}
            min={0.1} max={10}
          />
          <SettingField
            label="Crack Depth Critical Threshold"
            description="Configurable site parameter — not a universal standard"
            value={local.crackDepthCritical}
            unit="mm"
            onChange={(v) => set('crackDepthCritical', v)}
            min={0.1} max={20}
          />
        </SettingSection>

        {/* Vibration & Temp */}
        <SettingSection title="Sensor Thresholds">
          <SettingField
            label="Vibration Warning"
            value={local.vibrationWarning}
            unit="mm/s"
            onChange={(v) => set('vibrationWarning', v)}
            min={0.1} max={20}
          />
          <SettingField
            label="Vibration Critical"
            value={local.vibrationCritical}
            unit="mm/s"
            onChange={(v) => set('vibrationCritical', v)}
            min={0.1} max={30}
          />
          <SettingField
            label="Temperature Warning"
            value={local.temperatureWarning}
            unit="°C"
            onChange={(v) => set('temperatureWarning', v)}
            min={30} max={150}
          />
          <SettingField
            label="Temperature Critical"
            value={local.temperatureCritical}
            unit="°C"
            onChange={(v) => set('temperatureCritical', v)}
            min={30} max={200}
          />
          <SettingField
            label="Belt Tension Warning"
            value={local.tensionWarning}
            unit="kN"
            onChange={(v) => set('tensionWarning', v)}
            min={10} max={200}
          />
          <SettingField
            label="Belt Tension Critical"
            value={local.tensionCritical}
            unit="kN"
            onChange={(v) => set('tensionCritical', v)}
            min={10} max={300}
          />
        </SettingSection>

        {/* Alert Preferences */}
        <SettingSection title="Alert Preferences">
          {[
            { label: 'Enable critical alerts', checked: true },
            { label: 'Enable warning alerts', checked: true },
            { label: 'Enable info notifications', checked: true },
            { label: 'Auto-acknowledge info alerts', checked: false },
            { label: 'Send SMS on critical alert', checked: true },
          ].map(({ label, checked }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-[#E5E7EB] dark:border-[#292929] last:border-0">
              <span className="text-sm text-[#111827] dark:text-white">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
                <div className="w-9 h-5 bg-[#E5E7EB] dark:bg-[#292929] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
              </label>
            </div>
          ))}
        </SettingSection>

        {/* Notification Recipients */}
        <SettingSection title="Notification Recipients">
          {[
            { name: 'Control Room', contact: '+91-XXXX-XXXXXX' },
            { name: 'Maintenance Team Lead', contact: '+91-XXXX-XXXXXX' },
            { name: 'Safety Officer', contact: '+91-XXXX-XXXXXX' },
            { name: 'Site Supervisor', contact: '+91-XXXX-XXXXXX' },
          ].map(({ name, contact }) => (
            <div key={name} className="flex items-center justify-between py-2.5 border-b border-[#E5E7EB] dark:border-[#292929] last:border-0">
              <div>
                <p className="text-sm font-medium text-[#111827] dark:text-white">{name}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{contact}</p>
              </div>
              <button className="text-xs btn-secondary py-1 px-2">Edit</button>
            </div>
          ))}
        </SettingSection>
      </div>
    </div>
  );
}
