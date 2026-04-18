'use client';
import { useState } from 'react';
import { ShieldAlert, Phone, Mail, AlertTriangle, CheckCircle, Clock, X, MessageSquare } from 'lucide-react';

const contacts = [
  { name: 'Alex Kim', role: 'Sr. Recruiter (Primary)', phone: '+1-408-555-0001', email: 'alex@gdmatrix.com', available: true, responseTime: 'Immediate' },
  { name: 'Priya M', role: 'Recruiter (Secondary)', phone: '+1-408-555-0002', email: 'priya@gdmatrix.com', available: true, responseTime: '< 15 min' },
  { name: 'Operations Desk', role: 'Emergency Operations', phone: '+1-800-GD-MATRIX', email: 'ops@gdmatrix.com', available: true, responseTime: '24/7 Support' },
  { name: 'Legal & Compliance', role: 'Visa / Immigration', phone: '+1-408-555-0099', email: 'legal@gdmatrix.com', available: false, responseTime: 'Business Hours' },
];

const emergencyTypes = [
  { id: 'visa', label: 'Visa/Immigration Emergency', icon: ShieldAlert, color: '#dc2626', bg: '#fef2f2', desc: 'Sudden visa issue, I-94 discrepancy, or RFE received' },
  { id: 'client', label: 'Client Site Emergency', icon: AlertTriangle, color: '#d97706', bg: '#fffbeb', desc: 'Unexpected termination, policy conflict, or hostile situation' },
  { id: 'medical', label: 'Medical Emergency', icon: ShieldAlert, color: '#7c3aed', bg: '#faf5ff', desc: 'Medical leave required, accident at work site' },
  { id: 'payroll', label: 'Payroll Emergency', icon: AlertTriangle, color: '#0369a1', bg: '#f0f9ff', desc: 'Paycheck not received, bank issue, or incorrect amount' },
];

export default function EmergencyPage() {
  const [sent, setSent] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [notes, setNotes] = useState('');
  const [alertActive, setAlertActive] = useState(false);

  function sendAlert() {
    if (!selectedType) return;
    setAlertActive(true);
    setTimeout(() => { setSent(true); setAlertActive(false); }, 2000);
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title"><h1>Emergency Support</h1><p>Quick access to emergency contacts and urgent alert system</p></div>
      </div>
      <div className="page-content">
        {/* SOS Banner */}
        <div style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', borderRadius: 12, padding: '20px 24px', marginBottom: 24, color: 'white', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldAlert size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>24/7 Emergency Hotline</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>+1-800-GD-MATRIX</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.85, marginTop: 4 }}>Available around the clock for critical situations. Do not hesitate to call.</div>
          </div>
          <a href="tel:+18004363284" className="btn" style={{ background: 'white', color: '#dc2626', fontWeight: 700, padding: '10px 20px' }}>
            <Phone size={15} /> Call Now
          </a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Alert Form */}
          <div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={16} style={{ color: '#dc2626' }} /> Send Emergency Alert
              </div>
              {sent ? (
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <CheckCircle size={48} style={{ color: '#16a34a', margin: '0 auto 16px' }} />
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#16a34a', marginBottom: 8 }}>Alert Sent Successfully</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 20 }}>Your recruiter has been notified. Expect a call within 5 minutes.</div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setSent(false); setSelectedType(''); setNotes(''); }}>Send Another Alert</button>
                </div>
              ) : (
                <div style={{ padding: 20 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Select Emergency Type</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {emergencyTypes.map(e => {
                      const I = e.icon;
                      return (
                        <div key={e.id} onClick={() => setSelectedType(e.id)}
                          style={{ padding: '12px 14px', borderRadius: 8, border: selectedType === e.id ? `2px solid ${e.color}` : '1px solid var(--border)', cursor: 'pointer', background: selectedType === e.id ? e.bg : 'transparent', display: 'flex', alignItems: 'center', gap: 12 }}>
                          <I size={18} style={{ color: e.color, flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{e.label}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>{e.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="form-group">
                    <label>Additional Notes (optional)</label>
                    <textarea rows={3} placeholder="Describe the situation briefly..." value={notes} onChange={e => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
                  </div>
                  <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', background: '#dc2626', color: 'white', border: 'none' }} onClick={sendAlert} disabled={!selectedType || alertActive}>
                    {alertActive ? <><Clock size={14} /> Sending Alert...</> : <><AlertTriangle size={14} /> Send Emergency Alert</>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={16} style={{ color: 'var(--accent)' }} /> Emergency Contacts
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {contacts.map((c, i) => (
                  <div key={c.name} style={{ padding: '14px 20px', borderBottom: i < contacts.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: c.available ? '#eff6ff' : '#f1f5f9', color: c.available ? '#2563eb' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: 99, background: c.available ? '#dcfce7' : '#f1f5f9', color: c.available ? '#16a34a' : '#64748b', fontWeight: 600 }}>{c.available ? 'Available' : 'Limited'}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.role}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><Clock size={10} />{c.responseTime}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <a href={`tel:${c.phone}`} className="btn-icon" title={c.phone}><Phone size={14} /></a>
                      <a href={`mailto:${c.email}`} className="btn-icon" title={c.email}><Mail size={14} /></a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginTop: 16, padding: '16px 20px', background: '#fffbeb', border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#92400e', marginBottom: 4 }}>When to Use This System</div>
                  <ul style={{ fontSize: '0.82rem', color: '#78350f', lineHeight: 1.7, paddingLeft: 16 }}>
                    <li>Sudden visa status changes or RFE received</li>
                    <li>Unexpected project termination or client conflict</li>
                    <li>Missed paycheck or incorrect payment</li>
                    <li>Any situation requiring immediate recruiter intervention</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
