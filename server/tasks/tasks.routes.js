import { Router } from 'express';
import * as tasksService from './tasks.service.js';
import { authenticate } from '../auth/auth.middleware.js';

const router = Router();

// Return all tasks for the authenticated user.
router.get('/', authenticate, async (req, res, next) => {
  try {
    res.json(await tasksService.getUserTasks(req.user.id));
  } catch (err) {
    next(err);
  }
});

// Create a task for the authenticated user.
router.post('/', authenticate, async (req, res, next) => {
  try {
    const task = await tasksService.createTask(req.user.id, req.body.title);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

// Update a task owned by the authenticated user.
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await tasksService.updateTask(req.user.id, req.params.id, req.body);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// Delete a task owned by the authenticated user.
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await tasksService.deleteTask(req.user.id, req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
