'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, FileText, ShieldCheck, BookOpen, LogOut, ArrowLeftRight,
  MessageSquare, Mail, AlertTriangle, Lightbulb, MessageCircle
} from 'lucide-react';

const nav = [
  {
    section: 'Self-Service',
    items: [
      { href: '/portal/dashboard', label: 'My Pipeline', icon: LayoutDashboard },
      { href: '/portal/timesheets', label: 'Timesheets', icon: FileText },
      { href: '/portal/compliance', label: 'Compliance Vault', icon: ShieldCheck },
      { href: '/portal/prep', label: 'Interview Prep', icon: BookOpen },
      { href: '/portal/feedback', label: 'My Feedback', icon: MessageSquare },
    ],
  },
  {
    section: 'Connect',
    items: [
      { href: '/portal/chat', label: 'Chat with Recruiter', icon: MessageCircle },
      { href: '/portal/webmail', label: 'Webmail', icon: Mail },
    ],
  },
  {
    section: 'Support',
    items: [
      { href: '/portal/emergency', label: 'Emergency Support', icon: AlertTriangle },
      { href: '/portal/ideas', label: 'Idea Protection', icon: Lightbulb },
    ],
  },
];

import Logo from './Logo';

export default function PortalSidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState({ name: 'Arjun Sharma', title: 'Java Developer', company: 'GD Matrix' });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.name) {
          setUser({
            name: u.name,
            title: u.title || 'Consultant',
            company: u.companyName || 'GD Matrix'
          });
        }
      } catch (e) {}
    }
  }, []);

  const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <aside className="sidebar">
      <Link href="/portal/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: 'transparent', padding: 0 }}>
          <Logo style={{ width: 28, height: 28, color: 'var(--cyan, #0ea5e9)' }} />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">{user.company}</span>
          <span className="sidebar-logo-sub">Consultant Portal</span>
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
                  <span style={{ flex: 1 }}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="avatar" style={{ background: 'var(--cyan)', color: 'white' }}>{initials}</div>
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
