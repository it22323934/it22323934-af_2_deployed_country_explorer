import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';

export default function BordersTab({ country }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Border Countries</h3>
      {country.borders && country.borders.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {country.borders.map((border) => (
            <Button
              key={border}
              as={Link}
              to={`/country/${border}`}
              color="light"
              size="xs"
              data-testid={`border-${border}`}
            >
              {border}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm">This country has no bordering countries.</p>
      )}
    </div>
  );
}