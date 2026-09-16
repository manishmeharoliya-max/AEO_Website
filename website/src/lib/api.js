const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const session = {
  get: () => sessionStorage.getItem('zepfly-token'),
  set: (token) => sessionStorage.setItem('zepfly-token', token),
  clear: () => sessionStorage.removeItem('zepfly-token'),
};

export async function api(path, { body, signal, ...options } = {}) {
  const token = session.get();
  const timeout = AbortSignal.timeout(20000);
  let response;
  try {
    response = await fetch(`${base}/api${path}`, {
      ...options,
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error('Unable to reach the server. Check your connection and try again.');
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && token) {
      session.clear();
      window.dispatchEvent(new Event('session-expired'));
    }
    const error = new Error(
      data?.message || 'Unable to complete request. Please try again.',
    );
    error.status = response.status;
    throw error;
  }
  if (!data) throw new Error('The server returned an invalid response.');
  return data;
}
