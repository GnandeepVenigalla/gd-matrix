'use client';
import { getApiUrl } from '@/lib/apiConfig';
import { useState, useMemo, useEffect } from 'react';
import {
  Users, Search, Filter, Plus, FileText, Eye, Download,
  CheckCircle, XCircle, AlertTriangle, Shield, Clock,
  ChevronDown, Copy, Star, MoreHorizontal, RefreshCw
} from 'lucide-react';
import {
  consultants as allConsultants, getComplianceScore, getVisaUrgency, getDaysUntil, Consultant
} from '@/lib/mockData';

const VISA_COLORS: Record<string, string> = {
  H1B: 'badge-blue', OPT: 'badge-yellow', 'STEM OPT': 'badge-purple',
  CPT: 'badge-cyan', 'H4 EAD': 'badge-green', 'GC-EAD': 'badge-green',
  'Green Card': 'badge-green', 'US Citizen': 'badge-gray',
};

const STATUS_COLORS: Record<string, string> = {
  'On Bench': 'badge-yellow', 'On Project': 'badge-green',
  'Interview': 'badge-purple', 'Unavailable': 'badge-red',
};

function ComplianceMeter({ score }: { score: number }) {
  const color = score === 100 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace', minWidth: 32 }}>{score}%</span>
    </div>
  );
}

