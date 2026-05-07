import pool from '../db/connection.js';

// Insert a completed session for a user and return the inserted row.
export async function save(userId, duration, type, completedAt) {
  const [result] = await pool.query(
    'INSERT INTO pomodoro_sessions (user_id, task_id, duration, type, completed_at) VALUES (?, NULL, ?, ?, ?)',
    [userId, duration, type, completedAt]
  );
  const [rows] = await pool.query(
    'SELECT * FROM pomodoro_sessions WHERE id = ?',
    [result.insertId]
  );
  return rows[0];
}

// Return all sessions for a user, newest first.
export async function findByUserId(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM pomodoro_sessions WHERE user_id = ? ORDER BY completed_at DESC',
    [userId]
  );
  return rows;
}

// Return aggregated session stats for a user (totals, today, this week).
export async function getStatsByUserId(userId) {
  const [rows] = await pool.query(
    `SELECT
       COUNT(*) AS total_sessions,
       COALESCE(SUM(duration), 0) DIV 60 AS total_focus_minutes,
       SUM(DATE(completed_at) = CURDATE()) AS sessions_today,
       SUM(YEARWEEK(completed_at, 1) = YEARWEEK(CURDATE(), 1)) AS sessions_this_week
     FROM pomodoro_sessions
     WHERE user_id = ? AND type = 'work'`,
    [userId]
  );
  const r = rows[0] ?? {};
  return {
    total_sessions: Number(r.total_sessions ?? 0),
    total_focus_minutes: Number(r.total_focus_minutes ?? 0),
    sessions_today: Number(r.sessions_today ?? 0),
    sessions_this_week: Number(r.sessions_this_week ?? 0),
  };
}
