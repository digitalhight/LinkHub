import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const renderApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("WomenCards: Application mounted successfully");
  } catch (err) {
    console.error("WomenCards: Mount failed", err);
    rootElement.innerHTML = `<div style="padding:20px; text-align:center;">Erreur de démarrage. Veuillez vider votre cache.</div>`;
  }
};

// On attend que le DOM soit prêt pour éviter les erreurs de scripts tiers
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}