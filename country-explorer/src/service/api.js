import axios from 'axios';

const API_BASE = 'https://restcountries.com/v3.1';

// Cache storage
const cache = new Map();
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper to get from cache or fetch data
const fetchWithCache = async (key, fetchFn) => {
  const now = Date.now();
  const cachedData = cache.get(key);
  
  // Return cached data if it exists and hasn't expired
  if (cachedData && now - cachedData.timestamp < CACHE_EXPIRATION) {
    return cachedData.data;
  }
  
  // Otherwise fetch fresh data
  const data = await fetchFn();
  
  // Store in cache with timestamp
  cache.set(key, { 
    data, 
    timestamp: now 
  });
  
  return data;
};

// Clear expired cache items
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_EXPIRATION) {
      cache.delete(key);
    }
  }
};

// Run cleanup every minute
setInterval(cleanupCache, 60 * 1000);

// Manually clear the cache (useful for testing or forcing fresh data)
export const clearCache = () => cache.clear();

export const fetchAllCountries = async () => {
  return fetchWithCache('all-countries', async () => {
    const response = await axios.get(`${API_BASE}/all`);
    return response.data;
  });
};

export const fetchCountryByName = async (name) => {
  return fetchWithCache(`country-name-${name}`, async () => {
    const response = await axios.get(`${API_BASE}/name/${name}`);
    return response.data;
  });
};

export const fetchCountriesByRegion = async (region) => {
  return fetchWithCache(`countries-region-${region}`, async () => {
    const response = await axios.get(`${API_BASE}/region/${region}`);
    return response.data;
  });
};

export const fetchCountryByCode = async (code) => {
  return fetchWithCache(`country-code-${code}`, async () => {
    const response = await axios.get(`${API_BASE}/alpha/${code}`);
    return response.data[0];
  });
};

// Advanced caching for prefetching popular countries
export const prefetchPopularCountries = async () => {
  const popularCodes = ['USA', 'GBR', 'CAN', 'DEU', 'JPN', 'AUS', 'FRA', 'IND'];
  return Promise.all(popularCodes.map(code => fetchCountryByCode(code)));
};

// Get cache statistics (useful for debugging)
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};