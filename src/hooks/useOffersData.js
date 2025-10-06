import { useState, useEffect } from 'react';

// Base path for images
const IMAGE_BASE_PATH = 'https://enqlygo.com/storage/app/public';

// Cache for offers data
let cachedOffersData = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Custom hook to fetch offers data from API with caching
const useOffersData = () => {
  const [data, setData] = useState(cachedOffersData || []);
  const [loading, setLoading] = useState(!cachedOffersData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffersData = async () => {
      // Check if we have fresh cached data
      if (cachedOffersData && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        setData(cachedOffersData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch all services from all salons
        const response = await fetch('https://enqlygo.com/api/salons/services');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          // The API returns array of services directly
          const allServices = Array.isArray(result.data) ? result.data : [];
          cachedOffersData = allServices;
          cacheTime = Date.now();
          setData(allServices);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching offers data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersData();
  }, []);

  return { data, loading, error };
};

export default useOffersData;

