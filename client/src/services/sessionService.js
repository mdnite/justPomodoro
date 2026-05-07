const base = '/api/sessions';

// Throw on non-2xx responses, otherwise return parsed JSON.
async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Something went wrong');
  }
  if (res.status === 204) return null;
  return res.json();
}

// POST a completed work session to the server.
export async function saveSession({ duration, type, completedAt }) {
  const res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ duration, type, completedAt }),
  });
  return handleResponse(res);
}

// GET all sessions for the current user.
export async function getSessions() {
  const res = await fetch(base, {
    credentials: 'include',
  });
  return handleResponse(res);
}

// GET aggregated stats for the current user's sessions.
export async function getSessionStats() {
  const res = await fetch(`${base}/stats`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
