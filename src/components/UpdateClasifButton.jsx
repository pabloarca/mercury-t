// src/components/UpdateClasifButton.jsx
import React from 'react';
import { database } from '../firebaseConfig';
import { ref, get, update } from 'firebase/database';

// Componente que permite actualizar la clasificación de una parcela
const UpdateClasifButton = ({ municipio, featureId, updateClasif }) => {
  const handleUpdateClasif = async () => {
    try {
      console.log('Municipio:', municipio);
      console.log('Feature ID:', featureId);

      // Obtener la referencia de la parcela en la base de datos
      const parcelasRef = ref(database, `municipios/${municipio}/parcelas`);
      const snapshot = await get(parcelasRef);

      if (snapshot.exists()) {
        // Encontrar la parcela correspondiente por el código
        const parcelas = snapshot.val();
        const parcelaKey = Object.keys(parcelas).find(key => parcelas[key].codigo === featureId);
        
        if (parcelaKey) {
          const currentClasif = parcelas[parcelaKey].clasif;
          const newClasif = currentClasif === 1 ? 4 : 1;

          // Actualizar la clasificación en la parcela correspondiente
          await update(ref(database, `municipios/${municipio}/parcelas/${parcelaKey}`), { clasif: newClasif });
          console.log(`Clasif updated to ${newClasif}`);
          updateClasif();
        } else {
          console.error('No such document!');
        }
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error updating clasif:', error);
    }
  };

  return (
    <button
      onClick={handleUpdateClasif}
      className="bg-blue-500 text-white p-2 mt-2 rounded"
    >
      Modificar clasificación
    </button>
  );
};

export default UpdateClasifButton;
