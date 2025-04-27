import React from 'react';
import { Badge } from 'flowbite-react';

export default function CountryHeader({ country }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <h1 className="text-2xl font-bold" data-testid="country-name">
        {country.name.common}
      </h1>
      <Badge color="purple">{country.region}</Badge>
      {country.independent && (
        <Badge color="success" size="xs">Independent</Badge>
      )}
      {country.unMember && <Badge color="info" size="xs">UN Member</Badge>}
    </div>
  );
}