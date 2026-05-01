import pool from '../db/connection.js';

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM pomodoro_sessions ORDER BY completed_at DESC'
  );
  return rows;
}

export async function create(task_id, duration, type) {
  const [result] = await pool.query(
    'INSERT INTO pomodoro_sessions (task_id, duration, type, completed_at) VALUES (?, ?, ?, NOW())',
    [task_id ?? null, duration, type]
  );
  const [rows] = await pool.query(
    'SELECT * FROM pomodoro_sessions WHERE id = ?',
    [result.insertId]
  );
  return rows[0];
}

export async function getStats() {
  const [rows] = await pool.query(`
    SELECT
      COUNT(*) AS total_sessions,
      SUM(duration) AS total_minutes,
      SUM(type = 'work') AS work_sessions,
      SUM(type = 'short_break') AS short_breaks,
      SUM(type = 'long_break') AS long_breaks
    FROM pomodoro_sessions
  `);
  return rows[0];
}
