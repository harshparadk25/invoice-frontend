import api from './api';
import type { ICustomer, IPagination } from '../types';

export const customerService = {
  async getAll(params: { page?: number; limit?: number; search?: string } = {}): Promise<{
    success: boolean;
    customers: ICustomer[];
    pagination: IPagination;
  }> {
    const res = await api.get('/customers', { params });
    return res.data;
  },

  async getById(customerId: string): Promise<{ success: boolean; customer: ICustomer }> {
    const res = await api.get(`/customers/${customerId}`);
    return res.data;
  },

  async update(customerId: string, data: Partial<ICustomer>): Promise<{ success: boolean; customer: ICustomer }> {
    const res = await api.patch(`/customers/${customerId}`, data);
    return res.data;
  },

  async delete(customerId: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete(`/customers/${customerId}`);
    return res.data;
  },
};