function HotlistModal({ selected, onClose }: { selected: Consultant[]; onClose: () => void }) {
  const html = `
<table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:13px;">
  <thead><tr style="background:#0D1117;color:#00F5FF;">
    <th style="padding:10px;border:1px solid #30363d;">Name</th>
    <th style="padding:10px;border:1px solid #30363d;">Tech Stack</th>
    <th style="padding:10px;border:1px solid #30363d;">Visa</th>
    <th style="padding:10px;border:1px solid #30363d;">Exp.</th>
    <th style="padding:10px;border:1px solid #30363d;">Rate</th>
    <th style="padding:10px;border:1px solid #30363d;">Location</th>
    <th style="padding:10px;border:1px solid #30363d;">Available</th>
  </tr></thead>
  <tbody>
    ${selected.map((c, i) => `<tr style="background:${i % 2 ? '#1A2233' : '#161B22'}">
      <td style="padding:8px 10px;border:1px solid #30363d;font-weight:600;color:#E6EDF3;">${c.name.split(' ')[0]} ****</td>
      <td style="padding:8px 10px;border:1px solid #30363d;color:#8B949E;">${c.techStack.slice(0,3).join(', ')}</td>
      <td style="padding:8px 10px;border:1px solid #30363d;color:#00F5FF;">${c.visaType}</td>
      <td style="padding:8px 10px;border:1px solid #30363d;color:#E6EDF3;">${c.experience}y</td>
      <td style="padding:8px 10px;border:1px solid #30363d;color:#10B981;font-weight:700;">$${c.buyRate}/hr</td>
      <td style="padding:8px 10px;border:1px solid #30363d;color:#8B949E;">${c.location}</td>
      <td style="padding:8px 10px;border:1px solid #30363d;color:#10B981;">${c.availableFrom}</td>
    </tr>`).join('')}
  </tbody>
</table>
<p style="font-family:Arial;font-size:11px;color:#8B949E;margin-top:8px;">GD Matrix · GD Enterprises Inc. · Confidential – For Recipient Only</p>`.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon"><Download size={18} /></div>
          <div>
            <div className="modal-title">Hotlist Export</div>
            <div className="modal-subtitle">{selected.length} consultants selected</div>
          </div>
          <button className="modal-close" onClick={onClose}><XCircle size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="alert alert-cyan">
            <Shield size={16} />
            <span>Consultant names are auto-masked (last name redacted). Copy and paste this HTML directly into your email.</span>
          </div>
          <textarea
            value={html}
            readOnly
            style={{ width: '100%', height: 200, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, resize: 'vertical' }}
          />
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(html)}>
            <Copy size={14} /> Copy HTML
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsultantDetailModal({ consultant, onClose }: { consultant: Consultant; onClose: () => void }) {
  const score = getComplianceScore(consultant.compliance);
  const visaUrgency = getVisaUrgency(consultant.visaExpiry);
  const visaDays = getDaysUntil(consultant.visaExpiry);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--bg-primary)', fontSize: 16 }}>
            {consultant.name.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div>
            <div className="modal-title">{consultant.name}</div>
            <div className="modal-subtitle">{consultant.techStack.slice(0, 3).join(' · ')} · {consultant.location}</div>
          </div>
          <button className="modal-close" onClick={onClose}><XCircle size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="grid-2" style={{ marginBottom: 20 }}>
            <div>
              <label>Visa Status</label>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${VISA_COLORS[consultant.visaType] || 'badge-gray'}`}>{consultant.visaType}</span>
                <span style={{ fontSize: 12, color: visaUrgency === 'critical' ? 'var(--red)' : visaUrgency === 'warning' ? 'var(--yellow)' : 'var(--green)' }}>
                  {visaDays}d remaining
                </span>
              </div>
            </div>
            <div>
              <label>Buy Rate</label>
              <div style={{ marginTop: 6, fontSize: 20, fontWeight: 800, color: 'var(--green)', fontFamily: 'JetBrains Mono, monospace' }}>
                ${consultant.buyRate}/hr
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ marginBottom: 8, display: 'block' }}>Tech Stack</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {consultant.techStack.map(s => <span key={s} className="chip">{s}</span>)}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ marginBottom: 8, display: 'block' }}>Compliance Meter</label>
            <ComplianceMeter score={score} />
            <div className="compliance-checklist" style={{ marginTop: 10 }}>
              {Object.entries(consultant.compliance).map(([k, v]) => (
                <div key={k} className={`compliance-item ${v ? 'done' : 'missing'}`}>
                  {v ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>{k.toUpperCase()} {v ? 'uploaded' : '– MISSING'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label>Key Dates</label>
              <div style={{ fontSize: 13, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Visa Expiry</span>
                  <span style={{ color: visaUrgency === 'critical' ? 'var(--red)' : 'var(--text-primary)', fontFamily: 'JetBrains Mono, monospace' }}>{consultant.visaExpiry}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Passport Expiry</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>{consultant.passportExpiry}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Available From</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--cyan)' }}>{consultant.availableFrom}</span>
                </div>
              </div>
            </div>
            <div>
              <label>Activity</label>
              <div style={{ fontSize: 13, marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Submissions</span>
                  <span style={{ fontWeight: 700, color: 'var(--cyan)', fontFamily: 'JetBrains Mono, monospace' }}>{consultant.submissionsCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Interviews</span>
                  <span style={{ fontWeight: 700, color: 'var(--purple)', fontFamily: 'JetBrains Mono, monospace' }}>{consultant.interviewsCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Experience</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{consultant.experience} yrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary"><Shield size={14} /> Mask Resume</button>
          <button className="btn btn-primary"><FileText size={14} /> View Documents</button>
        </div>
      </div>
    </div>
  );
}


export default function BenchPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [viewConsultant, setViewConsultant] = useState<any | null>(null);
  const [consultants, setConsultants] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  
  const [editClient, setEditClient] = useState('');
  const [editRate, setEditRate] = useState(0);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        fetch(`\${getApiUrl()}/api/consultants?companyName=` + encodeURIComponent(u.companyName || 'GD Matrix'))
          .then(r => r.json())
          .then(data => {
             setConsultants(Array.isArray(data) ? data : []);
          });
      } catch(e){}
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      const res = await fetch(`\${getApiUrl()}/api/consultants/` + editing._id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client: editClient, payRate: editRate })
      });
      if (res.ok) {
        setEditing(null);
        fetchConsultants();
      } else alert('Failed to save');
    } catch(e) {
      alert('Error saving');
    }
  };

  const filtered = useMemo(() => consultants.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || (c.client || 'Bench').toLowerCase().includes(q);
  }), [search, consultants]);

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>The Bench</h1>
          <p>{filtered.length} consultants registered to your company</p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div className="search-wrapper" style={{ flex: 1, maxWidth: 400 }}>
            <Search size={15} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or client..."
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Consultant Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Current Client / Project</th>
                <th>Pay Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>No consultants found. Give them your invite code to sign up!</td></tr>
              )}
              {filtered.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.title || 'Consultant'}</td>
                  <td>{c.email}</td>
                  <td>{c.client || 'Bench'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--green)' }}>${c.payRate || 0}/hr</td>
                  <td><span className={"badge " + (c.client && c.client !== 'Bench' ? 'badge-blue' : 'badge-gray')}>{c.client && c.client !== 'Bench' ? 'On Project' : 'On Bench'}</span></td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => {
                      setEditing(c);
                      setEditClient(c.client || 'Bench');
                      setEditRate(c.payRate || 0);
                    }}>Edit Project / Rate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Edit {editing.name}</div>
              <button className="modal-close" onClick={() => setEditing(null)}><XCircle size={18} /></button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>Client / Project Name</label>
                <input className="input-field" value={editClient} onChange={e => setEditClient(e.target.value)} placeholder="e.g. Infosys BPO" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: 13, fontWeight: 500 }}>Pay Rate ($/hr)</label>
                <input className="input-field" type="number" value={editRate} onChange={e => setEditRate(Number(e.target.value))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
