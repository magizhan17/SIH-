import Database from 'better-sqlite3';
import path from 'path';

// Define the database file path
const dbPath = path.resolve(__dirname, '..', '..', 'cbh_monitor.db');

// Initialize the database connection
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// Define the schema
const schema = `
  CREATE TABLE IF NOT EXISTS conveyors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL,
    totalLength REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sensor_readings (
    id TEXT PRIMARY KEY,
    conveyorId TEXT NOT NULL,
    sensorType TEXT NOT NULL,
    name TEXT NOT NULL,
    value REAL NOT NULL,
    unit TEXT NOT NULL,
    status TEXT NOT NULL,
    trend TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (conveyorId) REFERENCES conveyors(id)
  );

  CREATE TABLE IF NOT EXISTS sensor_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    readingId TEXT NOT NULL,
    time TEXT NOT NULL,
    value REAL NOT NULL,
    FOREIGN KEY (readingId) REFERENCES sensor_readings(id)
  );

  CREATE TABLE IF NOT EXISTS laser_scans (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    conveyorId TEXT NOT NULL,
    position REAL NOT NULL,
    crackWidth REAL NOT NULL,
    crackDepth REAL NOT NULL,
    crackLength REAL NOT NULL,
    severity TEXT NOT NULL,
    confidence REAL NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (conveyorId) REFERENCES conveyors(id)
  );

  CREATE TABLE IF NOT EXISTS scan_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scanId TEXT NOT NULL,
    position REAL NOT NULL,
    depth REAL NOT NULL,
    FOREIGN KEY (scanId) REFERENCES laser_scans(id)
  );

  CREATE TABLE IF NOT EXISTS damage_events (
    id TEXT PRIMARY KEY,
    conveyorId TEXT NOT NULL,
    type TEXT NOT NULL,
    position REAL NOT NULL,
    depth REAL,
    length REAL,
    severity TEXT NOT NULL,
    detectedDate TEXT NOT NULL,
    recommendedAction TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (conveyorId) REFERENCES conveyors(id)
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    conveyorId TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    acknowledged INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    FOREIGN KEY (conveyorId) REFERENCES conveyors(id)
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conveyorId TEXT NOT NULL UNIQUE,
    estimatedDays REAL NOT NULL,
    confidence REAL NOT NULL,
    recommendedAction TEXT NOT NULL,
    urgency TEXT NOT NULL,
    FOREIGN KEY (conveyorId) REFERENCES conveyors(id)
  );

  CREATE TABLE IF NOT EXISTS prediction_timelines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    predictionConveyorId TEXT NOT NULL,
    day INTEGER NOT NULL,
    health REAL NOT NULL,
    isPrediction INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (predictionConveyorId) REFERENCES predictions(conveyorId)
  );

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    conveyorId TEXT NOT NULL,
    inspectionType TEXT NOT NULL,
    damageType TEXT NOT NULL,
    riskScore REAL NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    summary TEXT NOT NULL,
    FOREIGN KEY (conveyorId) REFERENCES conveyors(id)
  );

  CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value REAL NOT NULL
  );

  CREATE TABLE IF NOT EXISTS conveyor_states (
    conveyorId TEXT PRIMARY KEY,
    riskScore REAL NOT NULL,
    riskLevel TEXT NOT NULL,
    beltHealth REAL NOT NULL,
    maxCrackDepth REAL NOT NULL,
    estimatedRemainingDays REAL NOT NULL,
    FOREIGN KEY (conveyorId) REFERENCES conveyors(id)
  );
`;

// Initialize schema
export const initDb = () => {
  db.exec(schema);
};

export default db;
