import { Router } from 'express';
import pool from '../db/connection.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { title } = req.body;
    const [result] = await pool.query(
      'INSERT INTO tasks (title, is_completed) VALUES (?, false)',
      [title]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, is_completed } = req.body;
    await pool.query(
      'UPDATE tasks SET title = COALESCE(?, title), is_completed = COALESCE(?, is_completed) WHERE id = ?',
      [title ?? null, is_completed ?? null, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
