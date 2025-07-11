import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES } from '../data/componentConfig';
import LoadingSpinner from './LoadingSpinner';

// A simple normalization function to group similar product names
const normalizeName = (name) => {
    return name
        .toLowerCase()
        .replace(/(ram|gb|ddr4|ddr5|mhz|cl\d+)/g, '') // Remove common specs
        .replace(/[^a-z0-9]/g, '') // Remove special characters
        .trim();
};

export default function PartPicker({ category, onClose, onSelectPart }) {
  const [step, setStep] = useState(1); // 1: Product Selection, 2: Offer Selection
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartsForCategory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/retailers?category=${category}`);
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to fetch parts.');
        }
        setParts(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartsForCategory();
  }, [category]);

  const uniqueProducts = useMemo(() => {
    const productMap = new Map();
    parts.forEach(part => {
      const mainName = part.name.split(' ').slice(0, 5).join(' ');
      const normalized = normalizeName(mainName);

      if (!productMap.has(normalized)) {
        productMap.set(normalized, {
          displayName: part.name,
          vendors: [],
        });
      }
      productMap.get(normalized).vendors.push(part);
    });

    productMap.forEach(prod => prod.vendors.sort((a, b) => a.price - b.price));
    
    return Array.from(productMap.values()).sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [parts]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setStep(2);
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setStep(1);
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="min-h-[300px] flex flex-col justify-center items-center"><LoadingSpinner /><p className="mt-4">Fetching parts for {category}...</p></div>;
    }
    if (error) {
      return <div className="min-h-[300px] flex justify-center items-center text-red-400"><p>Error: {error}</p></div>;
    }
    if (uniqueProducts.length === 0) {
        return <div className="min-h-[300px] flex justify-center items-center"><p>No products found for this category.</p></div>;
    }

    if (step === 1) {
      return (
        <>
          <h3 className="text-lg font-semibold mb-4">Choose a Product ({uniqueProducts.length} found)</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {uniqueProducts.map((product, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectProduct(product)}
                className="p-3 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer transition flex justify-between items-center"
              >
                <p className="font-semibold flex-1">{product.displayName}</p>
                <p className="text-sm text-green-400 ml-4">
                  From ৳{product.vendors[0].price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <div className="flex items-center mb-4">
            <button onClick={handleBack} className="mr-4 text-blue-400 hover:underline">
              ← Back to Products
            </button>
            <h3 className="text-lg font-semibold truncate" title={selectedProduct.displayName}>{selectedProduct.displayName}</h3>
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            <p className="text-md font-bold mb-2">Available Offers:</p>
            {selectedProduct.vendors.map((part, idx) => (
              <div key={idx} className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold text-blue-300">{part.vendor}</p>
                  <p className="text-green-400 text-lg">৳{part.price.toLocaleString()}</p>
                  <p className={`text-sm ${part.stock === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>{part.stock}</p>
                </div>
                <button
                  onClick={() => onSelectPart(part)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
                  disabled={part.stock !== 'In Stock'}
                >
                  {part.stock === 'In Stock' ? 'Add to Build' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white w-full max-w-3xl p-6 rounded-lg shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
          <h2 className="text-2xl font-bold text-green-400">
            Select {CATEGORIES[category]?.displayName || category}
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">×</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
