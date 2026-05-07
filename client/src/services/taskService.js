const base = '/api/tasks';

// Throw on non-2xx responses, otherwise return parsed JSON.
async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Something went wrong');
  }
  if (res.status === 204) return null;
  return res.json();
}

// GET all tasks for the current user.
export async function getTasks() {
  const res = await fetch(base, {
    credentials: 'include',
  });
  return handleResponse(res);
}

// POST a new task with the given title.
export async function createTask(title) {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

// PUT updates onto an existing task.
export async function updateTask(id, data) {
  const res = await fetch(`${base}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// DELETE a task by id.
export async function deleteTask(id) {
  const res = await fetch(`${base}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(res);
}
