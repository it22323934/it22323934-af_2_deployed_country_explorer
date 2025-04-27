import { Card, Badge } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, InformationCircleIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';

export default function CountryCard({ country }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // Load favorite state from localStorage on component mount
  useEffect(() => {
    const favCountries = JSON.parse(localStorage.getItem('favoriteCountries')) || [];
    setIsFavorite(favCountries.includes(country.cca3));
  }, [country.cca3]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const favCountries = JSON.parse(localStorage.getItem('favoriteCountries')) || [];
    let updatedFavorites;
    
    if (isFavorite) {
      updatedFavorites = favCountries.filter(code => code !== country.cca3);
    } else {
      updatedFavorites = [...favCountries, country.cca3];
    }
    
    localStorage.setItem('favoriteCountries', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = (e) => {
    // Only navigate if the click is not on the buttons
    const isButtonClick = e.target.closest('button');
    if (!isButtonClick) {
      navigate(`/country/${country.cca3}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 h-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md"
      data-testid={`country-card-${country.cca3}`}
    >
      <div className="relative h-40 overflow-hidden">
        {!imageError ? (
          <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <span className="text-gray-500">{country.name.common}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
        <div className="absolute bottom-2 left-2 right-2 text-white flex justify-between items-center">
          <div>
            <Badge color="purple" className="mb-1">{country.region}</Badge>
          </div>
          <button 
            onClick={toggleFavorite}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
            aria-label={isFavorite ? `Remove ${country.name.common} from favorites` : `Add ${country.name.common} to favorites`}
          >
            {isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h5 className="text-xl font-bold truncate">{country.name.common}</h5>
          <div className="relative">
            <button 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Show country details"
            >
              <InformationCircleIcon className="h-5 w-5 text-gray-500" />
            </button>
            {showTooltip && (
              <div className="absolute right-0 z-10 w-64 p-3 text-sm rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" role="tooltip">
                <p><span className="font-bold">Official Name:</span> {country.name.official}</p>
                <p><span className="font-bold">Alpha-3 Code:</span> {country.cca3}</p>
                {country.languages && (
                  <p><span className="font-bold">Languages:</span> {Object.values(country.languages).join(', ')}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {country.capital && (
              <Badge color="gray" className="flex items-center gap-1">
                <GlobeAltIcon className="h-3.5 w-3.5" />
                {country.capital[0]}
              </Badge>
            )}
          </div>
          
          <p className="font-normal">
            <span className="font-semibold">Population:</span> {country.population.toLocaleString()}
          </p>
          
          <div className="flex items-center justify-between mt-3 pt-3 border-t dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {country.subregion || country.region}
            </span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {country.cca3}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}