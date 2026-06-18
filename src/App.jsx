import { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import Step1 from './pages/FastagForm/Step1';
import Step2 from './pages/FastagForm/Step2';
import Step3 from './pages/FastagForm/Step3';
import './App.css';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [formData, setFormData] = useState({});

  const handleStep1Next = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setActivePage('step2');
  };

  const handleStep2Next = (data) => {
    setFormData(prev => ({ ...prev, ...data }));
    setActivePage('step3');
  };

  const handleStep3Submit = () => {
    setActivePage('dashboard');
    setFormData({});
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNewForm={() => setActivePage('step1')} />;
      case 'step1':
        return <Step1 onNext={handleStep1Next} onBack={() => setActivePage('dashboard')} />;
      case 'step2':
        return <Step2 formData={formData} onNext={handleStep2Next} onBack={() => setActivePage('step1')} />;
      case 'step3':
        return <Step3 formData={formData} onSubmit={handleStep3Submit} onBack={() => setActivePage('step2')} />;
      default:
        return <Dashboard onNewForm={() => setActivePage('step1')} />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-content">
        <div className="page-wrapper animate-fadeIn" key={activePage}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
