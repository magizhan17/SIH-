import type { MaintenancePrediction } from '../types';

export const predictions: MaintenancePrediction[] = [
  {
    conveyorId: 'CV-04',
    estimatedDays: 18,
    confidence: 87,
    predictedHealthTimeline: [
      { day: 0, health: 72, isPrediction: false },
      { day: 1, health: 71, isPrediction: false },
      { day: 2, health: 70, isPrediction: false },
      { day: 3, health: 69, isPrediction: true },
      { day: 5, health: 67, isPrediction: true },
      { day: 7, health: 64, isPrediction: true },
      { day: 10, health: 59, isPrediction: true },
      { day: 14, health: 53, isPrediction: true },
      { day: 18, health: 45, isPrediction: true },
      { day: 21, health: 38, isPrediction: true },
    ],
    recommendedAction:
      'Schedule detailed inspection and maintenance before the predicted high-risk window (Day 14–18). Prepare replacement belt section for position 1200–1300 m.',
    urgency: 'high',
  },
];

// Critical prediction for simulated damage state
export const criticalPrediction: MaintenancePrediction = {
  conveyorId: 'CV-04',
  estimatedDays: 5,
  confidence: 91,
  predictedHealthTimeline: [
    { day: 0, health: 42, isPrediction: false },
    { day: 1, health: 38, isPrediction: true },
    { day: 2, health: 33, isPrediction: true },
    { day: 3, health: 28, isPrediction: true },
    { day: 4, health: 22, isPrediction: true },
    { day: 5, health: 15, isPrediction: true },
    { day: 6, health: 8, isPrediction: true },
  ],
  recommendedAction:
    'IMMEDIATE ACTION REQUIRED. Stop conveyor and conduct emergency inspection. Belt joint replacement is critical.',
  urgency: 'immediate',
};

export const getPrediction = (conveyorId: string): MaintenancePrediction | undefined =>
  predictions.find((p) => p.conveyorId === conveyorId);
