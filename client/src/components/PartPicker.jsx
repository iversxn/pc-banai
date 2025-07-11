import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES } from '../data/componentConfig';
import LoadingSpinner from './LoadingSpinner';

export default function PartPicker({ category, selectedParts, onClose, onSelectPart }) {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState(null);
  const [series, setSeries] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [productCatalog, setProductCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryConfig = CATEGORIES[category];
  const hasGuidedFlow = !!categoryConfig.brands;

  // This useEffect now makes ONE API call to get the entire, pre-grouped catalog.
  useEffect(() => {
    const fetchProductCatalog = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/retailers?category=${category}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'API request failed');
        // Sort the entire catalog by the price of its cheapest offer
        const sortedCatalog = json.data.sort((a, b) => a.allOffers[0].price - b.allOffers[0].price);
        setProductCatalog(sortedCatalog);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductCatalog();
  }, [category]);

  // This memo filters the catalog based on the user's choices in the wizard.
  const filteredCatalog = useMemo(() => {
    if (!series) return productCatalog;
    return productCatalog.filter(p => 
      series.keywords.some(kw => p.displayName.toLowerCase().includes(kw))
    );
  }, [series, productCatalog]);

  const handleSelectOffer = (offer) => {
    const compatibilityTags = series ? { socket: series.socket, memoryType: series.memoryType } : {};
    onSelectPart(offer, compatibilityTags);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
      <h2 className="text-2xl font-bold text-green-400">Select {categoryConfig.displayName}</h2>
      <button onClick={onClose} className="text-2xl hover:text-red-500">×</button>
    </div>
  );

  const renderBackButton = (backAction) => (
    <button onClick={backAction} className="mb-4 text-blue-400 hover:underline">← Back</button>
  );

  const renderStep = () => {
    if (isLoading) return <div className="min-h-[400px] flex flex-col justify-center items-center"><LoadingSpinner /><p className="mt-4 text-lg">Building live catalog from local retailers...</p></div>;
    if (error) return <p className="text-red-400 p-4">Error: {error}</p>;
    if (productCatalog.length === 0) return <p className="p-4">No products found for this category at any of our retailers.</p>

    // Guided Flow for CPU
    if (hasGuidedFlow) {
      if (step === 1) { // Brand Selection
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">1. Choose a Brand</h3>
            {Object.keys(categoryConfig.brands).map(b => (
              <div key={b} onClick={() => { setBrand(b); setStep(2); }} className="p-4 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer mb-2">{b}</div>
            ))}
          </div>
        );
      }
      if (step === 2) { // Series Selection
        return (
          <div>
            {renderBackButton(() => setStep(1))}
            <h3 className="text-lg font-semibold mb-4">2. Choose a Series for {brand}</h3>
            {categoryConfig.brands[brand].series.map(s => (
              <div key={s.name} onClick={() => { setSeries(s); setStep(3); }} className="p-4 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer mb-2">{s.name}</div>
            ))}
          </div>
        );
      }
      if (step === 3) { // Product Selection
        return (
          <div>
            {renderBackButton(() => setStep(2))}
            <h3 className="text-lg font-semibold mb-4">3. Choose a Product ({filteredCatalog.length} found)</h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {filteredCatalog.map((p, i) => (
                <div key={i} onClick={() => { setSelectedProduct(p); setStep(4); }} className="p-3 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer flex justify-between items-center">
                  <span className="flex-1">{p.displayName}</span>
                  <span className="text-green-400 ml-4">From ৳{p.allOffers[0].price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (step === 4) { // Offer Selection
        return (
          <div>
            {renderBackButton(() => setStep(3))}
            <h3 className="text-lg font-semibold mb-4">{selectedProduct.displayName}</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {selectedProduct.allOffers.map((offer, i) => (
                <div key={i} className="p-3 bg-gray-700 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-blue-300">{offer.vendor}</p>
                    <p className="text-green-400 text-lg">৳{offer.price.toLocaleString()}</p>
                    <p className={`text-sm ${offer.stock === 'In Stock' ? 'text-green-500' : 'text-red-500'}`}>{offer.stock}</p>
                  </div>
                  <button onClick={() => handleSelectOffer(offer)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" disabled={offer.stock !== 'In Stock'}>Add</button>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    // Default Flow for other components (e.g., GPU, PSU)
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose a Product ({productCatalog.length} found)</h3>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {productCatalog.map((p, i) => (
            <div key={i} onClick={() => { setSelectedProduct(p); setStep(2); }} className="p-3 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer flex justify-between items-center">
              <span className="flex-1">{p.displayName}</span>
              <span className="text-green-400 ml-4">From ৳{p.allOffers[0].price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 text-white w-full max-w-3xl p-6 rounded-lg shadow-xl flex flex-col">
        {renderHeader()}
        {renderStep()}
      </div>
    </div>
  );
}
