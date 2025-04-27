import React from 'react';

export default function CurrencyTab({ country }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Currencies</h3>
      {Object.entries(country.currencies || {}).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {Object.entries(country.currencies || {}).map(
            ([code, currency]) => (
              <div key={code} className="p-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-sm">
                <p className="font-bold">{currency.name}</p>
                <p>Code: {code} | Symbol: {currency.symbol || "N/A"}</p>
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-sm">No currency information available.</p>
      )}
    </div>
  );
}