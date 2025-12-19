import { FiEye, FiClock, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const History = ({ history, showToast }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetails = (analysis) => {
    showToast(`Détails de la transaction ${analysis.id} affichés`, 'info');
    // Ici vous pourriez ouvrir une modal avec plus de détails
    console.log('Transaction details:', analysis);
  };

  if (history.length === 0) {
    return (
      <section id="historique" className="historique-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Historique des Analyses</h2>
            <p className="section-subtitle">Aucune analyse effectuée pour le moment</p>
          </div>
          <div className="table-container">
            <div className="table-loading">
              <p>Effectuez votre première analyse pour voir l'historique</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="historique" className="historique-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Historique des Analyses</h2>
          <p className="section-subtitle">Consultez les transactions analysées récemment</p>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Montant</th>
                <th>Type</th>
                <th>Résultat</th>
                <th>Probabilité</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((analysis) => (
                <tr key={analysis.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiClock />
                      {formatDate(analysis.date)}
                    </div>
                  </td>
                  <td>{analysis.amount.toFixed(2)} €</td>
                  <td>{analysis.type}</td>
                  <td>
                    <span className={`status-badge ${analysis.prediction}`}>
                      {analysis.prediction === 'fraud' ? 'Fraude' : 'Sécurisé'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {analysis.prediction === 'fraud' ? (
                        <FiTrendingUp style={{ color: 'var(--danger-red)' }} />
                      ) : (
                        <FiTrendingDown style={{ color: 'var(--success-green)' }} />
                      )}
                      <span>{(analysis.probability * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                  <td>
                    <button 
                      className="btn-view"
                      onClick={() => handleViewDetails(analysis)}
                    >
                      <FiEye />
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default History;