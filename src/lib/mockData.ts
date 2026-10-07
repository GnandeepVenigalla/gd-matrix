export type VisaType = 'H1B' | 'OPT' | 'STEM OPT' | 'CPT' | 'H4 EAD' | 'GC-EAD' | 'Green Card' | 'US Citizen';
export type ConsultantStatus = 'On Bench' | 'On Project' | 'Interview' | 'Unavailable';
export type SubmissionStatus = 'Submitted' | 'Client Screening' | 'Round 1' | 'Round 2' | 'Offer' | 'Placed' | 'Rejected';

export interface Consultant {
  id: string;
  name: string;
  email: string;
  phone: string;
  visaType: VisaType;
  visaExpiry: string;
  i94Expiry: string;
  passportExpiry: string;
  techStack: string[];
  experience: number;
  location: string;
  status: ConsultantStatus;
  buyRate: number;
  compliance: {
    passport: boolean;
    i94: boolean;
    lca: boolean;
    i797: boolean;
  };
  linkedinUrl?: string;
  availableFrom: string;
  submissionsCount: number;
  interviewsCount: number;
}

export interface Vendor {
  id: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  type: 'Prime Vendor' | 'Direct Client' | 'Tier 2 Vendor';
  relationshipStrength: number;
  interviewsGiven: number;
  placements: number;
  activeSubmissions: number;
  location: string;
  netTerms: number;
}

export interface Submission {
  id: string;
  consultantId: string;
  consultantName: string;
  vendorId: string;
  vendorName: string;
  position: string;
  buyRate: number;
  sellRate: number;
  status: SubmissionStatus;
  submittedAt: string;
  lastUpdated: string;
  recruiter: string;
  notes?: string;
  location: string;
}

export interface Invoice {
  id: string;
  vendorName: string;
  consultantName: string;
  hours: number;
  rate: number;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  issuedDate: string;
  netTerms: number;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
}

// ── Consultants ────────────────────────────────────────────────
export const consultants: Consultant[] = [];

// ── Vendors ────────────────────────────────────────────────────
export const vendors: Vendor[] = [];

// ── Submissions ───────────────────────────────────────────────
export const submissions: Submission[] = [];

// ── Invoices ──────────────────────────────────────────────────
export const invoices: Invoice[] = [];

// ── Audit Logs ────────────────────────────────────────────────
export const auditLogs: AuditLog[] = [];

// ── Helpers ───────────────────────────────────────────────────
export function getMargin(buyRate: number, sellRate: number) {
  const hourly = sellRate - buyRate;
  const monthly = hourly * 160;
  const pct = ((hourly / sellRate) * 100).toFixed(1);
  return { hourly, monthly, pct };
}

export function getComplianceScore(c: Consultant['compliance']) {
  const items = Object.values(c);
  return Math.round((items.filter(Boolean).length / items.length) * 100);
}

export function getVisaUrgency(expiry: string): 'critical' | 'warning' | 'ok' {
  const days = Math.floor((new Date(expiry).getTime() - Date.now()) / 86400000);
  if (days <= 30) return 'critical';
  if (days <= 90) return 'warning';
  return 'ok';
}

export function getDaysUntil(dateStr: string) {
  return Math.floor((new Date(dateStr).getTime() - Date.now()) / 86400000);
}
