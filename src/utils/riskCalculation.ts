import type { RiskLevel, RiskFactors } from '../types';

/**
 * Demo risk calculation utility.
 *
 * This is a simplified demonstration model using weighted scoring.
 * Architecture is designed so this can be replaced with a real AI/ML model.
 *
 * IMPORTANT: This is a demo calculation. Real operational decisions
 * require validated engineering models, sensor calibration, and
 * site-specific safety procedures.
 */

export interface RiskScoreResult {
  score: number; // 0–100
  level: RiskLevel;
  factors: {
    name: string;
    contribution: number; // percentage contribution
    score: number; // 0–100 raw factor score
  }[];
}

// Weights for each factor (must sum to 100)
const FACTOR_WEIGHTS = {
  crackDepth: 35,
  beltTension: 20,
  vibration: 15,
  wear: 15,
  misalignment: 10,
  temperature: 5,
};

// Normalisation ranges for each factor
const NORMALISE_RANGES = {
  crackDepth: { min: 0, max: 6 }, // mm
  beltTension: { min: 50, max: 130 }, // kN
  vibration: { min: 0, max: 10 }, // mm/s
  wear: { min: 0, max: 100 }, // wear index 0–100
  misalignment: { min: 0, max: 12 }, // mm
  temperature: { min: 30, max: 100 }, // °C
};

function normalise(value: number, min: number, max: number): number {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

export function calculateRiskScore(factors: RiskFactors): RiskScoreResult {
  const factorScores = {
    crackDepth: normalise(factors.crackDepth, NORMALISE_RANGES.crackDepth.min, NORMALISE_RANGES.crackDepth.max),
    beltTension: normalise(factors.beltTension, NORMALISE_RANGES.beltTension.min, NORMALISE_RANGES.beltTension.max),
    vibration: normalise(factors.vibration, NORMALISE_RANGES.vibration.min, NORMALISE_RANGES.vibration.max),
    wear: normalise(factors.wear, NORMALISE_RANGES.wear.min, NORMALISE_RANGES.wear.max),
    misalignment: normalise(factors.misalignment, NORMALISE_RANGES.misalignment.min, NORMALISE_RANGES.misalignment.max),
    temperature: normalise(factors.temperature, NORMALISE_RANGES.temperature.min, NORMALISE_RANGES.temperature.max),
  };

  const score = Math.round(
    (factorScores.crackDepth * FACTOR_WEIGHTS.crackDepth +
      factorScores.beltTension * FACTOR_WEIGHTS.beltTension +
      factorScores.vibration * FACTOR_WEIGHTS.vibration +
      factorScores.wear * FACTOR_WEIGHTS.wear +
      factorScores.misalignment * FACTOR_WEIGHTS.misalignment +
      factorScores.temperature * FACTOR_WEIGHTS.temperature) /
      100
  );

  const level = getRiskLevel(score);

  return {
    score,
    level,
    factors: [
      { name: 'Crack Depth', contribution: FACTOR_WEIGHTS.crackDepth, score: Math.round(factorScores.crackDepth) },
      { name: 'Belt Tension', contribution: FACTOR_WEIGHTS.beltTension, score: Math.round(factorScores.beltTension) },
      { name: 'Vibration', contribution: FACTOR_WEIGHTS.vibration, score: Math.round(factorScores.vibration) },
      { name: 'Wear', contribution: FACTOR_WEIGHTS.wear, score: Math.round(factorScores.wear) },
      { name: 'Misalignment', contribution: FACTOR_WEIGHTS.misalignment, score: Math.round(factorScores.misalignment) },
      { name: 'Temperature', contribution: FACTOR_WEIGHTS.temperature, score: Math.round(factorScores.temperature) },
    ],
  };
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 30) return 'healthy';
  if (score <= 60) return 'monitor';
  if (score <= 80) return 'high-risk';
  return 'critical';
}

export function getRiskLevelLabel(level: RiskLevel): string {
  switch (level) {
    case 'healthy': return 'Healthy';
    case 'monitor': return 'Monitor';
    case 'high-risk': return 'High Risk';
    case 'critical': return 'Critical';
  }
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'healthy': return '#16A34A';
    case 'monitor': return '#2563EB';
    case 'high-risk': return '#EA580C';
    case 'critical': return '#DC2626';
  }
}

export function getRiskBgClass(level: RiskLevel): string {
  switch (level) {
    case 'healthy': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
    case 'monitor': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
    case 'high-risk': return 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400';
    case 'critical': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
  }
}

/**
 * Calculate a demo damage score from 0–100.
 * Inputs: crackDepth, crackLength, wear, misalignment, temperature.
 */
export function calculateDamageScore(inputs: {
  crackDepth: number;
  crackLength: number;
  wear: number;
  misalignment: number;
  temperature: number;
}): {
  overall: number;
  factors: { name: string; score: number }[];
} {
  const crackDepthScore = Math.min(100, (inputs.crackDepth / 6) * 100);
  const crackLengthScore = Math.min(100, (inputs.crackLength / 200) * 100);
  const wearScore = Math.min(100, inputs.wear);
  const misalignmentScore = Math.min(100, (inputs.misalignment / 12) * 100);
  const temperatureScore = Math.min(100, ((inputs.temperature - 30) / 70) * 100);

  const overall = Math.round(
    crackDepthScore * 0.35 +
      crackLengthScore * 0.25 +
      wearScore * 0.2 +
      misalignmentScore * 0.12 +
      temperatureScore * 0.08
  );

  return {
    overall,
    factors: [
      { name: 'Crack Depth', score: Math.round(crackDepthScore) },
      { name: 'Crack Length', score: Math.round(crackLengthScore) },
      { name: 'Belt Wear', score: Math.round(wearScore) },
      { name: 'Misalignment', score: Math.round(misalignmentScore) },
      { name: 'Temperature', score: Math.round(temperatureScore) },
    ],
  };
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'low': return '#16A34A';
    case 'moderate': return '#D97706';
    case 'high': return '#EA580C';
    case 'critical': return '#DC2626';
    default: return '#6B7280';
  }
}

export function getSeverityBgClass(severity: string): string {
  switch (severity) {
    case 'low': return 'status-healthy';
    case 'moderate': return 'status-warning';
    case 'high': return 'status-high-risk';
    case 'critical': return 'status-critical';
    default: return 'status-info';
  }
}

export function getStatusBgClass(status: string): string {
  switch (status) {
    case 'normal': return 'status-healthy';
    case 'warning': return 'status-warning';
    case 'critical': return 'status-critical';
    case 'offline': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400';
    default: return 'status-info';
  }
}
