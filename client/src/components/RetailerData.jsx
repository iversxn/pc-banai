import React, { useEffect, useState } from 'react';

export default function RetailerData() {
  const [retailerData, setRetailerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/retailers')
      .then((res) => res.json())
      .then((data) => {
        setRetailerData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load retailer data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-gray-600">Loading live retailer data...</div>;
  }

  if (!retailerData) {
    return <div className="text-red-600">Failed to load data.</div>;
  }

  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white">
      {Object.entries(retailerData).map(([retailer, items]) => (
        <div key={retailer} className="mb-4">
          <h3 className="text-lg font-semibold text-blue-600 capitalize">{retailer}</h3>
          {items.length === 0 ? (
            <p className="text-gray-500 text-sm">No items found</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item, idx) => (
                <li key={idx} className="py-2">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-medium">
                    {item.name}
                  </a>
                  <div className="text-sm text-gray-700">
                    ৳{item.price.toLocaleString()} — {item.stock}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
