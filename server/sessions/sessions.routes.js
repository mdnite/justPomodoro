import { Router } from 'express';
import * as sessionsService from './sessions.service.js';
// TODO: add update and delete functions for sessions, for now we only need to create them and get stats about them, so I'll leave that for later.
const router = Router();

// This is to get some stats about the sessions, like how many are active, how many have been created, etc.
router.get('/stats', async (_req, res, next) => {
  try {
    res.json(await sessionsService.getStats());
  } catch (err) {
    next(err);
  }
});

// Get all sessions, mostly for debugging purposes, will return a LOT of data lol.
router.get('/', async (_req, res, next) => {
  try {
    res.json(await sessionsService.getAllSessions());
  } catch (err) {
    next(err);
  }
});

// Create a new session
router.post('/', async (req, res, next) => {
  try {
    const session = await sessionsService.createSession(req.body);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

export default router;
