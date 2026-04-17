'use client';
import { auditLogs } from '@/lib/mockData';
import { Activity, User, Clock } from 'lucide-react';

export default function AuditPage() {
  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Audit Logs</h1>
          <p>Full history of every change in the system</p>
        </div>
      </div>
      <div className="page-content">
        <div className="card">
          <div className="section-header">
            <div className="section-title">Activity Timeline</div>
            <span className="badge badge-cyan">{auditLogs.length} records</span>
          </div>
          <div className="timeline">
            {auditLogs.map((log, i) => (
              <div key={log.id} className="timeline-item">
                <div className="timeline-dot" style={{ background: i % 2 === 0 ? 'var(--cyan-dim)' : 'var(--purple-dim)', border: `1px solid ${i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)'}` }}>
                  <Activity size={12} style={{ color: i % 2 === 0 ? 'var(--cyan)' : 'var(--purple)' }} />
                </div>
                <div className="timeline-content">
                  <div className="timeline-title">{log.action} — <span style={{ color: 'var(--cyan)' }}>{log.entity}</span></div>
                  <div className="timeline-desc">
                    by <strong>{log.user}</strong>
                    {log.oldValue && <span> · Changed from <code style={{ background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 3, fontSize: 11 }}>{log.oldValue}</code> to <code style={{ background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 3, fontSize: 11, color: 'var(--cyan)' }}>{log.newValue}</code></span>}
                  </div>
                  <div className="timeline-time"><Clock size={10} style={{ display: 'inline', marginRight: 4 }} />{new Date(log.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
