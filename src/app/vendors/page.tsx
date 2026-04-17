'use client';
import { useState } from 'react';
import { Building2, Star, TrendingUp, Users, Mail, Phone, Plus, X } from 'lucide-react';
import { vendors as allVendors, submissions } from '@/lib/mockData';

const TYPE_COLOR: Record<string, string> = {
  'Prime Vendor': 'badge-cyan',
  'Direct Client': 'badge-green',
  'Tier 2 Vendor': 'badge-gray',
};

function RelStrength({ value }: { value: number }) {
  const color = value >= 80 ? 'var(--green)' : value >= 60 ? 'var(--yellow)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 32 }}>{value}%</span>
    </div>
  );
}

export default function VendorsPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Vendor CRM</h1>
          <p>Prime vendors, direct clients & relationship manager</p>
        </div>
        <div className="top-bar-actions">
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Add Vendor</button>
        </div>
      </div>

      <div className="page-content">
        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="metric-card cyan">
            <div className="metric-icon cyan"><Building2 size={20} /></div>
            <div className="metric-label">Total Vendors</div>
            <div className="metric-value">{allVendors.length}</div>
          </div>
          <div className="metric-card green">
            <div className="metric-icon green"><TrendingUp size={20} /></div>
            <div className="metric-label">Total Placements</div>
            <div className="metric-value">{allVendors.reduce((s, v) => s + v.placements, 0)}</div>
          </div>
          <div className="metric-card purple">
            <div className="metric-icon purple"><Users size={20} /></div>
            <div className="metric-label">Active Submissions</div>
            <div className="metric-value">{allVendors.reduce((s, v) => s + v.activeSubmissions, 0)}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {allVendors.map(vendor => (
            <div key={vendor.id} className="card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--blue), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'white', flexShrink: 0 }}>
                  {vendor.company.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 4 }}>{vendor.company}</div>
                  <span className={`badge ${TYPE_COLOR[vendor.type] || 'badge-gray'}`}>{vendor.type}</span>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1,2,3].map(i => (
                    <Star key={i} size={12} style={{ color: i <= Math.round(vendor.relationshipStrength / 33) ? 'var(--yellow)' : 'var(--border-subtle)' }} fill={i <= Math.round(vendor.relationshipStrength / 33) ? 'var(--yellow)' : 'none'} />
                  ))}
                </div>
              </div>

              <RelStrength value={vendor.relationshipStrength} />
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, marginBottom: 14 }}>Relationship Strength</div>

              <div className="grid-3" style={{ marginBottom: 14 }}>
                {[
                  { label: 'Interviews', value: vendor.interviewsGiven, color: 'var(--purple)' },
                  { label: 'Placements', value: vendor.placements, color: 'var(--green)' },
                  { label: 'Active Subs', value: vendor.activeSubmissions, color: 'var(--cyan)' },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', background: 'var(--bg-secondary)', borderRadius: 8, padding: '8px 4px' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="glow-divider" style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <Users size={12} style={{ color: 'var(--text-muted)' }} />
                  <span><strong style={{ color: 'var(--text-primary)' }}>{vendor.contactPerson}</strong> · {vendor.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                  <a href={`mailto:${vendor.email}`} style={{ color: 'var(--cyan)', textDecoration: 'none' }}>{vendor.email}</a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                  <span>{vendor.phone} · Net {vendor.netTerms} days</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>View History</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Submit Candidate</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-header-icon"><Building2 size={18} /></div>
              <div><div className="modal-title">Add Vendor</div><div className="modal-subtitle">Add a prime vendor or direct client</div></div>
              <button className="modal-close" onClick={() => setShowAdd(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label>Company Name</label><input placeholder="e.g. Infosys BPO" /></div>
              <div className="grid-2">
                <div className="form-group"><label>Contact Person</label><input placeholder="Full name" /></div>
                <div className="form-group"><label>Vendor Type</label>
                  <select><option>Prime Vendor</option><option>Direct Client</option><option>Tier 2 Vendor</option></select>
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label>Email</label><input type="email" placeholder="contact@company.com" /></div>
                <div className="form-group"><label>Phone</label><input placeholder="+1-XXX-XXX-XXXX" /></div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label>Location</label><input placeholder="City, State" /></div>
                <div className="form-group"><label>Net Terms (days)</label>
                  <select><option>15</option><option>30</option><option>45</option><option>60</option></select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowAdd(false)}><Plus size={14} /> Add Vendor</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
