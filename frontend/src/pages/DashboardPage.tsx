import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOverview, getLatestTransactions } from '../api/transactions';
import { getAccounts } from '../api/accounts';
import { StatCard } from '../components/shared/StatCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Card } from '../components/shared/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis } from 'recharts';

const chartColors = ['#1f7a63', '#f9a826', '#38bdf8', '#fb7185', '#94a3b8'];

export const DashboardPage = () => {
  const [accountFilter, setAccountFilter] = useState<string>('');
  const { data: overview } = useQuery({
    queryKey: ['overview', accountFilter],
    queryFn: () => getOverview(accountFilter || undefined),
  });
  const { data: latestTransactions } = useQuery({
    queryKey: ['latest-transactions'],
    queryFn: getLatestTransactions,
  });
  const { data: accounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  });

  const pieData = overview
    ? Object.entries(overview.porCategoria).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Visão geral</h2>
          <p className="text-sm text-slate-500">
            Acompanhe rapidamente o desempenho das suas contas e integrações do n8n.
          </p>
        </div>
        <select
          value={accountFilter}
          onChange={(event) => setAccountFilter(event.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          <option value="">Todas as contas</option>
          {accounts?.map((account) => (
            <option key={account.id} value={account.id}>
              {account.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Receitas do mês"
          value={formatCurrency(overview?.receitas ?? 0)}
          accent="income"
        />
        <StatCard
          label="Despesas do mês"
          value={formatCurrency(overview?.despesas ?? 0)}
          accent="expense"
        />
        <StatCard
          label="Saldo consolidado"
          value={formatCurrency(overview?.saldo ?? 0)}
          helper={overview?.saldo && overview.saldo >= 0 ? 'Belo resultado!' : 'Ajuste seus custos'}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Despesas por categoria" description="Últimos lançamentos do período">
          <div className="h-64">
            {pieData.length === 0 ? (
              <p className="text-sm text-slate-500">Ainda não há dados suficientes.</p>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {pieData.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card
          title="Evolução do mês"
          description="Receitas x Despesas"
          actions={<span className="text-xs text-slate-400">Atualiza automaticamente</span>}
        >
          <div className="h-64">
            {overview?.timeline?.length ? (
              <ResponsiveContainer>
                <LineChart data={overview.timeline}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={() => 'Dia'} />
                  <Line type="monotone" dataKey="receita" stroke="#16a34a" strokeWidth={2} />
                  <Line type="monotone" dataKey="despesa" stroke="#f97316" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-500">Sem dados para o período.</p>
            )}
          </div>
        </Card>

        <Card title="Últimos lançamentos" description="Web + Webhook n8n">
          <div className="space-y-3">
            {latestTransactions && latestTransactions.length > 0 ? (
              latestTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{transaction.descricao}</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(transaction.dataLancamento)} · {transaction.origem}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      transaction.tipo === 'RECEITA' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {transaction.tipo === 'RECEITA' ? '+' : '-'} {formatCurrency(transaction.valor)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Sem lançamentos recentes.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
