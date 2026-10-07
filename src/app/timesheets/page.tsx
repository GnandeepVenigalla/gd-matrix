'use client';
import { getApiUrl } from '@/lib/apiConfig';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertTriangle, FileText, Bell, X, Download, Search, Filter, Calendar, Users } from 'lucide-react';

const STATUS_STYLE: Record<string, string> = {
  Approved: 'badge-green',
  Submitted: 'badge-yellow',
  Pending: 'badge-red',
};

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');


  useEffect(() => {
    fetchTimesheets();
    fetchConsultants();
  }, []);
  
  const fetchConsultants = () => {
    const userStr = localStorage.getItem('user');
    let comp = 'GD Matrix';
    if (userStr) {
      try { comp = JSON.parse(userStr).companyName || comp; } catch(e){}
    }
    fetch(`${getApiUrl()}/api/consultants?companyName=` + encodeURIComponent(comp))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setConsultants(data);
      });
  };

  const fetchTimesheets = () => {
    fetch(`${getApiUrl()}/api/timesheets`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTimesheets(data);
        } else {
          setTimesheets([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this timesheet for payroll?')) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/timesheets/${id}/approve`, { method: 'PUT' });
      if (res.ok) {
        fetchTimesheets();
      } else {
        alert('Failed to approve timesheet');
      }
    } catch(e) {
      alert('Error approving timesheet');
    }
  };

  const explicitPending = timesheets.filter((t: any) => t.status === 'Pending' || t.status === 'Pending Submission');
  
  // Smart Missing Logic
  const activeConsultants = consultants.filter((c: any) => c.client && c.client !== 'Bench');
  const allWeeks = Array.from(new Set(timesheets.map((t: any) => t.week).filter(Boolean)));
  const targetWeek = allWeeks[allWeeks.length - 1] || 'Apr 01 - Apr 07, 2026';
  
  const missingConsultants = activeConsultants.filter((c: any) => {
    return !timesheets.some(t => t.consultantId === c._id && t.week === targetWeek);
  });
  
  const pendingCount = explicitPending.length + missingConsultants.length;
  
  // Expose missing names for the alert
  const missingNames = missingConsultants.map((c: any) => c.name).join(', ');

  const approved = timesheets.filter((t: any) => t.status === 'Approved');

  
  const handleGenerateInvoice = async () => {
    if (filteredTimesheets.length === 0) return alert('No timesheets to invoice!');
    const confirmMsg = `Generate a consolidated invoice for ${filteredTimesheets.length} timesheet(s) totaling ${totalFilteredInvoice.toLocaleString()}?`;
    if (!confirm(confirmMsg)) return;
    
    try {
      const timesheetIds = filteredTimesheets.map((t: any) => t.id);
      const res = await fetch(`${getApiUrl()}/api/invoices/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timesheetIds })
      });
      if (res.ok) {
        alert('Invoice generated successfully!');
        fetchTimesheets(); // Refresh to show them as Invoiced
      } else {
        alert('Failed to generate invoice');
      }
    } catch(e) {
      alert('Error generating invoice');
    }
  };

  const getOverdueDays = (weekDate: string) => {
    if (!weekDate) return 0;
    const today = new Date().getTime();
    const endOfWeek = new Date(weekDate).getTime();
    if (isNaN(endOfWeek)) return 0;
    return Math.max(0, Math.floor((today - endOfWeek) / (1000 * 3600 * 24)));
  };

  
  const filteredTimesheets = timesheets.filter((t: any) => {
    const nameMatch = !filterName || t.consultantName === filterName;
    const statusMatch = filterStatus === 'All' || t.status === filterStatus || (filterStatus === 'Pending' && t.status === 'Pending Submission');
    const weekMatch = (() => {
      try {
        const parts = (t.week || '').split(' - ');
        if (parts.length !== 2) return true;
        const year = parts[1].split(', ')[1] || new Date().getFullYear();
        const tsStart = new Date(parts[0] + ', ' + year).getTime();
        const tsEnd = new Date(parts[1]).getTime() + 86400000;
        
        let match = true;
        if (filterStartDate) {
          const [sy, sm, sd] = filterStartDate.split('-');
          const startRange = new Date(Number(sy), Number(sm) - 1, Number(sd)).getTime();
          if (tsEnd < startRange) match = false;
        }
        if (filterEndDate) {
          const [ey, em, ed] = filterEndDate.split('-');
          const endRange = new Date(Number(ey), Number(em) - 1, Number(ed)).getTime() + 86400000;
          if (tsStart > endRange) match = false;
        }
        return match;
      } catch(e) { return true; }
    })();
    return nameMatch && statusMatch && weekMatch;
  });

  const totalFilteredHours = filteredTimesheets.reduce((sum: any, ts: any) => sum + (Number(ts.hours) || 0), 0);
  const totalFilteredInvoice = filteredTimesheets.reduce((sum: any, ts: any) => sum + ((Number(ts.hours) || 0) * (Number(ts.payRate) || 0)), 0);
  


  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading timesheets...</div>;
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Timesheet Portal</h1>
          <p>Weekly timesheet tracking & draft invoice generation</p>
        </div>
      </div>

      <div className="page-content">
        {pendingCount > 0 && (
          <div className="alert alert-yellow">
            <AlertTriangle size={16} />
            <span><strong>{pendingCount} consultant{pendingCount > 1 ? 's' : ''}</strong> haven&apos;t submitted timesheets for this week. {missingNames && `Missing from: ${missingNames}`}</span>
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
            <div className="metric-value">{timesheets.filter((t: any) => t.status === 'Submitted').length}</div>
          </div>
          <div className="metric-card red">
            <div className="metric-icon red"><AlertTriangle size={20} /></div>
            <div className="metric-label">Pending / Missing</div>
            <div className="metric-value">{pendingCount}</div>
          </div>
        </div>

        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '0 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', flex: 1 }}>
            <Users size={16} color="var(--text-muted)" />
            <select 
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', padding: '0.75rem', flex: 1, outline: 'none' }}
            >
              <option value="">All Consultants</option>
              {consultants.map((c: any) => (
                <option key={c._id} value={c.name}>
                  {c.name} {c.client && c.client !== 'Bench' ? `(${c.client})` : '(Bench)'}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '0 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <Calendar size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input 
                type="date"
                value={filterStartDate}
                onChange={e => setFilterStartDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', padding: '0.75rem 0', outline: 'none', fontFamily: 'inherit' }}
                title="Start Date"
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input 
                type="date"
                value={filterEndDate}
                onChange={e => setFilterEndDate(e.target.value)}
                style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', padding: '0.75rem 0', outline: 'none', fontFamily: 'inherit' }}
                title="End Date"
              />
            </div>
            {(filterStartDate || filterEndDate) && (
              <X 
                size={14} 
                color="var(--text-muted)" 
                style={{ cursor: 'pointer', marginLeft: '0.5rem' }} 
                onClick={() => { setFilterStartDate(''); setFilterEndDate(''); }} 
              />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-primary)', padding: '0 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', width: '200px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: '0.75rem', flex: 1, outline: 'none' }}
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Submitted">Submitted</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--cyan)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Showing <strong>{filteredTimesheets.length}</strong> timesheets
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Hours</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{totalFilteredHours}h</div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Invoice</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>${totalFilteredInvoice.toLocaleString()}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
              <button className="btn btn-primary" onClick={handleGenerateInvoice}>
                Generate Invoice
              </button>
            </div>
          </div>
        </div>
        <div className="table-container">

          {filteredTimesheets.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No timesheets found.
            </div>
          ) : (
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
                {filteredTimesheets.map((ts: any) => {
                  const invoice = (ts.hours || 0) * (ts.payRate || 0); // Dynamic rate based on Bench payRate
                  const overdueDays = getOverdueDays(ts.week);
                  const consultantName = ts.consultantName || 'Unknown';
                  const initial = consultantName.split(' ').map((n: string) => n[0]).join('');
                  
                  return (
                    <tr key={ts.id} style={{ opacity: ts.status === 'Pending' ? 0.85 : 1 }}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--cyan),var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                            {initial}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{consultantName}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>H1B</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{ts.week || '—'}</td>
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
                      <td><span className={`badge ${STATUS_STYLE[ts.status] || 'badge-gray'}`}>{ts.status}</span></td>
                      <td style={{ fontSize: 12, color: ts.status === 'Pending' ? 'var(--red)' : 'var(--text-secondary)', fontWeight: ts.status === 'Pending' ? 600 : 400 }}>
                        {ts.status === 'Pending' ? `Overdue by ${overdueDays} days` : ts.uploadedAt || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {ts.status !== 'Pending' && (
                            <button 
                              className="btn btn-sm btn-ghost"
                              onClick={() => {
                                if (ts.fileUrl) {
                                  window.open(ts.fileUrl.startsWith('http') ? ts.fileUrl : `${getApiUrl()}${ts.fileUrl}`, '_blank');
                                } else {
                                  alert('No file was attached to this timesheet (legacy record).');
                                }
                              }}
                              title="Download Attached Timesheet"
                            >
                              <Download size={12} /> Timesheet
                            </button>
                          )}
                          {ts.status === 'Submitted' && <button className="btn btn-sm btn-success" onClick={() => handleApprove(ts.id)}><CheckCircle size={12} /> Approve</button>}
                          {ts.status === 'Pending' && (
                            <button 
                              className="btn btn-sm btn-danger" 
                              style={{ background: 'var(--red-50)', color: 'var(--red-600)', borderColor: 'var(--red-200)' }}
                              onClick={() => alert(`Reminder email sent to ${consultantName} for the week ending ${ts.week}.`)}
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
          )}
        </div>
      </div>
    </>
  );
}
