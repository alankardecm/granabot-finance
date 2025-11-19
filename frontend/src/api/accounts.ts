import { api } from './client';
import type { Account } from '../types';

export const getAccounts = async () => {
  const { data } = await api.get<Account[]>('/accounts');
  return data;
};

export const createAccount = async (payload: { nome: string; tipo: string; moeda?: string; externalId?: string }) => {
  const { data } = await api.post<Account>('/accounts', payload);
  return data;
};

export const updateAccount = async (id: string, payload: Partial<Account>) => {
  const { data } = await api.put<Account>(`/accounts/${id}`, payload);
  return data;
};

export const deleteAccount = async (id: string) => {
  await api.delete(`/accounts/${id}`);
};
