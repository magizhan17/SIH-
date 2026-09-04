import { getSensorsForConveyor, updateSensorReading } from '../models/sensorModel';
import { getState, updateState } from '../models/stateModel';
import { calculateRiskScore } from './riskCalculationService';
import { evaluateAlerts } from './alertEngineService';
import { getSensorsCritical, getSensorsNormal } from '../data/sensors'; // For base values

let simulationMode = false;

export const setSimulationMode = (critical: boolean) => {
  simulationMode = critical;
};

export const getSimulationMode = () => simulationMode;

// Random walk function
const vary = (base: number, variance = 0.05) => {
  return parseFloat((base * (1 + (Math.random() - 0.5) * variance)).toFixed(2));
};

export const simulateSensorTick = (conveyorId: string) => {
  const currentSensors = getSensorsForConveyor(conveyorId);
  if (Object.keys(currentSensors).length === 0) return null;

  // Use base values to anchor the random walk so it doesn't drift too far
  const baseSensors = simulationMode ? getSensorsCritical() : getSensorsNormal();
  
  const updatedSensors: any = {};
  const now = new Date().toISOString();

  // Simulate new values
  for (const [key, sensor] of Object.entries(currentSensors)) {
    const baseVal = baseSensors[key]?.value || sensor.value;
    const newVal = vary(baseVal, simulationMode ? 0.08 : 0.03); // higher variance in critical mode
    
    // Determine trend
    const trend = newVal > sensor.value ? 'up' : newVal < sensor.value ? 'down' : 'stable';
    
    const updated = {
      ...sensor,
      value: newVal,
      trend,
      timestamp: now
    };
    updateSensorReading(updated);
    updatedSensors[key] = updated;
  }

  // Calculate new risk score
  const currentState = getState(conveyorId) || { maxCrackDepth: 0, beltHealth: 100, estimatedRemainingDays: 100 };
  const factors = {
    crackDepth: currentState.maxCrackDepth || 0,
    beltTension: updatedSensors.beltTension.value,
    vibration: updatedSensors.vibration.value,
    wear: 100 - (currentState.beltHealth || 100), // convert health to wear %
    misalignment: updatedSensors.misalignment.value,
    temperature: updatedSensors.temperature.value
  };

  const risk = calculateRiskScore(factors);
  
  // Update state
  updateState(conveyorId, {
    riskScore: risk.score,
    riskLevel: risk.level,
  });

  // Check alerts
  const newAlert = evaluateAlerts(conveyorId);

  return {
    sensors: updatedSensors,
    riskScore: risk.score,
    beltHealth: currentState.beltHealth,
    newAlert
  };
};
