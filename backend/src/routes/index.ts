import { Router } from 'express';
import { getAllConveyors, getConveyorById } from '../models/conveyorModel';
import { getSensorsForConveyor } from '../models/sensorModel';
import { getLaserScans, createLaserScan } from '../models/laserScanModel';
import { getDamages, createDamage } from '../models/damageModel';
import { getAlerts, createAlert, acknowledgeAlert } from '../models/alertModel';
import { getSettings, updateSettings } from '../models/settingsModel';
import { getReports } from '../models/reportModel';
import { getState, updateState } from '../models/stateModel';
import { generatePrediction } from '../services/predictionService';
import { setSimulationMode } from '../services/sensorSimulationService';
import { v4 as uuidv4 } from 'uuid';
import { getSensorsCritical } from '../data/sensors';

const router = Router();

// Conveyors
router.get('/conveyors', (req, res) => {
  res.json(getAllConveyors());
});
router.get('/conveyors/:id', (req, res) => {
  const c = getConveyorById(req.params.id);
  if (c) res.json(c);
  else res.status(404).json({ error: 'Not found' });
});

// Sensors
router.get('/sensors/:conveyorId/latest', (req, res) => {
  res.json(getSensorsForConveyor(req.params.conveyorId));
});

// Laser Scans
router.get('/laser-scans/:conveyorId', (req, res) => {
  res.json(getLaserScans(req.params.conveyorId));
});
router.post('/laser-scans', (req, res) => {
  createLaserScan(req.body);
  res.status(201).json({ success: true });
});

// Damages
router.get('/damage-events/:conveyorId', (req, res) => {
  res.json(getDamages(req.params.conveyorId));
});
router.post('/damage-events', (req, res) => {
  createDamage(req.body);
  res.status(201).json({ success: true });
});

// Alerts
router.get('/alerts/:conveyorId', (req, res) => {
  res.json(getAlerts(req.params.conveyorId));
});
router.post('/alerts', (req, res) => {
  createAlert(req.body);
  res.status(201).json({ success: true });
});
router.put('/alerts/:id/acknowledge', (req, res) => {
  acknowledgeAlert(req.params.id);
  res.json({ success: true });
});

// Emergency Alert (Simulated)
router.post('/alerts/emergency', (req, res) => {
  console.log(`[EMERGENCY] Emergency actions triggered for conveyor ${req.body.conveyorId}`);
  res.json({ success: true, message: 'Emergency actions triggered (Simulation)' });
});

// Reports
router.get('/reports/:conveyorId', (req, res) => {
  res.json(getReports(req.params.conveyorId));
});

// Settings
router.get('/settings', (req, res) => {
  res.json(getSettings());
});
router.put('/settings', (req, res) => {
  updateSettings(req.body);
  res.json({ success: true });
});

// Risk Score / State
router.get('/risk-score/:conveyorId', (req, res) => {
  res.json(getState(req.params.conveyorId) || { riskScore: 0 });
});

// Predictions
router.get('/predictions/:conveyorId', (req, res) => {
  res.json(generatePrediction(req.params.conveyorId) || {});
});

// Simulation Control
router.post('/simulation/damage', (req, res) => {
  setSimulationMode(true);
  updateState('CV-04', {
    riskScore: 91,
    riskLevel: 'critical',
    beltHealth: 42,
    maxCrackDepth: 4.8,
    estimatedRemainingDays: 5
  });
  
  // Create a critical alert instantly
  createAlert({
    id: `ALT-${uuidv4().substring(0, 8).toUpperCase()}`,
    conveyorId: 'CV-04',
    severity: 'critical',
    title: 'Critical Risk Level Detected',
    message: 'Risk score has reached 91 (Critical). Immediate inspection required.',
    timestamp: new Date().toISOString(),
    acknowledged: false,
    category: 'System'
  });

  res.json({ success: true, message: 'Simulation enabled' });
});

router.post('/simulation/reset', (req, res) => {
  setSimulationMode(false);
  updateState('CV-04', {
    riskScore: 72,
    riskLevel: 'high-risk',
    beltHealth: 68,
    maxCrackDepth: 3.2,
    estimatedRemainingDays: 18
  });
  res.json({ success: true, message: 'Simulation reset' });
});

export default router;
