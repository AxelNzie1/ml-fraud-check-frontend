import { useState } from 'react';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';
import { TRANSACTION_TYPES } from '../../config';

const Detection = ({ onAnalysisComplete, showToast }) => {
  const [formData, setFormData] = useState({
    amount: '',
    oldbalanceOrg: '',
    newbalanceOrig: '',
    oldbalanceDest: '',
    newbalanceDest: '',
    type: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest', 'type'];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field] === '') {
        showToast(`Le champ ${field} est requis`, 'error');
        return false;
      }
    }

    // Validation des montants
    const amounts = ['amount', 'oldbalanceOrg', 'newbalanceOrig', 'oldbalanceDest', 'newbalanceDest'];
    for (const field of amounts) {
      const value = parseFloat(formData[field]);
      if (isNaN(value) || value < 0) {
        showToast(`Le champ ${field} doit être un nombre positif`, 'error');
        return false;
      }
    }

    return true;
  };

  const simulateAnalysis = () => {
    // Simuler un délai d'analyse
    return new Promise(resolve => {
      setTimeout(() => {
        const probability = Math.random();
        const prediction = probability > 0.7 ? 'fraud' : 'safe';
        
        const analysisResult = {
          id: Date.now(),
          date: new Date().toISOString(),
          amount: parseFloat(formData.amount),
          type: formData.type,
          probability: prediction === 'fraud' ? 0.7 + Math.random() * 0.3 : Math.random() * 0.3,
          prediction,
          rawData: { ...formData }
        };
        
        resolve(analysisResult);
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Note: Pour le moment, on simule l'analyse
      // Vous pourrez remplacer cette partie par un appel à votre API
      const analysisResult = await simulateAnalysis();
      
      setResult(analysisResult);
      onAnalysisComplete(analysisResult);
      showToast('Analyse complétée avec succès', 'success');

    } catch (error) {
      console.error('Error analyzing transaction:', error);
      showToast('Erreur lors de l\'analyse', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="detection" className="detection-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Analyse de Transaction</h2>
          <p className="section-subtitle">
            Entrez les détails de la transaction pour détecter une éventuelle fraude
          </p>
        </div>

        <div className="detection-container">
          <div className="form-card">
            <form onSubmit={handleSubmit} className="detection-form">
              <div className="form-grid">
                {[
                  { id: 'amount', label: 'Montant (€)', type: 'number', step: '0.01' },
                  { id: 'oldbalanceOrg', label: 'Solde initial expéditeur', type: 'number', step: '0.01' },
                  { id: 'newbalanceOrig', label: 'Nouveau solde expéditeur', type: 'number', step: '0.01' },
                  { id: 'oldbalanceDest', label: 'Solde initial destinataire', type: 'number', step: '0.01' },
                  { id: 'newbalanceDest', label: 'Nouveau solde destinataire', type: 'number', step: '0.01' },
                ].map((field) => (
                  <div key={field.id} className="form-group">
                    <label htmlFor={field.id}>{field.label}</label>
                    <input
                      type={field.type}
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      step={field.step}
                      required
                      placeholder="0.00"
                      className="form-input"
                      min="0"
                    />
                  </div>
                ))}

                <div className="form-group">
                  <label htmlFor="type">Type de transaction</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  >
                    <option value="">Sélectionnez un type</option>
                    {TRANSACTION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className={`btn-submit ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                <span className="btn-text">
                  {loading ? 'Analyse en cours...' : 'Analyser la transaction'}
                </span>
                <div className="btn-loader"></div>
              </button>
            </form>
          </div>

          <div className="result-card" id="resultCard">
            {result ? (
              <div className="result-content">
                <div className="result-header">
                  <div className={`result-status ${result.prediction}`}>
                    <FiAlertCircle />
                    <span>
                      {result.prediction === 'fraud' ? 'Fraude détectée' : 'Transaction sécurisée'}
                    </span>
                  </div>
                  <div className={`status-badge ${result.prediction}`}>
                    {result.prediction === 'fraud' ? 'FRAUDE' : 'SÉCURISÉ'}
                  </div>
                </div>

                <div className="result-details">
                  <div className="detail-item">
                    <span className="detail-label">Montant:</span>
                    <span className="detail-value">{result.amount.toFixed(2)} €</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{result.type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Probabilité de fraude:</span>
                    <span className="detail-value">
                      {(result.probability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date d'analyse:</span>
                    <span className="detail-value">
                      {new Date(result.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="probability-bar">
                  <div 
                    className={`probability-fill ${result.prediction}`}
                    style={{ width: `${result.probability * 100}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="result-placeholder">
                <FiSearch className="placeholder-icon" />
                <p>Les résultats de l'analyse apparaîtront ici</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detection;