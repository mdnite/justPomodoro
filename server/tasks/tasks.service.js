import * as tasksRepository from './tasks.repository.js';

export async function getAllTasks() {
  return tasksRepository.findAll();
}

export async function createTask(title) {
  return tasksRepository.create(title);
}

export async function updateTask(id, fields) {
  return tasksRepository.update(id, fields);
}

export async function deleteTask(id) {
  return tasksRepository.remove(id);
}
