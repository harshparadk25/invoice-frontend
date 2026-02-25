import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Shield, UserCog, Users } from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import { memberService } from '../../services/member.service';
import { organizationService } from '../../services/organization.service';
import type { IMember } from '../../types';
import toast from 'react-hot-toast';

export default function MembersPage() {
  const [members, setMembers] = useState<IMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const org = await organizationService.getMyOrganization();
      if (!org) {
        setLoading(false);
        return;
      }
      setOrgId(org._id);
      const res = await memberService.getAll(org._id, true);
      setMembers(res.data);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[50vh]" />;

  if (!orgId) {
    return (
      <div className="space-y-6">
        <PageHeader title="Members" subtitle="Team members who can create invoices" />
        <EmptyState
          icon={<UserCog size={28} />}
          title="No Organization"
          description="You need an organization to view members."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Members" subtitle="Team members who can create invoices" />

      {/* Stats bar */}
      <div className="bg-white rounded-xl p-5 border border-dark-200/60">
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-1.5 text-dark-500">
            <Users size={14} />
            <span className="font-medium tabular-nums">{members.length}</span> total
          </div>
          <div className="flex items-center gap-1.5 text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="font-medium tabular-nums">{members.filter(m => m.isActive).length}</span> active
          </div>
          <div className="flex items-center gap-1.5 text-dark-400">
            <span className="w-1.5 h-1.5 rounded-full bg-dark-300" />
            <span className="font-medium tabular-nums">{members.filter(m => !m.isActive).length}</span> inactive
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={<UserCog size={28} />}
          title="No members yet"
          description="No team members have been added to this organization."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member, i) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl p-5 border transition-all ${
                member.isActive ? 'border-dark-200/60 hover:shadow-sm' : 'border-dark-200/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-semibold text-[13px] shrink-0 ${
                  member.role === 'owner' ? 'bg-linear-to-br from-amber-500 to-orange-500' : 'bg-linear-to-br from-primary-400 to-primary-600'
                }`}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] font-semibold text-dark-800 flex items-center gap-1.5">
                    <span className="truncate min-w-0">{member.name}</span>
                    {member.role === 'owner' && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] rounded-md font-medium shrink-0 whitespace-nowrap">
                        <Shield size={9} className="inline mr-0.5" /> Owner
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-dark-400 flex items-center gap-1">
                    <Phone size={10} /> {member.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-dark-100">
                <div className="flex items-center gap-3 text-[12px] text-dark-400">
                  <span className="tabular-nums">{member.invoiceCount} invoices</span>
                  {member.lastInvoiceAt && (
                    <span className="tabular-nums">Last: {new Date(member.lastInvoiceAt).toLocaleDateString()}</span>
                  )}
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-medium ${
                  member.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
