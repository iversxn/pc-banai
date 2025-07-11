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
}
