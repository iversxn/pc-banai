import React, { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function PartList() {
  const [parts, setParts] = useState(null);

  useEffect(() => {
    fetch('/data/retailers.json')
      .then(res => res.json())
      .then(data => setParts(data))
      .catch(err => console.error('Failed to load retailer data', err));
  }, []);

  if (!parts) return <LoadingSpinner />;

  const allParts = [
    ...parts.techland,
    ...parts.startech,
    ...parts.ultratech,
    ...parts.skyland,
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allParts.map((item, idx) => (
        <div key={idx} className="bg-gray-800 rounded-xl shadow p-4 hover:bg-gray-700 transition-all">
          <h3 className="text-lg font-bold">{item.name}</h3>
          <p className="text-green-400 font-semibold">৳ {item.price}</p>
          <p className={`text-sm ${item.stock === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>
            {item.stock}
          </p>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-sm">
            View on site →
          </a>
        </div>
      ))}
    </div>
  );
}
