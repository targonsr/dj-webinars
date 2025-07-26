import React, { useEffect } from 'react';

export default function Toast({ show, message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div className="fixed bottom-6 inset-x-0 flex justify-center pointer-events-none z-50">
      <div className="bg-red-600 text-white px-4 py-2 rounded-md shadow pointer-events-auto" role="alert">
        <span>{message}</span>
      </div>
    </div>
  );
} 