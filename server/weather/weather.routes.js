import { Router } from 'express';
import * as weatherService from './weather.service.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await weatherService.getWeather());
  } catch (err) {
    next(err);
  }
});

export default router;
