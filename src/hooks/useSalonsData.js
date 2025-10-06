import { useState, useEffect } from 'react';

// Cache for salon data
let cachedData = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Custom hook to fetch salons/sections data from API with caching
const useSalonsData = () => {
  const [data, setData] = useState(cachedData || []);
  const [loading, setLoading] = useState(!cachedData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalonsData = async () => {
      // Check if we have fresh cached data
      if (cachedData && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('https://enqlygo.com/api/salons');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          cachedData = result.data;
          cacheTime = Date.now();
          setData(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching salons data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonsData();
  }, []);

  return { data, loading, error };
};

export default useSalonsData;