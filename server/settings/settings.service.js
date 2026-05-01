import * as settingsRepository from './settings.repository.js';

export async function getSettings() {
  return settingsRepository.find();
}

export async function updateSettings(data) {
  return settingsRepository.upsert(data);
}
