// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ShipmentForm from './components/ShipmentForm.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="min-h-screen flex items-center justify-center p-6">
      <ShipmentForm />
    </div>
  </React.StrictMode>
);
