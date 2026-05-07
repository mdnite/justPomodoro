import { Router } from 'express';
import * as settingsService from './settings.service.js';

const router = Router();

// Return the authenticated user's settings.
router.get('/', async (req, res, next) => {
  try {
    res.json(await settingsService.getSettings(req.user.id));
  } catch (err) {
    next(err);
  }
});

// Update the authenticated user's settings.
router.put('/', async (req, res, next) => {
  try {
    res.json(await settingsService.updateSettings(req.user.id, req.body));
  } catch (err) {
    next(err);
  }
});

export default router;
