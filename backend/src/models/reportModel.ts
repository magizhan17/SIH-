import db from '../database/db';
import type { Report } from '../types';

export const getReports = (conveyorId: string): Report[] => {
  return db.prepare('SELECT * FROM reports WHERE conveyorId = ? ORDER BY date DESC').all(conveyorId) as Report[];
};
