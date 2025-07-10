import React from 'react';

export default function Sidebar({ categories, selectedParts, onSelect }) {
  return (
    <aside className="bg-gray-800 p-4 rounded-lg shadow-lg h-fit sticky top-6">
      <h2 className="text-green-400 text-lg font-bold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              className={`w-full text-left px-3 py-2 rounded hover:bg-green-700/20 transition ${
                selectedParts[cat] ? 'text-green-300' : 'text-gray-300'
              }`}
              onClick={() => onSelect(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
