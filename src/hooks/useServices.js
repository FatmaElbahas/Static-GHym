import { useState, useEffect, useCallback } from 'react';

/**
 * Hook مخصص لجلب وإدارة خدمات العيادات والأسعار
 */
export const useServices = (salonId) => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = useCallback(async () => {
    if (!salonId) {
      console.log('⚠️ No salon ID provided for services');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching services for salon ID:', salonId);
      const response = await fetch(`https://enqlygo.com/api/salons/${salonId}/services`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // إضافة timeout
        signal: AbortSignal.timeout(10000) // 10 ثواني
      });
      
      console.log('📊 Services API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Services API Response Data:', data);
        
        if (data.status === 'success' && data.data) {
          setServices(data.data);
          console.log('✅ Services loaded successfully:', data.data.length);
        } else {
          throw new Error(`Invalid services response format: ${JSON.stringify(data)}`);
        }
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error('❌ Services API error:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
        salonId: salonId
      });
      setError(err.message);
      
      // استخدام خدمات احتياطية
      console.log('🔄 Using fallback services');
      setServices([
        {
          id: 1,
          name: "استشارة طبية",
          price: 150,
          currency: "SAR",
          duration: 30
        },
        {
          id: 2,
          name: "فحص شامل",
          price: 300,
          currency: "SAR",
          duration: 60
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    if (salonId) {
      fetchServices();
    }
  }, [salonId, fetchServices]);

  // الحصول على أقل سعر
  const getMinPrice = useCallback(() => {
    if (!services.length) return null;
    
    const prices = services
      .filter(service => service.price && !isNaN(service.price))
      .map(service => parseFloat(service.price));
    
    if (prices.length === 0) return null;
    
    return Math.min(...prices);
  }, [services]);

  // الحصول على أعلى سعر
  const getMaxPrice = useCallback(() => {
    if (!services.length) return null;
    
    const prices = services
      .filter(service => service.price && !isNaN(service.price))
      .map(service => parseFloat(service.price));
    
    if (prices.length === 0) return null;
    
    return Math.max(...prices);
  }, [services]);

  // الحصول على متوسط السعر
  const getAveragePrice = useCallback(() => {
    if (!services.length) return null;
    
    const prices = services
      .filter(service => service.price && !isNaN(service.price))
      .map(service => parseFloat(service.price));
    
    if (prices.length === 0) return null;
    
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return Math.round(sum / prices.length);
  }, [services]);

  // تنسيق السعر للعرض
  const formatPrice = useCallback((price, currency = 'SAR') => {
    if (!price) return 'غير محدد';
    
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return 'غير محدد';
    
    return `${numPrice} ${currency}`;
  }, []);

  // الحصول على نطاق الأسعار للعرض
  const getPriceRange = useCallback(() => {
    const minPrice = getMinPrice();
    const maxPrice = getMaxPrice();
    
    if (!minPrice || !maxPrice) return null;
    
    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    }
    
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  }, [getMinPrice, getMaxPrice, formatPrice]);

  // استخراج السعر من بيانات العيادة مباشرة
  const extractPriceFromSalonData = useCallback((salonData) => {
    if (!salonData?.services || !Array.isArray(salonData.services)) {
      return null;
    }

    const prices = salonData.services
      .filter(service => service.price && !isNaN(service.price))
      .map(service => parseFloat(service.price));
    
    if (prices.length === 0) return null;
    
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `${minPrice} SAR`;
    }
    
    return `${minPrice} - ${maxPrice} SAR`;
  }, []);

  return {
    services,
    isLoading,
    error,
    getMinPrice,
    getMaxPrice,
    getAveragePrice,
    getPriceRange,
    formatPrice,
    extractPriceFromSalonData,
    refetch: fetchServices
  };
};
