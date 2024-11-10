import React, { useEffect, useRef, useState } from 'react';
import './Map.css'; // Import the CSS file

const Map = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Function to initialize the map
  useEffect(() => {
    const initMap = () => {
      const mapOptions = {
        center: { lat: 7.8731, lng: 80.7718 }, // Center of Sri Lanka
        zoom: 8,
      };
      
      const googleMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(googleMap);

      const service = new window.google.maps.places.PlacesService(googleMap);
      setPlacesService(service);
    };

    if (!map && window.google) {
      initMap();
    }
  }, [map]);

  // Function to find pharmacies and hospitals in Sri Lanka
  const findPlaces = (type) => {
    if (placesService && map) {
      const request = {
        location: map.getCenter(),
        radius: '50000', // Search within 50 km
        type: type, // 'pharmacy' or 'hospital'
      };

      placesService.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setMarkers((prevMarkers) => {
            // Clear previous markers
            prevMarkers.forEach((marker) => marker.setMap(null));

            // Create new markers
            const newMarkers = results.map((place) => {
              const marker = new window.google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name,
              });
              return marker;
            });
            return newMarkers;
          });
        }
      });
    }
  };

  return (
    <div className="map-container">
      <h1 className="header">Find Pharmacies & Hospitals</h1>

      {/* Buttons to find pharmacies and hospitals */}
      <div className="button-container">
        <button className="button" onClick={() => findPlaces('pharmacy')}>
          Find Pharmacies
        </button>
        <button className="button" onClick={() => findPlaces('hospital')}>
          Find Hospitals
        </button>
      </div>

      {/* Map container */}
      <div ref={mapRef} className="map-container"></div>
    </div>
  );
};

export default Map;
