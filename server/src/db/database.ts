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
    side TEXT NOT NULL CHECK(side IN ('left', 'right')),
    desc TEXT NOT NULL,
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS desk_blocks (
    desk_id TEXT NOT NULL,
    date TEXT NOT NULL,
    PRIMARY KEY (desk_id, date),
    FOREIGN KEY (desk_id) REFERENCES desks(id)
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    desk_id TEXT NOT NULL,
    desk_name TEXT NOT NULL,
    desk_desc TEXT NOT NULL,
    date TEXT NOT NULL,
    holder_name TEXT NOT NULL,
    holder_phone TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed')),
    amount REAL NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (desk_id) REFERENCES desks(id)
  );

  CREATE TABLE IF NOT EXISTS interest_signups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export default db;
