'use client';
import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/apiConfig';
import { FileText, Download, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const STATUS_MAP = { Paid: 'badge-green', Pending: 'badge-yellow', Overdue: 'badge-red' };

export default function InvoicesPage() {
  const [allInvoices, setAllInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${getApiUrl()}/api/invoices`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAllInvoices(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalPaid = allInvoices.filter((i: any) => i.status === 'Paid').reduce((s: any, i: any) => s + i.amount, 0);
  const totalPending = allInvoices.filter((i: any) => i.status === 'Pending').reduce((s: any, i: any) => s + i.amount, 0);
  const totalOverdue = allInvoices.filter((i: any) => i.status === 'Overdue').reduce((s: any, i: any) => s + i.amount, 0);

  if (loading) return <div style={{ padding: '2rem' }}>Loading invoices...</div>;

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Invoices</h1>
          <p>All invoices · {allInvoices.length} total</p>
        </div>
        <div className="top-bar-actions">
          <button className="btn btn-secondary"><Download size={14} /> Export All</button>
        </div>
      </div>
      <div className="page-content">
        <div className="metric-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
          <div className="metric-card green">
            <div className="metric-icon green"><CheckCircle size={20} /></div>
            <div className="metric-label">Paid</div>
            <div className="metric-value">${(totalPaid / 1000).toFixed(1)}K</div>
          </div>
          <div className="metric-card yellow">
            <div className="metric-icon yellow"><Clock size={20} /></div>
            <div className="metric-label">Pending</div>
            <div className="metric-value">${(totalPending / 1000).toFixed(1)}K</div>
          </div>
          <div className="metric-card red">
            <div className="metric-icon red"><AlertTriangle size={20} /></div>
            <div className="metric-label">Overdue</div>
            <div className="metric-value">${(totalOverdue / 1000).toFixed(1)}K</div>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr><th>Invoice ID</th><th>Consultant</th><th>Vendor</th><th>Hours</th><th>Rate</th><th>Total</th><th>Issued</th><th>Due</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
                {allInvoices.length === 0 ? (
                  <tr><td colSpan={7} style={{textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>No invoices generated yet.</td></tr>
                ) : allInvoices.map((inv: any) => (
                  <tr key={inv.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{inv.consultantName || 'Unknown'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{inv.vendorName || 'Direct Client'}</div>
                    </td>
                    <td>{inv.issuedDate || 'N/A'}</td>
                    <td>{inv.dueDate || 'N/A'}</td>
                    <td>{inv.hours}h</td>
                    <td style={{ fontWeight: 500, color: 'var(--green)' }}>${(inv.amount || 0).toLocaleString()}</td>
                    <td><span className={`badge ${STATUS_MAP[inv.status as keyof typeof STATUS_MAP] || 'badge-cyan'}`}>{inv.status}</span></td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon"><Download size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
