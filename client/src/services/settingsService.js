const base = '/api/settings';

// Throw on non-2xx responses, otherwise return parsed JSON.
async function handleResponse(res) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Something went wrong');
  }
  if (res.status === 204) return null;
  return res.json();
}

// GET the current user's settings.
export async function getSettings() {
  const res = await fetch(base, {
    credentials: 'include',
  });
  return handleResponse(res);
}

// PUT updated settings for the current user.
export async function updateSettings(data) {
  const res = await fetch(base, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}
