import React from 'react';

export default function PartSelectorModal({ visible, onClose, parts, onSelect, category }) {
  if (!visible) return null;

  return (
    <div className="bg-gray-900 text-white w-full max-w-3xl p-6 rounded-lg shadow-2xl max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-400">Select {category}</h2>
        <button onClick={onClose} className="text-red-400 hover:text-red-600">✕</button>
      </div>
      {parts.length === 0 ? (
        <p className="text-gray-400">No parts available in this category.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2 text-sm">Name</th>
              <th className="p-2 text-sm">Price</th>
              <th className="p-2 text-sm">Vendor</th>
              <th className="p-2 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-2 text-sm">{part.name}</td>
                <td className="p-2 text-sm">৳{part.price.toLocaleString()}</td>
                <td className="p-2 text-sm">{part.vendor}</td>
                <td className="p-2">
                  <button
                    onClick={() => onSelect(part)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
