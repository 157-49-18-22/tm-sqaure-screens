import { useState } from 'react';
import './Sidebar.css';

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'step1',
    label: 'New FASTag',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
];

function Sidebar({ activePage, onNavigate, isAuthenticated, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Hamburger Button (mobile only) */}
      <button
        className={`sidebar-hamburger${mobileOpen ? ' sidebar-hamburger--hidden' : ''}`}
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Overlay backdrop (mobile only) */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        {/* Close button (mobile only) */}
        <button
          className="sidebar-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Logo / Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <img src="/logo1.png" alt="SBI Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-name">SBI FASTag</span>
            <span className="brand-sub">Registration Portal</span>
          </div>
        </div>

        {/* Divider */}
        <div className="sidebar-divider" />

        {/* Section label */}
        <p className="sidebar-section-label">MAIN MENU</p>

        {/* Nav Items */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = activePage === item.id
              || (activePage === 'step2' && item.id === 'step1')
              || (activePage === 'step3' && item.id === 'step1');

            return (
              <button
                key={item.id}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.id === 'dashboard' && !isAuthenticated && (
                  <span className="nav-lock-icon" title="Login required">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                )}
                {isActive && <span className="nav-active-dot" />}
              </button>
            );
          })}
        </nav>

        {/* Logout button — only when authenticated */}
        {isAuthenticated && (
          <>
            <div className="sidebar-divider" style={{ marginTop: 'auto' }} />
            <div className="sidebar-logout-wrap">
              <div className="sidebar-user-info">
                <div className="sidebar-user-avatar">A</div>
                <div className="sidebar-user-text">
                  <span className="sidebar-user-name">Admin</span>
                  <span className="sidebar-user-role">Administrator</span>
                </div>
              </div>
              <button
                className="sidebar-logout-btn"
                onClick={() => { onLogout(); setMobileOpen(false); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default Sidebar;
