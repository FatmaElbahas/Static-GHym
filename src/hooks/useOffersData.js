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
        // Fetch services from salon ID 2
        const response = await fetch('https://enqlygo.com/api/salons/2/services');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success' && result.data && result.data.services) {
          const salon = result.data;
          
          // Map services with images - use salon owner_photo as fallback
          const allServices = salon.services.map(service => {
            // Use service images if available, otherwise use salon owner_photo
            let serviceImages = [];
            
            if (service.images && service.images.length > 0) {
              serviceImages = service.images;
            } else if (salon.images && salon.images.length > 0) {
              serviceImages = salon.images;
            } else if (salon.owner_photo) {
              // Use owner_photo as fallback
              serviceImages = [{
                id: `salon_${salon.id}`,
                service_id: service.id,
                image: salon.owner_photo
              }];
            }
            
            return {
              ...service,
              salon_name: salon.salon_name,
              salon_id: salon.id,
              images: serviceImages
            };
          });
          
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

