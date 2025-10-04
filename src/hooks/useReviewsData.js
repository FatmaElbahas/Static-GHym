import { useState, useEffect } from 'react';

// Custom hook to fetch reviews data from API
const useReviewsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://enqlygo.com/api/salons/reviews');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data && result.data.data) {
          setData(result.data.data);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching reviews data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviewsData();
  }, []);

  return { data, loading, error };
};

export default useReviewsData;

