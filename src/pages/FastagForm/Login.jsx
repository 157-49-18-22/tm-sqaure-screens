import { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const VALID_USER = 'admin';
  const VALID_PASS = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!userId.trim() || !password.trim()) {
      setError('Please enter both User ID and Password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      if (userId.trim() === VALID_USER && password === VALID_PASS) {
        onLogin();
      } else {
        setError('Invalid User ID or Password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-page">
      {/* ── Left Panel: SBI Branding ── */}
      <div className="login-left">
        <div className="login-left-overlay" />
        <div className="login-left-content animate-fadeIn">
          {/* Logo */}
          <div className="login-logo-wrap">
            <img src="/logo1.png" alt="SBI FASTag Logo" className="login-logo-img" />
          </div>

          {/* Tag line */}
          <div className="login-left-divider" />
          <h2 className="login-left-title">SBI FASTag<br />Registration Portal</h2>
          <p className="login-left-sub">
            Secure · Fast · Reliable<br />
            Powered by State Bank of India
          </p>

          {/* Feature chips */}
          <div className="login-features">
            {[
              { icon: '🔐', text: 'Secure Admin Access' },
              { icon: '📋', text: 'Manage Applications' },
              { icon: '✅', text: 'Approve & Track FASTag' },
            ].map((f, i) => (
              <div className="login-feature-chip" key={i}>
                <span>{f.icon}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative circles */}
        <div className="login-decor-circle login-decor-circle--1" />
        <div className="login-decor-circle login-decor-circle--2" />
        <div className="login-decor-circle login-decor-circle--3" />
      </div>

      {/* ── Right Panel: Login Form ── */}
      <div className="login-right">
        <div className="login-card animate-fadeInUp">
          {/* Header */}
          <div className="login-header">
            <div className="login-badge">
              <span className="login-badge-dot" />
              Admin Portal
            </div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-sub">Sign in to access the dashboard</p>
          </div>

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            {/* User ID */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-userid">User ID</label>
              <div className={`login-input-group ${userId ? 'has-value' : ''}`}>
                <span className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  id="login-userid"
                  type="text"
                  className="login-input"
                  placeholder="Enter your User ID"
                  value={userId}
                  onChange={e => { setUserId(e.target.value); setError(''); }}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-password">Password</label>
              <div className={`login-input-group ${password ? 'has-value' : ''}`}>
                <span className="login-input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="login-input"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="login-error animate-fadeIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="login-btn" disabled={loading} id="login-submit-btn">
              {loading ? (
                <><span className="login-spinner" />Verifying...</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Login to Dashboard
                </>
              )}
            </button>
          </form>

          <p className="login-footer-note">🔒 Secure Admin Access · SBI FASTag Portal</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
