export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatDate = (value: string) => {
  return new Date(value).toLocaleDateString('pt-BR');
};

export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
