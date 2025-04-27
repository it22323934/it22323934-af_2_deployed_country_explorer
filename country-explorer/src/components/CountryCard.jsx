import { Card, Badge, Toast } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartIcon, InformationCircleIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/favourites/favouriteSlice";
import { toast, ToastContainer } from "react-toastify";

export default function CountryCard({ country }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get current user and favorites from Redux
  const { currentUser } = useSelector((state) => state.user || {});
  const { favorites } = useSelector((state) => state.favorites || { favorites: [] });
  
  // Check if country is in favorites
  const isFavorite = favorites.some(
    (fav) =>
      fav.alpha3Code === country.cca3 ||
      fav.cca3 === country.cca3 ||
      fav.code === country.cca3
  );

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!currentUser) {
      toast.info("Please sign in to save favorites");
      navigate("/sign-in");
      return;
    }

    // Get consistent name and code values
    const countryName = country.name.common;
    const countryCode = country.cca3;

    if (isFavorite) {
      // Find the favorite item to get its exact stored ID
      const favoriteItem = favorites.find(
        (fav) =>
          fav.alpha3Code === country.cca3 ||
          fav.cca3 === country.cca3 ||
          fav.code === country.cca3
      );

      // Use the exact same identifier that was stored
      const idToRemove = favoriteItem
        ? favoriteItem.cca3 || favoriteItem.alpha3Code || favoriteItem.code
        : countryCode;

      dispatch(removeFavorite(idToRemove));
      toast.success(`${countryName} removed from favorites`);
    } else {
      dispatch(
        addFavorite({
          alpha3Code: countryCode,
          cca3: countryCode,
          code: countryCode,
          name: countryName,
          flag: country.flags?.svg || country.flags?.png,
          population: country.population,
          region: country.region,
          capital: Array.isArray(country.capital)
            ? country.capital[0]
            : country.capital,
          addedAt: new Date().toISOString(),
        })
      );
      toast.success(`${countryName} added to favorites`);
    }
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