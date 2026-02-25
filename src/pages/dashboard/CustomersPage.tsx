import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit3, Trash2, Save, Mail, Phone, MapPin, Building2, Hash, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { customerService } from '../../services/customer.service';
import type { ICustomer, IPagination } from '../../types';
import toast from 'react-hot-toast';

const inputClass = 'w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-dark-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 focus:bg-white transition-all';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState<ICustomer | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', address: '', trn: '', company: '', branch: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadCustomers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await customerService.getAll({ page, limit: 20, search: search || undefined });
      setCustomers(res.customers);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => loadCustomers(), 300);
    return () => clearTimeout(timer);
  }, [loadCustomers]);

  const openEdit = (customer: ICustomer) => {
    setEditCustomer(customer);
    setEditForm({
      name: customer.name || '', email: customer.email || '', phone: customer.phone || '',
      address: customer.address || '', trn: customer.trn || '', company: customer.company || '', branch: customer.branch || '',
    });
    setEditModal(true);
  };

  const handleSave = async () => {
    if (!editCustomer) return;
    setSaving(true);
    try {
      await customerService.update(editCustomer._id, editForm);
      toast.success('Customer updated');
      setEditModal(false);
      loadCustomers(pagination.page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await customerService.delete(id);
      toast.success('Customer deleted');
      setDeleteConfirm(null);
      loadCustomers(pagination.page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader  title="Customers" subtitle="Manage your customer database" />

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-5 border border-dark-200/60"
      >
        <div className="relative max-w-sm">
          <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-dark-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 focus:bg-white transition-all"
          />
        </div>
      </motion.div>

      {/* Customers Grid */}
      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[40vh]" />
      ) : customers.length === 0 ? (
        <EmptyState
          icon={<Users size={28} />}
          title="No customers yet"
          description="Customers will appear here once invoices are created."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer, i) => (
              <motion.div
                key={customer._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white rounded-xl p-5 border border-dark-200/60 hover:border-dark-300/60 hover:shadow-sm transition-all group flex flex-col"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                 <div className="min-w-0 flex-1">
                    <h3 className="text-[13px] font-semibold text-dark-800 truncate">{customer.name}</h3>
                    {customer.company && (
                      <p className="text-[11px] text-dark-400 flex items-center gap-1 mt-0.5">
                        <Building2 size={11} /> <span className="truncate">{customer.company}</span>
                      </p>
                    )}
                  </div>
                 <div className="flex items-center gap-1 opacity-70 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => openEdit(customer)} className="p-1 rounded-md hover:bg-primary-50 text-dark-400 hover:text-primary-600 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => setDeleteConfirm(customer._id)} className="p-1 rounded-md hover:bg-red-50 text-dark-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {customer.email && (
                    <p className="text-[12px] text-dark-500 flex items-center gap-2 truncate">
                      <Mail size={12} className="text-dark-400 shrink-0" /> {customer.email}
                    </p>
                  )}
                  {customer.phone && (
                    <p className="text-[12px] text-dark-500 flex items-center gap-2">
                      <Phone size={12} className="text-dark-400 shrink-0" /> {customer.phone}
                    </p>
                  )}
                  {customer.address && (
                    <p className="text-[12px] text-dark-500 flex items-center gap-2 truncate">
                      <MapPin size={12} className="text-dark-400 shrink-0" /> {customer.address}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 text-[12px]">
                  <span className="text-[12px] text-dark-400 tabular-nums">{customer.invoiceCount} invoices</span>
                  {customer.lastUsedAt && (
                    <span className="text-[12px] text-dark-400">
                      Last: {new Date(customer.lastUsedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <Pagination pagination={pagination} onPageChange={loadCustomers} />
        </>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Customer"
        maxWidth="max-w-lg"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setEditModal(false)}
              className="flex-1 py-2.5 border border-slate-200 text-dark-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-[13px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-[13px] shadow-sm"
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">Customer Name</label>
              <input type="text" placeholder="Full name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">Email</label>
              <input type="email" placeholder="email@example.com" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">Phone</label>
              <input type="tel" placeholder="Phone number" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">Address</label>
              <input type="text" placeholder="Street address" value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">Company</label>
              <input type="text" placeholder="Company name" value={editForm.company} onChange={(e) => setEditForm({ ...editForm, company: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">Branch</label>
              <input type="text" placeholder="Branch name" value={editForm.branch} onChange={(e) => setEditForm({ ...editForm, branch: e.target.value })} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">TRN</label>
              <input type="text" placeholder="Tax Registration Number" value={editForm.trn} onChange={(e) => setEditForm({ ...editForm, trn: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Customer"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-slate-200 text-dark-600 rounded-lg hover:bg-slate-50 transition-colors text-[13px] font-medium">
              Cancel
            </button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[13px] font-medium shadow-sm">
              Delete
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center py-4 px-2">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <p className="text-[14px] font-medium text-dark-800 mb-1">Are you sure?</p>
          <p className="text-[13px] text-dark-500">This customer will be permanently deleted. This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
