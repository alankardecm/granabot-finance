import { api } from './client';
import type { PaginatedResponse, TransactionFilters, TransactionItem, OverviewSummary } from '../types';

export const getTransactions = async (filters: TransactionFilters = {}) => {
  const { data } = await api.get<PaginatedResponse<TransactionItem>>('/transactions', {
    params: filters,
  });
  return data;
};

export const createTransaction = async (payload: Partial<TransactionItem> & { accountId: string; tipo: 'RECEITA' | 'DESPESA'; valor: number; dataLancamento: string }) => {
  const { data } = await api.post<TransactionItem>('/transactions', payload);
  return data;
};

export const updateTransaction = async (
  id: string,
  payload: Partial<TransactionItem>,
) => {
  const { data } = await api.put<TransactionItem>(`/transactions/${id}`, payload);
  return data;
};

export const deleteTransaction = async (id: string) => {
  await api.delete(`/transactions/${id}`);
};

export const getOverview = async (accountId?: string) => {
  const { data } = await api.get<OverviewSummary>('/transactions/overview', {
    params: accountId ? { accountId } : undefined,
  });
  return data;
};

export const getLatestTransactions = async () => {
  const { data } = await api.get<TransactionItem[]>('/transactions/latest');
  return data;
};
