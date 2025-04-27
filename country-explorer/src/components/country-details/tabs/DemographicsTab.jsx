import React from 'react';

export default function DemographicsTab({ country }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Demographics</h3>
      <div className="space-y-3 text-sm">
        <div>
          <h4 className="font-medium">Population</h4>
          <p className="text-xl font-bold">
            {country.population.toLocaleString()}
          </p>
        </div>

        {country.area && (
          <div>
            <h4 className="font-medium">Population Density</h4>
            <p>
              {(country.population / country.area).toFixed(2)} people/km²
            </p>
          </div>
        )}

        {country.car && (
          <div>
            <h4 className="font-medium">Driving Side</h4>
            <p>
              {country.car.side === "right" ? "Right side" : "Left side"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}