import { useState, useEffect } from 'react';

// Custom hook to fetch salons/sections data from API
const useSalonsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalonsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://enqlygo.com/api/salons');
        
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