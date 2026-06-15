import pool from '../db/connection.js';

// Return the settings row for a user, or null if none exists yet.
export async function getByUserId(userId) {
  const [rows] = await pool.query(
    'SELECT id, user_id, work_duration, short_break, long_break, sound_enabled, sessions_before_long_break, alarm_sound, alarm_volume FROM settings WHERE user_id = ?',
    [userId]
  );
  return rows[0] ?? null;
}

// Insert or update the settings row for a user, then return the updated row.
export async function update(userId, { work_duration, short_break, long_break, sound_enabled, sessions_before_long_break, alarm_sound, alarm_volume }) {
  await pool.query(
    `INSERT INTO settings (user_id, work_duration, short_break, long_break, sound_enabled, sessions_before_long_break, alarm_sound, alarm_volume)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       work_duration = VALUES(work_duration),
       short_break   = VALUES(short_break),
       long_break    = VALUES(long_break),
       sound_enabled = VALUES(sound_enabled),
       sessions_before_long_break = VALUES(sessions_before_long_break),
       alarm_sound = VALUES(alarm_sound),
       alarm_volume = VALUES(alarm_volume)`,
    [userId, work_duration, short_break, long_break, sound_enabled, sessions_before_long_break, alarm_sound, alarm_volume]
  );
  return getByUserId(userId);
}
