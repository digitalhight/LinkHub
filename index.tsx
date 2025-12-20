import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');

if (container) {
  try {
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("WomenCards: Application chargée.");
  } catch (error) {
    console.error("WomenCards: Erreur de rendu:", error);
    container.innerHTML = `<div style="padding:40px; text-align:center; font-family:sans-serif;">
      <h1 style="color:#3D5AFE">Oups !</h1>
      <p>Une erreur est survenue lors du chargement.</p>
      <button onclick="window.location.reload()" style="padding:10px 20px; background:#3D5AFE; color:white; border:none; border-radius:8px; cursor:pointer;">Réessayer</button>
    </div>`;
  }
}