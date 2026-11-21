const STORAGE_TOKEN_KEY = 'jus_digital_access_token';
const JWT_TOKEN_PATTERN = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:3000/api';

function extractValidJwt(rawToken: string | null): string | null {
  if (!rawToken) {
    return null;
  }
  const trimmed = rawToken.trim();
  return JWT_TOKEN_PATTERN.test(trimmed) ? trimmed : null;
}

export function getStoredToken(): string | null {
  return extractValidJwt(localStorage.getItem(STORAGE_TOKEN_KEY));
}

export function setStoredToken(token: string): void {
  const validToken = extractValidJwt(token);
  if (!validToken) {
    throw new Error('Token de autenticação em formato inválido.');
  }
  localStorage.setItem(STORAGE_TOKEN_KEY, validToken);
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'Ocorreu um erro ao comunicar com o servidor.';
    try {
      const errorData = (await response.json()) as { message?: string | string[] };
      if (errorData?.message) {
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join(' ')
          : errorData.message;
      }
    } catch {
      if (response.statusText) {
        errorMessage = response.statusText;
      }
    }
    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}
