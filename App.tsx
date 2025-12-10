import React, { useState, useEffect } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import RuleBuilder from './components/RuleBuilder';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRuleBuilder, setShowRuleBuilder] = useState(false);
  const { theme } = useCRM();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'leads': return <Leads />;
      case 'pipeline': return <Leads />; // Redirect to Leads (handles view state internally)
      case 'tasks': return <Tasks />;
      case 'automation': return (
         <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="max-w-md space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Automation Rules</h2>
              <p className="text-slate-500 dark:text-slate-400">Build powerful workflows to assign leads, trigger alerts, and automate tasks.</p>
              <button 
                 onClick={() => setShowRuleBuilder(true)}
                 className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-all font-medium"
              >
                 Open Rule Builder
              </button>
            </div>
         </div>
      );
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`flex min-h-screen font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200`}>
      <Sidebar 
        activePage={currentPage} 
        setPage={setCurrentPage} 
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 relative scroll-smooth bg-slate-50 dark:bg-slate-950">
           {renderPage()}
        </main>
      </div>

      {showRuleBuilder && <RuleBuilder onClose={() => setShowRuleBuilder(false)} />}
    </div>
  );
};

const App = () => {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
};

export default App;