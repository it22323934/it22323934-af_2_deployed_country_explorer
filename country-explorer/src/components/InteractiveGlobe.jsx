import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import { useSelector } from 'react-redux';
import { Badge } from 'flowbite-react';

export default function InteractiveGlobe({ countries }) {
  const globeRef = useRef();
  const tooltipRef = useRef(null);
  const globeContainerRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const darkMode = theme === 'dark';
  
  const [dimensions, setDimensions] = useState({
    height: 500,
    width: window.innerWidth > 768 ? 800 : window.innerWidth - 40,
  });
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const pointRadius = 1.0; // Slightly larger for better clickability

  // Format the countries data for the globe
  const geoJsonData = useMemo(() => {
    // Same as your existing code
    if (!countries?.length) return { features: [] };
    return {
      features: countries.map((country) => ({
        type: 'Feature',
        properties: {
          name: country.name.common,
          code: country.cca3,
          population: country.population,
          region: country.region,
          flag: country.flags?.svg,
          capital: country.capital?.[0] || 'N/A',
        },
        geometry: {
          type: 'Point',
          coordinates: country.latlng ? [country.latlng[1], country.latlng[0]] : [0, 0],
        },
      })),
    };
  }, [countries]);

  // Handle window resize with debounce
  useEffect(() => {
    // Same as your existing code
    let resizeTimer;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setDimensions({
          height: window.innerWidth > 768 ? 500 : 350,
          width: window.innerWidth > 768 ? 800 : window.innerWidth - 40,
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Globe ready handler
  const handleGlobeReady = useCallback(() => {
    // Same as your existing code
    setIsLoading(false);
    
    if (globeRef.current) {
      globeRef.current.controls().enableDamping = true;
      globeRef.current.controls().dampingFactor = 0.2;
      globeRef.current.controls().rotateSpeed = 0.7;
    }
  }, []);

  // Handle country click
  const handleCountryClick = useCallback((country) => {
    // Same as your existing code
    if (!country?.code) return;
    navigate(`/country/${country.code}`);
  }, [navigate]);

  // Handle hover events
  const handlePointHover = useCallback((point) => {
    // Same as your existing code
    if (point) {
      setHoveredCountry({
        name: point.properties.name,
        region: point.properties.region,
        code: point.properties.code,
        flag: point.properties.flag,
        capital: point.properties.capital,
        population: point.properties.population,
      });
      document.body.style.cursor = 'pointer';
    } else {
      setHoveredCountry(null);
      document.body.style.cursor = 'default';
    }
  }, []);

  // Much simpler way to track cursor position
  const handleMouseMove = useCallback((event) => {
    setCursorPosition({ x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    // Track mouse position globally
    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div className="flex flex-col items-center justify-center py-6 relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-gray-800/50 z-10 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Loading globe...</p>
          </div>
        </div>
      )}

      {/* Simplified tooltip that follows cursor */}
      {hoveredCountry && (
        <div
          ref={tooltipRef}
          className="fixed bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 px-4 text-sm border border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
          style={{
            top: `${cursorPosition.y + 15}px`,
            left: `${cursorPosition.x + 15}px`,
            pointerEvents: 'none',
            zIndex: 1000,
            maxWidth: '250px'
          }}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{hoveredCountry.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {hoveredCountry.flag && (
              <img src={hoveredCountry.flag} alt="" className="w-6 h-4 object-cover" />
            )}
            <Badge color="blue">{hoveredCountry.region}</Badge>
          </div>
          <div className="text-gray-500 dark:text-gray-400 mt-1 space-y-1">
            <p>Capital: {hoveredCountry.capital}</p>
            <p>Population: {hoveredCountry.population?.toLocaleString()}</p>
          </div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">Click to explore details</div>
        </div>
      )}

      <div 
        ref={globeContainerRef} 
        className="relative rounded-lg overflow-hidden"
      >
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={
            darkMode
              ? '//unpkg.com/three-globe/example/img/earth-night.jpg'
              : '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
          }
          backgroundColor={darkMode ? '#111827' : '#f9fafb'}
          atmosphereColor={darkMode ? '#334155' : '#60a5fa'}
          atmosphereAltitude={0.2}
          waitForGlobeReady={true}
          labelsData={geoJsonData.features}
          labelLat={(d) => d.geometry.coordinates[1]}
          labelLng={(d) => d.geometry.coordinates[0]}
          labelText={(d) => d.properties.name}
          labelSize={0.8}
          labelDotRadius={0.4}
          labelColor={() => (darkMode ? '#f3f4f6' : '#1f2937')}
          labelResolution={2}
          labelAltitude={0.01}
          labelIncludeDot={true}
          labelsTransitionDuration={500}
          pointsData={geoJsonData.features}
          pointLat={(d) => d.geometry.coordinates[1]}
          pointLng={(d) => d.geometry.coordinates[0]}
          pointAltitude={() => 0.02} // Fixed altitude for stability
          pointColor={(d) =>
            hoveredCountry?.code === d.properties.code
              ? '#ef4444'
              : darkMode
              ? '#f59e0b'
              : '#2563eb'
          }
          pointRadius={pointRadius}
          pointsMerge={false}
          pointsTransitionDuration={300}
          onGlobeReady={handleGlobeReady}
          onPointHover={handlePointHover}
          onPointClick={(point) => {
            if (point) handleCountryClick({ code: point.properties.code });
          }}
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg text-gray-900 dark:text-white font-medium">Click on a country to explore details</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Drag to rotate | Scroll to zoom | Hover to view country info
        </p>
      </div>
    </div>
  );
}