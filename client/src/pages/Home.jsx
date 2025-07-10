import React, { useEffect, useState } from 'react';

function RetailerData() {
  const [retailers, setRetailers] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/data/getRetailers');
      const json = await res.json();
      setRetailers(json);
    }
    fetchData();
  }, []);

  if (!retailers) return <p>Loading live prices...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(retailers).map(([vendor, items]) => (
        <div key={vendor} className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-2 capitalize">{vendor}</h2>
          {items.length === 0 ? (
            <p>No products</p>
          ) : (
            <ul className="space-y-2">
              {items.map((item, idx) => (
                <li key={idx} className="border rounded p-2">
                  <p className="font-semibold">{item.name}</p>
                  <p>Price: ৳{item.price}</p>
                  <p>Status: {item.stock}</p>
                  <a href={item.url} target="_blank" className="text-blue-500 underline">
                    View
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default RetailerData;
