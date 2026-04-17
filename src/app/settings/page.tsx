'use client';
import { useState } from 'react';
import { Settings, Upload, Palette, Users, Shield, Building2, Check } from 'lucide-react';

export default function SettingsPage() {
  const [primaryColor, setPrimaryColor] = useState('#00F5FF');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Settings</h1>
          <p>White-labeling, organization, roles & permissions</p>
        </div>
        <div className="top-bar-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? <><Check size={14} /> Saved!</> : <><Settings size={14} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="page-content">
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Org Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>🏢 Organization</div>
              <div className="form-group"><label>Company Name</label><input defaultValue="GD Enterprises Inc." /></div>
              <div className="form-group"><label>Admin Email</label><input defaultValue="admin@gdenterprises.com" /></div>
              <div className="form-group">
                <label>Company Logo</label>
                <div style={{ border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                  <Upload size={20} style={{ color: 'var(--text-muted)', display: 'block', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Upload logo (PNG, SVG)</div>
                </div>
              </div>
            </div>

            {/* White-labeling */}
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>🎨 White-Label Branding</div>
              <div className="form-group">
                <label>Primary Accent Color</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ width: 48, height: 40, padding: 2, cursor: 'pointer' }} />
                  <input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} style={{ fontFamily: 'JetBrains Mono, monospace', flex: 1 }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {['#00F5FF', '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'].map(c => (
                  <button key={c} onClick={() => setPrimaryColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: primaryColor === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
              <div className="form-group">
                <label>Platform Name</label>
                <input defaultValue="GD Matrix" />
              </div>
              <div className="form-group">
                <label>Subscription Plan</label>
                <select><option>Starter (1 recruiter)</option><option>Professional (5 recruiters)</option><option>Enterprise (Unlimited)</option></select>
              </div>
            </div>
          </div>

          {/* Roles & Permissions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>👥 Team Members</div>
              {[
                { name: 'Admin Owner', role: 'Owner', email: 'admin@gd.com', avatar: 'AO', access: 'Full Access', color: 'var(--cyan)' },
                { name: 'Alex Kim', role: 'Senior Recruiter', email: 'alex@gd.com', avatar: 'AK', access: 'Own Submissions Only', color: 'var(--purple)' },
                { name: 'Priya M', role: 'Recruiter', email: 'priya@gd.com', avatar: 'PM', access: 'Own Submissions Only', color: 'var(--green)' },
              ].map(member => (
                <div key={member.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: member.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                    {member.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{member.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{member.email} · {member.access}</div>
                  </div>
                  <span className={`badge ${member.role === 'Owner' ? 'badge-cyan' : 'badge-gray'}`}>{member.role}</span>
                </div>
              ))}
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: 12 }}><Users size={14} /> Invite Team Member</button>
            </div>

            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>🔐 Organization Hierarchy</div>
              {[
                { role: 'Owner', desc: 'Full access to all data, billing, settings & all recruiters', icon: '👑' },
                { role: 'Manager', desc: 'View all submissions, financials, consultants', icon: '📊' },
                { role: 'Recruiter', desc: 'Own submissions, own candidates only', icon: '🧑‍💼' },
                { role: 'Consultant', desc: 'Timesheet upload only (read-only profile)', icon: '💼' },
              ].map(r => (
                <div key={r.role} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: 20 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{r.role}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
