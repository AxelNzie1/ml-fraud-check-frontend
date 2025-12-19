import { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import Hero from './components/Sections/Hero';
import Detection from './components/Sections/Detection';
import History from './components/Sections/History';
import Statistics from './components/Sections/Statistics';
import Footer from './components/Layout/Footer';
import Toast from './components/Layout/Toast';

function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudDetected: 0,
    accuracyRate: 0,
    avgTime: 0
  });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const addToHistory = (analysis) => {
    setAnalysisHistory(prev => [analysis, ...prev.slice(0, 9)]);
    updateStatistics();
  };

  const updateStatistics = () => {
    const mockStats = {
      totalTransactions: analysisHistory.length + 10000,
      fraudDetected: analysisHistory.filter(a => a.prediction === 'fraud').length + 125,
      accuracyRate: 99.8,
      avgTime: 52
    };
    setStats(mockStats);
  };

  useEffect(() => {
    updateStatistics();
  }, [analysisHistory]);

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Detection 
          onAnalysisComplete={addToHistory}
          showToast={showToast}
        />
        <History 
          history={analysisHistory}
          showToast={showToast}
        />
        <Statistics 
          stats={stats}
          history={analysisHistory}
        />
      </main>
      <Footer />
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

export default App;