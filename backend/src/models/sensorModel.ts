import db from '../database/db';
import type { SensorReading } from '../types';

export const getSensorsForConveyor = (conveyorId: string): Record<string, SensorReading> => {
  const readings = db.prepare('SELECT * FROM sensor_readings WHERE conveyorId = ?').all(conveyorId) as any[];
  
  const result: Record<string, SensorReading> = {};
  for (const r of readings) {
    const history = db.prepare('SELECT time, value FROM sensor_history WHERE readingId = ? ORDER BY id DESC LIMIT 12').all(r.id) as { time: string, value: number }[];
    
    result[r.sensorType] = {
      id: r.id,
      name: r.name,
      value: r.value,
      unit: r.unit,
      status: r.status,
      trend: r.trend,
      history: history.reverse()
    };
  }
  
  return result;
};

export const updateSensorReading = (reading: any) => {
  db.prepare('UPDATE sensor_readings SET value = ?, status = ?, trend = ?, timestamp = ? WHERE id = ?').run(
    reading.value, reading.status, reading.trend, reading.timestamp, reading.id
  );
  
  // Keep last 24 history points
  db.prepare('INSERT INTO sensor_history (readingId, time, value) VALUES (?, ?, ?)').run(
    reading.id, new Date(reading.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), reading.value
  );
  
  db.prepare(`
    DELETE FROM sensor_history 
    WHERE readingId = ? AND id NOT IN (
      SELECT id FROM sensor_history WHERE readingId = ? ORDER BY id DESC LIMIT 24
    )
  `).run(reading.id, reading.id);
};
