import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

// Default center to Baku
const defaultCenter = {
  lat: 40.4093,
  lng: 49.8671
};

// Map styling for a dark mode aesthetic
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

const MapView = ({ stadiums }) => {
  const { t } = useTranslation();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const [map, setMap] = useState(null);
  const [selectedStadium, setSelectedStadium] = useState(null);

  const onLoad = useCallback(function callback(map) {
    if (stadiums.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      stadiums.forEach(s => {
        if (s.latitude && s.longitude) {
          bounds.extend({ lat: Number(s.latitude), lng: Number(s.longitude) });
        }
      });
      map.fitBounds(bounds);
    }
    setMap(map);
  }, [stadiums]);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center justify-center text-slate-400">
        <Loader2 size={32} className="animate-spin text-primary mb-2" />
        <p>Loading Map...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-slate-700 shadow-xl relative">
      {import.meta.env.VITE_GOOGLE_MAPS_API_KEY === 'your-google-maps-api-key' && (
        <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center text-center p-8 backdrop-blur-sm">
          <p className="text-white font-bold text-xl mb-2">Google Maps API Key Missing</p>
          <p className="text-slate-300">Please update VITE_GOOGLE_MAPS_API_KEY in your .env file.</p>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{ styles: darkMapStyle }}
      >
        {stadiums.map((stadium) => {
          if (!stadium.latitude || !stadium.longitude) return null;
          return (
            <Marker
              key={stadium.id}
              position={{ lat: Number(stadium.latitude), lng: Number(stadium.longitude) }}
              onClick={() => setSelectedStadium(stadium)}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#10b981', // Tailwind's Emerald 500 (primary)
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff'
              }}
            />
          );
        })}

        {selectedStadium && (
          <InfoWindow
            position={{ lat: Number(selectedStadium.latitude), lng: Number(selectedStadium.longitude) }}
            onCloseClick={() => setSelectedStadium(null)}
          >
            <div className="p-2 text-slate-800 min-w-[200px]">
              <h3 className="font-bold text-lg mb-1">{selectedStadium.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{selectedStadium.price_per_hour} AZN / {t('stadiums.per_hour').replace('/', '')}</p>
              <Link 
                to={`/stadiums/${selectedStadium.id}`}
                className="block text-center bg-primary text-white py-1.5 rounded-md font-medium hover:bg-primary-dark transition-colors"
              >
                {t('stadiums.book_now')}
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(MapView);
