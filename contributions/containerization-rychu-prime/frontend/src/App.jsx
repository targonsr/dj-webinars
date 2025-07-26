import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import MapView from './components/MapView';
import ResultsList from './components/ResultsList';
import Toast from './components/Toast';
import axios from 'axios';

export default function App() {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState({ address: 'Warszawa Centralna', radius: 5, geocode: null });
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(false);
  const mapRef = useRef();

  // Trigger initial search on mount
  useEffect(() => {
    handleSearch(search.address, search.radius);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (address, radius) => {
    if (!address) {
      setToast({ show: true, message: 'Address is required' });
      return;
    }
    setLoading(true);
    try {
      // 1. Call backend for locations
      const { data } = await axios.post('http://localhost:8000/search', {
        address,
        radius_km: radius
      });
      // 2. Geocode address
      const geoRes = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: { q: address, format: 'json', limit: 1, countrycodes: 'pl' }
      });
      let geocode = null;
      if (geoRes.data.length) {
        geocode = {
          lat: parseFloat(geoRes.data[0].lat),
          lon: parseFloat(geoRes.data[0].lon)
        };
      }
      setLocations(data);
      setSearch({ address, radius, geocode });
    } catch (err) {
      setToast({ show: true, message: 'Search failed – check API & CORS.' });
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <SearchForm
          address={search.address}
          radius={search.radius}
          onSearch={handleSearch}
          loading={loading}
        />
        <section className="grid lg:grid-cols-2 gap-6">
          <MapView
            locations={locations}
            search={search}
            mapRef={mapRef}
          />
          <ResultsList locations={locations} />
        </section>
      </main>
      <Toast show={toast.show} message={toast.message} onClose={() => setToast({ show: false, message: '' })} />
    </>
  );
} 