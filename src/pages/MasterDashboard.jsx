// src/pages/MasterDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database } from '../firebaseConfig';

const MasterDashboard = () => {
  const [municipios, setMunicipios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMunicipios = async () => {
      const municipiosRef = ref(database, 'municipios');
      const snapshot = await get(municipiosRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMunicipios(Object.keys(data));
      } else {
        console.error('No municipalities found');
      }
    };

    fetchMunicipios();
  }, []);

  const handleMunicipioClick = (municipio) => {
    navigate(`/user/${municipio}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Master Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {municipios.map((municipio) => (
          <div
            key={municipio}
            className="p-4 bg-white rounded shadow cursor-pointer"
            onClick={() => handleMunicipioClick(municipio)}
          >
            {municipio}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MasterDashboard;
