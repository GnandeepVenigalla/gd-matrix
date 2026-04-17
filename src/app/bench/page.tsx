'use client';
import { useState, useMemo } from 'react';
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
            {consultant.name.split(' ').map(n => n[0]).join('')}
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
  const [statusFilter, setStatusFilter] = useState('All');
  const [visaFilter, setVisaFilter] = useState('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [showHotlist, setShowHotlist] = useState(false);
  const [viewConsultant, setViewConsultant] = useState<Consultant | null>(null);

  const filtered = useMemo(() => allConsultants.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.techStack.some(s => s.toLowerCase().includes(q)) || c.location.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchVisa = visaFilter === 'All' || c.visaType === visaFilter;
    return matchSearch && matchStatus && matchVisa;
  }), [search, statusFilter, visaFilter]);

  const toggleSelect = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const selectedConsultants = allConsultants.filter(c => selected.includes(c.id));

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>The Bench</h1>
          <p>{filtered.length} consultants · {allConsultants.filter(c => c.status === 'On Bench').length} available</p>
        </div>
        <div className="top-bar-actions">
          {selected.length > 0 && (
            <button className="btn btn-secondary" onClick={() => setShowHotlist(true)}>
              <Download size={14} /> Export Hotlist ({selected.length})
            </button>
          )}
          <button className="btn btn-primary"><Plus size={14} /> Add Consultant</button>
        </div>
      </div>

      <div className="page-content">
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-wrapper">
            <Search size={15} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, skill, location..."
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ minWidth: 140 }}>
            <option>All</option>
            <option>On Bench</option>
            <option>On Project</option>
            <option>Interview</option>
            <option>Unavailable</option>
          </select>
          <select value={visaFilter} onChange={e => setVisaFilter(e.target.value)} style={{ minWidth: 140 }}>
            <option>All</option>
            <option>H1B</option>
            <option>OPT</option>
            <option>STEM OPT</option>
            <option>CPT</option>
            <option>H4 EAD</option>
            <option>GC-EAD</option>
            <option>Green Card</option>
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            {selected.length > 0 && (
              <span style={{ fontSize: 12, color: 'var(--cyan)' }}>{selected.length} selected</span>
            )}
            <button className="btn-icon" onClick={() => setSelected([])} title="Clear selection"><RefreshCw size={14} /></button>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: 36 }}>
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(c => c.id) : [])} checked={selected.length === filtered.length && filtered.length > 0} style={{ cursor: 'pointer' }} />
                </th>
                <th>Consultant</th>
                <th>Tech Stack</th>
                <th>Visa</th>
                <th>Visa Expiry</th>
                <th>Exp.</th>
                <th>Location</th>
                <th>Buy Rate</th>
                <th>Compliance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const score = getComplianceScore(c.compliance);
                const urgency = getVisaUrgency(c.visaExpiry);
                const days = getDaysUntil(c.visaExpiry);
                return (
                  <tr key={c.id} style={{ opacity: c.status === 'Unavailable' ? 0.6 : 1 }}>
                    <td>
                      <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                          {c.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.techStack[0]}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 200 }}>
                        {c.techStack.slice(0, 3).map(s => <span key={s} className="chip">{s}</span>)}
                        {c.techStack.length > 3 && <span className="chip">+{c.techStack.length - 3}</span>}
                      </div>
                    </td>
                    <td><span className={`badge ${VISA_COLORS[c.visaType] || 'badge-gray'}`}>{c.visaType}</span></td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: urgency === 'critical' ? 'var(--red)' : urgency === 'warning' ? 'var(--yellow)' : 'var(--text-primary)' }}>
                          {c.visaExpiry}
                        </span>
                        {urgency !== 'ok' && (
                          <span style={{ fontSize: 10, color: urgency === 'critical' ? 'var(--red)' : 'var(--yellow)' }}>
                            {urgency === 'critical' ? '🔴' : '🟡'} {days}d left
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.experience}y</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{c.location}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--green)' }}>${c.buyRate}/hr</td>
                    <td style={{ minWidth: 130 }}><ComplianceMeter score={score} /></td>
                    <td>
                      <span className={`badge ${STATUS_COLORS[c.status] || 'badge-gray'}`}>{c.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn-icon" onClick={() => setViewConsultant(c)} title="View Profile"><Eye size={13} /></button>
                        <button className="btn-icon" title="Mask Resume"><Shield size={13} /></button>
                        <button className="btn-icon" title="Schedule Interview"><Clock size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon"><Users size={24} /></div>
            <h3>No consultants found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {showHotlist && <HotlistModal selected={selectedConsultants} onClose={() => setShowHotlist(false)} />}
      {viewConsultant && <ConsultantDetailModal consultant={viewConsultant} onClose={() => setViewConsultant(null)} />}
    </>
  );
}
