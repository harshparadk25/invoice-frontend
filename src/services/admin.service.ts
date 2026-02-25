import api from './api';
import type { IAdminStats, IAdminOrganization, IInvoice, IInvoiceTemplate, IPagination } from '../types';

export const adminService = {
  async getStats(): Promise<IAdminStats> {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  async getOrganizations(params: { page?: number; limit?: number; search?: string } = {}): Promise<{
    success: boolean;
    organizations: IAdminOrganization[];
    pagination: IPagination;
  }> {
    const res = await api.get('/admin/organizations', { params });
    return res.data;
  },

  async getOrganization(orgId: string): Promise<{ success: boolean; organization: IAdminOrganization }> {
    const res = await api.get(`/admin/organizations/${orgId}`);
    return res.data;
  },

  async revokeOrganization(orgId: string): Promise<{ success: boolean; message: string; organization: IAdminOrganization }> {
    const res = await api.patch(`/admin/organizations/${orgId}/revoke`);
    return res.data;
  },

  async restoreOrganization(orgId: string): Promise<{ success: boolean; message: string; organization: IAdminOrganization }> {
    const res = await api.patch(`/admin/organizations/${orgId}/restore`);
    return res.data;
  },

  async getOrgInvoices(orgId: string, params: { page?: number; limit?: number } = {}): Promise<{
    success: boolean;
    invoices: IInvoice[];
    pagination: IPagination;
  }> {
    const res = await api.get(`/admin/organizations/${orgId}/invoices`, { params });
    return res.data;
  },

  async getOrgStats(orgId: string): Promise<{
    success: boolean;
    totalInvoices: number;
    thisMonthInvoices: number;
  }> {
    const res = await api.get(`/admin/organizations/${orgId}/stats`);
    return res.data;
  },

  async getOrgTemplate(orgId: string): Promise<{ success: boolean; template: IInvoiceTemplate }> {
    const res = await api.get(`/admin/organizations/${orgId}/template`);
    return res.data;
  },
};
