'use client';
import { consultants, submissions } from '@/lib/mockData';
import { MapPin, Building2, Calendar, Clock, ArrowRight } from 'lucide-react';

export default function ConsultantDashboard() {
  const me = consultants.find(c => c.id === 'c001')!;
  const mySubmissions = submissions.filter(s => s.consultantId === 'c001');

  const activeSubmissions = mySubmissions.filter(s => ['Submitted', 'Client Screening', 'Round 1', 'Round 2', 'Offer'].includes(s.status));

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Welcome back, {me.name.split(' ')[0]}</h1>
          <p>Here is the status of your current applications and assignments</p>
        </div>
      </div>

      <div className="page-content">
        <div className="dashboard-split" style={{ gridTemplateColumns: '1fr 300px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Active Pipeline</h2>
            {activeSubmissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No active submissions at the moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeSubmissions.map(sub => (
                  <div key={sub.id} style={{ padding: '1.25rem', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{sub.position}</div>
                      <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Building2 size={14}/> {sub.vendorName}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> {sub.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> Updated {sub.lastUpdated}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`badge ${sub.status === 'Offer' ? 'badge-green' : sub.status === 'Submitted' ? '' : 'badge-cyan'}`} style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Past Applications</h2>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Client / Vendor</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.filter(s => ['Placed', 'Rejected'].includes(s.status)).map(sub => (
                    <tr key={sub.id}>
                      <td style={{ fontWeight: 500 }}>{sub.position}</td>
                      <td>{sub.vendorName}</td>
                      <td>{sub.submittedAt}</td>
                      <td>
                        <span className={`badge ${sub.status === 'Placed' ? 'badge-green' : 'badge-red'}`}>
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {mySubmissions.filter(s => ['Placed', 'Rejected'].includes(s.status)).length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>No past applications</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card metric-card metric-card-cyan">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>My Profile</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                <span className="badge badge-cyan">{me.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Role</span>
                <span style={{ fontWeight: 500 }}>{me.techStack[0]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Location</span>
                <span>{me.location}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Experience</span>
                <span>{me.experience} Years</span>
              </div>
            </div>
            
            <div className="glow-divider" style={{ margin: '1rem 0' }}></div>
            
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Recruiter</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="avatar" style={{ width: 32, height: 32 }}>AK</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>Alex Kim</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>alex@gd.com</div>
              </div>
            </div>
          </div>

          <div className="card metric-card metric-card-yellow">
             <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={18}/> Upcoming Interviews</h3>
             <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
               You have 1 interview scheduled this week.
             </div>
             <div style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--yellow)' }}>
                <strong style={{ display: 'block', marginBottom: '0.25rem' }}>Round 1 - Infosys BPO</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={14}/> Tomorrow at 10:00 AM PST
                </div>
             </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
