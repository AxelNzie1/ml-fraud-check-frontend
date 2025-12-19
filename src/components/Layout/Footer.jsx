const Footer = () => {
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };
  
    return (
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>FraudeDetect</h4>
              <p>Solution intelligente de détection de fraudes bancaires</p>
            </div>
            <div className="footer-section">
              <h4>Liens rapides</h4>
              <ul>
                <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Accueil</a></li>
                <li><a href="#detection" onClick={(e) => { e.preventDefault(); scrollToSection('detection'); }}>Détection</a></li>
                <li><a href="#historique" onClick={(e) => { e.preventDefault(); scrollToSection('historique'); }}>Historique</a></li>
                <li><a href="#statistiques" onClick={(e) => { e.preventDefault(); scrollToSection('statistiques'); }}>Statistiques</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 FraudeDetect. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;