import { useState, useEffect, useCallback } from 'react';

/**
 * Hook مخصص لجلب وإدارة عناوين العيادات
 */
export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching addresses from API...');
      const response = await fetch('https://enqlygo.com/api/salons/addresses', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // إضافة timeout
        signal: AbortSignal.timeout(10000) // 10 ثواني
      });
      
      console.log('📊 Addresses API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Addresses API Response Data:', data);
        
        if (data.status === 'success' && data.data) {
          setAddresses(data.data);
          console.log('✅ Addresses loaded successfully:', data.data.length);
        } else {
          throw new Error(`Invalid addresses response format: ${JSON.stringify(data)}`);
        }
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
    } catch (err) {
      console.error('❌ Addresses API error:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      });
      setError(err.message);
      
      // استخدام عناوين احتياطية
      console.log('🔄 Using fallback addresses');
      setAddresses([
        "شارع البحر - المدينة المنورة",
        "الفيوم - الممشى السياحي",
        "Egypt",
        "القاهرة - مصر الجديدة"
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // استخراج المدينة من العنوان
  const getCityFromAddress = useCallback((address) => {
    if (!address) return "غير محدد";
    
    // قائمة المدن المعروفة
    const cities = [
      "الرياض", "جدة", "الدمام", "المدينة المنورة", "الطائف", 
      "الخبر", "الظهران", "القاهرة", "الفيوم", "مصر الجديدة"
    ];
    
    for (const city of cities) {
      if (address.includes(city)) {
        return city;
      }
    }
    
    return "غير محدد";
  }, []);

  // البحث عن عنوان مطابق
  const findMatchingAddress = useCallback((searchAddress) => {
    if (!searchAddress || !addresses.length) return null;
    
    return addresses.find(addr => 
      addr.toLowerCase().includes(searchAddress.toLowerCase()) ||
      searchAddress.toLowerCase().includes(addr.toLowerCase())
    );
  }, [addresses]);

  return {
    addresses,
    isLoading,
    error,
    getCityFromAddress,
    findMatchingAddress,
    refetch: fetchAddresses
  };
};
