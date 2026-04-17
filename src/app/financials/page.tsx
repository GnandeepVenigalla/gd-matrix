'use client';
import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, FileText, Plus, Download, X } from 'lucide-react';
import { invoices as allInvoices, submissions, consultants, getMargin } from '@/lib/mockData';

const ar = allInvoices.filter(i => i.status !== 'Paid');
const paid = allInvoices.filter(i => i.status === 'Paid');

const totalAR = ar.reduce((s, i) => s + i.amount, 0);
const totalOverdue = allInvoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0);
const totalPaid = paid.reduce((s, i) => s + i.amount, 0);

// AP = what we owe consultants (70% of AR roughly)
const totalAP = allInvoices.reduce((s, i) => s + i.hours * (i.rate * 0.73), 0);

function InvoiceModal({ onClose }: { onClose: () => void }) {
  const [selectedSub, setSelectedSub] = useState(submissions[0].id);
  const [hours, setHours] = useState(160);
  const sub = submissions.find(s => s.id === selectedSub);
  const amount = sub ? hours * sub.sellRate : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon"><FileText size={18} /></div>
          <div>
            <div className="modal-title">Generate Invoice</div>
            <div className="modal-subtitle">Auto-calculate from timesheet data</div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>Placement / Consultant</label>
            <select value={selectedSub} onChange={e => setSelectedSub(e.target.value)}>
              {submissions.filter(s => ['Placed', 'Offer', 'Round 2'].includes(s.status)).map(s => (
                <option key={s.id} value={s.id}>{s.consultantName} → {s.vendorName}</option>
              ))}
            </select>
          </div>

          {sub && (
            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 16, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Sell Rate</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--cyan)' }}>${sub.sellRate}/hr</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Bill-to</span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{sub.vendorName}</span>
              </div>
            </div>
          )}

          <div className="grid-2">
            <div className="form-group">
              <label>Hours Worked</label>
              <input type="number" value={hours} onChange={e => setHours(Number(e.target.value))} min={0} max={744} />
            </div>
            <div className="form-group">
              <label>Billing Period</label>
              <input type="month" defaultValue="2026-04" />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Invoice Date</label>
              <input type="date" defaultValue="2026-04-06" />
            </div>
            <div className="form-group">
              <label>Net Terms (days)</label>
              <select defaultValue="30">
                <option>15</option><option>30</option><option>45</option><option>60</option>
              </select>
            </div>
          </div>

          <div className="profit-highlight">
            <div>
              <div className="profit-label">Invoice Total</div>
              <div className="profit-amount">${amount.toLocaleString()}</div>
            </div>
            {sub && (
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div className="profit-label">Your Gross Profit</div>
                <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: 'var(--cyan)', fontSize: 18 }}>
                  ${(hours * getMargin(sub.buyRate, sub.sellRate).hourly).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onClose}>
            <FileText size={14} /> Generate & Send
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_MAP = {
  Paid: 'badge-green',
  Pending: 'badge-yellow',
  Overdue: 'badge-red',
};

export default function FinancialsPage() {
  const [tab, setTab] = useState<'ar' | 'ap' | 'all'>('ar');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const displayed = tab === 'all' ? allInvoices : tab === 'ar' ? ar : paid;

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>FinOps Ledger</h1>
          <p>Accounts Receivable · Accounts Payable · Invoice Management</p>
        </div>
        <div className="top-bar-actions">
          <button className="btn btn-secondary"><Download size={14} /> Export CSV</button>
          <button className="btn btn-primary" onClick={() => setShowInvoiceModal(true)}><Plus size={14} /> Generate Invoice</button>
        </div>
      </div>

      <div className="page-content">
        {/* Summary cards */}
        <div className="metric-grid">
          <div className="metric-card green">
            <div className="metric-icon green"><TrendingUp size={20} /></div>
            <div className="metric-label">Total A/R Outstanding</div>
            <div className="metric-value">${(totalAR / 1000).toFixed(1)}K</div>
            <div className="metric-change up"><TrendingUp size={12} /> {ar.length} invoices pending</div>
          </div>
          <div className="metric-card red">
            <div className="metric-icon red"><AlertTriangle size={20} /></div>
            <div className="metric-label">Overdue Balance</div>
            <div className="metric-value">${(totalOverdue / 1000).toFixed(1)}K</div>
            <div className="metric-change down"><TrendingDown size={12} /> Needs immediate follow-up</div>
          </div>
          <div className="metric-card cyan">
            <div className="metric-icon cyan"><DollarSign size={20} /></div>
            <div className="metric-label">A/P (Owed to Consultants)</div>
            <div className="metric-value">${(totalAP / 1000).toFixed(1)}K</div>
            <div className="metric-change"><Clock size={12} style={{ color: 'var(--text-secondary)' }} /> <span style={{ color: 'var(--text-secondary)' }}>After your cut</span></div>
          </div>
          <div className="metric-card purple">
            <div className="metric-icon purple"><CheckCircle size={20} /></div>
            <div className="metric-label">Collected (MTD)</div>
            <div className="metric-value">${(totalPaid / 1000).toFixed(1)}K</div>
            <div className="metric-change up"><TrendingUp size={12} /> {paid.length} invoices paid</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === 'ar' ? 'active' : ''}`} onClick={() => setTab('ar')}>A/R Receivable ({ar.length})</button>
          <button className={`tab ${tab === 'ap' ? 'active' : ''}`} onClick={() => setTab('ap')}>A/P Payable</button>
          <button className={`tab ${tab === 'all' ? 'active' : ''}`} onClick={() => setTab('all')}>All Invoices ({allInvoices.length})</button>
        </div>

        {tab === 'ap' ? (
          <div className="card">
            <div className="section-header">
              <div className="section-title">Accounts Payable — Consultant Payouts</div>
            </div>
            {consultants.filter(c => c.status === 'On Project').map(c => {
              const sub = submissions.find(s => s.consultantId === c.id && ['Placed'].includes(s.status));
              if (!sub) return null;
              const ap = sub.buyRate * 160;
              return (
                <div key={c.id} className="ledger-row">
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--cyan), var(--purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--bg-primary)', flexShrink: 0 }}>
                    {c.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600 }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sub.vendorName} · {sub.buyRate}/hr · 160 hrs/mo</div>
                  </div>
                  <div>
                    <span className="badge badge-yellow">Pending</span>
                  </div>
                  <div className="ledger-amount debit">-${ap.toLocaleString()}</div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Consultant</th>
                  <th>Vendor / Bill-to</th>
                  <th>Hours</th>
                  <th>Rate</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Net</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(inv => (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--cyan)' }}>{inv.id}</td>
                    <td style={{ fontWeight: 600 }}>{inv.consultantName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{inv.vendorName}</td>
                    <td className="count">{inv.hours}h</td>
                    <td className="count">${inv.rate}/hr</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--green)', fontSize: 14 }}>
                      ${inv.amount.toLocaleString()}
                    </td>
                    <td><span className={`badge ${STATUS_MAP[inv.status]}`}>{inv.status}</span></td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: inv.status === 'Overdue' ? 'var(--red)' : 'var(--text-secondary)' }}>
                      {inv.dueDate}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>Net {inv.netTerms}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-sm btn-ghost"><Download size={12} /> PDF</button>
                        {inv.status !== 'Paid' && <button className="btn btn-sm btn-success"><CheckCircle size={12} /> Mark Paid</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showInvoiceModal && <InvoiceModal onClose={() => setShowInvoiceModal(false)} />}
    </>
  );
}
