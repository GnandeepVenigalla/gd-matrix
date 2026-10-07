'use client';
import { getApiUrl } from '@/lib/apiConfig';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../auth.module.css';
import Logo from '../../../../components/Logo';

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`\${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
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
            Your Consultant<br />Self-Service Hub
          </h2>
          <p className={styles.authBrandDesc}>
            Manage your timesheets, track interview progress, and keep your documents compliant — all in one place.
          </p>

          <div className={styles.authBrandStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Live</div>
              <div className={styles.statLabel}>Pipeline status</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Auto</div>
              <div className={styles.statLabel}>Timesheet alerts</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Vault</div>
              <div className={styles.statLabel}>Doc storage</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>Prep</div>
              <div className={styles.statLabel}>Interview resources</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          <div className={styles.formHeader}>
            <div className={styles.rolePill} data-role="employee">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              Consultant Portal
            </div>
            <h1 className={styles.formTitle}>Sign in to your portal</h1>
            <p className={styles.formSubtitle}>Access your personal dashboard and documents</p>
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

            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrap}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="your.name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={`${styles.inputWrap} ${styles.hasToggle}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button type="button" className={styles.togglePasswordBtn} onClick={() => setShowPw(!showPw)}>
                  {showPw ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formMeta}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Keep me signed in
              </label>
              <button type="button" className={styles.forgotLink}>Forgot password?</button>
            </div>

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
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className={styles.switchPrompt}>
            Don&apos;t have an account?{' '}
            <button className={styles.switchLink} onClick={() => router.push('/auth/employee/signup')}>
              Request access
            </button>
          </p>

          <div className={styles.divider} style={{ marginTop: 20 }}>or</div>

          <p className={styles.switchPrompt} style={{ marginTop: 16 }}>
            Are you an admin or recruiter?{' '}
            <button className={styles.switchLink} onClick={() => router.push('/auth/employer/login')}>
              Go to Employer Portal
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
