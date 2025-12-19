import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const startApp = () => {
  const container = document.getElementById('root');
  if (!container) return;

  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("App WomenCards démarrée avec succès.");
  } catch (error) {
    console.error("Erreur fatale au démarrage:", error);
    container.innerHTML = `<div style="padding:20px;text-align:center;">Une erreur est survenue. Veuillez rafraîchir avec CTRL+F5.</div>`;
  }
};

// On s'assure que le DOM est prêt
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  startApp();
} else {
  window.addEventListener('DOMContentLoaded', startApp);
}