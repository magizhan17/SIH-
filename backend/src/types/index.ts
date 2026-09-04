// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type RiskLevel = 'healthy' | 'monitor' | 'high-risk' | 'critical';
export type SeverityLevel = 'low' | 'moderate' | 'high' | 'critical';
export type StatusType = 'normal' | 'warning' | 'critical' | 'offline';
export type AlertSeverity = 'info' | 'warning' | 'high' | 'critical';
export type ReportStatus = 'open' | 'reviewed' | 'closed' | 'pending';

export interface Conveyor {
  id: string;
  name: string;
  location: string;
  status: 'operational' | 'maintenance' | 'stopped' | 'critical';
  totalLength: number; // meters
}

export interface SensorReading {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: StatusType;
  trend: 'up' | 'down' | 'stable';
  history: { time: string; value: number }[];
}

export interface ConveyorState {
  conveyorId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  beltHealth: number; // 0-100
  maxCrackDepth: number; // mm
  estimatedRemainingDays: number;
  damageScore: number;
  sensors: {
    vibration: SensorReading;
    temperature: SensorReading;
    beltSpeed: SensorReading;
    beltTension: SensorReading;
    load: SensorReading;
    misalignment: SensorReading;
  };
}

export interface LaserScan {
  id: string;
  date: string;
  conveyorId: string;
  position: number; // meters
  crackWidth: number; // mm
  crackDepth: number; // mm
  crackLength: number; // mm
  severity: SeverityLevel;
  confidence: number; // 0-100
  status: 'pending' | 'reviewed' | 'action-required';
  depthProfile: { position: number; depth: number }[];
}

export interface DamageEvent {
  id: string;
  conveyorId: string;
  type: 'crack' | 'wear' | 'joint-rupture' | 'delamination' | 'misalignment';
  position: number; // meters
  depth?: number; // mm
  length?: number; // mm
  severity: SeverityLevel;
  detectedDate: string;
  recommendedAction: string;
  status: 'active' | 'monitoring' | 'repaired';
}

export interface Alert {
  id: string;
  conveyorId: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  category: string;
}

export interface MaintenancePrediction {
  conveyorId: string;
  estimatedDays: number;
  confidence: number; // 0-100
  predictedHealthTimeline: { day: number; health: number; isPrediction: boolean }[];
  recommendedAction: string;
  urgency: 'low' | 'medium' | 'high' | 'immediate';
}

export interface Report {
  id: string;
  conveyorId: string;
  inspectionType: string;
  damageType: string;
  riskScore: number;
  date: string;
  status: ReportStatus;
  summary: string;
}

export interface RiskFactors {
  crackDepth: number;
  beltTension: number;
  vibration: number;
  wear: number;
  misalignment: number;
  temperature: number;
}

export interface SystemSettings {
  warningRiskScore: number;
  criticalRiskScore: number;
  crackDepthWarning: number;
  crackDepthCritical: number;
  vibrationWarning: number;
  vibrationCritical: number;
  temperatureWarning: number;
  temperatureCritical: number;
  tensionWarning: number;
  tensionCritical: number;
}
