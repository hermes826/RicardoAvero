const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

function buildUrl(path) {
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
}

export async function apiFetch(path, options = {}) {
  const response = await fetch(buildUrl(path), options);

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || 'Ha ocurrido un error';
    throw new Error(message);
  }

  return data;
}

export function buildAssetUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return buildUrl(url);
}

export { BASE_URL };
