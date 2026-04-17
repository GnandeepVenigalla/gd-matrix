'use client';
import { BookOpen, Video, FileText, ExternalLink, MessagesSquare } from 'lucide-react';

export default function PortalInterviewPrep() {
  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title">
          <h1>Interview Prep Center</h1>
          <p>Client-specific resources, mock interviews, and study materials</p>
        </div>
      </div>

      <div className="page-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <div className="card metric-card metric-card-yellow">
           <div className="metric-icon metric-icon-yellow"><BookOpen size={24}/></div>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Infosys BPO - Round 1 Guide</h3>
           <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
             Compiled questions and core concepts asked by the client manager in recent Java Developer interviews.
           </p>
           <button className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
             <FileText size={16}/> View Document
           </button>
        </div>

        <div className="card metric-card metric-card-purple">
           <div className="metric-icon metric-icon-purple"><Video size={24}/></div>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Mock Interview Recording</h3>
           <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
             Your recent mock interview with our internal SME. Review the feedback and practice your system design.
           </p>
           <button className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
             <ExternalLink size={16}/> Watch Recording
           </button>
        </div>

        <div className="card metric-card metric-card-cyan">
           <div className="metric-icon metric-icon-cyan"><MessagesSquare size={24}/></div>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem' }}>Common Behavioral Questions</h3>
           <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
             A collection of standard behavioral questions (STAR method) to help you frame your past experiences.
           </p>
           <button className="btn btn-secondary w-full" style={{ justifyContent: 'center' }}>
             <FileText size={16}/> Read Guide
           </button>
        </div>

        </div>
      </div>
    </>
  );
}
