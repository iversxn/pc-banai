import React from 'react';

export default function TotalSummary({ selectedParts, onCheckout }) {
  let total = 0;
  const vendorBreakdown = {};
  let partCount = 0;

  Object.values(selectedParts).forEach((partOrParts) => {
    const items = Array.isArray(partOrParts) ? partOrParts : [partOrParts];
    items.forEach((part) => {
      if (part && typeof part.price === 'number') {
        partCount++;
        total += part.price;
        if (!vendorBreakdown[part.vendor]) {
          vendorBreakdown[part.vendor] = 0;
        }
        vendorBreakdown[part.vendor] += part.price;
      }
    });
  });

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-3">Build Summary</h2>
      
      {partCount === 0 ? (
        <p className="text-gray-400">Your build is empty. Start by choosing a component.</p>
      ) : (
        <>
          <div className="flex justify-between items-baseline mb-4">
            <span className="text-gray-300">Total Price:</span>
            <span className="text-3xl font-bold text-green-400">৳{total.toLocaleString()}</span>
          </div>

          <div className="text-sm text-gray-400 space-y-2 mb-6">
            <h3 className="font-semibold text-gray-200 mb-1">Cost by Retailer:</h3>
            {Object.keys(vendorBreakdown).length > 0 ? Object.entries(vendorBreakdown).map(([vendor, price]) => (
              <div key={vendor} className="flex justify-between">
                <span>• {vendor}</span>
                <span>৳{price.toLocaleString()}</span>
              </div>
            )) : <p>No vendors yet.</p>}
          </div>

          <button
            onClick={onCheckout}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-bold text-lg"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
