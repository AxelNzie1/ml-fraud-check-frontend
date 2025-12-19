import { useState } from 'react';
import { FiSearch, FiAlertCircle, FiInfo, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { API_ENDPOINTS, TRANSACTION_TYPES } from '../../config';
import axios from 'axios';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    console.log('🟡 ========== DÉBUT DE L\'ANALYSE ==========');
    console.log('📋 Données du formulaire:');
    console.log('  - Montant:', formData.amount);
    console.log('  - Solde initial expéditeur:', formData.oldbalanceOrg);
    console.log('  - Nouveau solde expéditeur:', formData.newbalanceOrig);
    console.log('  - Solde initial destinataire:', formData.oldbalanceDest);
    console.log('  - Nouveau solde destinataire:', formData.newbalanceDest);
    console.log('  - Type:', formData.type);

    try {
      // Préparer les données selon le format attendu par votre API
        // Dans handleSubmit, modifiez transactionData :
        const transactionData = {
            transaction_id: Date.now(),
            user_id: Math.floor(Math.random() * 10000), // Random user ID
            timestamp: new Date().toISOString(),
            amount: parseFloat(formData.amount),
            merchant_id: Math.floor(Math.random() * 1000), // Random merchant ID
            merchant_category: formData.type,
            country: "FR",
            channel: "online",
            device_id: Math.floor(Math.random() * 100),
            // Ajoutez les features de balance directement
            oldbalanceOrg: parseFloat(formData.oldbalanceOrg),
            newbalanceOrig: parseFloat(formData.newbalanceOrig),
            oldbalanceDest: parseFloat(formData.oldbalanceDest),
            newbalanceDest: parseFloat(formData.newbalanceDest),
            // Vous pouvez garder extra pour la compatibilité
            extra: {
            oldbalanceOrg: parseFloat(formData.oldbalanceOrg),
            newbalanceOrig: parseFloat(formData.newbalanceOrig),
            oldbalanceDest: parseFloat(formData.oldbalanceDest),
            newbalanceDest: parseFloat(formData.newbalanceDest)
            }
        };

      console.log('📤 Envoi des données à l\'API:');
      console.log('  URL:', API_ENDPOINTS.SCORE);
      console.log('  Données:', JSON.stringify(transactionData, null, 2));

      // TEST: Vérifier d'abord si l'API répond
      console.log('🩺 Test de santé de l\'API...');
      try {
        const healthCheck = await axios.get(API_ENDPOINTS.HEALTH, { timeout: 5000 });
        console.log('✅ API Health Check:');
        console.log('  Status:', healthCheck.data.status);
        console.log('  Modèle chargé:', healthCheck.data.model_loaded);
        console.log('  Features chargées:', healthCheck.data.features_loaded);
      } catch (healthError) {
        console.error('❌ API Health Check échoué:', healthError.message);
        throw new Error(`L'API n'est pas disponible: ${healthError.message}`);
      }

      // Appel à l'API réelle avec timeout
      console.log('🔄 Appel de l\'endpoint /score...');
      const response = await axios.post(API_ENDPOINTS.SCORE, transactionData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('✅ ========== RÉPONSE DE L\'API ==========');
      console.log('🎯 Résultat:');
      console.log('  - Transaction ID:', response.data.transaction_id);
      console.log('  - Probabilité de fraude:', (response.data.fraud_probability * 100).toFixed(2) + '%');
      console.log('  - Prédiction:', response.data.prediction);
      console.log('  - Seuil:', response.data.threshold);
      
      if (response.data.explanations) {
        console.log('  - Explications SHAP:');
        response.data.explanations.forEach((exp, index) => {
          console.log(`    ${index + 1}. ${exp.feature}: ${exp.impact > 0 ? '+' : ''}${exp.impact.toFixed(4)}`);
        });
      }
      
      if (response.data.warning) {
        console.log('  ⚠️  Warning:', response.data.warning);
      }

      const analysisResult = {
        id: transactionData.transaction_id,
        date: transactionData.timestamp,
        amount: parseFloat(formData.amount),
        type: formData.type,
        probability: response.data.fraud_probability,
        prediction: response.data.prediction,
        rawData: formData,
        apiResponse: response.data // Garder la réponse complète
      };

      setResult(analysisResult);
      onAnalysisComplete(analysisResult);
      
      // Message de toast personnalisé selon le résultat
      if (response.data.prediction === 'fraud') {
        showToast(`🚨 Fraude détectée! Probabilité: ${(response.data.fraud_probability * 100).toFixed(1)}%`, 'error');
      } else {
        showToast(`✅ Transaction sécurisée. Probabilité de fraude: ${(response.data.fraud_probability * 100).toFixed(1)}%`, 'success');
      }

    } catch (error) {
      console.error('❌ ========== ERREUR ==========');
      console.error('Message:', error.message);
      console.error('Code:', error.code);
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
      
      // Fallback: simulation si l'API n'est pas disponible
      showToast(`⚠️ API non disponible. Utilisation du mode simulation`, 'warning');
      
      // Simulation réaliste
      const isHighAmount = parseFloat(formData.amount) > 10000;
      const isZeroBalanceAfter = parseFloat(formData.newbalanceOrig) === 0;
      const isSuspiciousType = formData.type === 'TRANSFER' || formData.type === 'CASH_OUT';
      
      let probability;
      if (isHighAmount && isZeroBalanceAfter && isSuspiciousType) {
        probability = 0.8 + Math.random() * 0.15; // 80-95% pour fraude
      } else if (isHighAmount && isSuspiciousType) {
        probability = 0.6 + Math.random() * 0.2; // 60-80% pour fraude
      } else {
        probability = Math.random() * 0.3; // 0-30% pour fraude
      }
      
      const prediction = probability > 0.5 ? 'fraud' : 'legitimate';
      
      console.log('🤖 Mode simulation activé:');
      console.log('  - Montant élevé:', isHighAmount);
      console.log('  - Solde à zéro après:', isZeroBalanceAfter);
      console.log('  - Type suspect:', isSuspiciousType);
      console.log('  - Probabilité simulée:', (probability * 100).toFixed(2) + '%');
      console.log('  - Prédiction simulée:', prediction);
      
      const mockResult = {
        id: Date.now(),
        date: new Date().toISOString(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        probability,
        prediction,
        rawData: formData,
        isSimulated: true
      };
      
      setResult(mockResult);
      onAnalysisComplete(mockResult);
    } finally {
      setLoading(false);
      console.log('🔵 ========== FIN DE L\'ANALYSE ==========');
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
                    {result.prediction === 'fraud' ? (
                      <>
                        <FiAlertCircle />
                        <span>🚨 Fraude détectée</span>
                      </>
                    ) : (
                      <>
                        <FiInfo />
                        <span>✅ Transaction sécurisée</span>
                      </>
                    )}
                  </div>
                  <div className={`status-badge ${result.prediction}`}>
                    {result.prediction === 'fraud' ? 'FRAUDE' : 'SÉCURISÉ'}
                    {result.isSimulated && ' (SIM)'}
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
                    <span className="detail-label">Seuil de décision:</span>
                    <span className="detail-value">50%</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Confiance:</span>
                    <span className="detail-value">
                      {Math.abs((result.probability - 0.5) * 200).toFixed(1)}%
                      {result.prediction === 'fraud' ? (
                        <FiTrendingUp style={{ marginLeft: '8px', color: 'var(--danger-red)' }} />
                      ) : (
                        <FiTrendingDown style={{ marginLeft: '8px', color: 'var(--success-green)' }} />
                      )}
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
                  
                  {/* Afficher les explications SHAP si disponibles */}
                  {result.apiResponse?.explanations && result.apiResponse.explanations.length > 0 && (
                    <>
                      <div style={{ 
                        marginTop: '15px', 
                        paddingTop: '15px',
                        borderTop: '2px solid var(--bg-gray)'
                      }}>
                        <h4 style={{ 
                          color: 'var(--text-dark)', 
                          marginBottom: '10px',
                          fontSize: '0.95rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <FiInfo />
                          Facteurs d'influence
                        </h4>
                        {result.apiResponse.explanations.slice(0, 3).map((exp, index) => (
                          <div key={index} className="explanation-item" style={{
                            background: 'var(--bg-light)',
                            padding: '10px',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            border: '1px solid rgba(0,0,0,0.05)'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              marginBottom: '5px',
                              alignItems: 'center'
                            }}>
                              <span style={{ 
                                fontSize: '0.85em', 
                                color: 'var(--text-gray)',
                                fontWeight: '500'
                              }}>
                                {exp.feature.replace(/_/g, ' ')}
                              </span>
                              <span style={{
                                fontWeight: '600',
                                fontSize: '0.9em',
                                color: exp.impact > 0 ? 'var(--danger-red)' : 'var(--success-green)'
                              }}>
                                {exp.impact > 0 ? '+' : ''}{exp.impact.toFixed(4)}
                              </span>
                            </div>
                            <div style={{
                              height: '4px',
                              background: 'var(--bg-gray)',
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '100%',
                                width: `${Math.min(Math.abs(exp.impact) * 50, 100)}%`,
                                background: exp.impact > 0 
                                  ? 'linear-gradient(90deg, var(--danger-red) 0%, var(--danger-red-light) 100%)'
                                  : 'linear-gradient(90deg, var(--success-green) 0%, var(--success-green-light) 100%)',
                                marginLeft: exp.impact > 0 ? 'auto' : '0'
                              }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {result.isSimulated && (
                    <div className="detail-item" style={{ 
                      background: 'rgba(255, 193, 7, 0.1)',
                      borderLeft: '3px solid #ff9800',
                      marginTop: '15px'
                    }}>
                      <span className="detail-label" style={{ color: '#ff9800' }}>Mode:</span>
                      <span className="detail-value" style={{ color: '#ff9800' }}>
                        Simulation (API en mode test)
                      </span>
                    </div>
                  )}
                </div>

                <div className="probability-bar">
                  <div 
                    className={`probability-fill ${result.prediction}`}
                    style={{ width: `${result.probability * 100}%` }}
                  ></div>
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '-5px',
                    height: '18px',
                    width: '2px',
                    background: 'var(--text-dark)',
                    opacity: 0.3
                  }}></div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-gray)',
                  marginTop: '5px'
                }}>
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            ) : (
              <div className="result-placeholder">
                <FiSearch className="placeholder-icon" />
                <p>Les résultats de l'analyse apparaîtront ici</p>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-light)',
                  marginTop: '10px',
                  maxWidth: '300px'
                }}>
                  Remplissez le formulaire et cliquez sur "Analyser la transaction" pour vérifier si une transaction est frauduleuse.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detection;