import api from './api';
import type { IMember } from '../types';

export const memberService = {
  async getAll(organizationId: string, includeInactive = false): Promise<{
    success: boolean;
    data: IMember[];
    count: number;
  }> {
    const res = await api.get(`/members/${organizationId}`, {
      params: includeInactive ? { includeInactive: 'true' } : {},
    });
    return res.data;
  },

  async getStats(organizationId: string): Promise<{ success: boolean; data: IMember[] }> {
    const res = await api.get(`/members/${organizationId}/stats`);
    return res.data;
  },
};
