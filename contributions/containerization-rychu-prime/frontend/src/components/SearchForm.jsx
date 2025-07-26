import React, { useState } from 'react';

export default function SearchForm({ address, radius, onSearch, loading }) {
  const [localAddress, setLocalAddress] = useState(address);
  const [localRadius, setLocalRadius] = useState(radius);

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(localAddress, parseFloat(localRadius));
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <form className="grid lg:grid-cols-3 gap-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">Address / Place</label>
          <input
            id="address"
            type="text"
            required
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:placeholder-gray-400 px-3 py-2"
            placeholder="e.g. Warsaw Old Town"
            value={localAddress}
            onChange={e => setLocalAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="radius" className="block text-sm font-medium mb-1">Radius (km)</label>
          <input
            id="radius"
            type="number"
            min="0.1"
            max="50"
            step="0.1"
            required
            className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-900 px-3 py-2"
            value={localRadius}
            onChange={e => setLocalRadius(e.target.value)}
          />
        </div>
        <div className="self-end">
          <button
            type="submit"
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white font-medium shadow hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            disabled={loading}
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
      </form>
    </section>
  );
} 