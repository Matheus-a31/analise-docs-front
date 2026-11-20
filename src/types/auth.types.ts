export interface UserProfile {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}
