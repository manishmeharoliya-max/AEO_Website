const apiBase = (import.meta.env.VITE_API_URL || import.meta.env.VITE_AEO_API_URL || '').replace(/\/$/, '');
export function normalizeWebsiteUrl(value) {
  const input = value.trim();
  if (!input || input.length > 2048) throw new Error('Enter your website URL.');
  let url;
  try {
    url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`);
  } catch {
    throw new Error('Enter a valid URL, such as https://yourwebsite.com.');
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.port
  ) {
    throw new Error(
      'Use an HTTP or HTTPS website URL without login details or a custom port.',
    );
  }
  url.hash = '';
  return url.href;
}
export async function analyzeWebsite(url, signal) {
  let response;
  try {
    response = await fetch(`${apiBase}/api/aeo/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
      }),
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('The checker is unavailable right now. Please try again shortly.');
  }
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      result?.message ||
        'The checker is unavailable right now. Please try again shortly.',
    );
  }
  if (!result || !Number.isFinite(result.score) || !Array.isArray(result.checks)) {
    throw new Error('We could not read the analysis. Please try again.');
  }
  return result;
}
