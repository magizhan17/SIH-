import type { SensorReading } from '../types';

const makeTrend = (base: number, points = 12, variance = 0.05) =>
  Array.from({ length: points }, (_, i) => ({
    time: `${(8 + i).toString().padStart(2, '0')}:00`,
    value: parseFloat((base * (1 + (Math.random() - 0.5) * variance)).toFixed(2)),
  }));

// CV-04 normal state
export const getSensorsNormal = (): Record<string, SensorReading> => ({
  vibration: {
    id: 'VIB-01',
    name: 'Vibration',
    value: 3.2,
    unit: 'mm/s',
    status: 'normal',
    trend: 'stable',
    history: makeTrend(3.2),
  },
  temperature: {
    id: 'TMP-01',
    name: 'Temperature',
    value: 58,
    unit: '°C',
    status: 'normal',
    trend: 'up',
    history: makeTrend(58, 12, 0.03),
  },
  beltSpeed: {
    id: 'SPD-01',
    name: 'Belt Speed',
    value: 4.8,
    unit: 'm/s',
    status: 'normal',
    trend: 'stable',
    history: makeTrend(4.8, 12, 0.02),
  },
  beltTension: {
    id: 'TEN-01',
    name: 'Belt Tension',
    value: 82.4,
    unit: 'kN',
    status: 'warning',
    trend: 'up',
    history: makeTrend(82.4, 12, 0.04),
  },
  load: {
    id: 'LOD-01',
    name: 'Load',
    value: 1850,
    unit: 'kg',
    status: 'normal',
    trend: 'stable',
    history: makeTrend(1850, 12, 0.05),
  },
  misalignment: {
    id: 'MIS-01',
    name: 'Misalignment',
    value: 3.2,
    unit: 'mm',
    status: 'warning',
    trend: 'up',
    history: makeTrend(3.2, 12, 0.08),
  },
});

// CV-04 critical/simulated damage state
export const getSensorsCritical = (): Record<string, SensorReading> => ({
  vibration: {
    id: 'VIB-01',
    name: 'Vibration',
    value: 7.8,
    unit: 'mm/s',
    status: 'critical',
    trend: 'up',
    history: makeTrend(7.8, 12, 0.06),
  },
  temperature: {
    id: 'TMP-01',
    name: 'Temperature',
    value: 87,
    unit: '°C',
    status: 'critical',
    trend: 'up',
    history: makeTrend(87, 12, 0.04),
  },
  beltSpeed: {
    id: 'SPD-01',
    name: 'Belt Speed',
    value: 3.6,
    unit: 'm/s',
    status: 'warning',
    trend: 'down',
    history: makeTrend(3.6, 12, 0.03),
  },
  beltTension: {
    id: 'TEN-01',
    name: 'Belt Tension',
    value: 112.8,
    unit: 'kN',
    status: 'critical',
    trend: 'up',
    history: makeTrend(112.8, 12, 0.05),
  },
  load: {
    id: 'LOD-01',
    name: 'Load',
    value: 2420,
    unit: 'kg',
    status: 'warning',
    trend: 'up',
    history: makeTrend(2420, 12, 0.06),
  },
  misalignment: {
    id: 'MIS-01',
    name: 'Misalignment',
    value: 8.6,
    unit: 'mm',
    status: 'critical',
    trend: 'up',
    history: makeTrend(8.6, 12, 0.1),
  },
});

// Tension trend for charts
export const tensionTrend = [
  { time: '08:00', value: 74.2 },
  { time: '09:00', value: 75.6 },
  { time: '10:00', value: 76.1 },
  { time: '11:00', value: 78.4 },
  { time: '12:00', value: 79.0 },
  { time: '13:00', value: 80.3 },
  { time: '14:00', value: 82.4 },
  { time: '15:00', value: 83.1 },
  { time: '16:00', value: 82.8 },
  { time: '17:00', value: 84.2 },
  { time: '18:00', value: 82.4 },
];

export const vibrationTrend = [
  { time: '08:00', value: 2.1 },
  { time: '09:00', value: 2.3 },
  { time: '10:00', value: 2.4 },
  { time: '11:00', value: 2.6 },
  { time: '12:00', value: 2.8 },
  { time: '13:00', value: 2.9 },
  { time: '14:00', value: 3.1 },
  { time: '15:00', value: 3.0 },
  { time: '16:00', value: 3.2 },
  { time: '17:00', value: 3.4 },
  { time: '18:00', value: 3.2 },
];

export const temperatureTrend = [
  { time: '08:00', value: 48 },
  { time: '09:00', value: 50 },
  { time: '10:00', value: 51 },
  { time: '11:00', value: 53 },
  { time: '12:00', value: 55 },
  { time: '13:00', value: 56 },
  { time: '14:00', value: 57 },
  { time: '15:00', value: 58 },
  { time: '16:00', value: 58 },
  { time: '17:00', value: 59 },
  { time: '18:00', value: 58 },
];

export const speedTrend = [
  { time: '08:00', value: 4.9 },
  { time: '09:00', value: 4.8 },
  { time: '10:00', value: 4.8 },
  { time: '11:00', value: 4.9 },
  { time: '12:00', value: 4.7 },
  { time: '13:00', value: 4.8 },
  { time: '14:00', value: 4.8 },
  { time: '15:00', value: 4.8 },
  { time: '16:00', value: 4.7 },
  { time: '17:00', value: 4.9 },
  { time: '18:00', value: 4.8 },
];
