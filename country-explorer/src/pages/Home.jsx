import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAllCountries } from '../service/api';
import SearchFilter from '../components/SearchFilter';
import CountryCard from '../components/CountryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import InteractiveGlobe from '../components/InteractiveGlobe';
import InfoBanner from '../components/InfoBanner';
import { Alert, Tabs } from 'flowbite-react';
import { GlobeAltIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [viewMode, setViewMode] = useState('globe'); // 'globe' or 'list'

  useEffect(() => {
    const getCountries = async () => {
      try {
        const data = await fetchAllCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch countries:', err);
        setError('Failed to load countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getCountries();
  }, []);

  // Memoize filtered countries to prevent recalculation on theme changes
  const filteredCountries = useMemo(() => {
    return countries.filter(country => {
      const matchesSearch = country.name.common.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = regionFilter ? country.region === regionFilter : true;
      return matchesSearch && matchesRegion;
    });
  }, [countries, searchQuery, regionFilter]);

  // Memoize the setViewMode function to prevent recreation on re-renders
  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Alert color="failure">
          <span className="font-medium">{error}</span>
        </Alert>
      </div>
    );
  }

  return (
    <div className="page-container theme-transition">
      <h1 className="text-3xl font-bold mb-10 text-center theme-transition">Explore Countries Around the World</h1>
      <InfoBanner />
      <SearchFilter 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
      />
      
      <Tabs aria-label="View options tabs" style="underline" className="mt-8 mb-6">
        <Tabs.Item 
          active={viewMode === 'globe'} 
          title="Globe View" 
          icon={GlobeAltIcon}
          onClick={() => handleViewModeChange('globe')}
        >
          {filteredCountries.length > 0 ? (
            <InteractiveGlobe countries={filteredCountries} />
          ) : (
            <p className="text-center py-10 theme-transition">No countries match your search criteria.</p>
          )}
        </Tabs.Item>
        
        <Tabs.Item 
          active={viewMode === 'list'} 
          title="List View" 
          icon={ViewColumnsIcon}
          onClick={() => handleViewModeChange('list')}
        >
          {filteredCountries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
              {filteredCountries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
          ) : (
            <p className="text-center py-10 theme-transition">No countries match your search criteria.</p>
          )}
        </Tabs.Item>
      </Tabs>
    </div>
  );
}