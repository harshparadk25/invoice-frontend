import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Phone, Calendar, Shield, Hash, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { organizationService } from '../../services/organization.service';
import type { IOrganization } from '../../types';
import toast from 'react-hot-toast';

export default function OrganizationPage() {
  const [org, setOrg] = useState<IOrganization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrg();
  }, []);

  const loadOrg = async () => {
    try {
      const res = await organizationService.getMyOrganization();
      setOrg(res);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load organization');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[50vh]" />;

  if (!org) {
    return (
      <div className="space-y-6">
        <PageHeader title="Organization" subtitle="Your organization details" />
        <EmptyState
          icon={<Building2 size={28} />}
          title="No Organization"
          description="You don't have an organization yet. Create one to get started."
        />
      </div>
    );
  }

  const templateId = typeof org.templateId === 'object'
    ? (org.templateId as any)?._id
    : org.templateId || null;

  return (
    <div className="space-y-6">
      <PageHeader title="Organization" subtitle="Your organization details" />

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-dark-200/60 overflow-hidden"
      >
        {/* Accent bar */}
        <div className="h-1 bg-linear-to-r from-primary-500 to-primary-600" />

        <div className="p-6 sm:p-7">
          {/* Header row */}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-12 h-12 bg-linear-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-sm">
              {org.name?.[0]?.toUpperCase() || 'O'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-dark-900 truncate">{org.name}</h3>
              <p className="text-[11px] text-dark-400 mt-0.5">Organization Account</p>
            </div>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 ${
              org.isRevoked
                ? 'bg-red-50 text-red-600 ring-1 ring-red-100'
                : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
            }`}>
              {org.isRevoked
                ? <><XCircle size={11} /> Revoked</>
                : <><CheckCircle size={11} /> Active</>
              }
            </span>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Org ID */}
            <div className="bg-dark-50/60 rounded-lg p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-1.5">
                <Hash size={13} className="text-dark-400 shrink-0" />
                <span className="text-[10px] text-dark-400 uppercase tracking-widest font-semibold">Org ID</span>
              </div>
              <p className="text-[13px] text-dark-700 font-mono truncate" title={org._id}>
                {org._id}
              </p>
            </div>

            {/* Phone */}
            <div className="bg-dark-50/60 rounded-lg p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-1.5">
                <Phone size={13} className="text-dark-400 shrink-0" />
                <span className="text-[10px] text-dark-400 uppercase tracking-widest font-semibold">Phone</span>
              </div>
              <p className="text-[13px] text-dark-700 font-medium truncate">
                {org.phoneNumber || '—'}
              </p>
            </div>

            {/* Created */}
            <div className="bg-dark-50/60 rounded-lg p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar size={13} className="text-dark-400 shrink-0" />
                <span className="text-[10px] text-dark-400 uppercase tracking-widest font-semibold">Created</span>
              </div>
              <p className="text-[13px] text-dark-700 font-medium tabular-nums">
                {new Date(org.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })}
              </p>
            </div>

            {/* Template */}
            <div className="bg-dark-50/60 rounded-lg p-4 overflow-hidden">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield size={13} className="text-dark-400 shrink-0" />
                <span className="text-[10px] text-dark-400 uppercase tracking-widest font-semibold">Template</span>
              </div>
              {templateId ? (
                <p className="text-[13px] text-dark-700 font-mono truncate" title={templateId}>
                  {templateId}
                </p>
              ) : (
                <p className="text-[13px] text-dark-400 italic">Not assigned</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
