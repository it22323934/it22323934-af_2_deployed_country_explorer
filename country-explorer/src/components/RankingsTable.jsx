import React from 'react';
import { Table, Badge, Button } from 'flowbite-react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';

export default function RankingsTable({ filteredCountries, activeMetric, setActiveMetric }) {
  // Process countries data for display
  const rankedCountries = [...filteredCountries]
    .sort((a, b) => {
      if (activeMetric === 'area') return (b.area || 0) - (a.area || 0);
      if (activeMetric === 'density') {
        const densityA = a.area ? a.population / a.area : 0;
        const densityB = b.area ? b.population / b.area : 0;
        return densityB - densityA;
      }
      return b.population - a.population;
    })
    .slice(0, 20);

  // Column definitions
  const columns = [
    { name: 'Rank', key: 'rank' },
    { name: 'Country', key: 'country' },
    { 
      name: 'Population', 
      key: 'population',
      sortable: true,
      onClick: () => setActiveMetric('population'),
      active: activeMetric === 'population'
    },
    { 
      name: 'Area (km²)', 
      key: 'area',
      sortable: true,
      onClick: () => setActiveMetric('area'),
      active: activeMetric === 'area'
    },
    { 
      name: 'Density (people/km²)', 
      key: 'density',
      sortable: true,
      onClick: () => setActiveMetric('density'),
      active: activeMetric === 'density'
    }
  ];

  return (
    <div className="overflow-x-auto">
      <Table hoverable striped>
        <caption className="sr-only">Country rankings by population, area and density</caption>
        <Table.Head>
          {columns.map((column) => (
            <Table.HeadCell key={column.key} className="dark:bg-gray-700">
              {column.sortable ? (
                <button 
                  className="flex items-center gap-1 font-medium w-full text-left"
                  onClick={column.onClick}
                  aria-pressed={column.active}
                >
                  {column.name}
                  {column.active && (
                    <Badge color="blue" className="ml-2 px-2 py-1">
                      <ArrowUpIcon className="h-3 w-3" />
                    </Badge>
                  )}
                </button>
              ) : (
                column.name
              )}
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body className="divide-y">
          {rankedCountries.map((country, index) => {
            const densityValue = country.area ? Math.round(country.population / country.area) : null;
            
            return (
              <Table.Row 
                key={country.cca3} 
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell className="px-6 py-4">
                  {index + 1}
                </Table.Cell>
                <Table.Cell className="px-6 py-4 font-medium">
                  <div className="flex items-center gap-2">
                    {country.flags?.svg && (
                      <img 
                        src={country.flags.svg} 
                        alt="" 
                        className="w-5 h-3 object-cover"
                      />
                    )}
                    {country.name.common}
                  </div>
                </Table.Cell>
                <Table.Cell 
                  className={activeMetric === 'population' ? 'font-medium text-blue-600 dark:text-blue-400' : ''}
                >
                  {country.population.toLocaleString()}
                </Table.Cell>
                <Table.Cell 
                  className={activeMetric === 'area' ? 'font-medium text-blue-600 dark:text-blue-400' : ''}
                >
                  {country.area ? country.area.toLocaleString() : 'N/A'}
                </Table.Cell>
                <Table.Cell 
                  className={activeMetric === 'density' ? 'font-medium text-blue-600 dark:text-blue-400' : ''}
                >
                  {densityValue ? densityValue.toLocaleString() : 'N/A'}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
}