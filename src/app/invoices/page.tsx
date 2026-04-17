'use client';
import { invoices as allInvoices } from '@/lib/mockData';
import { FileText, Download, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

const STATUS_MAP = { Paid: 'badge-green', Pending: 'badge-yellow', Overdue: 'badge-red' };

export default function InvoicesPage() {
  const totalPaid = allInvoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = allInvoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.amount, 0);
  const totalOverdue = allInvoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);

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
              {allInvoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--cyan)' }}>{inv.id}</td>
                  <td style={{ fontWeight: 600 }}>{inv.consultantName}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{inv.vendorName}</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>{inv.hours}h</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace' }}>${inv.rate}/hr</td>
                  <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--green)', fontSize: 14 }}>${inv.amount.toLocaleString()}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{inv.issuedDate}</td>
                  <td style={{ fontSize: 12, color: inv.status === 'Overdue' ? 'var(--red)' : 'var(--text-secondary)', fontFamily: 'JetBrains Mono, monospace' }}>{inv.dueDate}</td>
                  <td><span className={`badge ${STATUS_MAP[inv.status]}`}>{inv.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn btn-sm btn-ghost"><Download size={12} /> PDF</button>
                      {inv.status !== 'Paid' && <button className="btn btn-sm btn-success"><CheckCircle size={12} /> Paid</button>}
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
