import axios from 'axios';
import type { 
  Conveyor, SensorReading, LaserScan, DamageEvent, Alert, 
  MaintenancePrediction, Report, SystemSettings 
} from '../types';

const API_BASE = '/api/v1';

export const api = {
  // Conveyors
  getConveyors: () => axios.get<Conveyor[]>(`${API_BASE}/conveyors`).then(res => res.data),
  
  // Sensors
  getLatestSensors: (conveyorId: string) => axios.get<Record<string, SensorReading>>(`${API_BASE}/sensors/${conveyorId}/latest`).then(res => res.data),
  
  // Laser Scans
  getLaserScans: (conveyorId: string) => axios.get<LaserScan[]>(`${API_BASE}/laser-scans/${conveyorId}`).then(res => res.data),
  
  // Damages
  getDamages: (conveyorId: string) => axios.get<DamageEvent[]>(`${API_BASE}/damage-events/${conveyorId}`).then(res => res.data),
  
  // Alerts
  getAlerts: (conveyorId: string) => axios.get<Alert[]>(`${API_BASE}/alerts/${conveyorId}`).then(res => res.data),
  acknowledgeAlert: (id: string) => axios.put(`${API_BASE}/alerts/${id}/acknowledge`).then(res => res.data),
  triggerEmergency: (conveyorId: string) => axios.post(`${API_BASE}/alerts/emergency`, { conveyorId }).then(res => res.data),
  
  // Predictions
  getPrediction: (conveyorId: string) => axios.get<MaintenancePrediction>(`${API_BASE}/predictions/${conveyorId}`).then(res => res.data),
  
  // Reports
  getReports: (conveyorId: string) => axios.get<Report[]>(`${API_BASE}/reports/${conveyorId}`).then(res => res.data),
  
  // Settings
  getSettings: () => axios.get<SystemSettings>(`${API_BASE}/settings`).then(res => res.data),
  updateSettings: (settings: Partial<SystemSettings>) => axios.put(`${API_BASE}/settings`, settings).then(res => res.data),
  
  // Simulation Controls
  simulateDamage: () => axios.post(`${API_BASE}/simulation/damage`).then(res => res.data),
  resetSimulation: () => axios.post(`${API_BASE}/simulation/reset`).then(res => res.data)
};
