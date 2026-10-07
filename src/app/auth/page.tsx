'use client';
import { getTenantFromUrl } from '@/lib/tenantConfig';
import { useRouter } from 'next/navigation';
import React from 'react';
import styles from './auth.module.css';
import Logo from '../../components/Logo';

export default function AuthSelectPage() {
  const router = useRouter();

  return (
    <div className={styles.selectPage}>
      {/* Left branding panel */}
      <div className={styles.brandPanel}>
        <div className={styles.brandInner}>
          <div className={styles.logoMark} style={{ background: 'transparent', padding: 0 }}>
            <Logo style={{ width: 64, height: 64, color: 'white' }} />
          </div>
          <h1 className={styles.brandTitle}>GD Matrix</h1>
          <p className={styles.brandTagline}>Talent Management OS</p>

          <div className={styles.brandFeatures}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <div className={styles.featureTitle}>Bench Management</div>
                <div className={styles.featureSub}>Track consultants from bench to placement</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <div className={styles.featureTitle}>Visa & Compliance</div>
                <div className={styles.featureSub}>Automated expiry alerts & document vault</div>
              </div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <div className={styles.featureTitle}>FinOps Ledger</div>
                <div className={styles.featureSub}>AR management and margin analytics</div>
              </div>
            </div>
          </div>

          <div className={styles.brandBadge}>
            <div className={styles.brandBadgeDot} />
            Enterprise-grade · Multi-tenant SaaS
          </div>
        </div>
      </div>

      {/* Right role selector */}
      <div className={styles.rolePanel}>
        <div className={styles.roleInner}>
          <div className={styles.roleHeader}>
            <h2 className={styles.roleTitle}>Welcome back</h2>
            <p className={styles.roleSub}>Select your portal to continue</p>
          </div>

          <div className={styles.roleCards}>
            <button
              className={styles.roleCard}
              onClick={() => router.push('/auth/employer/login')}
            >
              <div className={styles.roleCardIcon} data-type="employer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <div className={styles.roleCardContent}>
                <div className={styles.roleCardTitle}>Employer Portal</div>
                <div className={styles.roleCardDesc}>
                  For bench sales managers, recruiters & admins managing the full pipeline
                </div>
              </div>
              <div className={styles.roleCardArrow}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>

            <button
              className={styles.roleCard}
              onClick={() => router.push('/auth/employee/login')}
            >
              <div className={styles.roleCardIcon} data-type="employee">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className={styles.roleCardContent}>
                <div className={styles.roleCardTitle}>Consultant Portal</div>
                <div className={styles.roleCardDesc}>
                  For IT consultants to manage timesheets, documents & personal pipeline
                </div>
              </div>
              <div className={styles.roleCardArrow}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </button>
          </div>

          <p className={styles.roleFootnote}>
            New to GD Matrix?{' '}
            <button className={styles.linkBtn} onClick={() => router.push('/auth/employer/signup')}>
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
