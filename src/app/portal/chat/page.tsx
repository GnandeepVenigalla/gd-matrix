'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, MoreHorizontal, Check, CheckCheck } from 'lucide-react';

type Msg = { id: string; from: 'me' | 'recruiter'; text: string; time: string; read: boolean };

const recruiter = { name: 'Alex Kim', role: 'Sr. Recruiter', initials: 'AK', status: 'online' };

const initialMessages: Msg[] = [
  { id: 'm1', from: 'recruiter', text: "Hi Arjun! Great job on the Infosys Round 1 yesterday. The client was very impressed with your Spring Boot answers.", time: '9:02 AM', read: true },
  { id: 'm2', from: 'me', text: "Thank you Alex! I was a bit nervous about the system design part.", time: '9:05 AM', read: true },
  { id: 'm3', from: 'recruiter', text: "That's natural. For the Round 2, I'd recommend studying distributed systems — specifically CAP theorem and eventual consistency. I'll share some resources shortly.", time: '9:08 AM', read: true },
  { id: 'm4', from: 'me', text: "That would be really helpful. When is Round 2 scheduled?", time: '9:10 AM', read: true },
  { id: 'm5', from: 'recruiter', text: "They're targeting next Thursday. I'll confirm by EOD. Also, make sure your LinkedIn is updated — the client checks it.", time: '9:11 AM', read: false },
];

export default function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  function send() {
    const t = input.trim();
    if (!t) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMsgs(prev => [...prev, { id: `m${Date.now()}`, from: 'me', text: t, time: now, read: false }]);
    setInput('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { id: `m${Date.now()}r`, from: 'recruiter', text: "Got it! I'll follow up shortly. Keep an eye on your email for the calendar invite.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false }]);
    }, 1500);
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-title"><h1>Chat with Recruiter</h1><p>Get guidance and stay connected with your assigned recruiter</p></div>
      </div>
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)', padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Sidebar */}
          <div style={{ width: 260, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--white)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Conversations</div>
            <div style={{ padding: '10px 12px', background: '#eff6ff', margin: 8, borderRadius: 8, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{recruiter.initials}</div>
                  <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#22c55e', border: '1.5px solid white' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{recruiter.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Round 2 is targeting next Thu...</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2563eb', flexShrink: 0 }} />
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Chat Header */}
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--white)' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>{recruiter.initials}</div>
                <div style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: '#22c55e', border: '1.5px solid white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{recruiter.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />Online
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn-icon"><Phone size={15} /></button>
                <button className="btn-icon"><Video size={15} /></button>
                <button className="btn-icon"><MoreHorizontal size={15} /></button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12, background: '#f8fafc' }}>
              {msgs.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
                  {m.from === 'recruiter' && <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{recruiter.initials}</div>}
                  <div style={{ maxWidth: '68%' }}>
                    <div style={{ padding: '10px 14px', borderRadius: m.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.from === 'me' ? '#2563eb' : 'var(--white)', color: m.from === 'me' ? 'white' : 'var(--text)', fontSize: '0.88rem', lineHeight: 1.5, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: m.from === 'recruiter' ? '1px solid var(--border)' : 'none' }}>
                      {m.text}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.time}</span>
                      {m.from === 'me' && (m.read ? <CheckCheck size={11} style={{ color: '#2563eb' }} /> : <Check size={11} style={{ color: 'var(--text-muted)' }} />)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'var(--white)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." style={{ flex: 1, borderRadius: 24, padding: '9px 16px', border: '1px solid var(--border)' }} />
              <button className="btn btn-primary" style={{ borderRadius: '50%', width: 40, height: 40, padding: 0, justifyContent: 'center' }} onClick={send}><Send size={15} /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
