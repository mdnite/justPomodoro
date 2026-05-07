import * as tasksRepository from './tasks.repository.js';

// Return all tasks belonging to the user.
export async function getUserTasks(userId) {
  return tasksRepository.findAllByUserId(userId);
}

// Validate the title and create a task for the user.
export async function createTask(userId, title) {
  const trimmed = typeof title === 'string' ? title.trim() : '';
  if (!trimmed) {
    const err = new Error('Task title is required');
    err.status = 400;
    throw err;
  }
  return tasksRepository.create(userId, trimmed);
}

// Update a task owned by the user, 404 if not found.
export async function updateTask(userId, id, fields) {
  const updated = await tasksRepository.update(userId, id, fields);
  if (!updated) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }
  return updated;
}

// Delete a task owned by the user, 404 if not found.
export async function deleteTask(userId, id) {
  const removed = await tasksRepository.remove(userId, id);
  if (!removed) {
    const err = new Error('Task not found');
    err.status = 404;
    throw err;
  }
}
