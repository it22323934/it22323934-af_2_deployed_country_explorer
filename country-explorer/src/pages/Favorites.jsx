import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Badge } from "flowbite-react";
import { HiTrash, HiOutlineGlobe } from "react-icons/hi";
import {
  removeFavorite,
  clearFavorites,
} from "../redux/favourites/favouriteSlice";
import { toast, ToastContainer } from "react-toastify";

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites } = useSelector(
    (state) => state.favorites || { favorites: [] }
  );
  const { currentUser } = useSelector((state) => state.user || {});

  // Redirect to sign in if not logged in
  React.useEffect(() => {
    if (!currentUser) {
      toast.info("Please sign in to view your favorites");
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);

  const handleRemoveFavorite = (code, name) => {
    dispatch(removeFavorite(code));
    toast.success(`${name} removed from favorites`);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all favorites?")) {
      dispatch(clearFavorites());
      toast.success("All favorites cleared");
    }
  };

  // Get the correct country code - check all possible properties
  const getCountryCode = (country) => {
    return country.cca3 || country.alpha3Code || country.code;
  };

  if (!currentUser) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <ToastContainer position="top-center" />
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white flex items-center">
            <HiOutlineGlobe className="mr-2 text-blue-500" />
            My Favorite Countries
          </h1>

          {favorites.length > 0 && (
            <Button color="failure" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              You haven't added any countries to your favorites yet.
            </p>
            <Button as={Link} to="/" gradientDuoTone="purpleToBlue">
              Explore Countries
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((country) => {
              // Get proper country code for navigation
              const countryCode = getCountryCode(country);

              return (
                <Card
                  key={countryCode || Math.random()}
                  className="overflow-hidden h-full"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={country.flag}
                      alt={`${country.name} flag`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge color="dark">{country.region}</Badge>
                    </div>
                  </div>

                  <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white truncate">
                    {country.name}
                  </h5>

                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-4">
                    <p>Capital: {country.capital || "N/A"}</p>
                    <p>Population: {country.population.toLocaleString()}</p>
                    <p>
                      Added: {new Date(country.addedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex justify-between mt-auto">
                    {countryCode ? (
                      <Button
                        size="sm"
                        as={Link}
                        to={`/country/${countryCode}`}
                        color="blue"
                      >
                        View Details
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        color="blue"
                        onClick={() =>
                          toast.info("Country details not available")
                        }
                      >
                        View Details
                      </Button>
                    )}

                    <Button
                      size="sm"
                      color="failure"
                      onClick={() =>
                        handleRemoveFavorite(
                          countryCode || country.alpha3Code,
                          country.name
                        )
                      }
                    >
                      <HiTrash className="mr-1" /> Remove
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
