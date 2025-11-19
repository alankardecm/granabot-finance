import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile } from '../api/users';
import { createAccount, deleteAccount, getAccounts } from '../api/accounts';
import {
  createWebhookKey,
  getIntegrationConfig,
  getWebhookKeys,
  rotateWebhookKey,
  updateIntegrationConfig,
} from '../api/integrations';
import { Card } from '../components/shared/Card';
import { useAuthStore } from '../store/auth-store';

export const SettingsPage = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getProfile });
  const accountsQuery = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });
  const webhookKeysQuery = useQuery({ queryKey: ['webhook-keys'], queryFn: getWebhookKeys });
  const integrationQuery = useQuery({ queryKey: ['integration-config'], queryFn: getIntegrationConfig });

  const profileForm = useForm({ defaultValues: { nome: '', telefone: '', plano: '' } });
  const integrationForm = useForm({ defaultValues: { whatsappWebhookUrl: '', whatsappApiToken: '' } });
  const accountForm = useForm({ defaultValues: { nome: '', tipo: 'Carteira', moeda: 'BRL' } });

  useEffect(() => {
    if (profileQuery.data) {
      profileForm.reset(profileQuery.data);
    }
  }, [profileQuery.data, profileForm]);

  useEffect(() => {
    if (integrationQuery.data) {
      integrationForm.reset({
        whatsappWebhookUrl: integrationQuery.data.whatsappWebhookUrl ?? '',
        whatsappApiToken: integrationQuery.data.whatsappApiToken ?? '',
      });
    }
  }, [integrationQuery.data, integrationForm]);

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setUser(data);
    },
  });

  const integrationMutation = useMutation({
    mutationFn: updateIntegrationConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['integration-config'] }),
  });

  const accountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      accountForm.reset({ nome: '', tipo: 'Carteira', moeda: 'BRL' });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] }),
  });

  const webhookCreateMutation = useMutation({
    mutationFn: createWebhookKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhook-keys'] }),
  });

  const rotateMutation = useMutation({
    mutationFn: rotateWebhookKey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['webhook-keys'] }),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Configurações do usuário</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Dados pessoais" description="Visíveis nos relatórios e integrações">
          <form className="space-y-3" onSubmit={profileForm.handleSubmit((values) => profileMutation.mutate(values))}>
            <div>
              <label className="text-xs text-slate-500">Nome</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                {...profileForm.register('nome')}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500">Telefone</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...profileForm.register('telefone')}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Plano</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...profileForm.register('plano')}
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Salvar alterações
            </button>
          </form>
        </Card>

        <Card title="Integração WhatsApp" description="Fluxo automatizado via n8n">
          <form
            className="space-y-3"
            onSubmit={integrationForm.handleSubmit((values) => integrationMutation.mutate(values))}
          >
            <div>
              <label className="text-xs text-slate-500">Webhook URL</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                {...integrationForm.register('whatsappWebhookUrl')}
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Token (opcional)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                {...integrationForm.register('whatsappApiToken')}
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
            >
              Atualizar integração
            </button>
          </form>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Contas e carteiras" description="Controle as carteiras multi-tenant">
          <form className="mb-4 grid gap-3 sm:grid-cols-3" onSubmit={accountForm.handleSubmit((values) => accountMutation.mutate(values))}>
            <input
              placeholder="Nome"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              {...accountForm.register('nome', { required: true })}
            />
            <input
              placeholder="Tipo"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              {...accountForm.register('tipo')}
            />
            <button className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
              Adicionar conta
            </button>
          </form>
          <div className="space-y-3">
            {accountsQuery.data?.map((account) => (
              <div key={account.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold">{account.nome}</p>
                  <p className="text-xs text-slate-500">{account.tipo}</p>
                </div>
                <button
                  className="text-xs text-rose-500"
                  onClick={() => deleteAccountMutation.mutate(account.id)}
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Chaves de webhook" description="Rotacione quando necessário">
          <div className="space-y-3">
            <button
              className="rounded-lg border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary"
              onClick={() => {
                const accountId = accountsQuery.data?.[0]?.id;
                if (accountId) {
                  webhookCreateMutation.mutate({ accountId });
                }
              }}
            >
              Gerar nova chave (primeira conta)
            </button>
            {webhookKeysQuery.data?.map((key) => (
              <div key={key.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-semibold">{key.account.nome}</p>
                <p className="text-xs font-mono text-slate-500 break-all">{key.chave}</p>
                <button
                  className="mt-2 text-xs text-brand-primary"
                  onClick={() => rotateMutation.mutate(key.id)}
                >
                  Rotacionar chave
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

