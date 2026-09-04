import db from '../database/db';
import type { Alert } from '../types';

export const getAlerts = (conveyorId: string): Alert[] => {
  return db.prepare('SELECT * FROM alerts WHERE conveyorId = ? ORDER BY timestamp DESC').all(conveyorId) as Alert[];
};

export const createAlert = (alert: Alert) => {
  db.prepare(`
    INSERT INTO alerts (id, conveyorId, severity, title, message, timestamp, acknowledged, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    alert.id, alert.conveyorId, alert.severity, alert.title, alert.message, alert.timestamp, alert.acknowledged ? 1 : 0, alert.category
  );
};

export const acknowledgeAlert = (id: string) => {
  db.prepare('UPDATE alerts SET acknowledged = 1 WHERE id = ?').run(id);
};
