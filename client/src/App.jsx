import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
import PartsTable from './components/PartsTable';
import TotalSummary from './components/TotalSummary';
import CompatibilityAlert from './components/CompatibilityAlert';
import { checkCompatibility } from './utils/checkCompatibility';
import { CATEGORIES } from './data/componentConfig';
import PartPicker from './components/PartPicker';

const allCategoryKeys = Object.keys(CATEGORIES);

export default function App() {
  const [selectedParts, setSelectedParts] = useState({});
  const [compatibilityIssues, setCompatibilityIssues] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerCategory, setPickerCategory] = useState(null);

  useEffect(() => {
    const issues = checkCompatibility(selectedParts);
    setCompatibilityIssues(issues);
  }, [selectedParts]);

  const handleOpenPicker = (category) => {
    setPickerCategory(category);
    setIsPickerOpen(true);
  };

  const handlePartSelect = (part, compatibilityTags) => {
    const { category } = part;
    const partWithTags = { ...part, ...compatibilityTags };

    // Clear incompatible parts when a core component is selected
    if (category === 'CPU') {
      const { Motherboard, RAM, ...rest } = selectedParts;
      setSelectedParts({ ...rest, [category]: partWithTags });
    } else if (category === 'Motherboard') {
      const { RAM, ...rest } = selectedParts;
      setSelectedParts({ ...rest, [category]: partWithTags });
    } else {
      setSelectedParts((prev) => ({ ...prev, [category]: partWithTags }));
    }
    setIsPickerOpen(false);
  };

  const handlePartRemove = (category) => {
    const { [category]: removed, ...rest } = selectedParts;
    setSelectedParts(rest);
  };

  return (
    <>
      <Layout>
        <Header />
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2">
            {compatibilityIssues.length > 0 && (
              <div className="p-4 mb-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
                <h3 className="font-bold text-yellow-300 mb-2">Compatibility Warnings</h3>
                {compatibilityIssues.map((msg, i) => <CompatibilityAlert key={i} message={msg} />)}
              </div>
            )}
            <PartsTable
              categories={allCategoryKeys}
              selectedParts={selectedParts}
              onOpenPicker={handleOpenPicker}
              onRemove={handlePartRemove}
            />
          </main>
          <aside className="lg:col-span-1 sticky top-6 h-fit">
            <TotalSummary selectedParts={selectedParts} />
          </aside>
        </div>
      </Layout>
      {isPickerOpen && (
        <PartPicker
          category={pickerCategory}
          selectedParts={selectedParts}
          onClose={() => setIsPickerOpen(false)}
          onSelectPart={handlePartSelect}
        />
      )}
    </>
  );
}```

**File: `client/src/components/PartPicker.jsx` (MODIFIED - The New Wizard UI)**
```javascript
import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES } from '../data/componentConfig';
import LoadingSpinner from './LoadingSpinner';

export default function PartPicker({ category, selectedParts, onClose, onSelectPart }) {
  const [step, setStep] = useState(1);
  const [brand, setBrand] = useState(null);
  const [series, setSeries] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [liveProductList, setLiveProductList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryConfig = CATEGORIES[category];
  const hasGuidedFlow = !!categoryConfig.brands;

  useEffect(() => {
    const fetchLiveProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/retailers?category=${category}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'API request failed');
        setLiveProductList(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiveProducts();
  }, [category]);

  const filteredProductList = useMemo(() => {
    if (!series) return liveProductList;
    // Filter the full live list by the keywords of the selected series
    return liveProductList.filter(p => 
      series.keywords.some(kw => p.displayName.toLowerCase().includes(kw))
    );
  }, [series, liveProductList]);

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
    if (isLoading) return <div className="min-h-[300px] flex flex-col justify-center items-center"><LoadingSpinner /><p className="mt-4">Sourcing all available {categoryConfig.displayName}...</p></div>;
    if (error) return <p className="text-red-400">Error: {error}</p>;

    // Guided Flow (CPU)
    if (hasGuidedFlow) {
      if (step === 1) { // Brand Selection
        return (
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose a Brand</h3>
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
            <h3 className="text-lg font-semibold mb-4">Choose a Series for {brand}</h3>
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
            <h3 className="text-lg font-semibold mb-4">Choose a Product ({filteredProductList.length} found)</h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {filteredProductList.map((p, i) => (
                <div key={i} onClick={() => { setSelectedProduct(p); setStep(4); }} className="p-3 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer flex justify-between">
                  <span>{p.displayName}</span>
                  <span className="text-green-400">From ৳{p.offers[0].price.toLocaleString()}</span>
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
              {selectedProduct.offers.map((offer, i) => (
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

    // Default Flow (for other components)
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">Choose a Product ({liveProductList.length} found)</h3>
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
          {liveProductList.map((p, i) => (
            <div key={i} onClick={() => handleSelectOffer(p.offers[0])} className="p-3 bg-gray-700 rounded-md hover:bg-blue-600 cursor-pointer flex justify-between">
              <span>{p.displayName}</span>
              <span className="text-green-400">৳{p.offers[0].price.toLocaleString()}</span>
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
