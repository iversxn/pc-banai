import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
import PartsTable from './components/PartsTable'; // Using PartsTable for a more detailed view
import TotalSummary from './components/TotalSummary';
import CompatibilityAlert from './components/CompatibilityAlert';
import { checkCompatibility } from './utils/checkCompatibility';
import { CATEGORIES } from './data/componentConfig';
import PartPicker from './components/PartPicker';

const allCategoryKeys = Object.keys(CATEGORIES);
const multiSelectCategories = ['RAM', 'Storage', 'Case Fan', 'Monitor'];

export default function App() {
  const [allParts, setAllParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParts, setSelectedParts] = useState({});
  const [compatibilityIssues, setCompatibilityIssues] = useState([]);
  
  // Part Picker Modal State
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerCategory, setPickerCategory] = useState(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await fetch('/api/retailers');
        if (!res.ok) {
          throw new Error(`API Error: ${res.statusText}`);
        }
        const json = await res.json();
        if (json.success) {
          setAllParts(json.data);
        } else {
           setError(json.message || 'Failed to fetch parts.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchParts();
  }, []);
  
  useEffect(() => {
    const issues = checkCompatibility(selectedParts);
    setCompatibilityIssues(issues);
  }, [selectedParts]);

  const handleOpenPicker = (category) => {
    setPickerCategory(category);
    setIsPickerOpen(true);
  };

  const handlePartSelect = (part) => {
    const { category } = part;
    if (multiSelectCategories.includes(category)) {
      setSelectedParts((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), part],
      }));
    } else {
      setSelectedParts((prev) => ({ ...prev, [category]: part }));
    }
    setIsPickerOpen(false); // Close picker after selection
  };

  const handlePartRemove = (category, index = -1) => {
    setSelectedParts((prev) => {
      const updated = { ...prev };
      if (multiSelectCategories.includes(category) && index > -1) {
        updated[category] = updated[category].filter((_, i) => i !== index);
      } else {
        delete updated[category];
      }
      return updated;
    });
  };
  
  const content = (
    <div className="space-y-4">
      {compatibilityIssues.length > 0 && (
          <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
              {compatibilityIssues.map((msg, i) => <CompatibilityAlert key={i} message={msg} />)}
          </div>
      )}
      <PartsTable 
        categories={allCategoryKeys}
        selectedParts={selectedParts}
        onOpenPicker={handleOpenPicker}
        onRemove={handlePartRemove}
      />
    </div>
  );

  const summary = (
    <TotalSummary
      selectedParts={selectedParts}
      onCheckout={() => alert('Checkout functionality coming soon!')}
    />
  );
  
  if (isLoading) return <div className="text-center p-10">Loading PC Parts...</div>
  if (error) return <div className="text-center p-10 text-red-400">Error: {error}</div>

  return (
    <>
      <Layout>
        <Header />
        <div className="p-4">
            {content}
            {summary}
        </div>
      </Layout>
      
      {isPickerOpen && (
        <PartPicker
          category={pickerCategory}
          allParts={allParts}
          onClose={() => setIsPickerOpen(false)}
          onSelectPart={handlePartSelect}
        />
      )}
    </>
  );
}
