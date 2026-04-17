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
export const consultants: Consultant[] = [
  {
    id: 'c001', name: 'Arjun Sharma', email: 'arjun.sharma@email.com', phone: '+1-408-555-0101',
    visaType: 'H1B', visaExpiry: '2026-08-15', i94Expiry: '2026-08-15', passportExpiry: '2027-03-10',
    techStack: ['Java', 'Spring Boot', 'AWS', 'Kubernetes', 'PostgreSQL'], experience: 7,
    location: 'San Jose, CA', status: 'On Bench', buyRate: 55, compliance: { passport: true, i94: true, lca: true, i797: true },
    availableFrom: '2026-04-01', submissionsCount: 8, interviewsCount: 3,
  },
  {
    id: 'c002', name: 'Priya Nair', email: 'priya.nair@email.com', phone: '+1-214-555-0202',
    visaType: 'OPT', visaExpiry: '2026-06-20', i94Expiry: '2026-06-20', passportExpiry: '2028-11-05',
    techStack: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'GCP'], experience: 4,
    location: 'Dallas, TX', status: 'On Project', buyRate: 40, compliance: { passport: true, i94: true, lca: false, i797: false },
    availableFrom: '2026-07-01', submissionsCount: 5, interviewsCount: 2,
  },
  {
    id: 'c003', name: 'Rahul Mehta', email: 'rahul.mehta@email.com', phone: '+1-312-555-0303',
    visaType: 'STEM OPT', visaExpiry: '2026-05-10', i94Expiry: '2026-05-10', passportExpiry: '2026-09-20',
    techStack: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker'], experience: 5,
    location: 'Chicago, IL', status: 'Interview', buyRate: 48, compliance: { passport: true, i94: true, lca: false, i797: false },
    availableFrom: '2026-04-15', submissionsCount: 12, interviewsCount: 5,
  },
  {
    id: 'c004', name: 'Kavya Reddy', email: 'kavya.reddy@email.com', phone: '+1-917-555-0404',
    visaType: 'H4 EAD', visaExpiry: '2027-01-30', i94Expiry: '2027-01-30', passportExpiry: '2029-04-15',
    techStack: ['Salesforce', 'Apex', 'LWC', 'SOQL', 'Integration'], experience: 6,
    location: 'New York, NY', status: 'On Bench', buyRate: 52, compliance: { passport: true, i94: true, lca: true, i797: false },
    availableFrom: '2026-04-08', submissionsCount: 6, interviewsCount: 1,
  },
  {
    id: 'c005', name: 'Vikram Joshi', email: 'vikram.joshi@email.com', phone: '+1-678-555-0505',
    visaType: 'GC-EAD', visaExpiry: '2027-09-12', i94Expiry: '2027-09-12', passportExpiry: '2030-02-28',
    techStack: ['Tableau', 'Power BI', 'SQL', 'Snowflake', 'Python'], experience: 9,
    location: 'Atlanta, GA', status: 'On Project', buyRate: 65, compliance: { passport: true, i94: true, lca: true, i797: true },
    availableFrom: '2026-08-01', submissionsCount: 15, interviewsCount: 7,
  },
  {
    id: 'c006', name: 'Ananya Patel', email: 'ananya.patel@email.com', phone: '+1-512-555-0606',
    visaType: 'OPT', visaExpiry: '2026-04-30', i94Expiry: '2026-04-30', passportExpiry: '2027-07-14',
    techStack: ['SAP FICO', 'SAP MM', 'ABAP', 'S/4 HANA'], experience: 3,
    location: 'Austin, TX', status: 'On Bench', buyRate: 38, compliance: { passport: true, i94: false, lca: false, i797: false },
    availableFrom: '2026-04-01', submissionsCount: 4, interviewsCount: 0,
  },
  {
    id: 'c007', name: 'Suresh Kumar', email: 'suresh.kumar@email.com', phone: '+1-425-555-0707',
    visaType: 'H1B', visaExpiry: '2028-03-05', i94Expiry: '2028-03-05', passportExpiry: '2031-06-18',
    techStack: ['DevOps', 'Jenkins', 'Terraform', 'Azure', 'Ansible'], experience: 11,
    location: 'Seattle, WA', status: 'On Bench', buyRate: 70, compliance: { passport: true, i94: true, lca: true, i797: true },
    availableFrom: '2026-04-07', submissionsCount: 20, interviewsCount: 8,
  },
  {
    id: 'c008', name: 'Deepa Mohan', email: 'deepa.mohan@email.com', phone: '+1-571-555-0808',
    visaType: 'Green Card', visaExpiry: '2030-12-31', i94Expiry: '2030-12-31', passportExpiry: '2029-10-22',
    techStack: ['Business Analyst', 'Agile', 'Scrum', 'JIRA', 'Confluence'], experience: 8,
    location: 'Washington, DC', status: 'Interview', buyRate: 58, compliance: { passport: true, i94: true, lca: false, i797: false },
    availableFrom: '2026-04-20', submissionsCount: 9, interviewsCount: 4,
  },
  {
    id: 'c009', name: 'Kiran Reddy', email: 'kiran.reddy@email.com', phone: '+1-310-555-0909',
    visaType: 'CPT', visaExpiry: '2026-12-15', i94Expiry: '2026-12-15', passportExpiry: '2028-05-30',
    techStack: ['iOS', 'Swift', 'SwiftUI', 'Flutter', 'Firebase'], experience: 2,
    location: 'Los Angeles, CA', status: 'On Bench', buyRate: 35, compliance: { passport: true, i94: true, lca: false, i797: false },
    availableFrom: '2026-04-10', submissionsCount: 3, interviewsCount: 1,
  },
  {
    id: 'c010', name: 'Sanjay Verma', email: 'sanjay.verma@email.com', phone: '+1-713-555-1010',
    visaType: 'H1B', visaExpiry: '2025-10-20', i94Expiry: '2025-10-20', passportExpiry: '2026-07-11',
    techStack: ['Oracle DBA', 'PL/SQL', 'RAC', 'Data Guard', 'Exadata'], experience: 13,
    location: 'Houston, TX', status: 'On Bench', buyRate: 72, compliance: { passport: false, i94: false, lca: false, i797: false },
    availableFrom: '2026-04-01', submissionsCount: 22, interviewsCount: 9,
  },
];

