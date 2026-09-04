import db from '../database/db';
import type { LaserScan } from '../types';

export const getLaserScans = (conveyorId: string): LaserScan[] => {
  const scans = db.prepare('SELECT * FROM laser_scans WHERE conveyorId = ? ORDER BY date DESC').all(conveyorId) as any[];
  
  return scans.map(s => {
    const profile = db.prepare('SELECT position, depth FROM scan_profiles WHERE scanId = ?').all(s.id) as {position: number, depth: number}[];
    return {
      ...s,
      depthProfile: profile
    } as LaserScan;
  });
};

export const createLaserScan = (scan: LaserScan) => {
  db.prepare(`
    INSERT INTO laser_scans (id, date, conveyorId, position, crackWidth, crackDepth, crackLength, severity, confidence, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    scan.id, scan.date, scan.conveyorId, scan.position, scan.crackWidth, scan.crackDepth, scan.crackLength, scan.severity, scan.confidence, scan.status
  );
  
  const insertProfile = db.prepare('INSERT INTO scan_profiles (scanId, position, depth) VALUES (?, ?, ?)');
  for (const p of scan.depthProfile) {
    insertProfile.run(scan.id, p.position, p.depth);
  }
};
