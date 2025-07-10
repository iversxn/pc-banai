import React from 'react';

export default function CheckoutPanel({ selectedParts }) {
  const vendorLinks = {};

  Object.entries(selectedParts).forEach(([_, parts]) => {
    const list = Array.isArray(parts) ? parts : [parts];
    list.forEach((part) => {
      if (part?.url) {
        if (!vendorLinks[part.vendor]) {
          vendorLinks[part.vendor] = [];
        }
        vendorLinks[part.vendor].push(part.url);
      }
    });
  });

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-md shadow-md mt-6">
      <h2 className="text-xl font-semibold mb-3">Best Vendor Checkout</h2>
      {Object.entries(vendorLinks).map(([vendor, links]) => (
        <div key={vendor} className="mb-4">
          <h3 className="text-lg font-semibold text-blue-600">{vendor}</h3>
          <ul className="list-disc ml-6 text-sm text-gray-600 dark:text-gray-300">
            {links.map((url, idx) => (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-500 hover:text-blue-700"
                >
                  View Product
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
