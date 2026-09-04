import db from '../database/db';
import type { ConveyorState, RiskLevel } from '../types';
import { getSensorsForConveyor } from './sensorModel';

export const getState = (conveyorId: string): Partial<ConveyorState> | undefined => {
  const state = db.prepare('SELECT * FROM conveyor_states WHERE conveyorId = ?').get(conveyorId) as any;
  if (!state) return undefined;
  
  return {
    conveyorId: state.conveyorId,
    riskScore: state.riskScore,
    riskLevel: state.riskLevel as RiskLevel,
    beltHealth: state.beltHealth,
    maxCrackDepth: state.maxCrackDepth,
    estimatedRemainingDays: state.estimatedRemainingDays
  };
};

export const updateState = (conveyorId: string, state: Partial<ConveyorState>) => {
  const current = getState(conveyorId);
  if (!current) {
    db.prepare('INSERT INTO conveyor_states (conveyorId, riskScore, riskLevel, beltHealth, maxCrackDepth, estimatedRemainingDays) VALUES (?, ?, ?, ?, ?, ?)').run(
      conveyorId, state.riskScore || 0, state.riskLevel || 'healthy', state.beltHealth || 100, state.maxCrackDepth || 0, state.estimatedRemainingDays || 100
    );
  } else {
    db.prepare('UPDATE conveyor_states SET riskScore = ?, riskLevel = ?, beltHealth = ?, maxCrackDepth = ?, estimatedRemainingDays = ? WHERE conveyorId = ?').run(
      state.riskScore ?? current.riskScore, 
      state.riskLevel ?? current.riskLevel, 
      state.beltHealth ?? current.beltHealth, 
      state.maxCrackDepth ?? current.maxCrackDepth, 
      state.estimatedRemainingDays ?? current.estimatedRemainingDays, 
      conveyorId
    );
  }
};
