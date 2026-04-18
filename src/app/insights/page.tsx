'use client';
import { useState } from 'react';
import { MessageSquare, Brain, Target, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Lightbulb, Star, Mail, Calendar, TrendingUp } from 'lucide-react';
import { consultants, submissions } from '@/lib/mockData';

type Area = 'communication' | 'interview' | 'subject';

const areaConfig = {
  communication: { icon: MessageSquare, label: 'Communication', color: '#f59e0b', bg: '#fffbeb', text: '#d97706' },
  interview:     { icon: Target,         label: 'Interview Prep', color: '#ef4444', bg: '#fef2f2', text: '#dc2626' },
  subject:       { icon: Brain,          label: 'Subject Knowledge', color: '#a855f7', bg: '#faf5ff', text: '#9333ea' },
};

const insights = consultants.map((c) => {
  const myS = submissions.filter(s => s.consultantId === c.id);
  const seed = c.id.charCodeAt(3);
  const comm = 40 + (seed * 17) % 55;
  const intv = 35 + (seed * 23) % 60;
  const subj = 45 + (seed * 13) % 50;
  const weak: Area[] = [];
  if (comm < 65) weak.push('communication');
  if (intv < 65) weak.push('interview');
  if (subj < 65) weak.push('subject');
  const recs: string[] = [];
  if (comm < 65) recs.push('Schedule bi-weekly mock calls to improve verbal clarity.');
  if (intv < 65) recs.push('Run 2 mock technical rounds using the client-prep deck.');
  if (subj < 65) recs.push(`Assign a ${c.techStack[0]} deep-dive module and certification path.`);
  if (myS.filter(s => s.status === 'Rejected').length > 1) recs.push('Analyse rejections and reposition resume for niche roles.');
  if (!recs.length) recs.push('Performing well — maintain check-ins and target senior roles.');
  return { ...c, initials: c.name.split(' ').map(n => n[0]).join(''), weak, scores: { communication: comm, interview: intv, subject: subj }, recs, placementRate: myS.length ? Math.round(myS.filter(s => s.status === 'Placed').length / myS.length * 100) : 0 };
});

function Bar({ v, color }: { v: number; color: string }) {
  return <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99 }}><div style={{ width: `${v}%`, height: '100%', background: color, borderRadius: 99 }} /></div>;
}

function Card({ d }: { d: typeof insights[0] }) {
  const [open, setOpen] = useState(false);
  const bad = d.weak.length > 0;
  return (
    <div className="card" style={{ padding: 0, border: bad ? '1px solid #fecaca' : '1px solid var(--border)' }}>
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: bad ? '#fef2f2' : '#f0fdf4', color: bad ? '#dc2626' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{d.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontWeight: 600 }}>{d.name}</span>
            <span className={`badge ${d.status === 'On Project' ? 'badge-green' : 'badge-gray'}`}>{d.status}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.techStack.slice(0,3).join(' · ')}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {d.weak.length === 0
            ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}><CheckCircle size={13} /> On Track</span>
            : d.weak.map(a => { const cfg = areaConfig[a]; const I = cfg.icon; return <span key={a} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.73rem', fontWeight: 600, padding: '3px 7px', borderRadius: 4, background: cfg.bg, color: cfg.text }}><I size={11} />{cfg.label}</span>; })
          }
          {open ? <ChevronUp size={15} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text-muted)' }} />}
        </div>
      </div>
      {open && (
        <div style={{ borderTop: '1px solid var(--border)', padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Skill Scores</div>
            {(Object.keys(areaConfig) as Area[]).map(a => {
              const v = d.scores[a]; const cfg = areaConfig[a];
              return <div key={a} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{cfg.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: v < 65 ? cfg.text : '#16a34a' }}>{v}%</span>
                </div>
                <Bar v={v} color={v < 65 ? cfg.color : '#22c55e'} />
              </div>;
            })}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
              <div style={{ textAlign: 'center', padding: '10px 8px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{d.submissionsCount}</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 2 }}>Submissions</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 8px', background: 'var(--bg-subtle)', borderRadius: 8 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: d.placementRate > 30 ? '#16a34a' : '#dc2626' }}>{d.placementRate}%</div>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 2 }}>Placement Rate</div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 5 }}><Lightbulb size={12} />Recommended Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {d.recs.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '10px 12px', background: '#eff6ff', borderRadius: 8, borderLeft: '3px solid var(--accent)' }}>
                  <Star size={12} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <a href={`mailto:${d.email}`} className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center' }}><Mail size={12} />Email</a>
              <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}><Calendar size={12} />Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InsightsPage() {
  const [filter, setFilter] = useState<'all' | Area>('all');
  const filtered = filter === 'all' ? insights : insights.filter(i => i.weak.includes(filter));
  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title"><h1>Student Insights</h1><p>Identify consultants who need improvement and get recommended actions</p></div>
        <div className="top-bar-actions"><button className="btn btn-secondary btn-sm"><TrendingUp size={13} />Export Report</button></div>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          <div className="card" style={{ padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={18} style={{ color: '#dc2626' }} /></div>
              <div><div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{insights.filter(i => i.weak.length > 0).length}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>Needs Attention</div></div>
            </div>
          </div>
          {(Object.keys(areaConfig) as Area[]).map(a => {
            const cfg = areaConfig[a]; const I = cfg.icon; const count = insights.filter(i => i.weak.includes(a)).length;
            return <div key={a} className="card" style={{ padding: '14px 18px', cursor: 'pointer', border: filter === a ? `1.5px solid ${cfg.color}` : '1px solid var(--border)' }} onClick={() => setFilter(filter === a ? 'all' : a)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I size={18} style={{ color: cfg.text }} /></div>
                <div><div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{count}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>{cfg.label}</div></div>
              </div>
            </div>;
          })}
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['all', 'communication', 'interview', 'subject'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}>
              {f === 'all' ? 'All Consultants' : areaConfig[f].label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(d => <Card key={d.id} d={d} />)}
        </div>
      </div>
    </>
  );
}