// ── Vendors ────────────────────────────────────────────────────
export const vendors: Vendor[] = [
  { id: 'v001', company: 'Infosys BPO', contactPerson: 'Michael Chen', email: 'mchen@infosys.com', phone: '+1-408-555-1001', type: 'Prime Vendor', relationshipStrength: 92, interviewsGiven: 45, placements: 12, activeSubmissions: 7, location: 'Sunnyvale, CA', netTerms: 30 },
  { id: 'v002', company: 'Wipro Staffing', contactPerson: 'Sarah Johnson', email: 'sjohnson@wipro.com', phone: '+1-214-555-1002', type: 'Prime Vendor', relationshipStrength: 78, interviewsGiven: 28, placements: 8, activeSubmissions: 5, location: 'Dallas, TX', netTerms: 45 },
  { id: 'v003', company: 'TechMahindra Solutions', contactPerson: 'David Park', email: 'dpark@techmahindra.com', phone: '+1-312-555-1003', type: 'Tier 2 Vendor', relationshipStrength: 65, interviewsGiven: 18, placements: 4, activeSubmissions: 3, location: 'Chicago, IL', netTerms: 30 },
  { id: 'v004', company: 'Capgemini Consulting', contactPerson: 'Emily Rodriguez', email: 'erodriguez@capgemini.com', phone: '+1-212-555-1004', type: 'Direct Client', relationshipStrength: 88, interviewsGiven: 34, placements: 10, activeSubmissions: 4, location: 'New York, NY', netTerms: 30 },
  { id: 'v005', company: 'HCL Technologies', contactPerson: 'James Wilson', email: 'jwilson@hcl.com', phone: '+1-512-555-1005', type: 'Prime Vendor', relationshipStrength: 55, interviewsGiven: 12, placements: 3, activeSubmissions: 2, location: 'Austin, TX', netTerms: 45 },
];

