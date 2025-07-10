import React from 'react';

export default function CompatibilityAlert({ message }) {
  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-700 text-white px-6 py-3 rounded shadow-lg z-50 animate-pulse">
      ⚠️ {message}
    </div>
  );
}
