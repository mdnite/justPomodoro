import { Router } from 'express';
import * as tasksService from './tasks.service.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await tasksService.getAllTasks());
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const task = await tasksService.createTask(req.body.title);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const task = await tasksService.updateTask(req.params.id, req.body);
    res.json(task);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await tasksService.deleteTask(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
