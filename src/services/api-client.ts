const STORAGE_TOKEN_KEY = 'jus_digital_access_token';
const STORAGE_USER_KEY = 'jus_digital_user';

export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:3000/api';

export function getStoredToken(): string | null {
  return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function setStoredSession(token: string, userJson: string): void {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
  localStorage.setItem(STORAGE_USER_KEY, userJson);
}

export function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
  localStorage.removeItem(STORAGE_USER_KEY);
}

export function getStoredUserJson(): string | null {
  return localStorage.getItem(STORAGE_USER_KEY);
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
      // Fallback to statusText if response is not JSON
      if (response.statusText) {
        errorMessage = response.statusText;
      }
    }
    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}
