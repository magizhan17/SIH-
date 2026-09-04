import type { RiskLevel } from '../types';

export const calculateRiskScore = (factors: {
  crackDepth: number; // mm
  beltTension: number; // kN
  vibration: number; // mm/s
  wear: number; // % (0-100)
  misalignment: number; // mm
  temperature: number; // °C
}) => {
  // Normalize each factor to a 0-100 scale (rough approximation)
  // Max expected crack depth ~ 5mm
  const normCrack = Math.min(100, (factors.crackDepth / 5.0) * 100);
  
  // Normal tension ~ 80, critical ~ 110
  const normTension = Math.min(100, Math.max(0, (factors.beltTension - 70) / 40 * 100));
  
  // Normal vibration ~ 3, critical ~ 8
  const normVib = Math.min(100, (factors.vibration / 8.0) * 100);
  
  // Wear is already 0-100
  const normWear = factors.wear;
  
  // Normal misalignment ~ 3, critical ~ 10
  const normMis = Math.min(100, (factors.misalignment / 10.0) * 100);
  
  // Normal temp ~ 50, critical ~ 90
  const normTemp = Math.min(100, Math.max(0, (factors.temperature - 40) / 50 * 100));

  // Weights specified in problem statement
  const score = Math.round(
    normCrack * 0.35 +
    normTension * 0.20 +
    normVib * 0.15 +
    normWear * 0.15 +
    normMis * 0.10 +
    normTemp * 0.05
  );

  let level: RiskLevel = 'healthy';
  if (score > 80) level = 'critical';
  else if (score > 60) level = 'high-risk';
  else if (score > 30) level = 'monitor';

  return {
    score,
    level,
    DEMO_MODEL_ESTIMATE: true
  };
};
