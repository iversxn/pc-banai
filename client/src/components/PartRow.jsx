import React from 'react';
import { getBestVendor } from '../utils/compareVendors';
import vendorData from '../data/retailers.json';

const vendorColors = {
  TechlandBD: 'bg-blue-100 text-blue-800',
  StarTech: 'bg-red-100 text-red-800',
  Ultratech: 'bg-purple-100 text-purple-800',
  Skyland: 'bg-green-100 text-green-800',
};

export default function PartRow({ category, part, onSelect }) {
  const bestDeal = part ? getBestVendor(part.name, vendorData) : null;

  return (
    <div className="bg-white dark:bg-gray-900 shadow p-4 rounded-md border border-gray-200 dark:border-gray-700 transition hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {part?.vendor && (
            <img
              src={`/logos/${part.vendor.toLowerCase()}.png`}
              alt={part.vendor}
              className="w-8 h-8 rounded-sm object-contain border"
            />
          )}
          <div>
            <h2 className="text-lg font-semibold mb-1">{category}</h2>
            {part ? (
              <div className="text-sm space-y-1">
                <p className="font-medium text-gray-800 dark:text-gray-200">{part.name}</p>
                <p className="text-gray-600 dark:text-gray-400">৳{part.price}</p>
                <span
                  className={`inline-block text-xs px-2 py-1 rounded ${vendorColors[part.vendor] || 'bg-gray-100 text-gray-800'}`}
                >
                  {part.vendor}
                </span>

                {bestDeal && part.vendor !== bestDeal.vendor && (
                  <div className="mt-2 text-yellow-600 text-sm">
                    💡 Cheaper at {bestDeal.vendor}: ৳{bestDeal.price}
                    <button
                      onClick={() => onSelect(bestDeal)}
                      className="ml-3 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Switch
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No part selected</p>
            )}
          </div>
        </div>

        <button
          onClick={onSelect}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 mt-1 text-sm rounded hover:bg-blue-600 hover:text-white transition"
        >
          {part ? 'Change' : 'Add'}
        </button>
      </div>
    </div>
  );
}
