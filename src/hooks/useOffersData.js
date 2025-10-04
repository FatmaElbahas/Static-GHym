import { useState, useEffect } from 'react';

// Base path for images
const IMAGE_BASE_PATH = 'https://enqlygo.com/storage/app/public';

// Custom hook to fetch offers data from API
const useOffersData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffersData = async () => {
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

