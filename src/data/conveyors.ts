import type { Conveyor } from '../types';

export const conveyors: Conveyor[] = [
  {
    id: 'CV-01',
    name: 'CV-01',
    location: 'Primary Crushing Plant',
    status: 'operational',
    totalLength: 2400,
  },
  {
    id: 'CV-02',
    name: 'CV-02',
    location: 'Secondary Screening',
    status: 'operational',
    totalLength: 1800,
  },
  {
    id: 'CV-03',
    name: 'CV-03',
    location: 'Stock Pile Transfer',
    status: 'maintenance',
    totalLength: 3200,
  },
  {
    id: 'CV-04',
    name: 'CV-04',
    location: 'Iron Ore Processing Unit',
    status: 'operational',
    totalLength: 2800,
  },
];

export const getConveyor = (id: string): Conveyor | undefined =>
  conveyors.find((c) => c.id === id);
