import { TextInput, Select } from 'flowbite-react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function SearchFilter({ 
  searchQuery, 
  setSearchQuery, 
  regionFilter, 
  setRegionFilter 
}) {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  return (
    <div className="container mx-auto px-6 py-10 pt-20">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="w-full md:w-1/3">
          <TextInput
            type="text"
            icon={MagnifyingGlassIcon}
            placeholder="Search countries..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sizing="lg"
          />
        </div>
        <div className="w-full md:w-1/4">
          <Select
            icon={AdjustmentsHorizontalIcon}
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            sizing="lg"
          >
            <option value="">Filter by Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}