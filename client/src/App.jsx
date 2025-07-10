import React, { useState } from 'react';
import Header from './components/Header';
import Layout from './components/Layout';
import Sidebar from './components/Sidebar';
import ResponsiveGrid from './components/ResponsiveGrid';
import PartRow from './components/PartRow';
import MultiplePartRow from './components/MultiplePartRow';
import TotalSummary from './components/TotalSummary';
import CompatibilityAlert from './components/CompatibilityAlert';
import RetailerData from './components/RetailerData';
import { getDefaultPartForCategory } from './utils/getDefaultPart';

const allCategories = [
  'CPU',
  'Motherboard',
  'GPU',
  'RAM',
  'Storage',
  'PSU',
  'Case',
  'CPU Cooler',
  'Case Fan',
  'Monitor',
];

const multiSelectCategories = ['RAM', 'Storage', 'Case Fan', 'Monitor'];

export default function App() {
  const [selectedParts, setSelectedParts] = useState({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [incompatibilityMessage, setIncompatibilityMessage] = useState('');

  const handlePartSelect = (category, part) => {
    if (!part) return;

    if (multiSelectCategories.includes(category)) {
      setSelectedParts((prev) => ({
        ...prev,
        [category]: [...(prev[category] || []), part],
      }));
    } else {
      setSelectedParts((prev) => ({
        ...prev,
        [category]: part,
      }));
    }

    // Compatibility logic
    if (
      category === 'CPU' &&
      selectedParts['Motherboard'] &&
      part.brand !== selectedParts['Motherboard'].brand
    ) {
      setIncompatibilityMessage('⚠️ CPU and Motherboard brands do not match!');
    } else {
      setIncompatibilityMessage('');
    }
  };

  const handlePartRemove = (category, index) => {
    if (multiSelectCategories.includes(category)) {
      setSelectedParts((prev) => ({
        ...prev,
        [category]: prev[category].filter((_, i) => i !== index),
      }));
    } else {
      const updated = { ...selectedParts };
      delete updated[category];
      setSelectedParts(updated);
    }
  };

  const sidebar = (
    <Sidebar
      categories={allCategories}
      selectedParts={selectedParts}
      onSelect={setActiveCategory}
    />
  );

  const content = (
    <div className="space-y-6">
      {/* 🔍 Live Retailer Data */}
      <section>
        <h2 className="text-xl font-semibold text-green-700 mb-2">📊 Live Price Comparison</h2>
        <RetailerData />
      </section>

      {/* 🧩 PC Builder */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">🛠️ Build Your PC</h2>
        <div className="space-y-4">
          {allCategories.map((category) => {
            const parts =
              selectedParts[category] || (multiSelectCategories.includes(category) ? [] : null);

            return multiSelectCategories.includes(category) ? (
              <MultiplePartRow
                key={category}
                category={category}
                parts={parts}
                onAdd={() => {
                  const part = getDefaultPartForCategory(category);
                  if (part) handlePartSelect(category, part);
                }}
                onRemove={(index) => handlePartRemove(category, index)}
              />
            ) : (
              <PartRow
                key={category}
                category={category}
                part={parts}
                onSelect={() => {
                  const part = getDefaultPartForCategory(category);
                  if (part) handlePartSelect(category, part);
                }}
              />
            );
          })}
        </div>
      </section>
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
      <CompatibilityAlert message={incompatibilityMessage} />
      <Layout>
        <Header />
        <ResponsiveGrid sidebar={sidebar} content={content} summary={summary} />
      </Layout>
    </>
  );
}
