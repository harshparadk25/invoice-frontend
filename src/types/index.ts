// ─── User & Auth ─────────────────────────────────────────
export interface IUser {
  id: string;
  name: string;
  email: string;
  whatsappNumber?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  user: IUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ─── Organization ────────────────────────────────────────
export interface IOrganization {
  _id: string;
  name: string;
  ownerId: string | IUser;
  phoneNumber: string;
  templateId?: string | IInvoiceTemplate;
  isRevoked: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Invoice Template ────────────────────────────────────
export interface IBankDetails {
  accountName: string;
  bankName: string;
  accountNumber: string;
  branchName: string;
  swift: string;
  iban: string;
}

export interface IInvoiceTemplate {
  _id: string;
  organizationId: string;
  companyName: string;
  companyLogoUrl?: string;
  companyStampUrl?: string;
  address: string;
  email: string;
  phone: string;
  trn: string;
  bankDetails: IBankDetails;
  createdAt: string;
  updatedAt: string;
}

// ─── Invoice ─────────────────────────────────────────────
export interface IInvoiceCustomer {
  name: string;
  email?: string;
  address?: string;
  phone?: string;
  company?: string;
  branch?: string;
}

export interface IInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
  tax: number;
}

export interface IInvoiceTotal {
  subTotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
}

export interface IInvoice {
  _id: string;
  organizationId: string;
  templateId: string;
  invoiceNumber: string;
  invoiceDate: string;
  customer: IInvoiceCustomer;
  items: IInvoiceItem[];
  total: IInvoiceTotal;
  pdfUrl: string;
  generatedBy: {
    memberId?: string;
    phoneNumber: string;
    memberName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IInvoiceAnalytics {
  success: boolean;
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export interface IMemberStats {
  _id: string;
  memberName: string;
  phoneNumber: string;
  totalInvoices: number;
  totalAmount: number;
  lastInvoiceDate: string;
}

// ─── Customer ────────────────────────────────────────────
export interface ICustomer {
  _id: string;
  organizationId: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  trn?: string;
  company?: string;
  branch?: string;
  invoiceCount: number;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Member ──────────────────────────────────────────────
export interface IMember {
  _id: string;
  organizationId: string;
  name: string;
  phoneNumber: string;
  role: 'owner' | 'member';
  isActive: boolean;
  addedBy: string;
  invoiceCount: number;
  lastInvoiceAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Pagination ──────────────────────────────────────────
export interface IPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Admin ───────────────────────────────────────────────
export interface IAdminStats {
  success: boolean;
  totalOrganizations: number;
  totalUsers: number;
  totalInvoices: number;
  revokedOrganizations: number;
}

export interface IAdminOrganization extends IOrganization {
  owner?: IUser;
  template?: IInvoiceTemplate;
}

// ─── Conversation ────────────────────────────────────────
export interface IConversationSession {
  phoneNumber: string;
  sessionId: string;
  state: string;
  organizationId?: string;
  hasCompanyProfile: boolean;
  data: Record<string, unknown>;
  fieldStatus: Record<string, boolean>;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  messageCount: number;
}
