import db from '../database/db';
import type { MaintenancePrediction } from '../types';

export const getPrediction = (conveyorId: string): MaintenancePrediction | undefined => {
  const p = db.prepare('SELECT * FROM predictions WHERE conveyorId = ?').get(conveyorId) as any;
  if (!p) return undefined;
  
  const timeline = db.prepare('SELECT day, health, isPrediction FROM prediction_timelines WHERE predictionConveyorId = ? ORDER BY day ASC').all(conveyorId) as any[];
  
  return {
    conveyorId: p.conveyorId,
    estimatedDays: p.estimatedDays,
    confidence: p.confidence,
    recommendedAction: p.recommendedAction,
    urgency: p.urgency,
    predictedHealthTimeline: timeline.map(t => ({ day: t.day, health: t.health, isPrediction: t.isPrediction === 1 }))
  } as MaintenancePrediction;
};
