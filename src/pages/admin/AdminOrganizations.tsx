import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Search, Eye, ShieldOff, ShieldCheck, FileText,
  ChevronRight, Globe, Phone, Calendar, Mail, BarChart3, Download, X,
  CreditCard, MapPin, Hash,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { adminService } from '../../services/admin.service';
import type { IAdminOrganization, IInvoice, IInvoiceTemplate, IPagination } from '../../types';
import toast from 'react-hot-toast';

export default function AdminOrganizations() {
  const [organizations, setOrganizations] = useState<IAdminOrganization[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Detail panel
  const [selectedOrg, setSelectedOrg] = useState<IAdminOrganization | null>(null);
  const [orgStats, setOrgStats] = useState<{ totalInvoices: number; thisMonthInvoices: number } | null>(null);
  const [orgTemplate, setOrgTemplate] = useState<IInvoiceTemplate | null>(null);
  const [orgInvoices, setOrgInvoices] = useState<IInvoice[]>([]);
  const [invoicePagination, setInvoicePagination] = useState<IPagination>({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'template'>('overview');

  const loadOrganizations = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminService.getOrganizations({ page, limit: 20, search: search || undefined });
      setOrganizations(res.organizations);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => loadOrganizations(), 300);
    return () => clearTimeout(timer);
  }, [loadOrganizations]);

  const viewOrg = async (orgId: string) => {
    setDetailLoading(true);
    setShowDetail(true);
    setActiveTab('overview');
    try {
      const [orgRes, statsRes] = await Promise.all([
        adminService.getOrganization(orgId),
        adminService.getOrgStats(orgId),
      ]);
      setSelectedOrg(orgRes.organization);
      setOrgStats(statsRes);
      try {
        const templateRes = await adminService.getOrgTemplate(orgId);
        setOrgTemplate(templateRes.template);
      } catch { setOrgTemplate(null); }
      try {
        const invoicesRes = await adminService.getOrgInvoices(orgId, { limit: 10 });
        setOrgInvoices(invoicesRes.invoices);
        setInvoicePagination(invoicesRes.pagination);
      } catch { setOrgInvoices([]); }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load organization details');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRevoke = async (orgId: string) => {
    try {
      await adminService.revokeOrganization(orgId);
      toast.success('Organization revoked');
      loadOrganizations(pagination.page);
      if (selectedOrg?._id === orgId) setSelectedOrg({ ...selectedOrg, isRevoked: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to revoke');
    }
  };

  const handleRestore = async (orgId: string) => {
    try {
      await adminService.restoreOrganization(orgId);
      toast.success('Organization restored');
      loadOrganizations(pagination.page);
      if (selectedOrg?._id === orgId) setSelectedOrg({ ...selectedOrg, isRevoked: false });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to restore');
    }
  };

  const loadOrgInvoices = async (page: number) => {
    if (!selectedOrg) return;
    try {
      const res = await adminService.getOrgInvoices(selectedOrg._id, { page, limit: 10 });
      setOrgInvoices(res.invoices);
      setInvoicePagination(res.pagination);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Organizations" subtitle="Manage all organizations on the platform" />

      {/* Search */}
      <div className="bg-white rounded-xl p-5 border border-dark-200/60">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations..."
            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-dark-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Organizations Table */}
      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[40vh]" />
      ) : organizations.length === 0 ? (
        <EmptyState icon={<Building2 size={28} />} title="No organizations found" description="No organizations match your search criteria." />
      ) : (
        <div className="bg-white rounded-xl border border-dark-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50/40">
                  <th className="text-left text-[11px] font-semibold text-dark-500 uppercase tracking-wider px-5 py-3">Organization</th>
                  <th className="text-left text-[11px] font-semibold text-dark-500 uppercase tracking-wider px-5 py-3">Owner</th>
                  <th className="text-left text-[11px] font-semibold text-dark-500 uppercase tracking-wider px-5 py-3">Phone</th>
                  <th className="text-center text-[11px] font-semibold text-dark-500 uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-[11px] font-semibold text-dark-500 uppercase tracking-wider px-5 py-3">Created</th>
                  <th className="text-center text-[11px] font-semibold text-dark-500 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr
                    key={org._id}
                    className="border-b border-dark-50 hover:bg-dark-50/50 transition-colors cursor-pointer"
                    onClick={() => viewOrg(org._id)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-linear-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center text-white font-semibold text-[11px] shrink-0">
                          {org.name?.[0]?.toUpperCase() || 'O'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-dark-800 truncate">{org.name}</p>
                          <p className="text-[10px] text-dark-400 font-mono">{org._id.slice(-8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-[13px] text-dark-700 truncate">
                        {typeof org.ownerId === 'object' ? (org.ownerId as any)?.name || 'N/A' : 'N/A'}
                      </p>
                      <p className="text-[11px] text-dark-400 truncate">
                        {typeof org.ownerId === 'object' ? (org.ownerId as any)?.email || '' : ''}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-dark-500">{org.phoneNumber}</td>
                    <td className="px-5 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        org.isRevoked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {org.isRevoked ? 'Revoked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-dark-500 tabular-nums">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-0.5">
                        <button
                          onClick={() => viewOrg(org._id)}
                          className="p-1.5 rounded-md hover:bg-primary-50 text-dark-400 hover:text-primary-600 transition-colors"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {org.isRevoked ? (
                          <button
                            onClick={() => handleRestore(org._id)}
                            className="p-1.5 rounded-md hover:bg-green-50 text-dark-400 hover:text-green-600 transition-colors"
                            title="Restore"
                          >
                            <ShieldCheck size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRevoke(org._id)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-dark-400 hover:text-red-500 transition-colors"
                            title="Revoke"
                          >
                            <ShieldOff size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-dark-50">
            <Pagination pagination={pagination} onPageChange={loadOrganizations} />
          </div>
        </div>
      )}

      {/* Organization Detail Modal */}
      <Modal
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}
        title={selectedOrg?.name || 'Organization Details'}
        maxWidth="max-w-3xl"
        footer={
          selectedOrg && activeTab === 'overview' ? (
            <div className="flex gap-3">
              {selectedOrg.isRevoked ? (
                <button
                  onClick={() => handleRestore(selectedOrg._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[13px] font-medium"
                >
                  <ShieldCheck size={15} /> Restore Organization
                </button>
              ) : (
                <button
                  onClick={() => handleRevoke(selectedOrg._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[13px] font-medium"
                >
                  <ShieldOff size={15} /> Revoke Organization
                </button>
              )}
            </div>
          ) : undefined
        }
      >
        {detailLoading ? (
          <LoadingSpinner size="md" className="py-10" />
        ) : selectedOrg ? (
          <div>
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-dark-100 rounded-lg mb-5">
              {(['overview', 'invoices', 'template'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 px-3 rounded-md text-[13px] font-medium transition-colors capitalize ${
                    activeTab === tab ? 'bg-white text-dark-800 shadow-sm' : 'text-dark-500 hover:text-dark-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-[15px] font-bold shrink-0">
                    {selectedOrg.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[15px] font-bold text-dark-900 truncate">{selectedOrg.name}</h3>
                    <p className="text-[11px] text-dark-400 font-mono">ID: {selectedOrg._id}</p>
                  </div>
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${
                    selectedOrg.isRevoked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {selectedOrg.isRevoked ? 'Revoked' : 'Active'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-indigo-50 rounded-lg p-4 text-center">
                    <p className="text-xl font-bold text-indigo-700 tabular-nums">{orgStats?.totalInvoices || 0}</p>
                    <p className="text-[11px] text-indigo-600">Total Invoices</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4 text-center">
                    <p className="text-xl font-bold text-emerald-700 tabular-nums">{orgStats?.thisMonthInvoices || 0}</p>
                    <p className="text-[11px] text-emerald-600">This Month</p>
                  </div>
                </div>

                <div className="bg-dark-50 rounded-lg p-4">
                  <h4 className="text-[11px] font-semibold text-dark-500 uppercase tracking-wider mb-3">Owner Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div className="flex items-center gap-1.5">
                      <Globe size={12} className="text-dark-400" />
                      <span className="text-dark-600 truncate">
                        {typeof selectedOrg.ownerId === 'object' ? (selectedOrg.ownerId as any)?.name : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={12} className="text-dark-400" />
                      <span className="text-dark-600 truncate">
                        {typeof selectedOrg.ownerId === 'object' ? (selectedOrg.ownerId as any)?.email : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} className="text-dark-400" />
                      <span className="text-dark-600">{selectedOrg.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-dark-400" />
                      <span className="text-dark-600 tabular-nums">{new Date(selectedOrg.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
              <div>
                {orgInvoices.length === 0 ? (
                  <div className="text-center py-10 text-[13px] text-dark-400">No invoices found</div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-125">
                        <thead>
                          <tr className="border-b border-dark-200">
                            <th className="text-left py-2 px-3 text-[11px] text-dark-500 font-semibold uppercase tracking-wider">Invoice #</th>
                            <th className="text-left py-2 px-3 text-[11px] text-dark-500 font-semibold uppercase tracking-wider">Customer</th>
                            <th className="text-left py-2 px-3 text-[11px] text-dark-500 font-semibold uppercase tracking-wider">Date</th>
                            <th className="text-right py-2 px-3 text-[11px] text-dark-500 font-semibold uppercase tracking-wider">Amount</th>
                            <th className="text-center py-2 px-3 text-[11px] text-dark-500 font-semibold uppercase tracking-wider">PDF</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orgInvoices.map((inv) => (
                            <tr key={inv._id} className="border-b border-dark-50 hover:bg-dark-50/50">
                              <td className="py-2 px-3 text-[13px] font-medium text-primary-600">{inv.invoiceNumber}</td>
                              <td className="py-2 px-3 text-[13px] text-dark-700">{inv.customer?.name || 'N/A'}</td>
                              <td className="py-2 px-3 text-[13px] text-dark-500 tabular-nums">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                              <td className="py-2 px-3 text-[13px] text-right font-semibold tabular-nums">{inv.total?.grandTotal?.toFixed(2)}</td>
                              <td className="py-2 px-3 text-center">
                                {inv.pdfUrl && (
                                  <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:text-primary-700 inline-flex">
                                    <Download size={13} />
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Pagination pagination={invoicePagination} onPageChange={loadOrgInvoices} />
                  </>
                )}
              </div>
            )}

            {/* Template Tab */}
            {activeTab === 'template' && (
              <div>
                {orgTemplate ? (
                    <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      {orgTemplate.companyLogoUrl && (
                        <img src={orgTemplate.companyLogoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-lg border shrink-0" />
                      )}
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-bold text-dark-900 truncate">{orgTemplate.companyName}</h4>
                        <div className="flex flex-wrap gap-3 mt-1 text-[12px] text-dark-500">
                          <span className="flex items-center gap-1"><Mail size={11} /> {orgTemplate.email}</span>
                          <span className="flex items-center gap-1"><Phone size={11} /> {orgTemplate.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[13px]">
                      <div className="bg-dark-50 rounded-lg p-4">
                        <span className="text-[11px] text-dark-400 flex items-center gap-1"><MapPin size={11} /> Address</span>
                        <p className="text-dark-700 mt-1">{orgTemplate.address}</p>
                      </div>
                      <div className="bg-dark-50 rounded-lg p-4">
                        <span className="text-[11px] text-dark-400 flex items-center gap-1"><Hash size={11} /> TRN</span>
                        <p className="text-dark-700 mt-1">{orgTemplate.trn}</p>
                      </div>
                    </div>

                    {orgTemplate.bankDetails && (
                      <div className="bg-dark-50 rounded-lg p-4">
                        <h5 className="text-[11px] font-semibold text-dark-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <CreditCard size={12} /> Bank Details
                        </h5>
                        <div className="grid grid-cols-2 gap-2 text-[13px]">
                          {Object.entries(orgTemplate.bankDetails).map(([key, val]) => (
                            <div key={key}>
                              <span className="text-dark-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
                              <span className="text-dark-700">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 text-[13px] text-dark-400">No template configured</div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
