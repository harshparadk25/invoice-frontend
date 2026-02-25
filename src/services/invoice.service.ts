import api from './api';
import type { IInvoice, IInvoiceAnalytics, IMemberStats, IPagination } from '../types';

export const invoiceService = {
  async getAll(params: { page?: number; limit?: number; startDate?: string; endDate?: string } = {}): Promise<{
    success: boolean;
    invoices: IInvoice[];
    pagination: IPagination;
  }> {
    const res = await api.get('/invoices', { params });
    return res.data;
  },

  async getById(invoiceId: string): Promise<{ success: boolean; invoice: IInvoice }> {
    const res = await api.get(`/invoices/${invoiceId}`);
    return res.data;
  },

  async getAnalytics(): Promise<IInvoiceAnalytics> {
    const res = await api.get('/invoices/analytics');
    return res.data;
  },

  async getMemberStats(): Promise<{ success: boolean; data: IMemberStats[] }> {
    const res = await api.get('/invoices/member-stats');
    return res.data;
  },
};
