// src/components/DownloadCsv.jsx
import React, { useState } from 'react';

const DownloadCsv = ({ municipio }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDownloadClick = () => {
    setShowConfirmation(!showConfirmation);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleDownload = () => {
    // Aquí agregarías la lógica para descargar los datos del municipio como CSV
    alert(`Descargando datos del municipio: ${municipio}`);
    setShowConfirmation(false);
  };

  return (
    <div className="absolute top-12 right-10 mt-2.5 mr-4 p-2 bg-white rounded shadow font-bold">
      {!showConfirmation ? (
        <button
          onClick={handleDownloadClick}
          
        >
          Descargar datos csv
        </button>
      ) : (
        <div className="mt-2">
          <p className="mb-4">¿Seguro que quieres descargar los datos del municipio?</p>
          <button
            onClick={handleDownload}
            className="mt-2 bg-green-400 text-white py-1 px-3 mr-2 rounded"
          >
            Descargar
          </button>
          <button
            onClick={handleCancel}
            className="mt-2 bg-red-400 text-white py-1 px-3 rounded"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export default DownloadCsv;
