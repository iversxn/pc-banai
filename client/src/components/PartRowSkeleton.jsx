import React from 'react';

export default function PartRowSkeleton({ category }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow animate-pulse border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-400 mb-2">{category}</h2>
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
