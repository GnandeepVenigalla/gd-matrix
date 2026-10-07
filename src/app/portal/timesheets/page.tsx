'use client';
import { getApiUrl } from '@/lib/apiConfig';
import { useEffect, useState } from 'react';
import { UploadCloud, CheckCircle2, Clock, Trash2 } from 'lucide-react';

export default function PortalTimesheets() {
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [hours, setHours] = useState(40);
  const [clientProject, setClientProject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        fetch(`${getApiUrl()}/api/timesheets?userId=${u.id}`)
          .then(res => res.json())
          .then(data => {
            setTimesheets(Array.isArray(data) ? data : []);
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } catch (e) {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timesheet?')) return;
    try {
      const res = await fetch(`${getApiUrl()}/api/timesheets/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTimesheets(prev => prev.filter((ts: any) => ts.id !== id));
      } else {
        alert('Failed to delete timesheet');
      }
    } catch (e) {
      alert('Error deleting timesheet');
    }
  };

  const handleSubmit = async () => {
    if (!user) return alert("Please log in first");
    if (!clientProject.trim()) return alert("Please enter the Client / Project name");
    if (!file) return alert("Please upload a timesheet PDF");

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('week', 'Apr 01 - Apr 07, 2026');
      formData.append('hours', hours.toString());
      formData.append('clientProject', clientProject);
      formData.append('file', file);

      const res = await fetch(`\${getApiUrl()}/api/timesheets`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const fresh = await fetch(`${getApiUrl()}/api/timesheets?userId=${user.id}`).then(r => r.json());
        setTimesheets(Array.isArray(fresh) ? fresh : []);
        alert('Timesheet submitted successfully');
        setFile(null); // Reset file
      } else {
        alert('Failed to submit timesheet');
      }
    } catch (e) {
      alert('Error submitting timesheet');
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Loading timesheets...</div>;
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Timesheets</h1>
          <p>Submit your weekly hours and track payment processing</p>
        </div>
      </div>

      <div className="page-content">
        <div className="dashboard-split" style={{ gridTemplateColumns: '1fr 350px' }}>
        <div className="card">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title">Previous Timesheets</h2>
           </div>
           
           <div className="table-container">
             {timesheets.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                 No timesheets found. Submit your first one!
               </div>
             ) : (
               <table className="table">
                 <thead>
                   <tr>
                     <th>Week Ending</th>
                     <th>Hours Logged</th>
                     <th>Submitted On</th>
                     <th>Status</th><th style={{ width: 40 }}></th>
                   </tr>
                 </thead>
                 <tbody>
                   {timesheets.map((ts: any, i: number) => (
                     <tr key={i}>
                       <td style={{ fontWeight: 500 }}>{ts.week}</td>
                       <td>{ts.hours}h</td>
                       <td>{ts.uploadedAt || '—'}</td>
                       <td>
                         <span className="badge badge-green"><CheckCircle2 size={12} style={{ marginRight: 4 }}/> {ts.status}</span>
                       </td>
                       <td>
                         <button className="btn-icon" onClick={() => handleDelete(ts.id)} style={{ color: 'var(--red)' }} title="Delete Timesheet"><Trash2 size={14} /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card metric-card metric-card-purple">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Submit Hours (Apr 01 - Apr 07)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Client / Project</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={clientProject}
                  onChange={(e) => setClientProject(e.target.value)}
                  placeholder="e.g. Infosys BPO - Java Developer"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Total Hours</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Client Approved Timesheet (PDF)</label>
                <div style={{ 
                  border: '2px dashed var(--border-subtle)', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  textAlign: 'center', 
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.png"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                  {file ? (
                    <div style={{ color: 'var(--green)' }}>
                      <CheckCircle2 size={24} style={{ margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{file.name} attached</div>
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={24} style={{ color: 'var(--text-secondary)', margin: '0 auto 0.5rem' }} />
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Upload File</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Drag & drop or click</div>
                    </>
                  )}
                </div>
              </div>

              <div className="alert alert-yellow" style={{ margin: '0.5rem 0' }}>
                <Clock size={16} /> Timesheets are due every Monday by 10AM EST.
              </div>

              <button 
                className="btn btn-primary w-full" 
                style={{ justifyContent: 'center' }}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Timesheet'}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
