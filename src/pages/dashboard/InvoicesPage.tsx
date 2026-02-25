import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Download, Eye } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { invoiceService } from '../../services/invoice.service';
import type { IInvoice, IPagination } from '../../types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [detailModal, setDetailModal] = useState(false);

  const loadInvoices = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 20 };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await invoiceService.getAll(params);
      setInvoices(res.invoices);
      setPagination(res.pagination);
    } catch (err) {
      console.error('Load invoices error:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const viewInvoice = async (id: string) => {
    try {
      const res = await invoiceService.getById(id);
      setSelectedInvoice(res.invoice);
      setDetailModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Invoices" subtitle="View and manage all your invoices" />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-5 border border-dark-200/60"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-dark-800 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-400 focus:bg-white transition-all"
            />
          </div>
          <button
            onClick={() => loadInvoices(1)}
            className="px-5 py-2.5 bg-primary-600 text-white text-[13px] font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
          >
            Apply
          </button>
          {(startDate || endDate) && (
            <button
              onClick={() => { setStartDate(''); setEndDate(''); }}
              className="px-5 py-2.5 text-dark-500 text-[13px] font-medium rounded-lg hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner size="lg" className="min-h-[40vh]" />
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={<FileText size={28} />}
          title="No invoices found"
          description="Invoices created through WhatsApp will appear here."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-dark-200/60 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50/50">
                  <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Invoice #</th>
                  <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Customer</th>
                  <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Date</th>
                  <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Items</th>
                  <th className="text-right text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Amount</th>
                  <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">By</th>
                  <th className="text-center text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="border-b border-dark-50 hover:bg-dark-50/50 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-primary-600">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3">
                      <div className="text-[13px] font-medium text-dark-800">{inv.customer?.name || 'N/A'}</div>
                      {inv.customer?.email && (
                        <div className="text-[11px] text-dark-400 mt-0.5">{inv.customer.email}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-dark-500">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-dark-100 text-dark-600">
                        {inv.items?.length || 0} items
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] font-semibold text-dark-800 text-right tabular-nums">
                      {inv.total?.grandTotal?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-5 py-3 text-[13px] text-dark-500">{inv.generatedBy?.memberName || 'System'}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => viewInvoice(inv._id)}
                          className="p-1.5 rounded-md hover:bg-primary-50 text-dark-400 hover:text-primary-600 transition-colors"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        {inv.pdfUrl && (
                          <a
                            href={inv.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-green-50 text-dark-400 hover:text-green-600 transition-colors"
                            title="Download PDF"
                          >
                            <Download size={15} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3.5 border-t border-dark-50">
            <Pagination pagination={pagination} onPageChange={loadInvoices} />
          </div>
        </motion.div>
      )}

      {/* Invoice Detail Modal */}
      <Modal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        title={`Invoice ${selectedInvoice?.invoiceNumber || ''}`}
        maxWidth="max-w-2xl"
        footer={
          selectedInvoice?.pdfUrl ? (
            <a
              href={selectedInvoice.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-[13px] font-medium shadow-sm"
            >
              <Download size={16} />
              Download PDF
            </a>
          ) : undefined
        }
      >
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Customer section */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h4 className="text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-3">Customer</h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[13px]">
                <div><span className="text-dark-400">Name:</span> <span className="text-dark-800 font-medium ml-1">{selectedInvoice.customer?.name}</span></div>
                <div><span className="text-dark-400">Email:</span> <span className="text-dark-800 font-medium ml-1">{selectedInvoice.customer?.email || 'N/A'}</span></div>
                <div><span className="text-dark-400">Phone:</span> <span className="text-dark-800 font-medium ml-1">{selectedInvoice.customer?.phone || 'N/A'}</span></div>
                <div><span className="text-dark-400">Company:</span> <span className="text-dark-800 font-medium ml-1">{selectedInvoice.customer?.company || 'N/A'}</span></div>
              </div>
            </div>

            {/* Items table */}
            <div>
              <h4 className="text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-3">Items</h4>
              <div className="overflow-x-auto rounded-lg border border-slate-100">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left py-2.5 px-4 text-dark-500 font-semibold text-[11px] uppercase tracking-widest">Item</th>
                      <th className="text-right py-2.5 px-4 text-dark-500 font-semibold text-[11px] uppercase tracking-widest">Qty</th>
                      <th className="text-right py-2.5 px-4 text-dark-500 font-semibold text-[11px] uppercase tracking-widest">Price</th>
                      <th className="text-right py-2.5 px-4 text-dark-500 font-semibold text-[11px] uppercase tracking-widest">Tax</th>
                      <th className="text-right py-2.5 px-4 text-dark-500 font-semibold text-[11px] uppercase tracking-widest">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items?.map((item, i) => (
                      <tr key={i} className="border-t border-slate-50">
                        <td className="py-2.5 px-4 text-dark-800">{item.name}</td>
                        <td className="py-2.5 px-4 text-right text-dark-600 tabular-nums">{item.quantity}</td>
                        <td className="py-2.5 px-4 text-right text-dark-600 tabular-nums">{item.price?.toFixed(2)}</td>
                        <td className="py-2.5 px-4 text-right text-dark-600 tabular-nums">{item.tax?.toFixed(2)}</td>
                        <td className="py-2.5 px-4 text-right font-medium text-dark-800 tabular-nums">{item.total?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-primary-50/60 rounded-xl p-5 border border-primary-100">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
                <span className="text-dark-500">Subtotal</span>
                <span className="text-right font-medium text-dark-700 tabular-nums">{selectedInvoice.total?.subTotal?.toFixed(2)}</span>
                <span className="text-dark-500">Tax</span>
                <span className="text-right font-medium text-dark-700 tabular-nums">{selectedInvoice.total?.tax?.toFixed(2)}</span>
                <span className="text-dark-500">Discount</span>
                <span className="text-right font-medium text-dark-700 tabular-nums">{selectedInvoice.total?.discount?.toFixed(2)}</span>
                <span className="text-dark-900 font-semibold text-[14px] pt-2 border-t border-primary-200">Grand Total</span>
                <span className="text-right font-bold text-[14px] text-primary-700 pt-2 border-t border-primary-200 tabular-nums">{selectedInvoice.total?.grandTotal?.toFixed(2)}</span>
              </div>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}
