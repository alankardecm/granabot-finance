import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTransactions, createTransaction } from '../api/transactions';
import { getAccounts } from '../api/accounts';
import { downloadPdf, sendWhatsappReport } from '../api/reports';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Card } from '../components/shared/Card';
import type { TransactionFilters, PaginatedResponse, TransactionItem } from '../types';

const defaultDateRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().substring(0, 10);
  const end = now.toISOString().substring(0, 10);
  return { start, end };
};

export const TransactionsPage = () => {
  const queryClient = useQueryClient();
  const initialRange = useMemo(() => defaultDateRange(), []);
  const [filters, setFilters] = useState<TransactionFilters>({
    dataInicial: initialRange.start,
    dataFinal: initialRange.end,
    page: 1,
    pageSize: 12,
  });
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: getAccounts });
  const { data: transactions } = useQuery<PaginatedResponse<TransactionItem>>({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactions(filters),
  });

  const createMutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      accountId: '',
      tipo: 'RECEITA',
      descricao: '',
      categoria: 'Outros',
      valor: 0,
      dataLancamento: initialRange.end,
      estaPago: 'true',
    },
  });

  const onCreate = async (values: any) => {
    await createMutation.mutateAsync({
      ...values,
      valor: Number(values.valor),
      estaPago: values.estaPago === true || values.estaPago === 'true',
    });
    reset({ ...values, descricao: '', valor: 0 });
  };

  const onDownloadPdf = async () => {
    const { start, end } = defaultDateRange();
    const payload = {
      dataInicial: filters.dataInicial ?? start,
      dataFinal: filters.dataFinal ?? end,
      accountId: filters.accountId,
    };
    const pdfBuffer = await downloadPdf(payload);
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'extrato-granabot.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  const onSendWhatsapp = async () => {
    if (!whatsappNumber) return;
    const { start, end } = defaultDateRange();
    await sendWhatsappReport({
      numero: whatsappNumber,
      dataInicial: filters.dataInicial ?? start,
      dataFinal: filters.dataFinal ?? end,
      accountId: filters.accountId,
    });
    setWhatsappNumber('');
    alert('Extrato enviado via WhatsApp.');
  };

  const updateFilter = (key: keyof TransactionFilters, value: string | boolean) => {
    setFilters((prev: TransactionFilters) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: 1,
    }));
  };

  const totalTransactions = transactions?.meta.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-slate-900">Extrato completo</h2>
        <p className="text-sm text-slate-500">
          Consulte transações vindas do webhook do n8n ou lançamentos manuais.
        </p>
      </div>

      <Card title="Filtros" description="Personalize a busca do extrato">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Conta</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={filters.accountId ?? ''}
              onChange={(event) => updateFilter('accountId', event.target.value)}
            >
              <option value="">Todas</option>
              {accounts?.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Tipo</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={filters.tipo ?? ''}
              onChange={(event) => updateFilter('tipo', event.target.value)}
            >
              <option value="">Todos</option>
              <option value="RECEITA">Receita</option>
              <option value="DESPESA">Despesa</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Pago?</label>
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={filters.estaPago === undefined ? '' : filters.estaPago ? 'true' : 'false'}
              onChange={(event) =>
                updateFilter('estaPago', event.target.value === '' ? '' : event.target.value === 'true')
              }
            >
              <option value="">Todos</option>
              <option value="true">Pago</option>
              <option value="false">Pendente</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Início</label>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={filters.dataInicial ?? ''}
              onChange={(event) => updateFilter('dataInicial', event.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-500">Fim</label>
            <input
              type="date"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              value={filters.dataFinal ?? ''}
              onChange={(event) => updateFilter('dataFinal', event.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={onDownloadPdf}
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
          >
            Baixar PDF
          </button>
          <div className="flex items-center gap-2">
            <input
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              placeholder="WhatsApp com DDD"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              onClick={onSendWhatsapp}
              className="rounded-lg border border-brand-primary px-4 py-2 text-sm font-semibold text-brand-primary"
            >
              Enviar WhatsApp
            </button>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Novo lançamento" description="Complemente os dados vindos do n8n">
          <form className="space-y-3" onSubmit={handleSubmit(onCreate)}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500">Conta</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register('accountId', { required: true })}
                >
                  <option value="">Selecione</option>
                  {accounts?.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500">Tipo</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register('tipo')}
                >
                  <option value="RECEITA">Receita</option>
                  <option value="DESPESA">Despesa</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500">Descrição</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register('descricao', { required: true })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Categoria</label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register('categoria', { required: true })}
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="text-xs text-slate-500">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register('valor', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Data</label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register('dataLancamento', { required: true })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Status</label>
                <select
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  {...register('estaPago')}
                >
                  <option value="true">Pago</option>
                  <option value="false">Pendente</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
            >
              {createMutation.isPending ? 'Salvando...' : 'Adicionar lançamento'}
            </button>
          </form>
        </Card>

        <Card title="Extrato" description="Movimentações filtradas" actions={<span className="text-xs text-slate-400">{totalTransactions} registros</span>}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2">Data</th>
                  <th className="pb-2">Descrição</th>
                  <th className="pb-2">Categoria</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.data.map((transaction) => (
                  <tr key={transaction.id} className="border-t text-slate-700">
                    <td className="py-2">{formatDate(transaction.dataLancamento)}</td>
                    <td className="py-2">
                      <p className="font-medium">{transaction.descricao}</p>
                      <p className="text-xs text-slate-400">{transaction.origem}</p>
                    </td>
                    <td className="py-2">{transaction.categoria}</td>
                    <td className="py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          transaction.estaPago ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {transaction.estaPago ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-2 text-right font-semibold">
                      <span className={transaction.tipo === 'RECEITA' ? 'text-emerald-600' : 'text-rose-600'}>
                        {transaction.tipo === 'RECEITA' ? '+' : '-'} {formatCurrency(transaction.valor)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {(!transactions || transactions.data.length === 0) && (
            <p className="text-sm text-slate-500">Nenhuma transação encontrada.</p>
          )}
        </Card>
      </div>
    </div>
  );
};
