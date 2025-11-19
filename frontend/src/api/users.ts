import { api } from './client';
import type { User } from '../types';

export const getProfile = async () => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateProfile = async (payload: Partial<User>) => {
  const { data } = await api.put<User>('/users/me', payload);
  return data;
};
