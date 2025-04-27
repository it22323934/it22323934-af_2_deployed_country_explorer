import React from 'react';

export default function CountryCardSkeleton() {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
      <div className="bg-gray-300 dark:bg-gray-700 h-40"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
}