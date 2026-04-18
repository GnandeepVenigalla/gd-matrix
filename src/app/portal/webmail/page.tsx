'use client';
import { Inbox, Send, Star, Archive, Trash2, Search, RefreshCw, Paperclip, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const emails = [
  { id: 'e1', from: 'Alex Kim', email: 'alex@gdmatrix.com', subject: 'Timesheet Approved – Week of Apr 7', preview: 'Hi Arjun, your timesheet for the week of Apr 7 has been approved. Payment will be processed...', date: 'Today, 9:14 AM', read: false, starred: true, tag: 'Timesheet', tagColor: '#2563eb' },
  { id: 'e2', from: 'Infosys BPO', email: 'noreply@infosys.com', subject: 'Interview Confirmation – Round 2 (Java Dev)', preview: 'This is to confirm your Round 2 interview scheduled for Thursday April 18 at 10:00 AM PST...', date: 'Yesterday', read: false, starred: false, tag: 'Interview', tagColor: '#7c3aed' },
  { id: 'e3', from: 'Priya M', email: 'priya@gdmatrix.com', subject: 'Updated Resume – Please Review', preview: 'Arjun, I have updated your resume with GD Matrix branding. Please review and confirm if...', date: 'Apr 15', read: true, starred: true, tag: 'Action Required', tagColor: '#d97706' },
  { id: 'e4', from: 'HR Department', email: 'hr@gdmatrix.com', subject: 'April Pay Stub Available', preview: 'Your pay stub for the period Mar 16 – Mar 31 is now available in the payment portal...', date: 'Apr 12', read: true, starred: false, tag: 'Payroll', tagColor: '#16a34a' },
  { id: 'e5', from: 'Alex Kim', email: 'alex@gdmatrix.com', subject: 'New Submission: Wipro – Full Stack Developer', preview: 'Hi Arjun, I have submitted your profile for a Full Stack Developer role at Wipro. The client...', date: 'Apr 10', read: true, starred: false, tag: 'Submission', tagColor: '#0891b2' },
  { id: 'e6', from: 'Compliance Team', email: 'compliance@gdmatrix.com', subject: 'Visa Expiry Reminder – Action Required', preview: 'This is a reminder that your H1B visa stamp expires on Aug 15, 2026. Please contact your...', date: 'Apr 8', read: true, starred: true, tag: 'Compliance', tagColor: '#dc2626' },
];

const folders = [
  { label: 'Inbox', icon: Inbox, count: 2 },
  { label: 'Starred', icon: Star, count: 3 },
  { label: 'Sent', icon: Send, count: 0 },
  { label: 'Archive', icon: Archive, count: 0 },
  { label: 'Trash', icon: Trash2, count: 0 },
];

export default function WebmailPage() {
  const [folder, setFolder] = useState('Inbox');
  const [selected, setSelected] = useState<string | null>('e1');
  const [search, setSearch] = useState('');

  const filtered = emails.filter(e => {
    if (folder === 'Starred') return e.starred;
    return e.subject.toLowerCase().includes(search.toLowerCase()) || e.from.toLowerCase().includes(search.toLowerCase());
  });
  const detail = emails.find(e => e.id === selected);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title"><h1>Webmail</h1><p>Manage timesheets, submissions, and communications from your inbox</p></div>
        <div className="top-bar-actions"><button className="btn btn-secondary btn-sm"><RefreshCw size={13} />Refresh</button></div>
      </div>
      <div className="page-content" style={{ padding: 0, display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
        {/* Folder Nav */}
        <div style={{ width: 180, borderRight: '1px solid var(--border)', padding: '12px 0', background: 'var(--white)' }}>
          <div style={{ padding: '0 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: 8 }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem' }}><Send size={13} />Compose</button>
          </div>
          {folders.map(f => {
            const I = f.icon;
            return (
              <div key={f.label} onClick={() => setFolder(f.label)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', cursor: 'pointer', borderRadius: 6, margin: '1px 6px', background: folder === f.label ? '#eff6ff' : 'transparent', color: folder === f.label ? '#2563eb' : 'var(--text-secondary)', fontWeight: folder === f.label ? 600 : 400, fontSize: '0.85rem' }}>
                <I size={14} />
                <span style={{ flex: 1 }}>{f.label}</span>
                {f.count > 0 && <span style={{ fontSize: '0.7rem', fontWeight: 700, background: '#2563eb', color: 'white', padding: '1px 6px', borderRadius: 99 }}>{f.count}</span>}
              </div>
            );
          })}
        </div>

        {/* Email List */}
        <div style={{ width: 300, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ paddingLeft: 28, width: '100%', fontSize: '0.82rem' }} />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(e => (
              <div key={e.id} onClick={() => setSelected(e.id)}
                style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: selected === e.id ? '#eff6ff' : !e.read ? '#fafbff' : 'var(--white)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                    {e.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <span style={{ fontWeight: e.read ? 400 : 700, fontSize: '0.85rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.from}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>{e.date}</span>
                </div>
                <div style={{ fontWeight: e.read ? 400 : 600, fontSize: '0.82rem', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.subject}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.preview}</span>
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: 4, background: e.tagColor + '20', color: e.tagColor, fontWeight: 600, flexShrink: 0 }}>{e.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Detail */}
        {detail ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--white)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{detail.subject}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon"><Star size={14} style={{ color: detail.starred ? '#f59e0b' : 'var(--text-muted)', fill: detail.starred ? '#f59e0b' : 'none' }} /></button>
                  <button className="btn-icon"><Archive size={14} /></button>
                  <button className="btn-icon"><Trash2 size={14} /></button>
                  <button className="btn-icon"><MoreHorizontal size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                  {detail.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{detail.from}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>&lt;{detail.email}&gt;</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>To: arjun.sharma@email.com · {detail.date}</div>
                </div>
                <span style={{ fontSize: '0.73rem', padding: '3px 8px', borderRadius: 4, background: detail.tagColor + '20', color: detail.tagColor, fontWeight: 600 }}>{detail.tag}</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', background: '#f8fafc' }}>
              <div style={{ background: 'var(--white)', borderRadius: 10, padding: '28px 32px', maxWidth: 700, border: '1px solid var(--border)' }}>
                <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Hi Arjun,</p>
                <br />
                <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{detail.preview}</p>
                <br />
                <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Please let us know if you have any questions or concerns. We are here to support you every step of the way.</p>
                <br />
                <p style={{ lineHeight: 1.8, color: 'var(--text))', fontSize: '0.9rem', fontWeight: 500 }}>Best regards,<br />{detail.from}<br />GD Matrix</p>
              </div>
            </div>
            <div style={{ padding: '12px 24px', borderTop: '1px solid var(--border)', background: 'var(--white)', display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm"><Send size={13} />Reply</button>
              <button className="btn btn-secondary btn-sm">Forward</button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select an email to read</div>
        )}
      </div>
    </>
  );
}
