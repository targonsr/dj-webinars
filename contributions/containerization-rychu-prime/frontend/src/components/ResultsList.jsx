import React from 'react';

export default function ResultsList({ locations }) {
  if (!locations.length) {
    return (
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        <p className="text-gray-500 dark:text-gray-400">No locations found.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {locations.map((loc, i) => (
        <article key={i} className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold">{loc.name}</h3>
          {loc.description && <p className="text-sm mt-1">{loc.description}</p>}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            <strong>Distance:</strong> {loc.distance_km} km
          </p>
        </article>
      ))}
    </div>
  );
} 