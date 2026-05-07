import pool from '../db/connection.js';

// Return all tasks belonging to a user, newest first.
export async function findAllByUserId(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
}

// Return a single task by id, scoped to the owning user.
export async function findByIdForUser(userId, id) {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return rows[0] ?? null;
}

// Insert a new task for the user and return the inserted row.
export async function create(userId, title) {
  const [result] = await pool.query(
    'INSERT INTO tasks (user_id, title, is_completed) VALUES (?, ?, false)',
    [userId, title]
  );
  return findByIdForUser(userId, result.insertId);
}

// Update title and/or is_completed for a task owned by the user.
export async function update(userId, id, { title, is_completed }) {
  await pool.query(
    'UPDATE tasks SET title = COALESCE(?, title), is_completed = COALESCE(?, is_completed) WHERE id = ? AND user_id = ?',
    [title ?? null, is_completed ?? null, id, userId]
  );
  return findByIdForUser(userId, id);
}

// Delete a task owned by the user; returns true if a row was removed.
export async function remove(userId, id) {
  const [result] = await pool.query(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [id, userId]
  );
  return result.affectedRows > 0;
}
