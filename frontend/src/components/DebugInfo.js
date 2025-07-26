import React from 'react';

const DebugInfo = () => {
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      border: '1px solid #ccc',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <h4>Debug Info</h4>
      <p><strong>API URL:</strong> {apiUrl}</p>
      <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
      <p><strong>REACT_APP_API_URL:</strong> {process.env.REACT_APP_API_URL || 'Não definida'}</p>
    </div>
  );
};

export default DebugInfo; 