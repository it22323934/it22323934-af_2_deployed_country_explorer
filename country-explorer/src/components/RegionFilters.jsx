import { Badge } from 'flowbite-react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

export default function RegionFilters({ regions, selectedRegion, setSelectedRegion }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 mt-2">
      <div className="flex items-center gap-2">
        <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
      </div>
      <div className="flex flex-wrap gap-2">
        {regions.map(region => (
          <Badge 
            key={region} 
            className="cursor-pointer"
            color={selectedRegion === region ? 'blue' : 'gray'}
            onClick={() => setSelectedRegion(region)}
          >
            {region}
          </Badge>
        ))}
      </div>
    </div>
  );
}