import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
import PartsTable from './components/PartsTable';
import TotalSummary from './components/TotalSummary';
import CompatibilityAlert from './components/CompatibilityAlert';
import { checkCompatibility } from './utils/checkCompatibility';
import { CATEGORIES } from './data/componentConfig';
import PartPicker from './components/PartPicker';
import LoadingSpinner from './components/LoadingSpinner'; // Import the spinner

const allCategoryKeys = Object.keys(CATEGORIES);
const multiSelectCategories = ['RAM', 'Storage', 'Case Fan', 'Monitor'];

// Polling hook for fetching data
const usePartData = () => {
  const [allParts, setAllParts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Connecting to retailers...');

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10; // Try up to 10 times (e.g., 10 * 4s = 40s timeout)
    const interval = 4000; // 4 seconds

    const fetchData = async () => {
      attempts++;
      try {
        const res = await fetch('/api/retailers');
        const json = await res.json();

        if (res.status === 200 && json.success) {
          setAllParts(json.data);
          setIsLoading(false);
          setError(null);
          return; // Success, stop polling
        }

        if (res.status === 202 || (json.success === false && json.message.includes('updating'))) {
          setStatusMessage('Live data is being updated, this may take a moment...');
          if (attempts < maxAttempts) {
            setTimeout(fetchData, interval); // Retry after interval
          } else {
            setError('The server is taking too long to respond. Please try refreshing the page.');
            setIsLoading(false);
          }
        } else {
           throw new Error(json.message || 'An unknown error occurred.');
        }
      } catch (err) {
        setError(`Failed to fetch parts data: ${err.message}`);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { allParts, isLoading, error, statusMessage };
};


export default function App() {
  const { allParts, isLoading, error, statusMessage } = usePartData();
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

  if (isLoading) {
    return (
        <Layout>
            <Header />
            <div className="text-center p-10 flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-gray-300">{statusMessage}</p>
            </div>
        </Layout>
    );
  }

  if (error) {
      return (
        <Layout>
            <Header />
            <div className="text-center p-10">
                <p className="text-2xl text-red-500">An Error Occurred</p>
                <p className="mt-4 text-lg text-gray-300">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Refresh Page
                </button>
            </div>
        </Layout>
      );
  }


  return (
    <>
      <Layout>
        <Header />
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <main className="lg:col-span-2">
                {content}
            </main>
            <aside>
                {summary}
            </aside>
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
