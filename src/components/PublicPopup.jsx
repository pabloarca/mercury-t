
import React, { useEffect } from 'react';
import { Popup as MapboxPopup } from 'react-map-gl';

const PublicPopup = ({ popupInfo, onClose }) => {
  useEffect(() => {
    if (popupInfo) {
      console.log('Popup rendered with feature:', popupInfo.feature);
    }
  }, [popupInfo]);

  if (!popupInfo) return null;

  const { properties } = popupInfo.feature;

  return (
    <MapboxPopup
      longitude={popupInfo.longitude}
      latitude={popupInfo.latitude}
      closeButton={true}
      closeOnClick={true}
      onClose={onClose}
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
        <h3 className="font-bold pt-3">Referencia {properties.localId}</h3>
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
      </div>
    </MapboxPopup>
  );
};

export default PublicPopup;