// ── Submissions ───────────────────────────────────────────────
export const submissions: Submission[] = [
  { id: 's001', consultantId: 'c001', consultantName: 'Arjun Sharma', vendorId: 'v001', vendorName: 'Infosys BPO', position: 'Java Developer', buyRate: 55, sellRate: 78, status: 'Round 1', submittedAt: '2026-04-01', lastUpdated: '2026-04-05', recruiter: 'Alex Kim', location: 'Sunnyvale, CA' },
  { id: 's002', consultantId: 'c003', consultantName: 'Rahul Mehta', vendorId: 'v002', vendorName: 'Wipro Staffing', position: 'Full Stack Developer', buyRate: 48, sellRate: 72, status: 'Client Screening', submittedAt: '2026-04-02', lastUpdated: '2026-04-04', recruiter: 'Alex Kim', location: 'Dallas, TX' },
  { id: 's003', consultantId: 'c007', consultantName: 'Suresh Kumar', vendorId: 'v004', vendorName: 'Capgemini Consulting', position: 'DevOps Engineer', buyRate: 70, sellRate: 98, status: 'Offer', submittedAt: '2026-03-28', lastUpdated: '2026-04-06', recruiter: 'Priya M', location: 'New York, NY' },
  { id: 's004', consultantId: 'c004', consultantName: 'Kavya Reddy', vendorId: 'v001', vendorName: 'Infosys BPO', position: 'Salesforce Developer', buyRate: 52, sellRate: 75, status: 'Submitted', submittedAt: '2026-04-06', lastUpdated: '2026-04-06', recruiter: 'Alex Kim', location: 'San Jose, CA' },
  { id: 's005', consultantId: 'c005', consultantName: 'Vikram Joshi', vendorId: 'v003', vendorName: 'TechMahindra', position: 'Data Analyst', buyRate: 65, sellRate: 90, status: 'Placed', submittedAt: '2026-03-15', lastUpdated: '2026-04-01', recruiter: 'Priya M', location: 'Chicago, IL' },
  { id: 's006', consultantId: 'c008', consultantName: 'Deepa Mohan', vendorId: 'v005', vendorName: 'HCL Technologies', position: 'Business Analyst', buyRate: 58, sellRate: 82, status: 'Round 2', submittedAt: '2026-04-03', lastUpdated: '2026-04-06', recruiter: 'Alex Kim', location: 'Austin, TX' },
  { id: 's007', consultantId: 'c002', consultantName: 'Priya Nair', vendorId: 'v002', vendorName: 'Wipro Staffing', position: 'ML Engineer', buyRate: 40, sellRate: 62, status: 'Submitted', submittedAt: '2026-04-05', lastUpdated: '2026-04-05', recruiter: 'Priya M', location: 'Dallas, TX' },
  { id: 's008', consultantId: 'c010', consultantName: 'Sanjay Verma', vendorId: 'v004', vendorName: 'Capgemini', position: 'Oracle DBA', buyRate: 72, sellRate: 100, status: 'Rejected', submittedAt: '2026-03-25', lastUpdated: '2026-04-02', recruiter: 'Alex Kim', location: 'New York, NY' },
];

// ── Invoices ──────────────────────────────────────────────────
export const invoices: Invoice[] = [
  { id: 'INV-2026-001', vendorName: 'Capgemini Consulting', consultantName: 'Vikram Joshi', hours: 160, rate: 90, amount: 14400, status: 'Paid', dueDate: '2026-03-30', issuedDate: '2026-03-01', netTerms: 30 },
  { id: 'INV-2026-002', vendorName: 'Infosys BPO', consultantName: 'Arjun Sharma', hours: 168, rate: 78, amount: 13104, status: 'Pending', dueDate: '2026-05-05', issuedDate: '2026-04-05', netTerms: 30 },
  { id: 'INV-2026-003', vendorName: 'Wipro Staffing', consultantName: 'Rahul Mehta', hours: 160, rate: 72, amount: 11520, status: 'Overdue', dueDate: '2026-03-20', issuedDate: '2026-02-20', netTerms: 30 },
  { id: 'INV-2026-004', vendorName: 'Capgemini Consulting', consultantName: 'Suresh Kumar', hours: 176, rate: 98, amount: 17248, status: 'Pending', dueDate: '2026-05-06', issuedDate: '2026-04-06', netTerms: 30 },
  { id: 'INV-2026-005', vendorName: 'TechMahindra', consultantName: 'Deepa Mohan', hours: 160, rate: 82, amount: 13120, status: 'Paid', dueDate: '2026-03-15', issuedDate: '2026-02-15', netTerms: 30 },
];

// ── Audit Logs ────────────────────────────────────────────────
export const auditLogs: AuditLog[] = [
  { id: 'a001', user: 'Alex Kim', action: 'Updated Buy Rate', entity: 'Arjun Sharma', oldValue: '$50/hr', newValue: '$55/hr', timestamp: '2026-04-06T14:32:00Z' },
  { id: 'a002', user: 'Priya M', action: 'Status Changed', entity: 'Submission s003', oldValue: 'Round 2', newValue: 'Offer', timestamp: '2026-04-06T12:15:00Z' },
  { id: 'a003', user: 'Alex Kim', action: 'Added Consultant', entity: 'Kiran Reddy', timestamp: '2026-04-05T09:00:00Z' },
  { id: 'a004', user: 'Admin', action: 'Generated Invoice', entity: 'INV-2026-004', timestamp: '2026-04-06T08:00:00Z' },
  { id: 'a005', user: 'Priya M', action: 'Masked Resume', entity: 'Suresh Kumar', timestamp: '2026-04-05T16:45:00Z' },
  { id: 'a006', user: 'Alex Kim', action: 'Submission Created', entity: 'Kavya Reddy → Infosys', timestamp: '2026-04-06T11:20:00Z' },
];

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
