import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { fetchAllCountries } from '../service/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Alert, Tabs, Card } from 'flowbite-react';
import { ChartBarIcon, GlobeAltIcon, UsersIcon } from '@heroicons/react/24/outline';

// Import new components
import RegionFilters from '../components/statistics/RegionFilters';
import PopulationChart from '../components/statistics/PopulationChart';
import RegionChart from '../components/statistics/RegionChart';
import RankingsTable from '../components/statistics/RankingsTable';

export default function Statistics() {
  // Get theme from Redux store
  const { theme } = useSelector(state => state.theme);
  const isDarkMode = theme === 'dark';
  
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMetric, setActiveMetric] = useState('population');
  const [selectedRegion, setSelectedRegion] = useState('All');
  
  const regions = useMemo(() => {
    if (!countries.length) return ['All'];
    const uniqueRegions = [...new Set(countries.map(country => country.region))].filter(Boolean);
    return ['All', ...uniqueRegions.sort()];
  }, [countries]);

  useEffect(() => {
    const getCountries = async () => {
      try {
        const data = await fetchAllCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError('Failed to load countries data.');
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };

    getCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    if (selectedRegion === 'All') return countries;
    return countries.filter(country => country.region === selectedRegion);
  }, [countries, selectedRegion]);

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
    <div className="page-container pt-16 theme-transition">
      <h1 className="section-title text-center">World Statistics</h1>
      
      <RegionFilters 
        regions={regions} 
        selectedRegion={selectedRegion} 
        setSelectedRegion={setSelectedRegion} 
      />
      
      <Tabs aria-label="Statistics tabs">
        <Tabs.Item title="Population" icon={UsersIcon} active>
          <Card className="mt-4">
            <PopulationChart 
              filteredCountries={filteredCountries} 
              activeMetric={activeMetric} 
              setActiveMetric={setActiveMetric}
              isDarkMode={isDarkMode} 
            />
          </Card>
        </Tabs.Item>
        
        <Tabs.Item title="Regions" icon={GlobeAltIcon}>
          <Card className="mt-4">
            <RegionChart 
              filteredCountries={filteredCountries} 
              isDarkMode={isDarkMode} 
            />
          </Card>
        </Tabs.Item>
        
        <Tabs.Item title="Rankings" icon={ChartBarIcon}>
          <Card className="mt-4">
            <RankingsTable 
              filteredCountries={filteredCountries}
              activeMetric={activeMetric}
              setActiveMetric={setActiveMetric}
              isDarkMode={isDarkMode}
            />
          </Card>
        </Tabs.Item>
      </Tabs>
    </div>
  );
}