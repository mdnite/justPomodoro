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
    const {token, user} = await authService.login(email, password);
    
    // use Cookies for authentication (stores token in cookie)
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    res.clearCookie('token');
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
