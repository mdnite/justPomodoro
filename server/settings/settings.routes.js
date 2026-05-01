import { Router } from 'express';
import * as settingsService from './settings.service.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await settingsService.getSettings());
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    res.json(await settingsService.updateSettings(req.body));
  } catch (err) {
    next(err);
  }
});

export default router;
