'use client';
import { useState } from 'react';
import { Star, MessageSquare, CheckCircle, XCircle, Clock, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';

const feedbackData = [
  {
    id: 'fb001', type: 'Interview', company: 'Infosys BPO', role: 'Java Developer', date: '2026-04-05',
    round: 'Round 1', result: 'Passed', score: 78,
    areas: { communication: 82, technical: 74, problemSolving: 79 },
    recruiterNotes: 'Good foundational Java knowledge. Could improve on system design explanations. Work on structuring answers with STAR method.',
    focusAreas: ['System Design concepts', 'Spring Boot internals', 'STAR method for behavioral'],
    recruiter: 'Alex Kim',
  },
  {
    id: 'fb002', type: 'Interview', company: 'Wipro Staffing', role: 'Full Stack Developer', date: '2026-03-28',
    round: 'Client Screening', result: 'Passed', score: 85,
    areas: { communication: 88, technical: 82, problemSolving: 85 },
    recruiterNotes: 'Excellent communication skills. Client was impressed with the React experience. Strong candidate.',
    focusAreas: ['Docker & containerization basics', 'REST API design patterns'],
    recruiter: 'Alex Kim',
  },
  {
    id: 'fb003', type: 'Assessment', company: 'Capgemini', role: 'Java Developer', date: '2026-03-15',
    round: 'Technical Assessment', result: 'Rejected', score: 54,
    areas: { communication: 60, technical: 48, problemSolving: 55 },
    recruiterNotes: 'Struggled with advanced Kubernetes concepts and multi-threading. Need to strengthen these areas before next submission to a similar client.',
    focusAreas: ['Kubernetes orchestration', 'Java multi-threading & concurrency', 'Microservices architecture'],
    recruiter: 'Priya M',
  },
  {
    id: 'fb004', type: 'Interview', company: 'HCL Technologies', role: 'Java Developer', date: '2026-02-20',
    round: 'Round 2', result: 'Passed', score: 91,
    areas: { communication: 95, technical: 88, problemSolving: 90 },
    recruiterNotes: 'Outstanding performance. Client loved the project walkthrough. Offer stage next.',
    focusAreas: ['Salary negotiation prep', 'Benefits discussion'],
    recruiter: 'Alex Kim',
  },
];

function ScoreDial({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ width: 64, height: 64, borderRadius: '50%', border: `4px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/ 100</div>
      </div>
    </div>
  );
}

export default function FeedbackPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const detail = feedbackData.find(f => f.id === selected);
  const avg = Math.round(feedbackData.reduce((s, f) => s + f.score, 0) / feedbackData.length);
  const passed = feedbackData.filter(f => f.result === 'Passed').length;

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title"><h1>Interview Feedback</h1><p>Review your past interview and assessment feedback to identify growth areas</p></div>
      </div>
      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Avg Score', value: `${avg}%`, icon: Star, color: '#f59e0b', bg: '#fffbeb' },
            { label: 'Passed', value: `${passed}/${feedbackData.length}`, icon: CheckCircle, color: '#16a34a', bg: '#f0fdf4' },
            { label: 'In Review', value: `${feedbackData.filter(f => f.result === 'Passed').length}`, icon: TrendingUp, color: '#2563eb', bg: '#eff6ff' },
          ].map(s => {
            const I = s.icon;
            return (
              <div key={s.label} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><I size={18} style={{ color: s.color }} /></div>
                <div><div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div></div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: 16 }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {feedbackData.map(f => (
              <div key={f.id} className="card" onClick={() => setSelected(selected === f.id ? null : f.id)}
                style={{ cursor: 'pointer', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, border: selected === f.id ? '1.5px solid var(--accent)' : '1px solid var(--border)' }}>
                <ScoreDial score={f.score} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>{f.company}</span>
                    <span className={`badge ${f.result === 'Passed' ? 'badge-green' : 'badge-red'}`}>{f.result}</span>
                    <span className="badge badge-blue">{f.type}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 2 }}>{f.role} · {f.round}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{f.date}</div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              </div>
            ))}
          </div>

          {/* Detail Panel */}
          {detail && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{detail.company} — {detail.round}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>{detail.date} · {detail.recruiter}</div>
                </div>
                <span className={`badge ${detail.result === 'Passed' ? 'badge-green' : 'badge-red'}`}>{detail.result}</span>
              </div>
              <div style={{ padding: 20 }}>
                {/* Score breakdown */}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Score Breakdown</div>
                {Object.entries(detail.areas).map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: v >= 80 ? '#16a34a' : v >= 65 ? '#d97706' : '#dc2626' }}>{v}%</span>
                    </div>
                    <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99 }}><div style={{ width: `${v}%`, height: '100%', background: v >= 80 ? '#22c55e' : v >= 65 ? '#f59e0b' : '#ef4444', borderRadius: 99 }} /></div>
                  </div>
                ))}

                <div className="glow-divider" style={{ margin: '16px 0' }} />

                {/* Notes */}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Recruiter Notes</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '12px 14px', background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid var(--accent)', marginBottom: 16 }}>
                  {detail.recruiterNotes}
                </div>

                {/* Focus Areas */}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><BookOpen size={12} />Focus Areas</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {detail.focusAreas.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', padding: '8px 12px', background: '#faf5ff', borderRadius: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a855f7', flexShrink: 0 }} />{a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
