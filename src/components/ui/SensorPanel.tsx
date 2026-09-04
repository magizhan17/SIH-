import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import type { SensorReading } from '../../types';
import { StatusBadge } from './SharedComponents';

interface SensorPanelProps {
  sensor: SensorReading;
  icon: React.ElementType;
}

export function SensorPanel({ sensor, icon: Icon }: SensorPanelProps) {
  const getTrendColor = (trend: string, status: string) => {
    if (status === 'critical') return '#DC2626'; // red
    if (status === 'warning') return '#D97706'; // amber
    if (trend === 'up') return '#DC2626';
    if (trend === 'down') return '#16A34A';
    return '#3B82F6'; // blue for stable/normal
  };

  const trendColor = getTrendColor(sensor.trend, sensor.status);
  const isUp = sensor.trend === 'up';
  const isDown = sensor.trend === 'down';

  return (
    <div className="card p-3.5 card-hover space-y-3 flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between relative z-10">
        <div className="w-8 h-8 rounded-lg bg-[#F7F8FA] dark:bg-[#1a1a1a] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#6B7280] dark:text-[#A1A1AA]" />
        </div>
        <StatusBadge status={sensor.status} />
      </div>
      
      <div className="relative z-10">
        <p className="text-lg font-bold text-[#111827] dark:text-white flex items-end gap-1">
          {sensor.value}
          <span className="text-xs font-normal text-[#6B7280] dark:text-[#A1A1AA] mb-[3px]">{sensor.unit}</span>
        </p>
        <p className="text-xs text-[#6B7280] dark:text-[#A1A1AA] flex items-center gap-1 mt-1">
          <span className="font-medium" style={{ color: trendColor }}>
            {isUp ? '▲' : isDown ? '▼' : '—'}
          </span>
          {sensor.name}
        </p>
      </div>

      {/* Mini sparkline graph in the background bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-12 opacity-40 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sensor.history}>
            <defs>
              <linearGradient id={`gradient-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={trendColor} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={trendColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={trendColor} 
              strokeWidth={2}
              fill={`url(#gradient-${sensor.id})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
