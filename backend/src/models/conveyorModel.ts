import db from '../database/db';
import type { Conveyor } from '../types';

export const getAllConveyors = (): Conveyor[] => {
  return db.prepare('SELECT * FROM conveyors').all() as Conveyor[];
};

export const getConveyorById = (id: string): Conveyor | undefined => {
  return db.prepare('SELECT * FROM conveyors WHERE id = ?').get(id) as Conveyor | undefined;
};
