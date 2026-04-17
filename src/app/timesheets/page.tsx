'use client';

import { CheckCircle, Clock, AlertTriangle, FileText, Bell, X } from 'lucide-react';
import { consultants, submissions } from '@/lib/mockData';

type Timesheet = {
  id: string; consultantId: string; consultantName: string;
  week: string; hours: number; status: 'Submitted' | 'Pending' | 'Approved';
  clientApproved: boolean; uploadedAt?: string;
};

const MOCK_TIMESHEETS: Timesheet[] = [
  { id: 'ts001', consultantId: 'c002', consultantName: 'Priya Nair', week: '2026-03-31', hours: 40, status: 'Approved', clientApproved: true, uploadedAt: '2026-04-01' },
  { id: 'ts002', consultantId: 'c005', consultantName: 'Vikram Joshi', week: '2026-03-31', hours: 44, status: 'Approved', clientApproved: true, uploadedAt: '2026-04-01' },
  { id: 'ts003', consultantId: 'c007', consultantName: 'Suresh Kumar', week: '2026-03-31', hours: 40, status: 'Submitted', clientApproved: false, uploadedAt: '2026-04-02' },
  { id: 'ts004', consultantId: 'c008', consultantName: 'Deepa Mohan', week: '2026-03-31', hours: 38, status: 'Submitted', clientApproved: false, uploadedAt: '2026-04-02' },
  { id: 'ts005', consultantId: 'c003', consultantName: 'Rahul Mehta', week: '2026-03-31', hours: 0, status: 'Pending', clientApproved: false },
];

const STATUS_STYLE: Record<string, string> = {
  Approved: 'badge-green',
  Submitted: 'badge-yellow',
  Pending: 'badge-red',
};

export default function TimesheetsPage() {
  const pending = MOCK_TIMESHEETS.filter(t => t.status === 'Pending');
  const approved = MOCK_TIMESHEETS.filter(t => t.status === 'Approved');

  const getOverdueDays = (weekDate: string) => {
    // We mock the current date to an early April 2026 date to make the days calculation realistic
    const today = new Date('2026-04-16').getTime();
    const endOfWeek = new Date(weekDate).getTime();
    return Math.max(0, Math.floor((today - endOfWeek) / (1000 * 3600 * 24)));
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Timesheet Portal</h1>
          <p>Weekly timesheet tracking & draft invoice generation</p>
        </div>
      </div>

      <div className="page-content">
        {pending.length > 0 && (
          <div className="alert alert-yellow">
            <AlertTriangle size={16} />
            <span><strong>{pending.length} consultant{pending.length > 1 ? 's' : ''}</strong> haven&apos;t submitted timesheets for this week. Draft invoices pending.</span>
          </div>
        )}

        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="metric-card green">
            <div className="metric-icon green"><CheckCircle size={20} /></div>
            <div className="metric-label">Approved This Week</div>
            <div className="metric-value">{approved.length}</div>
          </div>
          <div className="metric-card yellow">
            <div className="metric-icon yellow"><Clock size={20} /></div>
            <div className="metric-label">Submitted (Under Review)</div>
            <div className="metric-value">{MOCK_TIMESHEETS.filter(t => t.status === 'Submitted').length}</div>
          </div>
          <div className="metric-card red">
            <div className="metric-icon red"><AlertTriangle size={20} /></div>
            <div className="metric-label">Pending / Missing</div>
            <div className="metric-value">{pending.length}</div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Consultant</th>
                <th>Week Ending</th>
                <th>Hours</th>
                <th>Draft Invoice</th>
                <th>Client Approved</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TIMESHEETS.map(ts => {
                const con = consultants.find(c => c.id === ts.consultantId);
                const sub = submissions.find(s => s.consultantId === ts.consultantId);
                const invoice = ts.hours * (sub?.sellRate || 75);
                const overdueDays = getOverdueDays(ts.week);
                
                return (
                  <tr key={ts.id} style={{ opacity: ts.status === 'Pending' ? 0.85 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                          {ts.consultantName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{ts.consultantName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{con?.visaType}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{ts.week}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: ts.hours > 0 ? 'var(--text-primary)' : 'var(--red)' }}>
                      {ts.hours > 0 ? `${ts.hours}h` : '—'}
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--green)' }}>
                      {ts.hours > 0 ? `$${invoice.toLocaleString()}` : '—'}
                    </td>
                    <td>
                      {ts.clientApproved
                        ? <CheckCircle size={15} style={{ color: 'var(--green)' }} />
                        : <X size={15} style={{ color: 'var(--red)' }} />}
                    </td>
                    <td><span className={`badge ${STATUS_STYLE[ts.status]}`}>{ts.status}</span></td>
                    <td style={{ fontSize: 12, color: ts.status === 'Pending' ? 'var(--red)' : 'var(--text-secondary)', fontWeight: ts.status === 'Pending' ? 600 : 400 }}>
                      {ts.status === 'Pending' ? `Overdue by ${overdueDays} days` : ts.uploadedAt || '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {ts.status === 'Submitted' && <button className="btn btn-sm btn-success"><CheckCircle size={12} /> Approve</button>}
                        {ts.status === 'Pending' && (
                          <button 
                            className="btn btn-sm btn-danger" 
                            style={{ background: 'var(--red-50)', color: 'var(--red-600)', borderColor: 'var(--red-200)' }}
                            onClick={() => alert(`Reminder email sent to ${ts.consultantName} for the week ending ${ts.week}.`)}
                          >
                            <Bell size={12} /> Remind
                          </button>
                        )}
                        {ts.status === 'Approved' && <button className="btn btn-sm btn-secondary"><FileText size={12} /> Invoice</button>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
