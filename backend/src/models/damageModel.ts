import db from '../database/db';
import type { DamageEvent } from '../types';

export const getDamages = (conveyorId: string): DamageEvent[] => {
  return db.prepare('SELECT * FROM damage_events WHERE conveyorId = ? ORDER BY detectedDate DESC').all(conveyorId) as DamageEvent[];
};

export const createDamage = (damage: DamageEvent) => {
  db.prepare(`
    INSERT INTO damage_events (id, conveyorId, type, position, depth, length, severity, detectedDate, recommendedAction, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    damage.id, damage.conveyorId, damage.type, damage.position, damage.depth || null, damage.length || null, damage.severity, damage.detectedDate, damage.recommendedAction, damage.status
  );
};
