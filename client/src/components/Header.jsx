import React, { useState, useEffect } from 'react';

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600 dark:text-white">
        PC Banai
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          🇧🇩 Build your dream PC with live local prices
        </span>
        <button
          onClick={() => setDark(!dark)}
          className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition"
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
}
