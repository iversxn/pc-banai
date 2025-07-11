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
const multiSelectCategories = ['RAM', 'Storage', 'Case Fan', 'Monitor'];

export default function App() {
  const [selectedParts, setSelectedParts] = useState({});
  const [compatibilityIssues, setCompatibilityIssues] = useState([]);

  // Part Picker Modal State
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

  const handlePartSelect = (part) => {
    const { category } = part;
    if (multiSelectCategories.includes(category)) {
      setSelectedParts((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), part],
      }));
    } else {
      // When changing a core component, clear dependent parts to avoid incompatibility
      if (category === 'CPU') {
          const { Motherboard, RAM, ...rest } = selectedParts;
          setSelectedParts({ ...rest, [category]: part });
      } else if (category === 'Motherboard') {
          const { RAM, ...rest } = selectedParts;
          setSelectedParts({ ...rest, [category]: part });
      } else {
          setSelectedParts((prev) => ({ ...prev, [category]: part }));
      }
    }
    setIsPickerOpen(false);
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
          <div className="p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg">
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
    </div>
  );

  const summary = (
    <TotalSummary
      selectedParts={selectedParts}
      onCheckout={() => alert('Checkout functionality coming soon!')}
    />
  );

  return (
    <>
      <Layout>
        <Header />
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <main className="lg:col-span-2">
                {content}
            </main>
            <aside className="lg:col-span-1 sticky top-6 h-fit">
                {summary}
            </aside>
        </div>
      </Layout>

      {isPickerOpen && (
        <PartPicker
          category={pickerCategory}
          selectedParts={selectedParts} // Pass selected parts for filtering
          onClose={() => setIsPickerOpen(false)}
          onSelectPart={handlePartSelect}
        />
      )}
    </>
  );
}
