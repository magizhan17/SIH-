import { getState } from '../models/stateModel';
import { getPrediction } from '../models/predictionModel';
import type { MaintenancePrediction } from '../types';

export const generatePrediction = (conveyorId: string): MaintenancePrediction | undefined => {
  const currentPrediction = getPrediction(conveyorId);
  const state = getState(conveyorId);
  
  if (!state || !currentPrediction) return currentPrediction;
  
  // Update prediction dynamically based on current health/risk
  const baseDays = state.riskLevel === 'critical' ? 5 : state.riskLevel === 'high-risk' ? 12 : 30;
  // Fluctuate slightly
  const estimatedDays = Math.round(baseDays * (0.9 + Math.random() * 0.2));
  
  return {
    ...currentPrediction,
    estimatedDays,
    urgency: state.riskLevel === 'critical' ? 'immediate' : state.riskLevel === 'high-risk' ? 'high' : 'medium'
  };
};
