import * as sessionsRepository from './sessions.repository.js';

export async function getAllSessions() {
  return sessionsRepository.findAll();
}

export async function createSession({ task_id, duration, type }) {
  return sessionsRepository.create(task_id, duration, type);
}

export async function deleteSession(id) {
  return sessionsRepository.remove(id);
}

export async function getStats() {
  return sessionsRepository.getStats();
}
