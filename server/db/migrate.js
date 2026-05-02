import pool from './connection.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
// Manually construct __dirname for ES modules to locate the migrations directory. 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

//Creates a table to track which migrations have been run
async function ensureMigrationsTable(conn) {
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS migrations_log (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
//Fast lookup structure used to skip files that have already been applied
async function getRunMigrations(conn) {
  const [rows] = await conn.execute('SELECT filename FROM migrations_log');
  return new Set(rows.map((r) => r.filename));
}

async function runMigrations() {
  const conn = await pool.getConnection();
  try {
    await ensureMigrationsTable(conn); //gotta make sure the log table exists before we can check it

    const allFiles = await fs.readdir(MIGRATIONS_DIR);
    const sqlFiles = allFiles.filter((f) => f.endsWith('.sql')).sort();

    if (sqlFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }

    const already = await getRunMigrations(conn);
    const pending = sqlFiles.filter((f) => !already.has(f));

    if (pending.length === 0) {
      console.log('But where the migration at, twin?');
      return;
    }

    for (const filename of pending) {
      const filepath = path.join(MIGRATIONS_DIR, filename);
      const sql = await fs.readFile(filepath, 'utf8');

      try {
        await conn.beginTransaction();
        // mysql2 doesn't support multi-statement execute by default, so split on ';' and run one by one.
        const statements = sql
          .split(';')
          .map((s) => s.trim())
          .filter(Boolean);

        for (const statement of statements) {
          await conn.execute(statement);
        }

        await conn.execute('INSERT INTO migrations_log (filename) VALUES (?)', [filename]);
        await conn.commit();
        console.log(`  ran: ${filename}`);
      } catch (err) {
        await conn.rollback();
        console.error(`  FAILED: ${filename}`);
        console.error(`  ${err.message}`);
        process.exit(1);
      }
    }

    console.log(`Done. ${pending.length} migration(s) applied.`);
  } finally {
    conn.release();
    await pool.end();
  }
}

await runMigrations();
