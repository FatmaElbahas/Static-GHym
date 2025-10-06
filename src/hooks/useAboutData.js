import { useState, useEffect } from 'react';

// Cache for about data
let cachedAboutData = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Custom hook to fetch about data from API with caching
const useAboutData = () => {
  const [data, setData] = useState(cachedAboutData);
  const [loading, setLoading] = useState(!cachedAboutData);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      // Check if we have fresh cached data
      if (cachedAboutData && cacheTime && Date.now() - cacheTime < CACHE_DURATION) {
        setData(cachedAboutData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('https://enqlygo.com/api/about');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          cachedAboutData = result.data;
          cacheTime = Date.now();
          setData(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return { data, loading, error };
};

export default useAboutData;

