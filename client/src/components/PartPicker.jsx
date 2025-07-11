import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES } from '../data/componentConfig';
import { DB } from '../data/productDatabase'; // Import the static DB
import LoadingSpinner from './LoadingSpinner';

// This component now handles the full logic:
// 1. Show a filtered list of products from the static DB.
// 2. On selection, fetch live offers for that specific product.

export default function PartPicker({ category, selectedParts, onClose, onSelectPart }) {
  const [step, setStep] = useState(1); // 1: Product List, 2: Live Offers
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [liveOffers, setLiveOffers] = useState([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [error, setError] = useState(null);

  // Memoized filtering logic
  const productList = useMemo(() => {
    let list = DB[category] || [];
    if (!list.length) return []; // Return empty if no static data for this category

    const { CPU, Motherboard } = selectedParts;

    if (category === 'Motherboard' && CPU) {
      list = list.filter(m => m.socket === CPU.socket);
    }
    
    if (category === 'RAM' && (CPU || Motherboard)) {
        const requiredType = Motherboard?.memoryType || CPU?.memoryType;
        if (requiredType) {
            list = list.filter(r => Array.isArray(requiredType) ? requiredType.includes(r.type) : r.type === requiredType);
        }
    }

    return list;
  }, [category, selectedParts]);

  const handleProductSelect = async (product) => {
    setSelectedProduct(product);
    setStep(2);
    setIsLoadingOffers(true);
    setError(null);
    setLiveOffers([]);

    try {
      const res = await fetch(`/api/retailers?category=${category}&productName=${encodeURIComponent(product.name)}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to fetch offers.');
      }
      // Sort offers by price
      const sortedOffers = json.data.sort((a, b) => a.price - b.price);
      setLiveOffers(sortedOffers);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedProduct(null);
    setLiveOffers([]);
  };

  const renderProductSelection = () => {
    if (!DB[category]) {
        return <div className="p-4">Live search for this category will be implemented soon.</div>
    }
    
    return (
      <>
        <h3 className="text-lg font-semibold mb-4">Choose a Product ({productList.length} compatible found)</h3>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {productList.length > 0 ? productList.map((product, idx) => (
            <div
              key={idx}
              onClick={() => handleProductSelect(product)}
              className="p-3 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer transition"
            >
              <p className="font-semibold">{product.name}</p>
            </div>
          )) : <p className="text-yellow-400">No compatible products found. Try changing your selected CPU or Motherboard.</p>}
        </div>
      </>
    );
  };

  const renderOfferSelection = () => (
    <>
      <div className="flex items-center mb-4">
        <button onClick={handleBack} className="mr-4 text-blue-400 hover:underline">
          ← Back
        </button>
        <h3 className="text-lg font-semibold truncate">{selectedProduct.name}</h3>
      </div>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {isLoadingOffers && <div className="flex flex-col items-center p-8"><LoadingSpinner /><p className="mt-4">Searching local retailers for the best price...</p></div>}
        {error && <p className="text-red-400">Error: {error}</p>}
        {!isLoadingOffers && liveOffers.length === 0 && <p>No live offers found for this product from our retailers.</p>}
        
        {liveOffers.map((offer, idx) => (
          <div key={idx} className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
            <div>
              <p className="font-semibold text-blue-300">{offer.vendor}</p>
              <p className="text-green-400 text-lg">৳{offer.price.toLocaleString()}</p>
              <p className={`text-sm ${offer.stock === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>{offer.stock}</p>
            </div>
            <button
              onClick={() => onSelectPart({ ...offer, ...selectedProduct })} // Combine static data with live offer
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500"
              disabled={offer.stock !== 'In Stock'}
            >
              {offer.stock === 'In Stock' ? 'Add to Build' : 'Out of Stock'}
            </button>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white w-full max-w-3xl p-6 rounded-lg shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
          <h2 className="text-2xl font-bold text-green-400">
            Select {CATEGORIES[category]?.displayName || category}
          </h2>
          <button onClick={onClose} className="text-2xl hover:text-red-500">×</button>
        </div>
        {step === 1 ? renderProductSelection() : renderOfferSelection()}
      </div>
    </div>
  );
}
