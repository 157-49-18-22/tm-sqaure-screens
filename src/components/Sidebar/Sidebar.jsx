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

// FastagIcon component removed

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
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
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activePage === item.id || (activePage === 'step2' && item.id === 'step1') ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {(activePage === item.id || (activePage === 'step2' && item.id === 'step1')) && (
              <span className="nav-active-dot" />
            )}
          </button>
        ))}
      </nav>

      {/* Badge removed as requested */}

      {/* Footer removed as requested */}
    </aside>
  );
}

export default Sidebar;
