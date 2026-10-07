'use client';
import { getApiUrl } from '@/lib/apiConfig';
import { getTenantFromUrl } from '@/lib/tenantConfig';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../auth.module.css';

import Logo from '../../../../components/Logo';

export default function EmployeeSignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [visaStatus, setVisaStatus] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [invitedCompany, setInvitedCompany] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tenant, setTenant] = useState('');
  useEffect(() => {
    const t = getTenantFromUrl();
    if (t) {
      setTenant(t);
      setInvitedCompany(t);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const comp = params.get('company');
      if (code) setInviteCode(code);
      if (comp) {
        setInvitedCompany(comp.replace(/-/g, ' '));
      }
    }
  }, []);

  // Password strength
  const pwStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const pwStrengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const pwStrengthColor = ['', 'var(--red-500)', 'var(--amber-500)', 'var(--blue-500)', 'var(--green-500)'][pwStrength];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName) { setError('First and last name are required.'); return; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('A valid email is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('Please agree to the terms to continue.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          role: 'employee',
          name: `${firstName} ${lastName}`.trim(),
          title: role || 'Consultant',
          inviteCode: inviteCode.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setLoading(false);
      router.push('/portal/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className={styles.authPage}>
      {/* ── Left brand panel (green theme) ── */}
      <div className={styles.authBrandPanel} data-role="employee">
        <div className={styles.authBrandInner}>
          <button className={styles.backLink} onClick={() => router.push('/auth')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to portal select
          </button>

          <div className={styles.authLogoMark} style={{ background: 'transparent', padding: 0 }}>
            <Logo style={{ width: 48, height: 48, color: 'white' }} />
          </div>

          <h2 className={styles.authBrandHeading}>
            Join your<br />Consultant Portal
          </h2>
          <p className={styles.authBrandDesc}>
            {invitedCompany ? `Your recruiter has added you to ${invitedCompany.toUpperCase()}. ` : ''}
            Create your account to access timesheets, documents, and your personal pipeline.
          </p>

          <div className={styles.authBrandStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>🔒</div>
              <div className={styles.statLabel}>Private data</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>📄</div>
              <div className={styles.statLabel}>Visa vault</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>⏱</div>
              <div className={styles.statLabel}>Timesheets</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>🎯</div>
              <div className={styles.statLabel}>My pipeline</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          {invitedCompany && (
            <div style={{ padding: '12px', backgroundColor: 'var(--green-500)', color: 'white', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <span>👋</span>
              <div>
                You have been invited to join <strong>{invitedCompany.toUpperCase()}</strong>.
              </div>
            </div>
          )}
          <div className={styles.formHeader}>
            <div className={styles.rolePill} data-role="employee">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Consultant Portal
            </div>
            <h1 className={styles.formTitle}>Create your account</h1>
            <p className={styles.formSubtitle}>Set up your consultant self-service profile</p>
          </div>

          <form className={styles.authForm} onSubmit={handleSubmit} noValidate>
            {error && (
              <div className={styles.errorAlert}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="firstName">First Name *</label>
                <div className={styles.inputWrap}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input id="firstName" type="text" placeholder="Arjun" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="lastName">Last Name *</label>
                <div className={styles.inputWrap}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input id="lastName" type="text" placeholder="Sharma" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email Address *</label>
              <div className={styles.inputWrap}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <input id="email" type="email" placeholder="arjun@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="phone">Phone</label>
                <div className={styles.inputWrap}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.38a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
                  </svg>
                  <input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="role">Tech Role</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Select role</option>
                  <option>Java Developer</option>
                  <option>DevOps Engineer</option>
                  <option>Data Engineer</option>
                  <option>Full Stack Developer</option>
                  <option>QA Engineer</option>
                  <option>Business Analyst</option>
                  <option>Project Manager</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="visa">Visa Status</label>
              <select id="visa" value={visaStatus} onChange={(e) => setVisaStatus(e.target.value)}>
                <option value="">Select visa status</option>
                <option>US Citizen</option>
                <option>Green Card</option>
                <option>H1B</option>
                <option>OPT (F1)</option>
                <option>STEM OPT</option>
                <option>TN Visa</option>
                <option>L1</option>
                <option>EAD</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="inviteCode">Invite Code (if provided by recruiter)</label>
              <div className={styles.inputWrap}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <input id="inviteCode" type="text" placeholder="e.g. GDMX-2024-XXXX" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="pw">Password *</label>
              <div className={`${styles.inputWrap} ${styles.hasToggle}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input id="pw" type={showPw ? 'text' : 'password'} placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className={styles.togglePasswordBtn} onClick={() => setShowPw(!showPw)}>
                  {showPw ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
              {password && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                    {[1,2,3,4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background: i <= pwStrength ? pwStrengthColor : 'var(--gray-200)',
                          transition: 'background 0.2s',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: pwStrengthColor, fontWeight: 600 }}>{pwStrengthLabel}</span>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPw">Confirm Password *</label>
              <div className={styles.inputWrap}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input id="confirmPw" type={showPw ? 'text' : 'password'} placeholder="Re-enter password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required />
              </div>
            </div>

            <label className={styles.checkboxLabel}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              I agree to the{' '}
              <a href="#" style={{ color: 'var(--accent)', marginLeft: 3 }}>Terms of Service</a>
              {' '}&amp;{' '}
              <a href="#" style={{ color: 'var(--accent)' }}>Privacy Policy</a>
            </label>

            <button
              type="submit"
              className={styles.submitBtn}
              data-role="employee"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </>
              )}
            </button>
          </form>

          <p className={styles.switchPrompt}>
            Already have an account?{' '}
            <button className={styles.switchLink} onClick={() => router.push('/auth/employee/login')}>
              Sign in
            </button>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
