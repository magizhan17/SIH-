import db, { initDb } from './db';
import { conveyors } from '../data/conveyors';
import { getSensorsNormal } from '../data/sensors';
import { laserScans } from '../data/laserScans';
import { damages } from '../data/damages';
import { alerts } from '../data/alerts';
import { reports } from '../data/reports';
import { predictions } from '../data/predictions';
import { SystemSettings } from '../types';

console.log('Initializing database schema...');
initDb();

console.log('Seeding data...');

try {
  db.prepare('BEGIN').run();

  // 1. Conveyors
  const insertConveyor = db.prepare('INSERT OR IGNORE INTO conveyors (id, name, location, status, totalLength) VALUES (?, ?, ?, ?, ?)');
  for (const c of conveyors) {
    insertConveyor.run(c.id, c.name, c.location, c.status, c.totalLength);
  }

  // 2. Sensors (for CV-04 default)
  const insertSensor = db.prepare('INSERT OR IGNORE INTO sensor_readings (id, conveyorId, sensorType, name, value, unit, status, trend, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertHistory = db.prepare('INSERT OR IGNORE INTO sensor_history (readingId, time, value) VALUES (?, ?, ?)');
  
  const normalSensors = getSensorsNormal();
  const now = new Date().toISOString();
  
  for (const [key, sensor] of Object.entries(normalSensors)) {
    insertSensor.run(sensor.id, 'CV-04', key, sensor.name, sensor.value, sensor.unit, sensor.status, sensor.trend, now);
    for (const h of sensor.history) {
      insertHistory.run(sensor.id, h.time, h.value);
    }
  }

  // 3. Laser Scans
  const insertScan = db.prepare('INSERT OR IGNORE INTO laser_scans (id, date, conveyorId, position, crackWidth, crackDepth, crackLength, severity, confidence, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertProfile = db.prepare('INSERT OR IGNORE INTO scan_profiles (scanId, position, depth) VALUES (?, ?, ?)');
  
  for (const scan of laserScans) {
    insertScan.run(scan.id, scan.date, scan.conveyorId, scan.position, scan.crackWidth, scan.crackDepth, scan.crackLength, scan.severity, scan.confidence, scan.status);
    for (const p of scan.depthProfile) {
      insertProfile.run(scan.id, p.position, p.depth);
    }
  }

  // 4. Damages
  const insertDamage = db.prepare('INSERT OR IGNORE INTO damage_events (id, conveyorId, type, position, depth, length, severity, detectedDate, recommendedAction, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  for (const d of damages) {
    insertDamage.run(d.id, d.conveyorId, d.type, d.position, d.depth || null, d.length || null, d.severity, d.detectedDate, d.recommendedAction, d.status);
  }

  // 5. Alerts
  const insertAlert = db.prepare('INSERT OR IGNORE INTO alerts (id, conveyorId, severity, title, message, timestamp, acknowledged, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const a of alerts) {
    insertAlert.run(a.id, a.conveyorId, a.severity, a.title, a.message, a.timestamp, a.acknowledged ? 1 : 0, a.category);
  }

  // 6. Predictions
  const insertPrediction = db.prepare('INSERT OR IGNORE INTO predictions (conveyorId, estimatedDays, confidence, recommendedAction, urgency) VALUES (?, ?, ?, ?, ?)');
  const insertTimeline = db.prepare('INSERT OR IGNORE INTO prediction_timelines (predictionConveyorId, day, health, isPrediction) VALUES (?, ?, ?, ?)');
  
  for (const p of predictions) {
    insertPrediction.run(p.conveyorId, p.estimatedDays, p.confidence, p.recommendedAction, p.urgency);
    for (const t of p.predictedHealthTimeline) {
      insertTimeline.run(p.conveyorId, t.day, t.health, t.isPrediction ? 1 : 0);
    }
  }

  // 7. Reports
  const insertReport = db.prepare('INSERT OR IGNORE INTO reports (id, conveyorId, inspectionType, damageType, riskScore, date, status, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  for (const r of reports) {
    insertReport.run(r.id, r.conveyorId, r.inspectionType, r.damageType, r.riskScore, r.date, r.status, r.summary);
  }

  // 8. Default System Settings
  const defaultSettings: SystemSettings = {
    warningRiskScore: 60,
    criticalRiskScore: 80,
    crackDepthWarning: 2.0,
    crackDepthCritical: 4.0,
    vibrationWarning: 5.0,
    vibrationCritical: 8.0,
    temperatureWarning: 70,
    temperatureCritical: 90,
    tensionWarning: 90,
    tensionCritical: 110,
  };
  const insertSetting = db.prepare('INSERT OR IGNORE INTO system_settings (key, value) VALUES (?, ?)');
  for (const [key, value] of Object.entries(defaultSettings)) {
    insertSetting.run(key, value as number);
  }

  // 9. Initial Conveyor State for CV-04
  const insertState = db.prepare('INSERT OR IGNORE INTO conveyor_states (conveyorId, riskScore, riskLevel, beltHealth, maxCrackDepth, estimatedRemainingDays) VALUES (?, ?, ?, ?, ?, ?)');
  insertState.run('CV-04', 72, 'high-risk', 68, 3.2, 18);

  db.prepare('COMMIT').run();
  console.log('Database seeded successfully.');
} catch (error) {
  db.prepare('ROLLBACK').run();
  console.error('Error seeding database:', error);
}
