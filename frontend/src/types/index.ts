export type User = {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  plano: string;
};

export type Account = {
  id: string;
  nome: string;
  tipo: string;
  moeda: string;
  externalId?: string | null;
};

export type TransactionItem = {
  id: string;
  accountId: string;
  userId: string;
  tipo: 'RECEITA' | 'DESPESA';
  descricao: string;
  categoria: string;
  valor: number;
  dataLancamento: string;
  estaPago: boolean;
  origem: string;
  identificadorExterno?: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
};

export type OverviewSummary = {
  receitas: number;
  despesas: number;
  saldo: number;
  porCategoria: Record<string, number>;
  timeline: Array<{ date: string; receita: number; despesa: number; saldo: number }>;
};

export type WebhookKey = {
  id: string;
  accountId: string;
  descricao?: string | null;
  chave: string;
  ativo: boolean;
  account: Account;
};

export type IntegrationConfig = {
  whatsappWebhookUrl?: string | null;
  whatsappApiToken?: string | null;
};

export type TransactionFilters = {
  accountId?: string;
  tipo?: 'RECEITA' | 'DESPESA';
  categoria?: string;
  estaPago?: boolean;
  dataInicial?: string;
  dataFinal?: string;
  page?: number;
  pageSize?: number;
};
