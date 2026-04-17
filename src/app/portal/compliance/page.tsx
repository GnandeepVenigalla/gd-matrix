'use client';
import { consultants } from '@/lib/mockData';
import { ShieldAlert, CheckCircle, UploadCloud, FileText, AlertTriangle } from 'lucide-react';

export default function PortalCompliance() {
  const me = consultants.find(c => c.id === 'c001')!;

  const docs = [
    { name: 'Passport', required: true, status: me.compliance.passport, expiry: me.passportExpiry },
    { name: 'Visa Stamp / I-94', required: true, status: me.compliance.i94, expiry: me.i94Expiry },
    { name: 'I-797 (Approval Notice)', required: true, status: me.compliance.i797, expiry: me.visaExpiry },
    { name: 'LCA', required: true, status: me.compliance.lca, expiry: me.visaExpiry },
  ];

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Compliance Vault</h1>
          <p>Manage your immigration documents and identity verification</p>
        </div>
      </div>

      <div className="page-content">
        <div className="dashboard-split">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card metric-card metric-card-cyan">
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h2 className="section-title">My Documents</h2>
               <button className="btn btn-primary"><UploadCloud size={16}/> Upload Document</button>
             </div>

             <div className="compliance-checklist" style={{ margin: 0 }}>
               {docs.map((doc, idx) => (
                 <div key={idx} className={`compliance-item ${doc.status ? 'done' : 'missing'}`}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                     {doc.status ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                     <div>
                       <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{doc.name}</div>
                       <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                         {doc.status ? `Expires: ${doc.expiry}` : 'Needs Upload — Required'}
                       </div>
                     </div>
                   </div>
                   {doc.status ? (
                     <button className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem' }}>View</button>
                   ) : (
                     <button className="btn btn-primary btn-sm" style={{ padding: '0.35rem 0.75rem' }}>Upload</button>
                   )}
                 </div>
               ))}
             </div>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card metric-card metric-card-blue">
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Status Overview</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
               <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <ShieldAlert size={24} style={{ color: 'var(--blue)' }} />
               </div>
               <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{me.visaType} Status</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Valid until {me.visaExpiry}</div>
               </div>
            </div>
            <div className="glow-divider" style={{ margin: '1rem 0' }}></div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              If you receive an extension or change of status, please upload your new I-797 notice to the vault immediately to prevent billing delays.
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
