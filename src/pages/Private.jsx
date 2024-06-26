// src/pages/Private.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, database } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PrivatePopup from '../components/PrivatePopup';
import { Legend, Logo } from '../components/Legend';
import MapStyleToggle from '../components/MapStyleToggle';


const Private = () => {
  // Obtener el parámetro 'municipio' de la URL
  const { municipio } = useParams();

  // Definir estados para almacenar los datos geojson y de municipio
  const [geoJson, setGeoJson] = useState(null);
  const [municipioData, setMunicipioData] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11');
  const [popupInfo, setPopupInfo] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  // Función para obtener datos del municipio desde Firebase
  const fetchMunicipioData = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        const sanitizedEmail = user.email.replace('.', ',');
        const municipioRef = ref(database, `municipios/${municipio}`);
        const snapshot = await get(municipioRef);

        if (snapshot.exists() && snapshot.val().usuario === sanitizedEmail) {
          setMunicipioData(snapshot.val());
          const parcelas = Object.values(snapshot.val().parcelas).map(parcela => ({
            type: 'Feature',
            geometry: parcela.geometry,
            properties: parcela,
          }));

          const geojson = {
            type: 'FeatureCollection',
            features: parcelas,
          };
          setGeoJson(geojson);
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Error fetching municipio data: ", error);
      navigate('/');
    }
  };

  // Ejecutar fetchMunicipioData cuando el componente se monta o el municipio cambia
  useEffect(() => {
    fetchMunicipioData();
  }, [municipio]);

  // Función para manejar el clic en el mapa
  const handleMapClick = (event) => {
    const features = mapRef.current.queryRenderedFeatures(event.point, {
      layers: ['data-fill']
    });

    if (features.length) {
      const feature = features[0];
      setPopupInfo({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
        properties: feature.properties,
      });
    } else {
      setPopupInfo(null);
    }
  };

  // Función para actualizar los datos después de modificar la clasificación
  const updateClasif = () => {
    fetchMunicipioData();
  };

  const toggleMapStyle = () => {
    setMapStyle(prevStyle => 
      prevStyle === 'mapbox://styles/mapbox/light-v11' 
      ? 'mapbox://styles/mapbox/satellite-v9' 
      : 'mapbox://styles/mapbox/light-v11'
    );
  };


  // Si no se han cargado los datos del municipio, mostrar un mensaje de carga
  if (!municipioData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-screen w-screen">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: municipioData.longitude || -2.967,
          latitude: municipioData.latitude || 37.953,
          zoom: municipioData.zoom || 14,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        onClick={handleMapClick} // Añadir el manejador de clics
      >
        {geoJson && (
          <Source id="my-data" type="geojson" data={geoJson}>
            <Layer
              id="data-line"
              type="line"
              paint={{
                'line-color': {
                  // Usar la propiedad 'clasif' para definir el color de las líneas
                  type: 'categorical',
                  property: 'clasif',
                  stops: [
                    [1, 'red'],
                    [2, '#9400D3'],
                    [3, '#00FF00'],
                    [4, '#00BFFF'],
                  ],
                },
                'line-width': 2,
              }}
            />
            <Layer
              id="data-fill"
              type="fill"
              paint={{
                'fill-color': 'rgba(0, 0, 0, 0)', // Relleno transparente
              }}
            />
          </Source>
        )}
        <NavigationControl position="top-right" />
        {popupInfo && (
          <PrivatePopup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            properties={popupInfo.properties}
            municipio={municipio}
            updateClasif={updateClasif}
            onClose={() => setPopupInfo(null)}
          />
        )}
      </Map>
      <Logo />
      <Legend />
      <MapStyleToggle toggleMapStyle={toggleMapStyle} />
    </div>
  );
};

export default Private;
