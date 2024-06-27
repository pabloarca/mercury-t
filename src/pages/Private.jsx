import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, database } from '../firebaseConfig';
import { ref, get } from 'firebase/database';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import PrivatePopup from '../components/PrivatePopup';

const Private = () => {
  const { municipio } = useParams();
  const [geoJson, setGeoJson] = useState(null);
  const [municipioData, setMunicipioData] = useState(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11');
  const [popupInfo, setPopupInfo] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchMunicipioData();
  }, [municipio]);

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

  const updateClasif = () => {
    console.log('Refrescando datos...');
    fetchMunicipioData();
  };

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
        onClick={handleMapClick}
      >
        {geoJson && (
          <Source id="my-data" type="geojson" data={geoJson}>
            <Layer
              id="data-line"
              type="line"
              paint={{
                'line-color': {
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
                'fill-color': {
                  type: 'categorical',
                  property: 'clasif',
                  stops: [
                    [1, 'rgba(255,0,0,0.5)'],
                    [2, 'rgba(148,0,211,0.5)'],
                    [3, 'rgba(0,255,0,0.5)'],
                    [4, 'rgba(0,191,255,0.5)'],
                  ],
                },
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
            onClose={() => setPopupInfo(null)}
            municipio={municipio}
            updateClasif={updateClasif}
          />
        )}
      </Map>
    </div>
  );
};

export default Private;
