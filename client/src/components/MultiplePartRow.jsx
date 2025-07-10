import React from 'react';

export default function MultiplePartRow({ category, parts, onAdd, onRemove }) {
  return (
    <div className="border-b border-gray-700 py-2 px-4">
      <div className="flex justify-between items-center text-gray-300 mb-2">
        <h3 className="font-semibold">{category}</h3>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          onClick={onAdd}
        >
          + Add
        </button>
      </div>
      {parts.length === 0 && (
        <p className="italic text-gray-500">No {category} added yet.</p>
      )}
      <div className="space-y-2">
        {parts.map((part, index) => (
          <div key={index} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-200">{part.name}</div>
            <div className="text-sm text-gray-300">৳{part.price.toLocaleString()}</div>
            <div className="text-sm text-green-300">{part.vendor}</div>
            <button
              onClick={() => onRemove(index)}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
