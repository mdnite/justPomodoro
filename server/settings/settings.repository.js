import pool from '../db/connection.js';

export async function find() {
  const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
  return rows[0] ?? null;
}

export async function upsert({ work_duration, short_break, long_break, sound_enabled }) {
  await pool.query(
    `INSERT INTO settings (id, work_duration, short_break, long_break, sound_enabled)
     VALUES (1, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       work_duration = VALUES(work_duration),
       short_break   = VALUES(short_break),
       long_break    = VALUES(long_break),
       sound_enabled = VALUES(sound_enabled)`,
    [work_duration, short_break, long_break, sound_enabled]
  );
  return find();
}
