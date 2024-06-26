// src/pages/Public.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { database } from '../firebaseConfig'; // Ajusta la ruta si es necesario
import { ref, get } from 'firebase/database';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PublicPopup from '../components/PublicPopup'; // Ajusta la ruta si es necesario
import { Legend, Logo } from '../components/Legend';
import MapStyleToggle from '../components/MapStyleToggle'; // Importa el componente MapStyleToggle

const Public = () => {
  const { municipio } = useParams();
  const [geoJson, setGeoJson] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [municipioData, setMunicipioData] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11');
  const mapRef = useRef(null);

  const fetchMunicipioData = async () => {
    try {
      const municipioRef = ref(database, `municipios/${municipio.toLowerCase()}`);
      const snapshot = await get(municipioRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMunicipioData(data);
        const parcelas = Object.values(data.parcelas).map(parcela => ({
          type: 'Feature',
          geometry: parcela.geometry,
          properties: {
            codigo: parcela.codigo,
            documentLi: parcela.documentLi,
            localId: parcela.localId,
            Tipo_edif: parcela.Tipo_edif,
            fecha_cons: parcela.fecha_cons,
            dire: parcela.dire,
            informatio: parcela.informatio,
            clasif: parcela.clasif,
          },
        }));

        const geojson = {
          type: 'FeatureCollection',
          features: parcelas,
        };
        setGeoJson(geojson);
      } else {
        console.log('No data found for municipio:', municipio);
      }
    } catch (error) {
      console.error('Error fetching municipio data:', error);
    }
  };

  useEffect(() => {
    fetchMunicipioData();
  }, [municipio]);

  const handleMapClick = (e) => {
    const map = mapRef.current.getMap();
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['data-fill-interactive'],
    });

    if (!features.length) {
      setPopupInfo(null);
      return;
    }

    const feature = features[0];
    const coordinates = e.lngLat;

    setTimeout(() => {
      setPopupInfo({
        longitude: coordinates.lng,
        latitude: coordinates.lat,
        feature,
      });
    }, 0);
  };

  const toggleMapStyle = () => {
    setMapStyle(prevStyle => 
      prevStyle === 'mapbox://styles/mapbox/light-v11' 
      ? 'mapbox://styles/mapbox/satellite-v9' 
      : 'mapbox://styles/mapbox/light-v11'
    );
  };

  if (!municipioData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-screen w-screen">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: municipioData.longitude || -4.744462, // Valor por defecto si no hay datos
          latitude: municipioData.latitude || 36.66227,   // Valor por defecto si no hay datos
          zoom: municipioData.zoom || 14,                // Valor por defecto si no hay datos
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        onClick={handleMapClick}
      >
        {geoJson && (
          <Source id="parcelas" type="geojson" data={geoJson}>
            <Layer
              id="data-line"
              type="line"
              paint={{
                'line-color': [
                  'match',
                  ['get', 'clasif'],
                  1, 'red',
                  2, '#9400D3',
                  3, '#00FF00',
                  4, '#00BFFF',
                  '#000000' // default color if no match
                ],
                'line-width': 2,
              }}
            />
            <Layer
              id="data-fill-interactive"
              type="fill"
              paint={{
                'fill-color': 'rgba(0, 0, 0, 0)', // Relleno transparente
              }}
            />
          </Source>
        )}
        <PublicPopup popupInfo={popupInfo} onClose={() => setPopupInfo(null)} />
        <NavigationControl position="top-right" />
      </Map>
      <Logo />
      <Legend />
      <MapStyleToggle toggleMapStyle={toggleMapStyle} />
    </div>
  );
};

export default Public;
