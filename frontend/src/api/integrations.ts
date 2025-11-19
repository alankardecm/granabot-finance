import { api } from './client';
import type { IntegrationConfig, WebhookKey } from '../types';

export const getIntegrationConfig = async () => {
  const { data } = await api.get<IntegrationConfig>('/integrations/config');
  return data;
};

export const updateIntegrationConfig = async (payload: IntegrationConfig) => {
  const { data } = await api.put<IntegrationConfig>('/integrations/config', payload);
  return data;
};

export const getWebhookKeys = async () => {
  const { data } = await api.get<WebhookKey[]>('/integrations/webhook-keys');
  return data;
};

export const createWebhookKey = async (payload: { accountId: string; descricao?: string }) => {
  const { data } = await api.post<WebhookKey>('/integrations/webhook-keys', payload);
  return data;
};

export const rotateWebhookKey = async (id: string) => {
  const { data } = await api.post<WebhookKey>(`/integrations/webhook-keys/${id}/rotate`, {});
  return data;
};
