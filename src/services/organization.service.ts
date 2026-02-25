import api from './api';
import type { IOrganization, IInvoiceTemplate } from '../types';

export const organizationService = {
  async getMyOrganization(): Promise<IOrganization | null> {
    try {
      const res = await api.get('/organizations/my');
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  },

  async getById(id: string): Promise<IOrganization> {
    const res = await api.get(`/organizations/${id}`);
    return res.data;
  },
};

export const templateService = {
  async get(organizationId: string): Promise<IInvoiceTemplate> {
    const res = await api.get(`/templates/${organizationId}`);
    return res.data;
  },

  async update(organizationId: string, data: FormData): Promise<IInvoiceTemplate> {
    const res = await api.patch(`/templates/${organizationId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
