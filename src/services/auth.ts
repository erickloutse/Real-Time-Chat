import api from './api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatarUrl: string;
  };
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (email: string, password: string, username: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', { email, password, username });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (data: { username?: string; avatarUrl?: string }) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};