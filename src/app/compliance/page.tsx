'use client';
import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Bell, FileLock, Upload } from 'lucide-react';
import { consultants, getVisaUrgency, getDaysUntil } from '@/lib/mockData';

const VISA_EXPIRY_RULES = [
  { days: 90, label: '90 Days Notice', action: 'Email consultant to start paperwork', color: 'var(--yellow)', badge: 'badge-yellow' },
  { days: 60, label: '60 Days Alert', action: 'Create High Priority ticket for HR Manager', color: 'var(--yellow)', badge: 'badge-yellow' },
  { days: 30, label: '30 Days CRITICAL', action: 'Profile turns Red — prevent placements', color: 'var(--red)', badge: 'badge-red' },
];

export default function CompliancePage() {
  const [selectedConsultant, setSelectedConsultant] = useState(consultants[0]);

  const critical = consultants.filter(c => getVisaUrgency(c.visaExpiry) === 'critical');
  const warning = consultants.filter(c => getVisaUrgency(c.visaExpiry) === 'warning');
  const ok = consultants.filter(c => getVisaUrgency(c.visaExpiry) === 'ok');

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Visa & Compliance</h1>
          <p>Risk mitigation suite — legal status tracker with zero-error alerts</p>
        </div>
        <div className="top-bar-actions">
          <button className="btn btn-danger"><Bell size={14} /> Send Bulk Alerts</button>
          <button className="btn btn-primary"><Upload size={14} /> Upload Document</button>
        </div>
      </div>

      <div className="page-content">
        {/* Risk Summary */}
        {critical.length > 0 && (
          <div className="alert alert-red">
            <AlertTriangle size={16} />
            <span><strong>{critical.length} consultant{critical.length > 1 ? 's' : ''}</strong> have visas expiring within 30 days. Placement is RESTRICTED for these profiles.</span>
          </div>
        )}

        <div className="metric-grid">
          <div className="metric-card red">
            <div className="metric-icon red"><Shield size={20} /></div>
            <div className="metric-label">Critical (&lt;30d)</div>
            <div className="metric-value" style={{ color: 'var(--red)' }}>{critical.length}</div>
          </div>
          <div className="metric-card yellow">
            <div className="metric-icon yellow"><AlertTriangle size={20} /></div>
            <div className="metric-label">Warning (30-90d)</div>
            <div className="metric-value" style={{ color: 'var(--yellow)' }}>{warning.length}</div>
          </div>
          <div className="metric-card green">
            <div className="metric-icon green"><CheckCircle size={20} /></div>
            <div className="metric-label">Good Standing</div>
            <div className="metric-value" style={{ color: 'var(--green)' }}>{ok.length}</div>
          </div>
          <div className="metric-card cyan">
            <div className="metric-icon cyan"><FileLock size={20} /></div>
            <div className="metric-label">Docs 100% Complete</div>
            <div className="metric-value">{consultants.filter(c => Object.values(c.compliance).every(Boolean)).length}</div>
          </div>
        </div>

        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Visa Matrix Table */}
          <div>
            <div className="section-header"><div className="section-title">Visa Matrix</div></div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Consultant</th>
                    <th>Visa Type</th>
                    <th>Expiry</th>
                    <th>Days Left</th>
                    <th>I-94</th>
                    <th>Passport</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {consultants.map(c => {
                    const days = getDaysUntil(c.visaExpiry);
                    const urgency = getVisaUrgency(c.visaExpiry);
                    return (
                      <tr
                        key={c.id}
                        style={{
                          cursor: 'pointer',
                          background: selectedConsultant.id === c.id ? 'var(--bg-hover)' : undefined,
                          borderLeft: selectedConsultant.id === c.id ? '2px solid var(--cyan)' : '2px solid transparent',
                        }}
                        onClick={() => setSelectedConsultant(c)}
                      >
                        <td style={{ fontWeight: 600, fontSize: 12 }}>{c.name}</td>
                        <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{c.visaType}</span></td>
                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: urgency === 'critical' ? 'var(--red)' : urgency === 'warning' ? 'var(--yellow)' : 'var(--text-secondary)' }}>
                          {c.visaExpiry}
                        </td>
                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: urgency === 'critical' ? 'var(--red)' : urgency === 'warning' ? 'var(--yellow)' : 'var(--green)' }}>
                          {days}d
                        </td>
                        <td>{c.compliance.i94 ? <CheckCircle size={14} style={{ color: 'var(--green)' }} /> : <XCircle size={14} style={{ color: 'var(--red)' }} />}</td>
                        <td>{c.compliance.passport ? <CheckCircle size={14} style={{ color: 'var(--green)' }} /> : <XCircle size={14} style={{ color: 'var(--red)' }} />}</td>
                        <td>
                          <span className={`badge ${urgency === 'critical' ? 'badge-red' : urgency === 'warning' ? 'badge-yellow' : 'badge-green'}`} style={{ fontSize: 10 }}>
                            {urgency === 'critical' ? '🔴 Critical' : urgency === 'warning' ? '🟡 Warning' : '✅ OK'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel: Selected Consultant Docs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Automation Rules */}
            <div className="card">
              <div className="section-title" style={{ marginBottom: 14 }}>🤖 Automation Rules</div>
              {VISA_EXPIRY_RULES.map(rule => (
                <div key={rule.days} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: rule.color === 'var(--red)' ? 'var(--red-dim)' : 'var(--yellow-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={16} style={{ color: rule.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: rule.color }}>{rule.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>{rule.action}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Vault */}
            <div className="card">
              <div className="section-header">
                <div className="section-title">📂 Document Vault — {selectedConsultant.name}</div>
              </div>
              {[
                { key: 'passport', label: 'Passport Copy', desc: 'Government-issued travel document' },
                { key: 'i94', label: 'I-94 Record', desc: 'Arrival/departure record' },
                { key: 'lca', label: 'LCA / H1B Notice', desc: 'Labor Condition Application' },
                { key: 'i797', label: 'I-797 Approval', desc: 'USCIS approval notice' },
              ].map(doc => {
                const uploaded = selectedConsultant.compliance[doc.key as keyof typeof selectedConsultant.compliance];
                return (
                  <div key={doc.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: uploaded ? 'var(--green-dim)' : 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {uploaded ? <CheckCircle size={16} style={{ color: 'var(--green)' }} /> : <XCircle size={16} style={{ color: 'var(--red)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{doc.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{doc.desc}</div>
                    </div>
                    <button className={`btn btn-sm ${uploaded ? 'btn-secondary' : 'btn-primary'}`}>
                      {uploaded ? 'View' : 'Upload'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
