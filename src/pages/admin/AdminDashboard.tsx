import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, FileText, ShieldOff, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/ui/StatCard';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { adminService } from '../../services/admin.service';
import type { IAdminStats } from '../../types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<IAdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await adminService.getStats();
      setStats(res);
    } catch (err) {
      console.error('Admin stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[60vh]" />;

  const barData = [
    { name: 'Organizations', value: stats?.totalOrganizations || 0, fill: '#6366f1' },
    { name: 'Users', value: stats?.totalUsers || 0, fill: '#22c55e' },
    { name: 'Invoices', value: stats?.totalInvoices || 0, fill: '#8b5cf6' },
    { name: 'Revoked', value: stats?.revokedOrganizations || 0, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" subtitle="System-wide overview and management" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Organizations" value={stats?.totalOrganizations || 0} icon={<Building2 size={20} />} color="blue" delay={0} />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<Users size={20} />} color="green" delay={0.1} />
        <StatCard title="Total Invoices" value={stats?.totalInvoices || 0} icon={<FileText size={20} />} color="purple" delay={0.2} />
        <StatCard title="Revoked Orgs" value={stats?.revokedOrganizations || 0} icon={<ShieldOff size={20} />} color="red" delay={0.3} />
      </div>

      {/* Overview Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-5 border border-dark-200/60"
      >
        <h3 className="text-base font-semibold text-dark-800 mb-4 flex items-center gap-2">
          <Activity size={16} className="text-primary-500" />
          Platform Overview
        </h3>
        <div className="overflow-hidden">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <motion.rect key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-linear-to-br from-indigo-500 to-indigo-700 rounded-xl p-5 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={18} />
            <h3 className="text-[13px] font-semibold">Organizations</h3>
          </div>
          <p className="text-2xl font-bold tabular-nums">{stats?.totalOrganizations || 0}</p>
          <p className="text-indigo-200 mt-0.5 text-[11px]">Active organizations on platform</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-linear-to-br from-emerald-500 to-emerald-700 rounded-xl p-5 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} />
            <h3 className="text-[13px] font-semibold">Growth</h3>
          </div>
          <p className="text-2xl font-bold tabular-nums">{stats?.totalInvoices || 0}</p>
          <p className="text-emerald-200 mt-0.5 text-[11px]">Total invoices generated</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-linear-to-br from-purple-500 to-purple-700 rounded-xl p-5 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} />
            <h3 className="text-[13px] font-semibold">Users</h3>
          </div>
          <p className="text-2xl font-bold tabular-nums">{stats?.totalUsers || 0}</p>
          <p className="text-purple-200 mt-0.5 text-[11px]">Registered platform users</p>
        </motion.div>
      </div>
    </div>
  );
}
