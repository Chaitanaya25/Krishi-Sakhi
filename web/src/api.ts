// web/src/api.ts
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.trim())
    ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/+$/, '')
    : '/ksapi'; // default to Next proxy

type Options = RequestInit & { raw?: boolean };

export async function api<T = any>(path: string, opts: Options = {}): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${API_BASE}${cleanPath}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
  };
  console.info('[API CALL]', { url, method: opts.method || 'GET', API_BASE });

  try {
    const res = await fetch(url, { ...opts, headers }); // same-origin now
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[API ERROR]', res.status, url, text);
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${text || 'no body'}`);
    }
    if (opts.raw) return (res as unknown) as T;
    return (await res.json()) as T;
  } catch (e: any) {
    console.error('[API NETWORK ERROR]', url, e);
    throw new Error(`Network error calling ${url}: ${e?.message || e}`);
  }
}