import React from 'react';
import { Tooltip } from 'flowbite-react';
import CountryMap from '../CountryMap';

export default function CountryFlagSection({ country }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-lg shadow-lg w-full">
        <img
          src={country.flags.svg || country.flags.png}
          alt={country.flags.alt || `${country.name.common} flag`}
          className="w-full h-64 sm:h-72 object-contain bg-gray-100 dark:bg-gray-700 p-2"
          loading="eager"
          data-testid="country-flag"
        />
        {country.coatOfArms?.svg && (
          <div className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md">
            <Tooltip content="National Coat of Arms">
              <img
                src={country.coatOfArms.svg}
                alt="Coat of Arms"
                className="h-14 w-14"
              />
            </Tooltip>
          </div>
        )}
      </div>

      <div className="h-72 min-h-[300px] rounded-lg shadow-lg overflow-hidden">
        <CountryMap
          lat={country.latlng?.[0]}
          lng={country.latlng?.[1]}
          name={country.name.common}
          data-testid="country-map"
        />
      </div>
    </div>
  );
}