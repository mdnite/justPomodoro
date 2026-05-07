import * as sessionsRepository from './sessions.repository.js';

// Validate input and persist a completed work session for the user.
export async function createSession(userId, { duration, type, completedAt }) {
  if (type !== 'work') {
    const err = new Error('Only work sessions can be saved');
    err.status = 400;
    throw err;
  }
  const numericDuration = Number(duration);
  if (!Number.isFinite(numericDuration) || numericDuration <= 0) {
    const err = new Error('Duration must be a positive number');
    err.status = 400;
    throw err;
  }
  const completed = completedAt ? new Date(completedAt) : new Date();
  return sessionsRepository.save(userId, numericDuration, type, completed);
}

// Return all sessions belonging to the user.
export async function getUserSessions(userId) {
  return sessionsRepository.findByUserId(userId);
}

// Return aggregate stats for the user's sessions.
export async function getSessionStats(userId) {
  return sessionsRepository.getStatsByUserId(userId);
}
