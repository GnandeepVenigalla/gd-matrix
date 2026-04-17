'use client';
import { UploadCloud, FileText, CheckCircle2, Clock } from 'lucide-react';

export default function PortalTimesheets() {
  const timesheets = [
    { week: 'Mar 25 - Mar 31, 2026', hours: 40, status: 'Approved', submittedOn: '2026-04-01' },
    { week: 'Mar 18 - Mar 24, 2026', hours: 40, status: 'Approved', submittedOn: '2026-03-25' },
    { week: 'Mar 11 - Mar 17, 2026', hours: 38, status: 'Approved', submittedOn: '2026-03-18' },
  ];

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
             <table className="table">
               <thead>
                 <tr>
                   <th>Week Ending</th>
                   <th>Hours Logged</th>
                   <th>Submitted On</th>
                   <th>Status</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td style={{ fontWeight: 500 }}>Apr 01 - Apr 07, 2026</td>
                   <td>—</td>
                   <td>—</td>
                   <td><span className="badge badge-yellow">Pending Submission</span></td>
                 </tr>
                 {timesheets.map((ts, i) => (
                   <tr key={i}>
                     <td style={{ fontWeight: 500 }}>{ts.week}</td>
                     <td>{ts.hours}h</td>
                     <td>{ts.submittedOn}</td>
                     <td>
                       <span className="badge badge-green"><CheckCircle2 size={12} style={{ marginRight: 4 }}/> {ts.status}</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card metric-card metric-card-purple">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Submit Hours (Apr 01 - Apr 07)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Client / Project</label>
                <select className="input-field" disabled defaultValue="infosys">
                  <option value="infosys">Infosys BPO - Java Developer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Total Hours</label>
                <input type="number" className="input-field" placeholder="e.g. 40" defaultValue={40} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.35rem' }}>Client Approved Timesheet (PDF)</label>
                <div style={{ 
                  border: '2px dashed var(--border-subtle)', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  textAlign: 'center', 
                  background: 'var(--bg-secondary)',
                  cursor: 'pointer'
                }}>
                  <UploadCloud size={24} style={{ color: 'var(--text-secondary)', margin: '0 auto 0.5rem' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Upload File</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Drag & drop or click</div>
                </div>
              </div>

              <div className="alert alert-yellow" style={{ margin: '0.5rem 0' }}>
                <Clock size={16} /> Timesheets are due every Monday by 10AM EST.
              </div>

              <button className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>Submit Timesheet</button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
