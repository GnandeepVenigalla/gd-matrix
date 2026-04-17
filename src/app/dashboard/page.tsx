'use client';
import { useState } from 'react';
import {
  Users, DollarSign, AlertTriangle, Clock, TrendingUp, TrendingDown,
  ArrowRight, CheckCircle, XCircle, Calendar, Zap, Bell, RefreshCw
} from 'lucide-react';
import {
  consultants, submissions, invoices, auditLogs,
  getVisaUrgency, getDaysUntil
} from '@/lib/mockData';

const expiringVisas = consultants.filter(c => getVisaUrgency(c.visaExpiry) !== 'ok');
const onBench = consultants.filter(c => c.status === 'On Bench');
const onProject = consultants.filter(c => c.status === 'On Project');
const monthlyRevenue = onProject.reduce((s, c) => {
  const sub = submissions.find(s => s.consultantId === c.id && s.status === 'Placed');
  return s + (sub ? sub.sellRate * 160 : c.buyRate * 1.4 * 160);
}, 0);
const pendingInvoices = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
const openInterviews = submissions.filter(s => ['Round 1', 'Round 2', 'Offer'].includes(s.status));

function TopBar() {
  return (
    <div className="top-bar">
      <div className="top-bar-title">
        <h1>Command Center</h1>
        <p>Welcome back, Alex — here's what needs your attention today</p>
      </div>
      <div className="top-bar-actions">
        <button className="btn-icon"><RefreshCw size={15} /></button>
        <button className="btn-icon" style={{ position: 'relative' }}>
          <Bell size={15} />
          <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: 'var(--red)' }} />
        </button>
        <button className="btn btn-primary">
          <Zap size={14} /> Quick Submit
        </button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
      <TopBar />
      <div className="page-content">

        {/* Alerts */}
        {expiringVisas.filter(c => getVisaUrgency(c.visaExpiry) === 'critical').length > 0 && (
          <div className="alert alert-red">
            <AlertTriangle size={16} />
            <span>
              <strong>{expiringVisas.filter(c => getVisaUrgency(c.visaExpiry) === 'critical').length} consultants</strong> have visas expiring in &lt;30 days. Immediate action required.
            </span>
          </div>
        )}

        {/* Metric Cards */}
        <div className="metric-grid">
          <div className="metric-card cyan">
            <div className="metric-icon cyan"><Users size={20} /></div>
            <div className="metric-label">Total Consultants</div>
            <div className="metric-value">{consultants.length}</div>
            <div className="metric-change up"><TrendingUp size={12} /> {onBench.length} on bench, {onProject.length} placed</div>
          </div>

          <div className="metric-card green">
            <div className="metric-icon green"><DollarSign size={20} /></div>
            <div className="metric-label">Monthly Projected Rev</div>
            <div className="metric-value">${(monthlyRevenue / 1000).toFixed(0)}K</div>
            <div className="metric-change up"><TrendingUp size={12} /> +12% vs last month</div>
          </div>

          <div className="metric-card red">
            <div className="metric-icon red"><AlertTriangle size={20} /></div>
            <div className="metric-label">Expiring Visas (60d)</div>
            <div className="metric-value">{expiringVisas.length}</div>
            <div className="metric-change down"><TrendingDown size={12} /> {expiringVisas.filter(c => getVisaUrgency(c.visaExpiry) === 'critical').length} critical</div>
          </div>

          <div className="metric-card purple">
            <div className="metric-icon purple"><Clock size={20} /></div>
            <div className="metric-label">Interviews Active</div>
            <div className="metric-value">{openInterviews.length}</div>
            <div className="metric-change up"><TrendingUp size={12} /> {submissions.filter(s => s.status === 'Offer').length} at Offer stage</div>
          </div>
        </div>

        <div className="dashboard-split">
          {/* Left Column */}
          <div>
            {/* Revenue Snapshot */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="section-header">
                <div className="section-title">Revenue Snapshot</div>
                <span className="badge badge-green">Live Data</span>
              </div>

              <div className="grid-3" style={{ marginBottom: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>
                    ${pendingInvoices.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>AR OUTSTANDING</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--cyan)', fontFamily: 'JetBrains Mono, monospace' }}>
                    ${invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>OVERDUE</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--purple)', fontFamily: 'JetBrains Mono, monospace' }}>
                    ${invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>COLLECTED (MTD)</div>
                </div>
              </div>
            </div>

            {/* Interview Pipeline Summary */}
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="section-header">
                <div className="section-title">Interview Pipeline</div>
                <a href="/submissions" style={{ fontSize: 12, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                  Full Kanban <ArrowRight size={12} />
                </a>
              </div>

              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[
                  { label: 'Submitted', count: submissions.filter(s => s.status === 'Submitted').length, color: 'var(--blue)' },
                  { label: 'Screening', count: submissions.filter(s => s.status === 'Client Screening').length, color: 'var(--yellow)' },
                  { label: 'Round 1', count: submissions.filter(s => s.status === 'Round 1').length, color: 'var(--purple)' },
                  { label: 'Round 2', count: submissions.filter(s => s.status === 'Round 2').length, color: 'var(--cyan)' },
                  { label: 'Offer', count: submissions.filter(s => s.status === 'Offer').length, color: 'var(--green)' },
                  { label: 'Placed', count: submissions.filter(s => s.status === 'Placed').length, color: 'var(--green)' },
                ].map(col => (
                  <div key={col.label} style={{ flex: 1, background: 'var(--bg-secondary)', borderRadius: 8, padding: '10px 8px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: col.color }}>{col.count}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{col.label}</div>
                  </div>
                ))}
              </div>

              {openInterviews.slice(0, 4).map(sub => (
                <div key={sub.id} className="ledger-row">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--purple)', flexShrink: 0 }}>
                    {sub.consultantName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{sub.consultantName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{sub.position} · {sub.vendorName}</div>
                  </div>
                  <span className={`badge ${
                    sub.status === 'Offer' ? 'badge-green' :
                    sub.status === 'Round 2' ? 'badge-cyan' :
                    sub.status === 'Round 1' ? 'badge-purple' : 'badge-yellow'
                  }`}>{sub.status}</span>
                </div>
              ))}
            </div>

            {/* Visa Alert Table */}
            <div className="card">
              <div className="section-header">
                <div className="section-title">⚠️ Visa Expiry Alerts</div>
                <a href="/compliance" style={{ fontSize: 12, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
                  Manage All <ArrowRight size={12} />
                </a>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Consultant</th>
                      <th>Visa</th>
                      <th>Expiry</th>
                      <th>Days Left</th>
                      <th>Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringVisas.map(c => {
                      const days = getDaysUntil(c.visaExpiry);
                      const risk = getVisaUrgency(c.visaExpiry);
                      return (
                        <tr key={c.id}>
                          <td style={{ fontWeight: 600 }}>{c.name}</td>
                          <td><span className="badge badge-blue">{c.visaType}</span></td>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{c.visaExpiry}</td>
                          <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: risk === 'critical' ? 'var(--red)' : 'var(--yellow)' }}>{days}d</td>
                          <td>
                            <span className={`badge ${risk === 'critical' ? 'badge-red' : 'badge-yellow'}`}>
                              {risk === 'critical' ? '🔴 Critical' : '🟡 Warning'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Activity Feed */}
          <div>
            <div className="card" style={{ height: '100%' }}>
              <div className="section-header">
                <div className="section-title">Activity Feed</div>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Live</span>
              </div>
              <div className="activity-feed">
                {auditLogs.map((log, i) => (
                  <div key={log.id} className="activity-item">
                    <div className="activity-dot" style={{
                      background: i === 0 ? 'var(--cyan)' : i === 1 ? 'var(--green)' : i === 2 ? 'var(--purple)' : 'var(--yellow)'
                    }} />
                    <div style={{ flex: 1 }}>
                      <div className="activity-text">
                        <strong>{log.user}</strong> {log.action.toLowerCase()} for <strong>{log.entity}</strong>
                        {log.oldValue && <span style={{ color: 'var(--text-muted)' }}> ({log.oldValue} → {log.newValue})</span>}
                      </div>
                      <div className="activity-time">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glow-divider" />

              {/* Quick Stats */}
              <div className="section-title" style={{ marginBottom: 12, fontSize: 13 }}>Today's Snapshot</div>
              {[
                { label: 'Resumes Sent', value: 4, color: 'var(--cyan)' },
                { label: 'Interviews Scheduled', value: 2, color: 'var(--purple)' },
                { label: 'Timesheets Received', value: 7, color: 'var(--green)' },
                { label: 'Invoices Generated', value: 1, color: 'var(--yellow)' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.label}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: s.color, fontSize: 15 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
