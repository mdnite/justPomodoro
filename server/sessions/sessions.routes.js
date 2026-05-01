import { Router } from 'express';
import * as sessionsService from './sessions.service.js';

const router = Router();

router.get('/stats', async (_req, res, next) => {
  try {
    res.json(await sessionsService.getStats());
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    res.json(await sessionsService.getAllSessions());
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const session = await sessionsService.createSession(req.body);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

export default router;
