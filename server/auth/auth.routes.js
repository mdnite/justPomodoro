import { Router } from 'express';
import * as authService from './auth.service.js';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    await authService.logout();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
