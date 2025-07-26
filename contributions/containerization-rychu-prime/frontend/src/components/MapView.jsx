import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function MapView({ locations = [], search = {}, mapRef }) {
  const mapContainerRef = useRef(null);
  const resultMarkersRef = useRef();
  const searchMarkerRef = useRef();

  // Initialize the map only once and only when container has size
  useEffect(() => {
    let map;
    if (!mapRef.current && mapContainerRef.current) {
      const { width, height } = mapContainerRef.current.getBoundingClientRect();
      if (width > 0 && height > 0) {
        map = L.map(mapContainerRef.current, {
          zoomControl: false,
          scrollWheelZoom: false,
        }).setView([52.2297, 21.0122], 12);
        L.control.zoom({ position: 'topright' }).addTo(map);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© Rychu Prime'
        }).addTo(map);
        resultMarkersRef.current = L.featureGroup().addTo(map);
        searchMarkerRef.current = L.featureGroup().addTo(map);
        mapRef.current = map;
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
      }
    }
    // ResizeObserver to handle container resizes
    let resizeObs;
    if (mapRef.current && mapContainerRef.current) {
      resizeObs = new window.ResizeObserver(() => {
        mapRef.current.invalidateSize();
      });
      resizeObs.observe(mapContainerRef.current);
    }
    return () => {
      if (resizeObs && mapContainerRef.current) {
        resizeObs.unobserve(mapContainerRef.current);
      }
    };
  }, [mapRef]);

  // Markers and fitBounds logic
  useEffect(() => {
    if (!mapRef.current) return;
    resultMarkersRef.current.clearLayers();
    searchMarkerRef.current.clearLayers();
    locations.forEach(loc => {
      const m = L.marker([loc.latitude, loc.longitude], {
        icon: L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        })
      }).bindPopup(`<strong>${loc.name}</strong><br>${loc.distance_km} km`);
      resultMarkersRef.current.addLayer(m);
    });
    if (search.geocode) {
      L.marker([search.geocode.lat, search.geocode.lon], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        })
      }).addTo(searchMarkerRef.current).bindPopup(`<strong>Search:</strong><br>${search.address}`);
    }
    const allMarkers = [
      ...resultMarkersRef.current.getLayers(),
      ...searchMarkerRef.current.getLayers()
    ];
    if (allMarkers.length > 0) {
      const group = L.featureGroup(allMarkers);
      mapRef.current.fitBounds(group.getBounds(), { padding: [40, 40] });
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
  }, [locations, search, mapRef]);

  return (
    <div style={{ height: '500px', width: '100%', overflow: 'hidden', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
} 