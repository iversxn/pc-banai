import React from 'react';

export default function TotalSummary({ selectedParts, onCheckout }) {
  let total = 0;
  const vendorBreakdown = {};

  Object.entries(selectedParts).forEach(([category, parts]) => {
    const items = Array.isArray(parts) ? parts : [parts];
    items.forEach((part) => {
      total += part.price;
      if (!vendorBreakdown[part.vendor]) {
        vendorBreakdown[part.vendor] = 0;
      }
      vendorBreakdown[part.vendor] += part.price;
    });
  });

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-3">Total Summary</h2>
      <p className="text-gray-800 dark:text-gray-200 mb-2">Total: ৳{total}</p>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        {Object.entries(vendorBreakdown).map(([vendor, price]) => (
          <p key={vendor}>
            • {vendor}: ৳{price}
          </p>
        ))}
      </div>

      <button
        onClick={onCheckout}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
