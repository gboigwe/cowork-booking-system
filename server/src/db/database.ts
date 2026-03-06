import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', 'data.db');

const db = new Database(dbPath);

// Enable WAL mode for better concurrent performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS desks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('individual', 'team')),
    position_index INTEGER NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    desk_id TEXT NOT NULL,
    desk_name TEXT NOT NULL,
    desk_type TEXT NOT NULL,
    membership_tier TEXT,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    hours REAL NOT NULL,
    total_cost REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (desk_id) REFERENCES desks(id)
  );
`);

export default db;
