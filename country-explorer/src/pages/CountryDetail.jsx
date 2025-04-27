import React, { useState, useEffect, useTransition } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchCountryByCode, clearCache } from "../service/api";
import LoadingSpinner from "../components/LoadingSpinner";
import CountryError from "../components/country-details/CountryError";
import CountryNavigation from "../components/country-details/CountryNavigation";
import CountryFlagSection from "../components/country-details/CountryFlagSection";
import CountryInfoSection from "../components/country-details/CountryInfoSection";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../redux/favourites/favouriteSlice";
import { toast, ToastContainer } from "react-toastify";
import { Button } from "flowbite-react";
import { HiHeart } from "react-icons/hi";

export default function CountryDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useSelector((state) => state.user || {});
  const { favorites } = useSelector(
    (state) => state.favorites || { favorites: [] }
  );
  // Check if current country is favorited
  const isFavorite =
    country &&
    favorites.some(
      (fav) =>
        fav.alpha3Code === country.alpha3Code ||
        fav.alpha3Code === country.cca3 ||
        fav.cca3 === country.cca3 ||
        fav.cca3 === country.alpha3Code
    );

  // Fetch country data with cache support
  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        setLoading(true);
        const data = await fetchCountryByCode(code);

        startTransition(() => {
          setCountry(data);
          setError(null);
        });
      } catch (err) {
        console.error("Error fetching country:", err);
        setError(`Failed to fetch details for country code: ${code}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [code]);

  // Handle manual refresh with cache clearing
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      clearCache();
      const data = await fetchCountryByCode(code);
      setCountry(data);
      setError(null);
    } catch (err) {
      setError("Failed to refresh country data.");
    } finally {
      setRefreshing(false);
    }
  };

  // Handle invalid country codes by redirecting
  useEffect(() => {
    if (error && !loading) {
      const timer = setTimeout(() => {
        navigate("/", {
          state: { error: `Country with code "${code}" not found.` },
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, loading, navigate, code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <CountryError error={error} navigate={navigate} />;
  }
  const handleToggleFavorite = () => {
    if (!currentUser) {
      toast.info("Please sign in to save favorites");
      navigate("/sign-in");
      return;
    }
    const countryName = country.name.common || country.name;
    const countryCode = country.cca3 || country.alpha3Code;
    if (isFavorite) {
      dispatch(removeFavorite(country.alpha3Code));
      toast.success(`${countryName} removed from favorites`);
    } else {
      dispatch(
        addFavorite({
          alpha3Code: countryCode,
          cca3: countryCode,
          name: countryName,
          flag: country.flags?.svg || country.flags?.png,
          population: country.population,
          region: country.region,
          capital: country.capital,
          addedAt: new Date().toISOString(),
        })
      );
      toast.success(`${countryName} added to favorites`);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-5"
      data-testid="country-detail-page"
    >
      <ToastContainer position="top-center" />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          {country && (
            <Button
              color={isFavorite ? "failure" : "gray"}
              onClick={handleToggleFavorite}
              className="flex items-center gap-2"
            >
              <HiHeart
                className={`h-5 w-5 ${
                  isFavorite ? "text-white fill-current" : "text-red-500"
                }`}
                fill={isFavorite ? "currentColor" : "none"}
              />
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
          )}
        </div>

        <CountryNavigation
          handleRefresh={handleRefresh}
          refreshing={refreshing}
        />

        {country && (
          <div className="grid md:grid-cols-2 gap-6">
            <CountryFlagSection country={country} />
            <CountryInfoSection country={country} />
          </div>
        )}
      </div>
    </div>
  );
}
