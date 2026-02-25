import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Building2, Mail, Phone, MapPin, Hash, CreditCard,
  Edit3, Save, X, Upload, Image,
} from 'lucide-react';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { organizationService, templateService } from '../../services/organization.service';
import type { IInvoiceTemplate } from '../../types';
import toast from 'react-hot-toast';

interface TemplateForm {
  companyName: string;
  email: string;
  phone: string;
  address: string;
  trn: string;
  bankDetails: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    branchName: string;
    swift: string;
    iban: string;
  };
}

const emptyBankDetails = {
  accountName: '', bankName: '', accountNumber: '',
  branchName: '', swift: '', iban: '',
};

export default function TemplatesPage() {
  const [template, setTemplate] = useState<IInvoiceTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);

  // Edit state
  const [editModal, setEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TemplateForm>({
    companyName: '', email: '', phone: '', address: '', trn: '',
    bankDetails: { ...emptyBankDetails },
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [stampFile, setStampFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [stampPreview, setStampPreview] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const stampRef = useRef<HTMLInputElement>(null);

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
      const tpl = await templateService.get(org._id);
      setTemplate(tpl);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = () => {
    if (!template) return;
    setForm({
      companyName: template.companyName || '',
      email: template.email || '',
      phone: template.phone || '',
      address: template.address || '',
      trn: template.trn || '',
      bankDetails: {
        accountName: template.bankDetails?.accountName || '',
        bankName: template.bankDetails?.bankName || '',
        accountNumber: template.bankDetails?.accountNumber || '',
        branchName: template.bankDetails?.branchName || '',
        swift: template.bankDetails?.swift || '',
        iban: template.bankDetails?.iban || '',
      },
    });
    setLogoFile(null);
    setStampFile(null);
    setLogoPreview(template.companyLogoUrl || null);
    setStampPreview(template.companyStampUrl || null);
    setEditModal(true);
  };

  const handleFileChange = (type: 'logo' | 'stamp', file: File | null) => {
    if (!file) return;
    if (type === 'logo') {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setStampFile(file);
      setStampPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!orgId) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('companyName', form.companyName);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('address', form.address);
      fd.append('trn', form.trn);
      fd.append('bankDetails', JSON.stringify(form.bankDetails));
      if (logoFile) fd.append('logo', logoFile);
      if (stampFile) fd.append('stamp', stampFile);

      const updated = await templateService.update(orgId, fd);
      setTemplate(updated);
      setEditModal(false);
      toast.success('Template updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update template');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof TemplateForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateBankField = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [key]: value },
    }));
  };

  if (loading) return <LoadingSpinner size="lg" className="min-h-[50vh]" />;

  const inputClass =
    'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-dark-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all';

  const labelClass =
    'block text-[11px] font-semibold text-dark-500 uppercase tracking-widest mb-1';

  /* ── Reusable section header inside the modal ── */
  const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-7 h-7 rounded-md bg-primary-50 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-primary-600" />
      </div>
      <h4 className="text-[13px] font-semibold text-dark-700">{title}</h4>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice Template"
        subtitle="Your invoice template configuration"
        action={
          template ? (
            <button
              onClick={openEdit}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-[13px] font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
            >
              <Edit3 size={15} />
              Edit Template
            </button>
          ) : undefined
        }
      />

      {/* ─── Display Card ─── */}
      {!template ? (
        <EmptyState
          icon={<Settings size={28} />}
          title="No Template"
          description="No invoice template has been configured for your organization."
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-dark-200/60 shadow-sm overflow-hidden"
        >
          {/* Card header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <Building2 size={16} className="text-primary-600" />
            <h3 className="text-base font-semibold text-dark-800">Company Details</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Logo + Info + Stamp */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {template.companyLogoUrl && (
                <img
                  src={template.companyLogoUrl}
                  alt="Logo"
                  className="w-16 h-16 object-contain rounded-lg border border-slate-200 bg-slate-50 p-1 shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-bold text-dark-900 truncate">
                  {template.companyName}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-3 text-[13px]">
                  {template.email && (
                    <div className="flex items-center gap-2 text-dark-500 min-w-0">
                      <Mail size={13} className="text-dark-400 shrink-0" />
                      <span className="truncate">{template.email}</span>
                    </div>
                  )}
                  {template.phone && (
                    <div className="flex items-center gap-2 text-dark-500">
                      <Phone size={13} className="text-dark-400 shrink-0" />
                      <span>{template.phone}</span>
                    </div>
                  )}
                  {template.address && (
                    <div className="flex items-center gap-2 text-dark-500 min-w-0">
                      <MapPin size={13} className="text-dark-400 shrink-0" />
                      <span className="truncate">{template.address}</span>
                    </div>
                  )}
                  {template.trn && (
                    <div className="flex items-center gap-2 text-dark-500">
                      <Hash size={13} className="text-dark-400 shrink-0" />
                      <span>TRN: {template.trn}</span>
                    </div>
                  )}
                </div>
              </div>

              {template.companyStampUrl && (
                <img
                  src={template.companyStampUrl}
                  alt="Stamp"
                  className="w-14 h-14 object-contain rounded-lg border border-slate-200 bg-slate-50 p-1 shrink-0"
                />
              )}
            </div>

            {/* Bank Details */}
            {template.bankDetails && (
              <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-5">
                <h4 className="text-[11px] font-semibold text-dark-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CreditCard size={12} /> Bank Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-[13px]">
                  {template.bankDetails.accountName && (
                    <div>
                      <span className="text-dark-400">Account:</span>{' '}
                      <span className="text-dark-700 font-medium">{template.bankDetails.accountName}</span>
                    </div>
                  )}
                  {template.bankDetails.bankName && (
                    <div>
                      <span className="text-dark-400">Bank:</span>{' '}
                      <span className="text-dark-700 font-medium">{template.bankDetails.bankName}</span>
                    </div>
                  )}
                  {template.bankDetails.accountNumber && (
                    <div>
                      <span className="text-dark-400">Acc #:</span>{' '}
                      <span className="text-dark-700 font-medium">{template.bankDetails.accountNumber}</span>
                    </div>
                  )}
                  {template.bankDetails.branchName && (
                    <div>
                      <span className="text-dark-400">Branch:</span>{' '}
                      <span className="text-dark-700 font-medium">{template.bankDetails.branchName}</span>
                    </div>
                  )}
                  {template.bankDetails.swift && (
                    <div>
                      <span className="text-dark-400">SWIFT:</span>{' '}
                      <span className="text-dark-700 font-medium">{template.bankDetails.swift}</span>
                    </div>
                  )}
                  {template.bankDetails.iban && (
                    <div>
                      <span className="text-dark-400">IBAN:</span>{' '}
                      <span className="text-dark-700 font-medium">{template.bankDetails.iban}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ─── Edit Template Modal ─── */}
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Edit Invoice Template"
        maxWidth="max-w-2xl"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setEditModal(false)}
              className="flex-1 py-2.5 border border-slate-300 text-dark-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-[13px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 text-[13px] shadow-sm"
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="space-y-5">

          {/* ── Company Information ── */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <SectionHeader icon={Building2} title="Company Information" />

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Company Name</label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={form.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    placeholder="+971 XX XXX XXXX"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Address</label>
                  <input
                    type="text"
                    placeholder="Company address"
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>TRN</label>
                  <input
                    type="text"
                    placeholder="Tax Registration Number"
                    value={form.trn}
                    onChange={(e) => updateField('trn', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Logo & Stamp ── */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <SectionHeader icon={Image} title="Logo & Stamp" />

            <div className="grid grid-cols-2 gap-4">
              {/* Logo upload */}
              <div>
                <label className={labelClass}>Company Logo</label>
                <div
                  onClick={() => logoRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1.5 py-4 px-3 border-2 border-dashed border-slate-300 rounded-lg bg-white hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer group"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="w-11 h-11 object-contain rounded-md border border-slate-200" />
                  ) : (
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Upload size={15} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                  )}
                  <p className="text-[10px] font-medium text-slate-500 group-hover:text-primary-600 text-center truncate max-w-full transition-colors">
                    {logoFile ? logoFile.name : 'Click to upload'}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 text-center">PNG, JPG — max 5 MB</p>
                <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('logo', e.target.files?.[0] || null)} />
              </div>

              {/* Stamp upload */}
              <div>
                <label className={labelClass}>Company Stamp</label>
                <div
                  onClick={() => stampRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-1.5 py-4 px-3 border-2 border-dashed border-slate-300 rounded-lg bg-white hover:border-primary-400 hover:bg-primary-50/30 transition-all cursor-pointer group"
                >
                  {stampPreview ? (
                    <img src={stampPreview} alt="Stamp" className="w-11 h-11 object-contain rounded-md border border-slate-200" />
                  ) : (
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                      <Upload size={15} className="text-slate-400 group-hover:text-primary-500 transition-colors" />
                    </div>
                  )}
                  <p className="text-[10px] font-medium text-slate-500 group-hover:text-primary-600 text-center truncate max-w-full transition-colors">
                    {stampFile ? stampFile.name : 'Click to upload'}
                  </p>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 text-center">PNG, JPG — max 5 MB</p>
                <input ref={stampRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('stamp', e.target.files?.[0] || null)} />
              </div>
            </div>
          </div>

          {/* ── Bank Details ── */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-4">
            <SectionHeader icon={CreditCard} title="Bank Details" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'accountName', label: 'Account Name', placeholder: 'Account holder name' },
                { key: 'bankName', label: 'Bank Name', placeholder: 'Bank name' },
                { key: 'accountNumber', label: 'Account Number', placeholder: 'Account number' },
                { key: 'branchName', label: 'Branch Name', placeholder: 'Branch name' },
                { key: 'swift', label: 'SWIFT Code', placeholder: 'SWIFT / BIC' },
                { key: 'iban', label: 'IBAN', placeholder: 'International Bank Account Number' },
              ].map((field) => (
                <div key={field.key}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={(form.bankDetails as any)[field.key]}
                    onChange={(e) => updateBankField(field.key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </Modal>
    </div>
  );
}
