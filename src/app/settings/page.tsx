'use client';
import { useState, useEffect } from 'react';
import { Settings, Upload, Palette, Users, Shield, Building2, Check, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [primaryColor, setPrimaryColor] = useState('#00F5FF');
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState({ name: 'Admin', email: 'admin@company.com', companyName: 'Company Inc', title: 'Owner' });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
      } catch (e) {}
    }
  }, []);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const initials = user.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'AD';

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
              <div className="form-group"><label>Company Name</label><input defaultValue={user.companyName} /></div>
              <div className="form-group"><label>Admin Email</label><input defaultValue={user.email} /></div>
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
                {['#00F5FF', '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444'].map((c: any) => (
                  <button key={c} onClick={() => setPrimaryColor(c)} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: primaryColor === c ? '2px solid white' : '2px solid transparent', cursor: 'pointer' }} />
                ))}
              </div>
              <div className="form-group">
                <label>Platform Name</label>
                <input defaultValue={user.companyName} />
              </div>
              <div className="form-group">
                <label>Subscription Plan</label>
                <select><option>Starter (1 recruiter)</option><option>Professional (5 recruiters)</option><option>Enterprise (Unlimited)</option></select>
              </div>
            </div>

            {/* Consultant Portal Link */}
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>🔗 Consultant Portal Access</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.4 }}>
                This is the custom onboarding link for your consultants. It automatically applies your company name and invite code.
              </p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input 
                  readOnly 
                  value={(() => {
                    if (typeof window === 'undefined') return '';
                    const companySlug = user.companyName ? encodeURIComponent(user.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) : 'portal';
                    let host = window.location.hostname;
                    if (host.startsWith('www.')) host = host.substring(4);
                    const port = window.location.port ? `:${window.location.port}` : '';
                    return `${window.location.protocol}//${companySlug}.${host}${port}/auth/employee/signup?code=${(user as any).inviteCode || ''}`;
                  })()} 
                  style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: 13 }} 
                />
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    const companySlug = user.companyName ? encodeURIComponent(user.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')) : 'portal';
                    let host = window.location.hostname;
                    if (host.startsWith('www.')) host = host.substring(4);
                    const port = window.location.port ? `:${window.location.port}` : '';
                    window.open(`${window.location.protocol}//${companySlug}.${host}${port}/auth/employee/signup?code=${(user as any).inviteCode || ''}`, '_blank');
                  }}
                  title="Open Consultant Portal"
                >
                  <ExternalLink size={14} /> Open
                </button>
              </div>

              <div className="section-title" style={{ marginBottom: 12, fontSize: 13 }}>🎟️ Company Invite Code</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.4 }}>
                This is your unique organization code. It is already embedded in the link above.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  readOnly 
                  value={(user as any).inviteCode || 'Relogin to generate'} 
                  style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontWeight: 600, letterSpacing: '2px', fontFamily: 'monospace' }} 
                />
              </div>
            </div>
          </div>

          {/* Roles & Permissions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>👥 Team Members</div>
              
              {/* Active Logged in user */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                  {initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{user.name} (You)</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{user.email} · Full Access</div>
                </div>
                <span className="badge badge-cyan">{(user as any).role === 'employer' ? 'Admin' : (user.title || 'Consultant')}</span>
              </div>
              
              {/* Mock additional user */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                  PM
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Priya M</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>priya@example.com · Own Submissions Only</div>
                </div>
                <span className="badge badge-gray">Recruiter</span>
              </div>

              <button className="btn btn-secondary" style={{ width: '100%', marginTop: 12 }}><Users size={14} /> Invite Team Member</button>
            </div>

            <div className="card">
              <div className="section-title" style={{ marginBottom: 16 }}>🔐 Organization Hierarchy</div>
              {[
                { role: 'Owner', desc: 'Full access to all data, billing, settings & all recruiters', icon: '👑' },
                { role: 'Manager', desc: 'View all submissions, financials, consultants', icon: '📊' },
                { role: 'Recruiter', desc: 'Own submissions, own candidates only', icon: '🧑‍💼' },
                { role: 'Consultant', desc: 'Timesheet upload only (read-only profile)', icon: '💼' },
              ].map((r: any) => (
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
