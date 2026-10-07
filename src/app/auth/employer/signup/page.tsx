'use client';
import { getApiUrl } from '@/lib/apiConfig';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../auth.module.css';

type Step = 1 | 2 | 3;

import Logo from '../../../../components/Logo';

export default function EmployerSignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  // Step 1 – Company info
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [slug, setSlug] = useState('');

  // Auto-generate slug from company name
  function toSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 30);
  }

  function handleCompanyChange(val: string) {
    setCompany(val);
    setSlug(toSlug(val));
  }


  // Step 2 – Account credentials
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);

  // Step 3 – Invite
  const [inviteEmails, setInviteEmails] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  function validateStep1() {
    if (!company.trim()) { setError('Company name is required.'); return false; }
    setError(''); return true;
  }

  function validateStep2() {
    if (!firstName || !lastName) { setError('First and last name are required.'); return false; }
    if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('A valid email is required.'); return false; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return false; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return false; }
    if (!agreed) { setError('Please agree to the terms to continue.'); return false; }
    setError(''); return true;
  }

  function nextStep() {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => (s + 1) as Step);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`${getApiUrl()}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password, 
          role: 'employer',
          name: `${firstName} ${lastName}`.trim(),
          companyName: company,
          title: 'Admin'
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
      router.push('/dashboard');
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  const steps = [1, 2, 3] as const;

  return (
    <div className={styles.authPage}>
      {/* ── Left brand panel ── */}
      <div className={styles.authBrandPanel} data-role="employer">
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
            Set up your<br />Talent OS
          </h2>
          <p className={styles.authBrandDesc}>
            Get your IT consultancy up and running in under 5 minutes. Invite your team and start managing the pipeline today.
          </p>

          <div className={styles.authBrandStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Free</div>
              <div className={styles.statLabel}>14-day trial</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>∞</div>
              <div className={styles.statLabel}>Consultants</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>SOC2</div>
              <div className={styles.statLabel}>Compliant</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          <div className={styles.formHeader}>
            <div className={styles.rolePill} data-role="employer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              Employer Portal
            </div>

            {/* Step indicator */}
            <div className={styles.stepIndicator}>
              {steps.map((s) => (
                <div
                  key={s}
                  className={`${styles.stepDot} ${s === step ? styles.active : s < step ? styles.done : styles.pending}`}
                  data-role="employer"
                />
              ))}
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
                Step {step} of 3
              </span>
            </div>

            <h1 className={styles.formTitle}>
              {step === 1 && 'Company details'}
              {step === 2 && 'Create your account'}
              {step === 3 && 'Invite your team'}
            </h1>
            <p className={styles.formSubtitle}>
              {step === 1 && 'Tell us about your consultancy'}
              {step === 2 && 'Set your admin credentials'}
              {step === 3 && 'Optionally add team members now'}
            </p>
          </div>

          <form
            className={styles.authForm}
            onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}
            noValidate
          >
            {error && (
              <div className={styles.errorAlert}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <div className={styles.field}>
                  <label htmlFor="company">Company Name *</label>
                  <div className={styles.inputWrap}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <input
                      id="company"
                      type="text"
                      placeholder="Meta9 Consulting"
                      value={company}
                      onChange={(e) => handleCompanyChange(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* ── Consultant Portal URL preview ── */}
                {slug && (
                  <div style={{
                    background: 'var(--blue-50)',
                    border: '1px solid var(--blue-100)',
                    borderRadius: 8,
                    padding: '12px 14px',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--blue-700)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      🔗 Your consultant portal URL
                    </div>
                    <code style={{
                      display: 'block',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--blue-700)',
                      background: 'var(--blue-100)',
                      padding: '6px 10px',
                      borderRadius: 6,
                      marginBottom: 8,
                    }}>
                      {slug}.matrix.com
                    </code>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 10 }}>
                      Share this URL with your consultants. They&apos;ll log in here for their personal portal.
                    </div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                      Customize subdomain
                    </label>
                    <div style={{ display: 'flex', alignItems: 'stretch', background: 'white', border: '1px solid var(--border-strong)', borderRadius: 6, overflow: 'hidden' }}>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 30))}
                        style={{ flex: 1, border: 'none', boxShadow: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, borderRadius: 0 }}
                        placeholder="your-company"
                      />
                      <span style={{ padding: '0 10px', fontSize: 12, color: 'var(--text-muted)', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', background: 'var(--gray-50)', whiteSpace: 'nowrap' }}>
                        .matrix.com
                      </span>
                    </div>
                  </div>
                )}

                <div className={styles.field}>
                  <label htmlFor="industry">Industry</label>
                  <select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="">Select industry</option>
                    <option>IT Staffing & Consulting</option>
                    <option>Software Development</option>
                    <option>Healthcare IT</option>
                    <option>Financial Technology</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="size">Company Size</label>
                  <select
                    id="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  >
                    <option value="">Select team size</option>
                    <option>1–10 employees</option>
                    <option>11–50 employees</option>
                    <option>51–200 employees</option>
                    <option>200+ employees</option>
                  </select>
                </div>
              </>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label htmlFor="firstName">First Name *</label>
                    <div className={styles.inputWrap}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      <input id="firstName" type="text" placeholder="Jane" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="lastName">Last Name *</label>
                    <div className={styles.inputWrap}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      <input id="lastName" type="text" placeholder="Smith" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="email">Work Email *</label>
                  <div className={styles.inputWrap}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                    <input id="email" type="email" placeholder="jane@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
              </>
            )}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <div className={styles.field}>
                  <label htmlFor="invites">Team Email Addresses (optional)</label>
                  <textarea
                    id="invites"
                    rows={4}
                    placeholder="recruiter@company.com&#10;manager@company.com&#10;..."
                    value={inviteEmails}
                    onChange={(e) => setInviteEmails(e.target.value)}
                    style={{ resize: 'vertical', fontFamily: 'Inter, sans-serif', fontSize: 13 }}
                  />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    One email per line. Team members will receive an invite link.
                  </span>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              {step > 1 && (
                <button
                  type="button"
                  className={styles.submitBtn}
                  data-role="employer"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  style={{ background: 'var(--gray-100)', color: 'var(--text-secondary)', flex: '0 0 auto', width: 'auto', padding: '0 20px' }}
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className={styles.submitBtn}
                data-role="employer"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 0.8s linear infinite' }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Creating account…
                  </>
                ) : step === 3 ? (
                  <>
                    {inviteEmails.trim() ? 'Create account & send invites' : 'Create account'}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </>
                )}
              </button>
            </div>
          </form>

          <p className={styles.switchPrompt}>
            Already have an account?{' '}
            <button className={styles.switchLink} onClick={() => router.push('/auth/employer/login')}>
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
