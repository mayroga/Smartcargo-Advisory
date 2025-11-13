import React from 'react';
import ReactDOM from 'react-dom/client';
import ShipmentForm from './components/ShipmentForm.jsx'; // Importa tu formulario

// Este archivo monta el componente principal en el <div> con id="root" del index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShipmentForm /> 
  </React.StrictMode>,
);
