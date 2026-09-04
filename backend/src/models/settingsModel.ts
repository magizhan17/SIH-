import db from '../database/db';
import type { SystemSettings } from '../types';

export const getSettings = (): SystemSettings => {
  const rows = db.prepare('SELECT key, value FROM system_settings').all() as {key: string, value: number}[];
  const settings: any = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings as SystemSettings;
};

export const updateSettings = (settings: Partial<SystemSettings>) => {
  const update = db.prepare('UPDATE system_settings SET value = ? WHERE key = ?');
  const insert = db.prepare('INSERT OR IGNORE INTO system_settings (key, value) VALUES (?, ?)');
  
  db.transaction(() => {
    for (const [key, value] of Object.entries(settings)) {
      if (value !== undefined) {
        insert.run(key, value);
        update.run(value, key);
      }
    }
  })();
};
