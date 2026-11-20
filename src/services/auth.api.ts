import { AuthResponse, UserProfile } from '../types/auth.types';
import { apiRequest } from './api-client';

export interface GoogleLoginPayload {
  credential?: string;
  accessToken?: string;
}

export const authApi = {
  loginWithGoogle(payload: GoogleLoginPayload): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  loginWithDevMode(payload?: {
    name?: string;
    email?: string;
    picture?: string;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/dev-login', {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },

  getProfile(): Promise<UserProfile> {
    return apiRequest<UserProfile>('/auth/me', {
      method: 'GET',
    });
  },
};
