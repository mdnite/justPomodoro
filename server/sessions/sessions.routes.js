import { Router } from 'express';
import * as sessionsService from './sessions.service.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

// Return aggregated stats for the authenticated user.
router.get('/stats', authenticate, async (req, res, next) => {
  try {
    res.json(await sessionsService.getSessionStats(req.user.id));
  } catch (err) {
    next(err);
  }
});

// Return all sessions for the authenticated user.
router.get('/', authenticate, async (req, res, next) => {
  try {
    res.json(await sessionsService.getUserSessions(req.user.id));
  } catch (err) {
    next(err);
  }
});

// Save a completed work session for the authenticated user.
router.post('/', authenticate, async (req, res, next) => {
  try {
    const session = await sessionsService.createSession(req.user.id, req.body);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

export default router;
