import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import { useSelector } from 'react-redux';
import { Badge } from 'flowbite-react';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

export default function InteractiveGlobe({ countries }) {
  const globeRef = useRef();
  const hoverTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useSelector(state => state.theme);
  const darkMode = theme === 'dark';
  const [dimensions, setDimensions] = useState({
    height: 500,
    width: window.innerWidth > 768 ? 800 : window.innerWidth - 40
  });
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [globeReady, setGlobeReady] = useState(false);
  
  // Use more reasonable point radius for balance between clickability and appearance
  const pointRadius = 0.8;

  // Format the countries data for the globe
  const geoJsonData = useMemo(() => {
    if (!countries?.length) return { features: [] };
    return {
      features: countries.map(country => ({
        type: 'Feature',
        properties: {
          name: country.name.common,
          code: country.cca3,
          population: country.population,
          region: country.region,
          flag: country.flags?.svg,
          capital: country.capital?.[0] || 'N/A'
        },
        geometry: {
          type: 'Point',
          coordinates: country.latlng ? [country.latlng[1], country.latlng[0]] : [0, 0]
        }
      }))
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
          width: window.innerWidth > 768 ? 800 : window.innerWidth - 40
        });
      }, 250); // Debounce resize events
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set correct size
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Auto-rotate animation with smoother transitions
  useEffect(() => {
    if (globeRef.current && globeReady) {
      const globe = globeRef.current;
      
      // Configure auto-rotation with smoother speed
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.35; // Slower for smoother rotation
      
      // For better interaction, disable auto-rotation when user interacts
      const handleInteractionStart = () => {
        globe.controls().autoRotate = false;
      };
      
      const handleInteractionEnd = () => {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
          if (globe && !hoveredCountry) { // Only restart if not currently hovering
            globe.controls().autoRotate = true;
          }
        }, 5000); // Wait longer before restarting rotation
      };
      
      globe.controls().addEventListener('start', handleInteractionStart);
      globe.controls().addEventListener('end', handleInteractionEnd);
      
      return () => {
        if (globe && globe.controls()) {
          globe.controls().removeEventListener('start', handleInteractionStart);
          globe.controls().removeEventListener('end', handleInteractionEnd);
        }
      };
    }
  }, [globeReady, hoveredCountry]);
  
  // Handler when globe is ready
  const handleGlobeReady = useCallback(() => {
    setIsLoading(false);
    setGlobeReady(true);
  }, []);

  // Handle country click with proper error protection
  const handleCountryClick = useCallback((country) => {
    if (!country?.code) return;
    
    // Clear any pending hover timeouts to prevent interference
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Navigate after short delay to prevent accidental clicks
    setTimeout(() => {
      navigate(`/country/${country.code}`);
    }, 100);
  }, [navigate]);

  // Calculate point altitude based on population with more subtle effect
  const getPointAltitude = useCallback(point => {
    if (!point?.properties?.population) return 0.02;
    const population = point.properties.population;
    // More subtle altitude differences - looks better visually
    return Math.min(0.08, 0.02 + (Math.log10(population) / 150));
  }, []);

  // Debounced hover handler to prevent excessive globe movements
  const handlePointHover = useCallback(point => {
    // Clear any existing hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    if (point) {
      // Update hover state immediately for visual feedback
      setHoveredCountry({
        name: point.properties.name,
        region: point.properties.region,
        code: point.properties.code,
        flag: point.properties.flag,
        capital: point.properties.capital
      });
      
      // Change cursor to pointer for better UX
      document.body.style.cursor = 'pointer';
      
      // Only move the globe if hover persists for a brief moment
      hoverTimeoutRef.current = setTimeout(() => {
        if (globeRef.current) {
          // Smoother animation with longer duration
          globeRef.current.pointOfView({
            lat: point.geometry.coordinates[1],
            lng: point.geometry.coordinates[0],
            altitude: 1.8
          }, 800); // Longer animation time for smoother movement
        }
      }, 300); // Delay before moving the globe
    } else {
      setHoveredCountry(null);
      document.body.style.cursor = 'default';
    }
  }, []);

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
      
      <div 
        className={`text-center mb-4 transition-opacity transition-transform duration-300 ease-in-out ${
          hoveredCountry ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        style={{ pointerEvents: 'none' }} // Prevents tooltip from interfering with globe interactions
      >
        {hoveredCountry && (
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 px-5">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{hoveredCountry?.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              {hoveredCountry?.flag && (
                <img src={hoveredCountry.flag} alt="" className="w-6 h-4 object-cover" />
              )}
              <Badge color="blue">{hoveredCountry?.region}</Badge>
            </div>
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">
              Click to explore details
              <CursorArrowRaysIcon className="h-4 w-4 inline ml-1" />
            </p>
          </div>
        )}
      </div>
      
      <div className="relative">
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl={darkMode 
            ? "//unpkg.com/three-globe/example/img/earth-night.jpg"
            : "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          }
          backgroundColor={darkMode ? "#111827" : "#f9fafb"}
          atmosphereColor={darkMode ? "#334155" : "#60a5fa"}
          atmosphereAltitude={0.2} // Slightly less intense atmosphere
          waitForGlobeReady={true}
          labelsData={geoJsonData.features}
          labelLat={d => d.geometry.coordinates[1]}
          labelLng={d => d.geometry.coordinates[0]}
          labelText={d => d.properties.name}
          labelSize={0.8} // Smaller for less overlap
          labelDotRadius={0.4}
          labelColor={() => darkMode ? "#f3f4f6" : "#1f2937"}
          labelResolution={2}
          labelAltitude={0.01}
          labelIncludeDot={true}
          labelsTransitionDuration={500}
          pointsData={geoJsonData.features}
          pointLat={d => d.geometry.coordinates[1]}
          pointLng={d => d.geometry.coordinates[0]}
          pointAltitude={getPointAltitude}
          pointColor={d => hoveredCountry?.code === d.properties.code 
            ? "#ef4444" // Red for highlighted point
            : (darkMode ? "#f59e0b" : "#2563eb")
          }
          pointRadius={pointRadius}
          pointsMerge={false}
          pointsTransitionDuration={300}
          onGlobeReady={handleGlobeReady}
          onPointHover={handlePointHover}
          onPointClick={point => {
            if (point) handleCountryClick({ code: point.properties.code });
          }}
          onLabelClick={label => {
            if (label) handleCountryClick({ code: label.properties.code });
          }}
        />
        
        <div className="absolute bottom-5 left-5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <div className="text-xs text-gray-800 dark:text-gray-200 flex gap-1 items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
            <span>{countries?.length || 0} countries</span>
          </div>
        </div>
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