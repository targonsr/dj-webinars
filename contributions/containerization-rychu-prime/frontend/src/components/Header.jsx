import React from 'react';

export default function Header() {
  return (
    <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <h1 className="text-lg font-semibold tracking-wide">🌍 Rychu Prime Geo-Platform</h1>
        <a
          href="https://github.com/developer-jutra/dj-webinars"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Developer Jutra ↗
        </a>
      </div>
    </header>
  );
} 