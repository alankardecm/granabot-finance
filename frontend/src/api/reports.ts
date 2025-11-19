import { api } from './client';

export type ReportPayload = {
  dataInicial: string;
  dataFinal: string;
  accountId?: string;
};

export const downloadPdf = async (payload: ReportPayload) => {
  const response = await api.post<ArrayBuffer>('/reports/pdf', payload, {
    responseType: 'arraybuffer',
  });
  return response.data;
};

export const sendWhatsappReport = async (payload: ReportPayload & { numero: string }) => {
  const { data } = await api.post<{ message: string }>('/reports/send-whatsapp', payload);
  return data;
};
