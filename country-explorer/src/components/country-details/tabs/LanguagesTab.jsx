import React from 'react';
import { Badge } from 'flowbite-react';

export default function LanguagesTab({ country }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Languages</h3>
      {Object.entries(country.languages || {}).length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {Object.entries(country.languages || {}).map(
            ([code, language]) => (
              <Badge key={code} color="info" size="xs">
                {language} ({code})
              </Badge>
            )
          )}
        </div>
      ) : (
        <p className="text-sm">No language information available.</p>
      )}
    </div>
  );
}