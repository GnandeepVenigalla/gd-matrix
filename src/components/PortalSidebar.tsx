'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

export default function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/portal/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: 'var(--cyan)', color: 'white' }}>GD</div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-name">GD Matrix</span>
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

      {/* Temp Switch to Admin */}
      <div style={{ padding: '0 1rem', marginTop: 'auto', marginBottom: '1rem' }}>
         <Link href="/dashboard" className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
            <ArrowLeftRight size={16}/> Switch to Admin
         </Link>
      </div>

      <div className="sidebar-footer">
        <div className="avatar" style={{ background: 'var(--cyan)', color: 'white' }}>AS</div>
        <div className="avatar-info">
          <div className="avatar-name">Arjun Sharma</div>
          <div className="avatar-role">Java Developer</div>
        </div>
        <button className="btn-icon" title="Sign out" style={{ marginLeft: 'auto' }}><LogOut /></button>
      </div>
    </aside>
  );
}
