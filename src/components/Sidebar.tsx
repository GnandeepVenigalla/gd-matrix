'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Send, DollarSign, Building2,
  FileText, Settings, ShieldCheck, Bell, LogOut, Activity,
  type LucideIcon,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
  alert?: boolean;
};

type NavSection = {
  section: string;
  items: NavItem[];
};

const nav: NavSection[] = [
  {
    section: 'Core',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/bench', label: 'The Bench', icon: Users, badge: '5' },
      { href: '/submissions', label: 'Submissions', icon: Send, badge: '8' },
      { href: '/vendors', label: 'Vendors', icon: Building2 },
    ],
  },
  {
    section: 'Finance',
    items: [
      { href: '/financials', label: 'FinOps Ledger', icon: DollarSign },
      { href: '/timesheets', label: 'Timesheets', icon: FileText, badge: '3' },
      { href: '/invoices', label: 'Invoices', icon: Activity },
    ],
  },
  {
    section: 'Admin',
    items: [
      { href: '/compliance', label: 'Visa & Compliance', icon: ShieldCheck, badge: '2', alert: true },
      { href: '/audit', label: 'Audit Logs', icon: Bell },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon">GD</div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">GD Matrix</span>
          <span className="sidebar-logo-sub">Talent OS</span>
        </div>
      </Link>

      <nav className="sidebar-nav">
        {nav.map((section) => (
          <div key={section.section}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link key={item.href} href={item.href} className={`nav-item${active ? ' active' : ''}`}>
                  <Icon />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  {item.badge && (
                    <span className={`nav-badge${item.alert ? ' nav-badge--alert' : ''}`} style={{ flexShrink: 0 }}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Temp Switch to Portal */}
      <div style={{ padding: '0 1rem', marginTop: 'auto', marginBottom: '1rem' }}>
         <Link href="/portal/dashboard" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
            Switch to Portal
         </Link>
      </div>

      <div className="sidebar-footer">
        <div className="avatar">AK</div>
        <div className="avatar-info">
          <div className="avatar-name">Alex Kim</div>
          <div className="avatar-role">Sr. Recruiter</div>
        </div>
        <button className="btn-icon" title="Sign out" style={{ marginLeft: 'auto' }}><LogOut /></button>
      </div>
    </aside>
  );
}
