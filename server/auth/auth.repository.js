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

export async function findByGoogleId(googleId) {
  const [rows] = await pool.query('SELECT * FROM users WHERE google_id = ?', [googleId]);
  return rows[0] ?? null;
}

export async function linkGoogleId(userId, googleId) {
  await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [googleId, userId]);
}

export async function createGoogleUser(email, googleId) {
  const [result] = await pool.query('INSERT INTO users (email, google_id) VALUES (?, ?)', [email, googleId]);
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
  return rows[0];
}
