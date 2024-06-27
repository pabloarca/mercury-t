// src/components/PrivatePopup.jsx
import React, { useState, useEffect } from 'react';
import { Popup as MapboxPopup } from 'react-map-gl';
import UpdateClasifButton from './UpdateClasifButton';

// Componente que muestra un popup con la información de una parcela
const PrivatePopup = ({ longitude, latitude, properties, onClose, municipio, updateClasif }) => {
  const [showModify, setShowModify] = useState(false);

  useEffect(() => {
    setShowModify(false); // Resetear el estado de showModify cuando cambian las propiedades del popup
  }, [properties]);

  const handleModifyClick = () => {
    setShowModify(true);
  };

  const handleCancelClick = () => {
    setShowModify(false);
  };

  // Función para obtener el mensaje basado en la clasificación
  const getDynamicMessage = (clasif) => {
    switch (clasif) {
      case 1:
        return "Vas a cambiar el estado de público con amianto a público sin amianto, ¿estás seguro?";
      case 2:
        return "Esta edificación privada con amianto desaparecerá del mapa y los cambios son irreversibles, ¿Estás seguro?";
      case 4:
        return "Vas a cambiar del estado público sin amianto a público con amianto, ¿estás seguro?";
      default:
        return "";
    }
  };

  const dynamicMessage = getDynamicMessage(properties.clasif);

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
        
        {properties.clasif !== 3 && (
          <button
            className="mt-2 bg-blue-500 text-white py-1 px-3 rounded"
            onClick={handleModifyClick}
          >
            Modificar estado
          </button>
        )}

        {showModify && properties.clasif !== 3 && (
          <div className="mt-2">
            <p className="text-xs pt-4">{dynamicMessage}</p>
            <UpdateClasifButton
              municipio={municipio}
              featureId={properties.codigo}
              updateClasif={updateClasif}
            />
            <button
              className="mt-2 bg-red-400 text-white py-1 px-3 rounded"
              onClick={handleCancelClick}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </MapboxPopup>
  );
};

export default PrivatePopup;
