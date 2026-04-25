import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    res.json(rows[0] ?? null);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { work_duration, short_break, long_break, sound_enabled } = req.body;
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
    const [rows] = await pool.query('SELECT * FROM settings WHERE id = 1');
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
