'use client';
import { getApiUrl } from '@/lib/apiConfig';
import { useState, useEffect } from 'react';
const submissions: any[] = [];
import { MapPin, Building2, Calendar, Clock, ArrowRight, Edit, Save } from 'lucide-react';

export default function ConsultantDashboard() {
  
  const [user, setUser] = useState<any>({ name: 'Consultant', title: 'Developer', companyName: 'GD Matrix' });
  const [liveUser, setLiveUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.name) setUser(u);
        
        // Fetch live user status to get their assigned client
        const comp = encodeURIComponent(u.companyName || 'GD Matrix');
        fetch(`\${getApiUrl()}/api/consultants?companyName=` + comp)
          .then(r => r.json())
          .then(data => {
             if (Array.isArray(data)) {
               const me = data.find(c => c._id === u.id);
               if (me) setLiveUser(me);
             }
          });
      } catch(e) {}
    }
  }, []);

  
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', location: '', experience: '' });

  const handleEdit = () => {
    setEditForm({
      title: liveUser?.title || user.title || 'Consultant',
      location: liveUser?.location || 'Remote',
      experience: liveUser?.experience || '5 Years'
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    if (!liveUser) return;
    try {
      await fetch(`\${getApiUrl()}/api/consultants/` + liveUser._id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      setLiveUser({ ...liveUser, ...editForm });
      setEditMode(false);
    } catch(e) {
      alert('Failed to save profile');
    }
  };

  const isOnProject = liveUser && liveUser.client && liveUser.client !== 'Bench';
  const clientName = isOnProject ? liveUser.client : 'None';
  const recruiterName = user.companyName ? user.companyName + ' Admin' : 'Admin';

  const mySubmissions = submissions.filter((s: any) => s.consultantId === 'c001');

  const activeSubmissions = mySubmissions.filter((s: any) => ['Submitted', 'Client Screening', 'Round 1', 'Round 2', 'Offer'].includes(s.status));

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Welcome back, {user.name.split(' ')[0]}</h1>
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
                {activeSubmissions.map((sub: any) => (
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
                  {mySubmissions.filter((s: any) => ['Placed', 'Rejected'].includes(s.status)).map((sub: any) => (
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
                  {mySubmissions.filter((s: any) => ['Placed', 'Rejected'].includes(s.status)).length === 0 && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>No past applications</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card metric-card metric-card-cyan">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>My Profile</h3>
              {editMode ? (
                <button onClick={handleSave} className="btn-icon" style={{ color: 'var(--cyan)' }}><Save size={16}/></button>
              ) : (
                <button onClick={handleEdit} className="btn-icon"><Edit size={16}/></button>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                {isOnProject ? <span className="badge badge-blue">On Project</span> : <span className="badge badge-cyan">On Bench</span>}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Role</span>
                {editMode ? (
                  <input className="input-sm" style={{ width: 120, textAlign: 'right' }} value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} />
                ) : (
                  <span style={{ fontWeight: 500 }}>{liveUser?.title || user.title || 'Consultant'}</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Location</span>
                {editMode ? (
                  <input className="input-sm" style={{ width: 120, textAlign: 'right' }} value={editForm.location} onChange={e => setEditForm({...editForm, location: e.target.value})} />
                ) : (
                  <span>{liveUser?.location || 'Remote'}</span>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Experience</span>
                {editMode ? (
                  <input className="input-sm" style={{ width: 120, textAlign: 'right' }} value={editForm.experience} onChange={e => setEditForm({...editForm, experience: e.target.value})} />
                ) : (
                  <span>{liveUser?.experience || '5 Years'}</span>
                )}
              </div>
            </div>
            
            <div className="glow-divider" style={{ margin: '1rem 0' }}></div>
            
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Recruiter</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="avatar" style={{ width: 32, height: 32 }}>{recruiterName.substring(0,2).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{recruiterName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>admin@{user.companyName ? user.companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "company"}.com</div>
              </div>
            </div>
          </div>

          <div className="card metric-card metric-card-yellow">
             <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={18}/> Upcoming Interviews</h3>
             <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
               You have 0 interviews scheduled this week.
             </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
