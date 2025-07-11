import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../data/componentConfig';

// Modal component to select a part
export default function PartPicker({ category, allParts, onClose, onSelectPart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 1. Filter parts for the current category
  const categoryParts = useMemo(() =>
    allParts.filter(p => p.category === category),
    [allParts, category]
  );

  // 2. Group parts by normalized name to get unique products
  const uniqueProducts = useMemo(() => {
    const productMap = new Map();
    categoryParts.forEach(part => {
      if (!productMap.has(part.normalizedName)) {
        productMap.set(part.normalizedName, {
          displayName: part.name,
          vendors: [],
        });
      }
      productMap.get(part.normalizedName).vendors.push(part);
    });
    // Sort vendors by price for each product
    productMap.forEach(prod => prod.vendors.sort((a, b) => a.price - b.price));
    return Array.from(productMap.values());
  }, [categoryParts]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const renderProductSelection = () => (
    <>
      <h3 className="text-lg font-semibold mb-4">Choose a Product</h3>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {uniqueProducts.length > 0 ? uniqueProducts.map((product, idx) => (
          <div
            key={idx}
            onClick={() => handleSelectProduct(product)}
            className="p-3 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer transition"
          >
            <p className="font-semibold">{product.displayName}</p>
            <p className="text-sm text-green-400">
              Starts from ৳{product.vendors[0].price.toLocaleString()}
            </p>
          </div>
        )) : <p>No products found for this category.</p>}
      </div>
    </>
  );
  
  const renderVendorSelection = () => (
     <>
      <div className="flex items-center mb-4">
        <button onClick={() => setSelectedProduct(null)} className="mr-4 text-blue-400 hover:underline">
          ← Back
        </button>
        <h3 className="text-lg font-semibold">{selectedProduct.displayName}</h3>
      </div>
      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        <p className="text-md font-bold mb-2">Available Offers:</p>
        {selectedProduct.vendors.map((part, idx) => (
          <div key={idx} className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold text-blue-300">{part.vendor}</p>
              <p className="text-green-400">৳{part.price.toLocaleString()}</p>
              <p className={`text-sm ${part.stock === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>{part.stock}</p>
            </div>
            <button
              onClick={() => onSelectPart(part)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Add to Build
            </button>
          </div>
        ))}
      </div>
     </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white w-full max-w-2xl p-6 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
          <h2 className="text-2xl font-bold text-green-400">
            Select {CATEGORIES[category]?.displayName || category}
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">×</button>
        </div>
        {!selectedProduct ? renderProductSelection() : renderVendorSelection()}
      </div>
    </div>
  );
}
