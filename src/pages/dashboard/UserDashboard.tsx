import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Users, TrendingUp, Calendar, BarChart3, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { invoiceService } from '../../services/invoice.service';
import { customerService } from '../../services/customer.service';
import type { IInvoiceAnalytics, IMemberStats, IInvoice } from '../../types';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function UserDashboard() {
  const [analytics, setAnalytics] = useState<IInvoiceAnalytics | null>(null);
  const [memberStats, setMemberStats] = useState<IMemberStats[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<IInvoice[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [analyticsRes, memberStatsRes, invoicesRes, customersRes] = await Promise.all([
        invoiceService.getAnalytics(),
        invoiceService.getMemberStats(),
        invoiceService.getAll({ limit: 5 }),
        customerService.getAll({ limit: 1 }),
      ]);
      setAnalytics(analyticsRes);
      setMemberStats(memberStatsRes.data);
      setRecentInvoices(invoicesRes.invoices);
      setCustomerCount(customersRes.pagination.total);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[50vh]" />;

  const barData = [
    { name: 'Today', value: analytics?.today || 0 },
    { name: 'Week', value: analytics?.thisWeek || 0 },
    { name: 'Month', value: analytics?.thisMonth || 0 },
    { name: 'Total', value: analytics?.total || 0 },
  ];

  const pieData = memberStats.slice(0, 6).map((m) => ({
    name: m.memberName || 'Unknown',
    value: m.totalInvoices,
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Overview of your business" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Invoices" value={analytics?.total || 0} icon={<FileText size={20} />} color="blue" delay={0} />
        <StatCard title="Today" value={analytics?.today || 0} icon={<Calendar size={20} />} color="green" delay={0.05} />
        <StatCard title="This Month" value={analytics?.thisMonth || 0} icon={<TrendingUp size={20} />} color="purple" delay={0.1} />
        <StatCard title="Customers" value={customerCount} icon={<Users size={20} />} color="orange" delay={0.15} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-5 border border-dark-200/60 min-w-0"
        >
          <h3 className="text-sm font-semibold text-dark-700 mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary-500" />
            Invoice Overview
          </h3>
          <div className="w-full overflow-hidden">
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-xl p-5 border border-dark-200/60 min-w-0"
        >
          <h3 className="text-sm font-semibold text-dark-700 mb-4 flex items-center gap-2">
            <UserCheck size={16} className="text-emerald-500" />
            By Member
          </h3>
          {pieData.length > 0 ? (
            <>
              <div className="w-full overflow-hidden">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-[12px] text-dark-500">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-45 text-dark-400 text-sm">No data</div>
          )}
        </motion.div>
      </div>

      {/* Recent Invoices */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-dark-200/60 overflow-hidden"
      >
        <div className="px-5 py-3.5 border-b border-dark-100">
          <h3 className="text-sm font-semibold text-dark-700">Recent Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-125">
            <thead>
              <tr className="border-b border-dark-100 bg-dark-50/50">
                <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Invoice #</th>
                <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Date</th>
                <th className="text-right text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Amount</th>
                <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">By</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv._id} className="border-b border-dark-50 hover:bg-dark-50/50 transition-colors">
                  <td className="px-5 py-3 text-[13px] font-medium text-primary-600">{inv.invoiceNumber}</td>
                  <td className="px-5 py-3 text-[13px] text-dark-700">{inv.customer?.name || 'N/A'}</td>
                  <td className="px-5 py-3 text-[13px] text-dark-500">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-dark-800 text-right tabular-nums">{inv.total?.grandTotal?.toFixed(2) || '0.00'}</td>
                  <td className="px-5 py-3 text-[13px] text-dark-500">{inv.generatedBy?.memberName || 'System'}</td>
                </tr>
              ))}
              {recentInvoices.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-dark-400 text-sm">No invoices yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Member Performance */}
      {memberStats.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-xl border border-dark-200/60 overflow-hidden"
        >
          <div className="px-5 py-3.5 border-b border-dark-100">
            <h3 className="text-sm font-semibold text-dark-700">Member Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-125">
              <thead>
                <tr className="border-b border-dark-100 bg-dark-50/50">
                  <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Member</th>
                  <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Phone</th>
                  <th className="text-right text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Invoices</th>
                  <th className="text-right text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Amount</th>
                  <th className="text-left text-[11px] font-semibold text-dark-400 uppercase tracking-wider px-5 py-3">Last Invoice</th>
                </tr>
              </thead>
              <tbody>
                {memberStats.map((m) => (
                  <tr key={m._id} className="border-b border-dark-50 hover:bg-dark-50/50 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-dark-800">{m.memberName}</td>
                    <td className="px-5 py-3 text-[13px] text-dark-500">{m.phoneNumber}</td>
                    <td className="px-5 py-3 text-[13px] text-dark-700 text-right tabular-nums">{m.totalInvoices}</td>
                    <td className="px-5 py-3 text-[13px] font-semibold text-dark-800 text-right tabular-nums">{m.totalAmount?.toFixed(2)}</td>
                    <td className="px-5 py-3 text-[13px] text-dark-500">{m.lastInvoiceDate ? new Date(m.lastInvoiceDate).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
