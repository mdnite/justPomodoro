import pool from '../db/connection.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
  return rows;
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows[0] ?? null;
}

export async function create(title) {
  const [result] = await pool.query(
    'INSERT INTO tasks (title, is_completed) VALUES (?, false)',
    [title]
  );
  return findById(result.insertId);
}

export async function update(id, { title, is_completed }) {
  await pool.query(
    'UPDATE tasks SET title = COALESCE(?, title), is_completed = COALESCE(?, is_completed) WHERE id = ?',
    [title ?? null, is_completed ?? null, id]
  );
  return findById(id);
}

export async function remove(id) {
  await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
}
