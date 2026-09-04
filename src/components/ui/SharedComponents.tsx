import React from 'react';
import { type RiskLevel } from '../../types';
import { getRiskLevelLabel, getRiskColor } from '../../utils/riskCalculation';

interface RiskScoreCircleProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScoreCircle({ score, level, size = 'md' }: RiskScoreCircleProps) {
  const sizes = {
    sm: { svg: 80, stroke: 6, r: 34, fontSize: 'text-lg', labelSize: 'text-[10px]' },
    md: { svg: 120, stroke: 8, r: 50, fontSize: 'text-2xl', labelSize: 'text-xs' },
    lg: { svg: 160, stroke: 10, r: 68, fontSize: 'text-4xl', labelSize: 'text-sm' },
  };

  const { svg, stroke, r, fontSize, labelSize } = sizes[size];
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = getRiskColor(level);
  const label = getRiskLevelLabel(level);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svg} height={svg} className="-rotate-90">
        <circle
          cx={svg / 2}
          cy={svg / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-[#E5E7EB] dark:text-[#292929]"
        />
        <circle
          cx={svg / 2}
          cy={svg / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${fontSize} font-bold text-[#111827] dark:text-white`}>{score}</span>
        <span className={`${labelSize} font-medium mt-0.5`} style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number; // 0–100
  color?: string;
  height?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, color = '#3B82F6', height = 'h-2', showLabel = false }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className={`progress-bar-track ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">0</span>
          <span className="text-[10px] text-[#6B7280] dark:text-[#A1A1AA]">100</span>
        </div>
      )}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const classes: Record<string, string> = {
    normal: 'status-healthy',
    healthy: 'status-healthy',
    operational: 'status-healthy',
    warning: 'status-warning',
    monitor: 'status-warning',
    'high-risk': 'status-high-risk',
    high: 'status-high-risk',
    critical: 'status-critical',
    info: 'status-info',
    reviewed: 'status-info',
    closed: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 status-badge',
    open: 'status-warning',
    pending: 'status-info',
    moderate: 'status-warning',
    low: 'status-healthy',
  };

  const labels: Record<string, string> = {
    normal: 'Normal',
    healthy: 'Healthy',
    operational: 'Operational',
    warning: 'Warning',
    monitor: 'Monitor',
    'high-risk': 'High Risk',
    high: 'High',
    critical: 'Critical',
    info: 'Info',
    reviewed: 'Reviewed',
    closed: 'Closed',
    open: 'Open',
    pending: 'Pending',
    moderate: 'Moderate',
    low: 'Low',
  };

  const dotColor: Record<string, string> = {
    normal: 'text-green-500',
    healthy: 'text-green-500',
    operational: 'text-green-500',
    warning: 'text-amber-500',
    monitor: 'text-amber-500',
    'high-risk': 'text-orange-500',
    high: 'text-orange-500',
    critical: 'text-red-500',
    info: 'text-blue-500',
    reviewed: 'text-blue-500',
    closed: 'text-gray-500',
    open: 'text-amber-500',
    pending: 'text-blue-500',
    moderate: 'text-amber-500',
    low: 'text-green-500',
  };

  return (
    <span className={`${classes[status] || 'status-info'} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-current ${dotColor[status] || 'text-blue-500'}`} />
      {labels[status] || status}
    </span>
  );
}

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  status?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  trend?: 'up' | 'down' | 'stable';
  trendGoodDirection?: 'up' | 'down';
}

export function KPICard({ title, value, unit, status, description, children, className = '', trend, trendGoodDirection }: KPICardProps) {
  return (
    <div className={`card p-5 flex flex-col gap-3 card-hover ${className}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="kpi-label">{title}</p>
        {status && <StatusBadge status={status} />}
      </div>
      <div className="flex items-end gap-1">
        <span className="kpi-value">{value}</span>
        {unit && <span className="text-sm text-[#6B7280] dark:text-[#A1A1AA] mb-1">{unit}</span>}
      </div>
      {description && (
        <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{description}</p>
      )}
      {children}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-[#E5E7EB] dark:bg-[#292929] rounded w-full" />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-[#F7F8FA] dark:bg-[#1a1a1a] flex items-center justify-center text-[#6B7280] dark:text-[#A1A1AA]">
        {icon}
      </div>
      <p className="text-sm font-medium text-[#111827] dark:text-white">{title}</p>
      {description && <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA]">{description}</p>}
    </div>
  );
}
