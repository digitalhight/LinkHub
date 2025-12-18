import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Critical Render Error:", err);
    rootElement.innerHTML = `
      <div style="height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; font-family:sans-serif; text-align:center; padding:20px;">
        <h1 style="color:#ef4444;">Oups !</h1>
        <p>Une erreur de connexion au serveur est survenue.</p>
        <button onclick="window.location.reload(true)" style="background:#6366f1; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-weight:bold;">
          Réessayer
        </button>
      </div>
    `;
  }
}