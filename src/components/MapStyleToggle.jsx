// src/components/MapStyleToggle.jsx
import React from 'react';

const MapStyleToggle = ({ toggleMapStyle }) => {
  return (
    <button 
      onClick={toggleMapStyle} 
      className="absolute top-0 right-10 mt-2.5 mr-4 p-2 bg-white rounded shadow font-bold"
    >
      Cambiar mapa base
    </button>
  );
};

export default MapStyleToggle;
