import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Badge, TextInput, Dropdown, Select } from "flowbite-react";
import { HiTrash, HiOutlineGlobe, HiSearch, HiFilter, HiSortAscending } from "react-icons/hi";
import { removeFavorite, clearFavorites } from "../redux/favourites/favouriteSlice";
import { toast, ToastContainer } from "react-toastify";

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites } = useSelector((state) => state.favorites || { favorites: [] });
  const { currentUser } = useSelector((state) => state.user || {});

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [sortOption, setSortOption] = useState("name");
  const [filteredFavorites, setFilteredFavorites] = useState([]);

  // Extract unique regions for filter dropdown
  const regions = [...new Set(favorites.map(country => country.region))].filter(Boolean);

  // Redirect to sign in if not logged in
  useEffect(() => {
    if (!currentUser) {
      toast.info("Please sign in to view your favorites");
      navigate("/sign-in");
    }
  }, [currentUser, navigate]);

  // Apply filters and sort whenever dependencies change
  useEffect(() => {
    let result = [...favorites];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(country => 
        country.name.toLowerCase().includes(lowerSearch) || 
        (country.capital && country.capital.toLowerCase().includes(lowerSearch))
      );
    }
    
    // Apply region filter
    if (selectedRegion && selectedRegion !== "all") {
      result = result.filter(country => country.region === selectedRegion);
    }
    
    // Apply sorting
    switch (sortOption) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "population":
        result.sort((a, b) => a.population - b.population);
        break;
      case "populationDesc":
        result.sort((a, b) => b.population - a.population);
        break;
      case "dateAdded":
        result.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
        break;
      case "dateAddedDesc":
        result.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        break;
      default:
        break;
    }
    
    setFilteredFavorites(result);
  }, [favorites, searchTerm, selectedRegion, sortOption]);

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

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRegion("all");
    setSortOption("name");
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
        <div className="flex justify-between items-center mb-6">
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
          <>
            {/* Search and Filter Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 mb-6 rounded-lg shadow flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <TextInput
                  id="search"
                  type="text"
                  placeholder="Search countries by name or capital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={HiSearch}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap md:flex-nowrap">
                <div className="w-full md:w-48">
                  <Select 
                    id="region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    <option value="all">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </Select>
                </div>
                
                <div className="w-full md:w-48">
                  <Select
                    id="sort"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="nameDesc">Name (Z-A)</option>
                    <option value="population">Population (Low-High)</option>
                    <option value="populationDesc">Population (High-Low)</option>
                    <option value="dateAdded">Date Added (Oldest)</option>
                    <option value="dateAddedDesc">Date Added (Newest)</option>
                  </Select>
                </div>
                
                {(searchTerm || selectedRegion !== "all" || sortOption !== "name") && (
                  <Button color="light" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
            
            {/* Results summary */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              <p>
                Showing {filteredFavorites.length} of {favorites.length} favorites
                {searchTerm && ` matching "${searchTerm}"`}
                {selectedRegion !== "all" && ` in ${selectedRegion}`}
              </p>
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                  No countries match your search criteria.
                </p>
                <Button color="light" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFavorites.map((country) => {
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
          </>
        )}
      </div>
    </div>
  );
}