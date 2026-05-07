import * as settingsRepository from './settings.repository.js';

const DEFAULTS = {
  work_duration: 25,
  short_break: 5,
  long_break: 15,
  sound_enabled: true,
  sessions_before_long_break: 4,
};

// Return the user's settings, or seed-and-return defaults if they have none yet.
export async function getSettings(userId) {
  const existing = await settingsRepository.getByUserId(userId);
  if (existing) return existing;
  return settingsRepository.update(userId, DEFAULTS);
}

// Update the user's settings, falling back to defaults for any missing fields.
export async function updateSettings(userId, data) {
  const current = (await settingsRepository.getByUserId(userId)) ?? DEFAULTS;
  const merged = { ...DEFAULTS, ...current, ...data };
  return settingsRepository.update(userId, merged);
}
