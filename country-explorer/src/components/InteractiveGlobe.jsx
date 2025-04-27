import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import { useSelector } from 'react-redux';
import { Badge } from 'flowbite-react';

export default function InteractiveGlobe({ countries }) {
  const globeRef = useRef();
  const tooltipRef = useRef(null);
  const globeContainerRef = useRef(null);
  const autoRotationTimeoutRef = useRef(null);
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
  const [isInteracting, setIsInteracting] = useState(false);

  const pointRadius = 1.0; // Slightly larger for better clickability

  // Format the countries data for the globe
  const geoJsonData = useMemo(() => {
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
  
  // Auto-rotation control
  const startAutoRotation = useCallback(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5; // Slower rotation for better visibility
      setIsInteracting(false);
    }
  }, []);
  
  const stopAutoRotation = useCallback(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = false;
      setIsInteracting(true);
      
      // Clear any existing timeout
      if (autoRotationTimeoutRef.current) {
        clearTimeout(autoRotationTimeoutRef.current);
      }
      
      // Set a timeout to restart rotation after inactivity
      autoRotationTimeoutRef.current = setTimeout(() => {
        if (!hoveredCountry) {
          startAutoRotation();
        }
      }, 5000); // 5 seconds of inactivity before restarting rotation
    }
  }, [hoveredCountry, startAutoRotation]);

  // Globe ready handler
  const handleGlobeReady = useCallback(() => {
    setIsLoading(false);
    
    if (globeRef.current) {
      // Configure controls for smoother interaction
      globeRef.current.controls().enableDamping = true;
      globeRef.current.controls().dampingFactor = 0.2;
      globeRef.current.controls().rotateSpeed = 0.7;
      
      // Start auto-rotation
      startAutoRotation();
      
      // Add interaction listeners
      globeRef.current.controls().addEventListener('start', stopAutoRotation);
    }
  }, [startAutoRotation, stopAutoRotation]);

  // Cleanup event listeners and timeouts
  useEffect(() => {
    return () => {
      if (autoRotationTimeoutRef.current) {
        clearTimeout(autoRotationTimeoutRef.current);
      }
      
      if (globeRef.current && globeRef.current.controls()) {
        globeRef.current.controls().removeEventListener('start', stopAutoRotation);
      }
    };
  }, [stopAutoRotation]);

  // Handle country click
  const handleCountryClick = useCallback((country) => {
    if (!country?.code) return;
    navigate(`/country/${country.code}`);
  }, [navigate]);

  // Handle hover events
  const handlePointHover = useCallback((point) => {
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
      
      // Stop rotation when hovering over a point
      stopAutoRotation();
    } else {
      setHoveredCountry(null);
      document.body.style.cursor = 'default';
    }
  }, [stopAutoRotation]);

  // Track cursor position
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
        {/* Country counter badge */}
        <div className="absolute top-4 left-4 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full py-1 px-3 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {countries?.length || 0} countries
            </span>
          </div>
        </div>
        
        {/* Auto-rotation indicator */}
        {!isInteracting && (
          <div className="absolute top-4 right-4 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full py-1 px-3 shadow-md border border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-300 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Auto-rotating
            </span>
          </div>
        )}

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