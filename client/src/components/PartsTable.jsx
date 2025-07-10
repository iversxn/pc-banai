// client/src/components/PartsTable.jsx
import React from 'react';

export default function PartsTable({ category, parts, selectedParts, onSelect, onRemove }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-white mb-3">{category}</h2>
      <table className="w-full table-auto border-collapse border border-gray-700 text-white">
        <thead>
          <tr className="bg-gray-900">
            <th className="border border-gray-700 px-4 py-2 text-left">Component</th>
            <th className="border border-gray-700 px-4 py-2">Selection</th>
            <th className="border border-gray-700 px-4 py-2">Base Price</th>
            <th className="border border-gray-700 px-4 py-2">Promo</th>
            <th className="border border-gray-700 px-4 py-2">Shipping</th>
            <th className="border border-gray-700 px-4 py-2">Tax</th>
            <th className="border border-gray-700 px-4 py-2">Availability</th>
            <th className="border border-gray-700 px-4 py-2">Price</th>
            <th className="border border-gray-700 px-4 py-2">Where</th>
            <th className="border border-gray-700 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedParts.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center p-4 border border-gray-700">
                <button
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                  onClick={() => onSelect(null)}
                >
                  Choose a {category}
                </button>
              </td>
            </tr>
          ) : (
            selectedParts.map((part, idx) => (
              <tr key={idx} className="hover:bg-gray-800">
                <td className="border border-gray-700 px-4 py-2">{part.name}</td>
                <td className="border border-gray-700 px-4 py-2">{part.selection || '-'}</td>
                <td className="border border-gray-700 px-4 py-2">৳{part.basePrice?.toLocaleString() || '-'}</td>
                <td className="border border-gray-700 px-4 py-2">{part.promo || '-'}</td>
                <td className="border border-gray-700 px-4 py-2">{part.shipping || '-'}</td>
                <td className="border border-gray-700 px-4 py-2">{part.tax || '-'}</td>
                <td className="border border-gray-700 px-4 py-2">{part.availability || '-'}</td>
                <td className="border border-gray-700 px-4 py-2 font-bold">৳{part.price?.toLocaleString() || '-'}</td>
                <td className="border border-gray-700 px-4 py-2">{part.vendor || '-'}</td>
                <td className="border border-gray-700 px-4 py-2">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => onRemove(idx)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

