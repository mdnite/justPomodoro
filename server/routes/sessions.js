import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM pomodoro_sessions ORDER BY completed_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { task_id, duration, type } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pomodoro_sessions (task_id, duration, type, completed_at) VALUES (?, ?, ?, NOW())',
      [task_id ?? null, duration, type]
    );
    const [rows] = await pool.query(
      'SELECT * FROM pomodoro_sessions WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        COUNT(*) AS total_sessions,
        SUM(duration) AS total_minutes,
        SUM(type = 'work') AS work_sessions,
        SUM(type = 'short_break') AS short_breaks,
        SUM(type = 'long_break') AS long_breaks
      FROM pomodoro_sessions
    `);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
