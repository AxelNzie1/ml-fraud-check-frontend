import { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

const Hero = () => {
  const [counts, setCounts] = useState({
    accuracy: 0,
    time: 0,
    transactions: 0
  });

  useEffect(() => {
    const targetValues = {
      accuracy: 99.9,
      time: 0.05,
      transactions: 10000
    };

    const duration = 2000;
    const steps = 60;
    const increment = {
      accuracy: targetValues.accuracy / steps,
      time: targetValues.time / steps,
      transactions: targetValues.transactions / steps
    };

    let step = 0;
    const timer = setInterval(() => {
      step++;
      setCounts({
        accuracy: Math.min(increment.accuracy * step, targetValues.accuracy),
        time: parseFloat((increment.time * step).toFixed(2)),
        transactions: Math.min(Math.floor(increment.transactions * step), targetValues.transactions)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targetValues);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="title-line">Détection Intelligente</span>
          <span className="title-line">de Fraudes Bancaires</span>
        </h1>
        <p className="hero-subtitle">
          Protégez vos transactions avec l'intelligence artificielle
        </p>
        <button 
          className="btn-primary" 
          onClick={() => scrollToSection('detection')}
        >
          <span>Commencer l'analyse</span>
          <FiChevronRight />
        </button>
      </div>

      <div className="hero-stats">
        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-value">{counts.accuracy.toFixed(1)}%</div>
          <div className="stat-label">Précision</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">{counts.time}s</div>
          <div className="stat-label">Temps de réponse</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-value">{counts.transactions.toLocaleString()}</div>
          <div className="stat-label">Transactions analysées</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;