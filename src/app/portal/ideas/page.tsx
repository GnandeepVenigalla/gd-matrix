'use client';
import { useState } from 'react';
import { Shield, Plus, CheckCircle, Clock, AlertTriangle, FileText, Lock, Download, Eye } from 'lucide-react';

const ideas = [
  {
    id: 'id001', title: 'Automated Hotlist Generator', description: 'A one-click system to auto-generate and email available consultant profiles to vendor mailing lists based on skill filters.',
    category: 'Automation', registeredAt: '2026-03-15', status: 'Registered', refCode: 'GDM-IP-2026-001', registeredBy: 'Arjun Sharma',
  },
  {
    id: 'id002', title: 'AI-Powered Resume Masker', description: 'Use NLP to intelligently redact PII from resumes while preserving technical achievements, then apply GD Matrix branding.',
    category: 'AI/ML', registeredAt: '2026-03-28', status: 'Pending Review', refCode: 'GDM-IP-2026-002', registeredBy: 'Arjun Sharma',
  },
  {
    id: 'id003', title: 'Vendor Scorecard Analytics', description: 'Dashboard to track vendor interview-to-placement ratios, response times, and payment reliability to rank vendor relationships.',
    category: 'Analytics', registeredAt: '2026-04-01', status: 'Registered', refCode: 'GDM-IP-2026-003', registeredBy: 'Arjun Sharma',
  },
];

const categories = ['Automation', 'AI/ML', 'Analytics', 'Product Feature', 'Process Improvement', 'Other'];

const statusConfig = {
  'Registered': { color: '#16a34a', bg: '#f0fdf4', icon: CheckCircle },
  'Pending Review': { color: '#d97706', bg: '#fffbeb', icon: Clock },
  'Rejected': { color: '#dc2626', bg: '#fef2f2', icon: AlertTriangle },
};

export default function IdeasPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: '' });
  const [submitted, setSubmitted] = useState(false);
  const [list, setList] = useState(ideas);

  function handleSubmit() {
    if (!form.title || !form.description || !form.category) return;
    const newIdea = {
      id: `id00${list.length + 1}`, title: form.title, description: form.description, category: form.category,
      registeredAt: new Date().toISOString().split('T')[0], status: 'Pending Review' as const,
      refCode: `GDM-IP-2026-00${list.length + 1}`, registeredBy: 'Arjun Sharma',
    };
    setList(prev => [newIdea, ...prev]);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setShowForm(false); setForm({ title: '', description: '', category: '' }); }, 2500);
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title"><h1>Idea Protection</h1><p>Register and protect your professional ideas, innovations, and intellectual contributions</p></div>
        <div className="top-bar-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={14} />Register New Idea</button>
        </div>
      </div>
      <div className="page-content">
        {/* Info Banner */}
        <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', borderRadius: 12, padding: '18px 24px', marginBottom: 20, color: 'white', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Timestamped IP Registration</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>All ideas are timestamped on registration and stored in an immutable audit trail. Each registration generates a unique reference code that can be used in legal or IP dispute proceedings.</div>
          </div>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
            <Download size={13} /> Download Certificate
          </button>
        </div>

        {/* Registration Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: 20, border: '1px solid #bfdbfe' }}>
            <div style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lock size={16} style={{ color: 'var(--accent)' }} />Register New Idea
            </div>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={40} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 700, color: '#16a34a', marginBottom: 6 }}>Idea Registered Successfully!</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>A unique reference code has been generated and an email confirmation is on its way.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label>Idea Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Automated Resume Screening Tool" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select a category...</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description *</label>
                  <textarea rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your idea in detail — what problem it solves, how it works, and its intended impact..." style={{ resize: 'vertical' }} />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
                  <button className="btn btn-primary" onClick={handleSubmit} disabled={!form.title || !form.description || !form.category}><Shield size={13} />Register & Protect</button>
                  <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ideas List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(idea => {
            const cfg = statusConfig[idea.status as keyof typeof statusConfig];
            const I = cfg.icon;
            return (
              <div key={idea.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={20} style={{ color: '#64748b' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem' }}>{idea.title}</span>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 4, background: cfg.bg, color: cfg.color, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <I size={11} />{idea.status}
                      </span>
                      <span className="badge badge-blue">{idea.category}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{idea.description}</p>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />Registered: {idea.registeredAt}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#2563eb' }}><Lock size={11} />{idea.refCode}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>By: {idea.registeredBy}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button className="btn-icon" title="View Certificate"><Eye size={14} /></button>
                    <button className="btn-icon" title="Download"><Download size={14} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="card" style={{ marginTop: 20, padding: '14px 18px', background: '#f8fafc', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            <strong>Disclaimer:</strong> This system provides a timestamped record of idea submissions for internal IP management purposes. It does not constitute a formal patent or copyright filing. For full legal protection, consult a qualified IP attorney. GD Matrix is not liable for disputes arising from unregistered external disclosures.
          </p>
        </div>
      </div>
    </>
  );
}
