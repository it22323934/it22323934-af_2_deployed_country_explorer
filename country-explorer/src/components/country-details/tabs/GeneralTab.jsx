import React from 'react';

export default function GeneralTab({ country }) {
  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="mb-1"><span className="font-semibold">Official Name:</span> {country.name.official}</p>
          <p className="mb-1"><span className="font-semibold">Native Name:</span> {Object.values(country.name.nativeName || {})[0]?.common || "N/A"}</p>
          <p className="mb-1"><span className="font-semibold">Capital:</span> {country.capital?.[0] || "N/A"}</p>
          <p className="mb-1"><span className="font-semibold">Region:</span> {country.region}</p>
          <p className="mb-1"><span className="font-semibold">Sub Region:</span> {country.subregion || "N/A"}</p>
        </div>
        <div>
          <p className="mb-1"><span className="font-semibold">Population:</span> {country.population.toLocaleString()}</p>
          <p className="mb-1"><span className="font-semibold">Area:</span> {country.area?.toLocaleString()} km²</p>
          <p className="mb-1"><span className="font-semibold">Domain:</span> {country.tld?.[0] || "N/A"}</p>
          <p className="mb-1"><span className="font-semibold">Independent:</span> {country.independent ? "Yes" : "No"}</p>
          <p className="mb-1"><span className="font-semibold">UN Member:</span> {country.unMember ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}