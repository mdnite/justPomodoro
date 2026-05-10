import * as settingsRepository from './settings.repository.js';

const DEFAULTS = {
  work_duration: 25,
  short_break: 5,
  long_break: 15,
  sound_enabled: true,
  sessions_before_long_break: 4,
};

// Return the user's settings, or DEFAULTS if no row exists yet (read-only — does not seed the DB).
export async function getSettings(userId) {
  const existing = await settingsRepository.getByUserId(userId);
  return existing ?? DEFAULTS;
}

// Update the user's settings, falling back to defaults for any missing fields.
export async function updateSettings(userId, data) {
  const current = (await settingsRepository.getByUserId(userId)) ?? DEFAULTS;
  const merged = { ...current, ...data };
  return settingsRepository.update(userId, merged);
}
