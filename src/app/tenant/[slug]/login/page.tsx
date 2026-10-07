'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './tenant-login.module.css';

interface Props {
  params: Promise<{ slug: string }> | { slug: string };
}

/**
 * Tenant-specific consultant login page.
 * Served at [slug].matrix.com (e.g. meta9.matrix.com)
 * Internally rendered at /tenant/[slug]/login via middleware rewrite.
 */
export default function TenantLoginPage({ params }: Props) {
  const router = useRouter();

  // Next.js 15 passes params as a Promise for server components but as an
  // object for client components. Handle both cases safely.
  const resolvedParams =
    params && typeof (params as Promise<{ slug: string }>).then === 'function'
      ? React.use(params as Promise<{ slug: string }>)
      : (params as { slug: string });

  const { slug } = resolvedParams;

  // Format slug nicely for display: "meta9" → "Meta9", "acme-corp" → "Acme Corp"
  const companyName = slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    // TODO: POST to Rails Devise API with tenant slug header
    // POST /api/v1/auth/sign_in  { email, password, tenant: slug }
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push('/portal/dashboard');
  }

  return (
    <div className={styles.page}>
      {/* ── Left: Branding ── */}
      <div className={styles.brand}>
        <div className={styles.brandInner}>
          {/* GD Matrix platform logo */}
          <div className={styles.platformBadge}>
            <div className={styles.platformIcon}>GD</div>
            <span>Powered by GD Matrix</span>
          </div>

          {/* Company name */}
          <div className={styles.companyName}>{companyName}</div>
          <h1 className={styles.brandHeading}>Consultant<br />Self-Service Portal</h1>
          <p className={styles.brandDesc}>
            Your personal workspace for timesheets, documents, interview prep, and pipeline status.
          </p>

          {/* Feature list */}
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <div className={styles.featureCheck}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>Submit & track weekly timesheets</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureCheck}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>Store I-797, I-20, EAD & passport securely</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureCheck}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>Track your interview pipeline status</span>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureCheck}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>Access client-specific interview prep resources</span>
            </div>
          </div>

          {/* URL badge */}
          <div className={styles.urlBadge}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <code>{slug}.matrix.com</code>
          </div>
        </div>
      </div>

      {/* ── Right: Login form ── */}
      <div className={styles.formSide}>
        <div className={styles.formWrap}>
          {/* Company header */}
          <div className={styles.formCompanyHeader}>
            <div className={styles.companyAvatar}>
              {companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className={styles.formCompanyName}>{companyName}</div>
              <div className={styles.formCompanyPortal}>Consultant Portal</div>
            </div>
          </div>

          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSubtitle}>
            Sign in with your {companyName} consultant credentials
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && (
              <div className={styles.errorBox}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrap}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
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
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(!showPw)}>
                  {showPw ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formMeta}>
              <label className={styles.rememberLabel}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Keep me signed in
              </label>
              <button type="button" className={styles.forgotBtn}>Forgot password?</button>
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.spinner}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign in to {companyName}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className={styles.helpText}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Don&apos;t have access yet? Contact your recruiter at {companyName}.
          </div>

          <div className={styles.divider}>
            <span />
            <span className={styles.dividerText}>not the right portal?</span>
            <span />
          </div>

          <button
            className={styles.wrongPortalBtn}
            onClick={() => router.push('/auth')}
          >
            Go to main login page
          </button>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
