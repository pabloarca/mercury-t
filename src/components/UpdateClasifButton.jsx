// src/components/UpdateClasifButton.jsx
import React from 'react';
import { ref, get, set, remove } from 'firebase/database';
import { database } from '../firebaseConfig';

const UpdateClasifButton = ({ municipio, featureId, updateClasif }) => {
  const handleUpdateClasif = async () => {
    try {
      console.log('Iniciando la actualización de clasif para la parcela con ID:', featureId);

      // Obtener la referencia de las parcelas del municipio en la base de datos de Firebase
      const parcelasRef = ref(database, `municipios/${municipio}/parcelas`);
      console.log('Referencia de parcelas:', parcelasRef);

      // Obtener los datos de las parcelas
      const snapshot = await get(parcelasRef);
      console.log('Snapshot de parcelas:', snapshot.val());

      if (snapshot.exists()) {
        const parcelas = snapshot.val();

        // Encontrar la parcela correspondiente usando featureId
        const parcelaKey = Object.keys(parcelas).find(
          (key) => parcelas[key].codigo === featureId
        );
        console.log('Parcela Key encontrada:', parcelaKey);

        if (parcelaKey) {
          const parcela = parcelas[parcelaKey];
          const currentClasif = parcela.clasif;
          console.log('Clasif actual de la parcela:', currentClasif);

          // Actualizar el valor de clasif según las reglas proporcionadas
          if (currentClasif === 1) {
            parcela.clasif = 4;
          } else if (currentClasif === 4) {
            parcela.clasif = 1;
          } else if (currentClasif === 2) {
            console.log('Eliminando la parcela con ID:', parcelaKey);
            await remove(ref(database, `municipios/${municipio}/parcelas/${parcelaKey}`));
            updateClasif();
            return;
          }

          // Actualizar el valor de clasif en la base de datos de Firebase
          await set(ref(database, `municipios/${municipio}/parcelas/${parcelaKey}`), parcela);
          console.log('Clasif actualizado:', parcela.clasif);
          updateClasif();
        } else {
          console.error('Parcela no encontrada');
        }
      } else {
        console.error('No se encontraron parcelas para este municipio');
      }
    } catch (error) {
      console.error('Error actualizando clasif:', error);
    }
  };

  return (
    <button
      className="mt-2 bg-green-500 text-white py-1 px-3 rounded mr-2"
      onClick={handleUpdateClasif}
    >
      Confirmar
    </button>
  );
};

export default UpdateClasifButton;
