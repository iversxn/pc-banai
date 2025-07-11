import React from 'react';
import { CATEGORIES } from '../data/componentConfig';

export default function PartsTable({ categories, selectedParts, onOpenPicker, onRemove }) {
  const multiSelectCategories = ['RAM', 'Storage'];

  return (
    <div className="bg-gray-900/50 p-4 rounded-lg">
      <table className="w-full text-left text-white">
        <thead>
          <tr className="border-b border-gray-600">
            <th className="p-3">Component</th>
            <th className="p-3">Selection</th>
            <th className="p-3">Vendor</th>
            <th className="p-3">Price</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const isMulti = multiSelectCategories.includes(cat);
            const partOrParts = selectedParts[cat];

            if (isMulti) {
              const parts = Array.isArray(partOrParts) ? partOrParts : [];
              return (
                <React.Fragment key={cat}>
                  {parts.map((part, idx) => (
                    <tr key={`${cat}-${idx}`} className="border-b border-gray-800 hover:bg-gray-800">
                      <td className="p-3">{idx === 0 ? CATEGORIES[cat].displayName : ''}</td>
                      <td className="p-3">{part.name}</td>
                      <td className="p-3">{part.vendor}</td>
                      <td className="p-3 text-green-400">৳{part.price.toLocaleString()}</td>
                      <td className="p-3">
                        <button onClick={() => onRemove(cat, idx)} className="text-red-500 hover:underline">Remove</button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-gray-800">
                     <td className="p-3 font-semibold">{parts.length === 0 ? CATEGORIES[cat].displayName: ''}</td>
                     <td colSpan="4" className={parts.length > 0 ? "text-right p-3": "p-3"}>
                        <button onClick={() => onOpenPicker(cat)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">+ Add {CATEGORIES[cat].displayName}</button>
                     </td>
                  </tr>
                </React.Fragment>
              );
            } else {
              const part = partOrParts;
              return (
                <tr key={cat} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="p-3 font-semibold">{CATEGORIES[cat].displayName}</td>
                  {part ? (
                    <>
                      <td className="p-3">{part.name}</td>
                      <td className="p-3">{part.vendor}</td>
                      <td className="p-3 text-green-400">৳{part.price.toLocaleString()}</td>
                      <td className="p-3">
                        <button onClick={() => onOpenPicker(cat)} className="text-yellow-400 hover:underline mr-4">Change</button>
                        <button onClick={() => onRemove(cat)} className="text-red-500 hover:underline">Remove</button>
                      </td>
                    </>
                  ) : (
                    <td colSpan="4" className="p-3">
                      <button onClick={() => onOpenPicker(cat)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Choose {CATEGORIES[cat].displayName}</button>
                    </td>
                  )}
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}```

**File: `client/src/components/CompatibilityAlert.jsx` (MODIFIED)**
```javascript
import React from 'react';

export default function CompatibilityAlert({ message }) {
  if (!message) return null;

  return (
    <div className="text-yellow-300 text-sm p-1">
      {message}
    </div>
  );
}
