'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Users, Send, DollarSign, Building2,
  FileText, Settings, ShieldCheck, Bell, LogOut, Activity, TrendingUp,
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
      { href: '/insights', label: 'Student Insights', icon: TrendingUp },
      { href: '/compliance', label: 'Visa & Compliance', icon: ShieldCheck, badge: '2', alert: true },
      { href: '/audit', label: 'Audit Logs', icon: Bell },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

import Logo from './Logo';

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Alex Kim', title: 'Sr. Recruiter', company: 'GD Matrix' });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.name) {
          setUser({
            name: u.name,
            title: u.role === 'employer' ? 'Admin' : (u.title || 'Consultant'),
            company: u.companyName || 'GD Matrix'
          });
        }
      } catch (e) {}
    }
  }, []);

  const initials = user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: 'transparent', padding: 0 }}>
          <Logo style={{ width: 28, height: 28, color: 'var(--accent, #1e3a8a)' }} />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">{user.company}</span>
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

      <div className="sidebar-footer">
        <div className="avatar">{initials}</div>
        <div className="avatar-info">
          <div className="avatar-name">{user.name}</div>
          <div className="avatar-role">{user.title}</div>
        </div>
        <button 
          className="btn-icon" 
          title="Sign out" 
          style={{ marginLeft: 'auto' }}
          onClick={() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            window.location.href = '/auth';
          }}
        >
          <LogOut />
        </button>
      </div>
    </aside>
  );
}
