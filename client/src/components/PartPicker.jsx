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

  useEffect(() => {
    const fetchProductCatalog = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/retailers?category=${category}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'API request failed');
        setProductCatalog(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductCatalog();
  }, [category]);

  const filteredCatalog = useMemo(() => {
    let list = productCatalog;
    const { CPU, Motherboard } = selectedParts;

    // Guided flow filtering (for CPU)
    if (series) {
      return list.filter(p => series.keywords.some(kw => p.displayName.toLowerCase().includes(kw)));
    }

    // Compatibility filtering for other components
    if (category === 'Motherboard' && CPU?.socket) {
      list = list.filter(p => p.socket === CPU.socket);
    }
    if (category === 'RAM' && (CPU || Motherboard)) {
      const requiredType = Motherboard?.memoryType || CPU?.memoryType;
      if (requiredType) {
        list = list.filter(p => Array.isArray(requiredType) ? requiredType.includes(p.memoryType) : p.memoryType === requiredType);
      }
    }
    return list;
  }, [series, productCatalog, selectedParts, category]);

  const handleSelectOffer = (offer) => {
    // Pass the compatibility tags from the selected series (for CPUs) or the product itself (for Mobo/RAM)
    const compatibilityTags = series 
        ? { socket: series.socket, memoryType: series.memoryType } 
        : { socket: selectedProduct?.socket, memoryType: selectedProduct?.memoryType };
    onSelectPart(offer, compatibilityTags);
  };

  const renderHeader = () => ( /* ... same as before ... */ 
    <div className="flex justify-between items-center mb-4 border-b border-gray-600 pb-3">
      <h2 className="text-2xl font-bold text-green-400">Select {categoryConfig.displayName}</h2>
      <button onClick={onClose} className="text-2xl hover:text-red-500">×</button>
    </div>
  );

  const renderBackButton = (backAction) => ( /* ... same as before ... */
    <button onClick={backAction} className="mb-4 text-blue-400 hover:underline">← Back</button>
  );

  const renderOfferList = (product) => (
    <div>
      {renderBackButton(() => setStep(hasGuidedFlow ? 3 : 1))}
      <h3 className="text-lg font-semibold mb-4">{product.displayName}</h3>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {product.allOffers.map((offer, i) => (
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

  const renderStep = () => {
    if (isLoading) return <div className="min-h-[400px] flex flex-col justify-center items-center"><LoadingSpinner /><p className="mt-4 text-lg">Building live catalog from local retailers...</p></div>;
    if (error) return <p className="text-red-400 p-4">Error: {error}</p>;
    if (filteredCatalog.length === 0) return <div className="p-4 text-center"><p>No compatible products found.</p><p className="text-sm text-gray-400">Retailers may be out of stock, or you may need to adjust your other components.</p></div>;

    // Guided Flow for CPU
    if (hasGuidedFlow) {
      if (step === 1) { /* ... Brand Selection ... */ }
      if (step === 2) { /* ... Series Selection ... */ }
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
      if (step === 4) return renderOfferList(selectedProduct);
    }

    // Default Flow for other components (Mobo, RAM, GPU, etc.)
    if (step === 1) { // Product List
      return (
        <div>
          <h3 className="text-lg font-semibold mb-4">Choose a Product ({filteredCatalog.length} found)</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {filteredCatalog.map((p, i) => (
              <div key={i} onClick={() => { setSelectedProduct(p); setStep(2); }} className="p-3 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer flex justify-between items-center">
                <span className="flex-1">{p.displayName}</span>
                <span className="text-green-400 ml-4">From ৳{p.allOffers[0].price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (step === 2) return renderOfferList(selectedProduct);
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
