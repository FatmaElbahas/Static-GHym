import { useState, useEffect } from 'react';

// Custom hook to fetch most booked services from API
const useServicesData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicesData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://enqlygo.com/api/salons/most_booking_services');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          setData(result.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching services data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServicesData();
  }, []);

  return { data, loading, error };
};

export default useServicesData;

