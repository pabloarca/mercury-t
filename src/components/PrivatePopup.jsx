// src/components/PrivatePopup.jsx
import React from 'react';
import { Popup as MapboxPopup } from 'react-map-gl';
import UpdateClasifButton from './UpdateClasifButton';

// Componente que muestra un popup con la información de una parcela
const PrivatePopup = ({ longitude, latitude, properties, municipio, updateClasif, onClose }) => {
  return (
    <MapboxPopup
      longitude={longitude}
      latitude={latitude}
      onClose={onClose}
      closeOnClick={false}
      anchor="top"
      className="z-50 custom-popup"
    >
      <div className="p-2">
        {properties.documentLi && (
          <img
            src={properties.documentLi}
            alt="Image"
            className="max-w-full h-auto pt-2 corrected-image"
          />
        )}
        <h3 className="font-bold pt-3">Código identificador {properties.codigo}</h3>
        <p><strong>Refcat:</strong> {properties.localId}</p>
        <p><strong>Tipo:</strong> {properties.Tipo_edif}</p>
        <p><strong>Fecha de construcción:</strong> {properties.fecha_cons}</p>
        <p><strong>Dirección:</strong> {properties.dire}</p>
        {properties.informatio && (
          <p>
            <a 
              href={properties.informatio} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Link a Catastro
            </a>
          </p>
        )}
        {/* Renderizar el botón de actualización sólo si la clasificación es 1 o 4 */}
        {(properties.clasif === 1 || properties.clasif === 4) && (
          <UpdateClasifButton 
            municipio={municipio} 
            featureId={properties.codigo} 
            updateClasif={updateClasif} 
          />
        )}
      </div>
    </MapboxPopup>
  );
};

export default PrivatePopup;
