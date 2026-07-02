import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './pages/Login';
import Step1 from './pages/FastagForm/Step1';
import Step2 from './pages/FastagForm/Step2';
import Step3 from './pages/FastagForm/Step3';
import './App.css';

const pageTitles = {
  dashboard: 'Dashboard',
  login: 'Admin Login',
  step1: 'New FASTag — Step 1',
  step2: 'New FASTag — Step 2',
  step3: 'New FASTag — Step 3',
};

function App() {
  const [activePage, setActivePage] = useState('step1');
  const [formData, setFormData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleStep1Next = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setActivePage('step2');
  };

  const handleStep2Next = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setActivePage('step3');
  };

  const handleStep3Submit = () => {
    setActivePage('step1');
    setFormData({});
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePage('step1');
  };

  // When clicking Dashboard in sidebar: go to login if not authenticated
  const handleNavigate = (page) => {
    if (page === 'dashboard' && !isAuthenticated) {
      setActivePage('login');
    } else {
      setActivePage(page);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'dashboard':
        return isAuthenticated
          ? <Dashboard onNewForm={() => setActivePage('step1')} />
          : <Login onLogin={handleLogin} />;
      case 'step1':
        return <Step1 onNext={handleStep1Next} onBack={() => setActivePage('step1')} />;
      case 'step2':
        return <Step2 formData={formData} onNext={handleStep2Next} onBack={() => setActivePage('step1')} />;
      case 'step3':
        return <Step3 formData={formData} onSubmit={handleStep3Submit} onBack={() => setActivePage('step2')} />;
      default:
        return <Step1 onNext={handleStep1Next} onBack={() => setActivePage('step1')} />;
    }
  };

  // Login page — full screen, no sidebar
  if (activePage === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <main className="app-content">
        {/* Mobile Top Bar */}
        <div className="mobile-topbar">
          <span className="mobile-topbar-title">{pageTitles[activePage] || 'SBI FASTag'}</span>
          <div className="mobile-topbar-logo">
            <img src="/logo1.png" alt="SBI" style={{ height: '28px', objectFit: 'contain' }} />
          </div>
        </div>

        <div className="page-wrapper animate-fadeIn" key={activePage}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
