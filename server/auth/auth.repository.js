import pool from '../db/connection.js';

export async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] ?? null;
}

export async function create(email, passwordHash) {
  const [result] = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );
  const [rows] = await pool.query('SELECT id, email, created_at FROM users WHERE id = ?', [result.insertId]);
  return rows[0];
}
