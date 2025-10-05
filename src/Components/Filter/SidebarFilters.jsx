import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faHospital,
  faStethoscope,
  faUserMd,
  faStar,
  faCalendarAlt,
  faMoneyBillWave,
  faFilter,
  faSpinner,
  faExclamationTriangle,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useFilter } from "../../context/FilterContext";
import SARIcon from "../SARIcon/SARIcon";

export default function SidebarFilters() {
  const { filters, updateFilters, resetFilters, isFiltered, allData } = useFilter();
  
  // دالة للحصول على اسم التخصص من الـ ID
  const getCategoryNameById = (id, lang = 'ar') => {
    // البحث في التخصصات المحملة من API
    const category = categories.find(cat => cat.id === parseInt(id));
    if (category) {
      return lang === 'ar' ? category.title_ar : category.title_en;
    }
    
    // fallback للتخصصات الافتراضية
    const categoryNames = {
      1: { ar: 'علاج الأسنان', en: 'Dental Treatment' },
      2: { ar: 'تقويم الأسنان', en: 'Orthodontics' },
      3: { ar: 'طب الأطفال', en: 'Pediatrics' },
      4: { ar: 'طب العيون', en: 'Ophthalmology' },
      5: { ar: 'الجلدية', en: 'Dermatology' },
      6: { ar: 'القلب والأوعية الدموية', en: 'Cardiology' },
      7: { ar: 'العظام', en: 'Orthopedics' },
      8: { ar: 'النساء والولادة', en: 'Gynecology' },
      9: { ar: 'الأنف والأذن والحنجرة', en: 'ENT' },
      10: { ar: 'الطب النفسي', en: 'Psychiatry' }
    };
    
    return categoryNames[id]?.[lang] || `التخصص ${id}`;
  };
  
  // دالة لاستخراج بيانات الفلتر من الـ FilterContext
  const extractFilterDataFromContext = (data) => {
    console.log('🔄 Extracting filter data from context:', data.length, 'items');
    
    // استخراج المدن
    const extractedCities = data.map(item => {
      const address = item.salon_address || item.address || '';
      if (typeof address === 'string' && address.trim()) {
        // قائمة المدن المعروفة للبحث (عربي + إنجليزي)
        const cities = [
          'الرياض', 'Riyadh',
          'جدة', 'Jeddah', 
          'الدمام', 'Dammam',
          'المدينة المنورة', 'Medina',
          'الطائف', 'Taif',
          'الخبر', 'Khobar',
          'الظهران', 'Dhahran',
          'القاهرة', 'Cairo',
          'الفيوم', 'Fayoum',
          'مصر الجديدة', 'New Cairo', 'Heliopolis',
          'الإسكندرية', 'Alexandria'
        ];
        
        // البحث عن المدينة في العنوان
        for (const city of cities) {
          if (address.includes(city)) {
            return city;
          }
        }
        
        // إذا لم توجد مدينة معروفة، نأخذ أول جزء من العنوان
        if (address.includes(' - ')) {
          return address.split(' - ')[0].trim();
        } else if (address.includes('،')) {
          return address.split('،')[0].trim();
        } else if (address.includes(',')) {
          return address.split(',')[0].trim();
        } else {
          return address.trim();
        }
      }
      return null;
    }).filter(Boolean);
    
    const uniqueCities = [...new Set(extractedCities)];
    setCities(uniqueCities);
    setCitiesLoading(false);
    
    // استخراج التخصصات
    const categoryIds = new Set();
    data.forEach(item => {
      if (item.salon_categories) {
        if (typeof item.salon_categories === 'string') {
          item.salon_categories.split(',').forEach(id => {
            if (id.trim()) categoryIds.add(parseInt(id.trim()));
          });
        } else if (Array.isArray(item.salon_categories)) {
          item.salon_categories.forEach(id => {
            if (id) categoryIds.add(parseInt(id));
          });
        } else if (typeof item.salon_categories === 'number') {
          categoryIds.add(item.salon_categories);
        }
      }
    });
    
    // إنشاء قائمة التخصصات مع الأسماء من API
    const extractedCategories = Array.from(categoryIds).map(id => ({
      id: id,
      title_ar: getCategoryNameById(id),
      title_en: getCategoryNameById(id, 'en')
    }));
    
    console.log('🏷️ Extracted categories from context:', extractedCategories);
    
    // تحديث التخصصات المحملة من API مع التخصصات الموجودة في البيانات
    setCategories(prevCategories => {
      const combined = [...prevCategories];
      extractedCategories.forEach(extracted => {
        if (!combined.find(cat => cat.id === extracted.id)) {
          combined.push(extracted);
        }
      });
      return combined;
    });
    
    setCategoriesLoading(false);
    
    // استخراج أسماء الصالونات
    const salonNames = data.map(item => item.salon_name || item.name).filter(Boolean);
    setSalons(salonNames);
    setSalonsLoading(false);
    
    // استخراج أسماء الأطباء
    const uniqueDoctors = [...new Set(data.map(item => item.owner_name).filter(Boolean))];
    setDoctors(uniqueDoctors);
    setDoctorsLoading(false);
    
    // استخراج التقييمات
    const ratings = data
      .map(item => item.rating)
      .filter(rating => rating && rating > 0)
      .sort((a, b) => b - a);
    
    const uniqueRatings = [...new Set(ratings)];
    setAvailableRatings(uniqueRatings);
    setRatingsLoading(false);
    
    console.log('✅ Filter data extracted from context:', {
      cities: uniqueCities.length,
      categories: categories.length,
      salons: salonNames.length,
      doctors: uniqueDoctors.length,
      ratings: uniqueRatings.length
    });
  };
  
  // دالة للـ fallback APIs
  const loadFallbackData = async (controller) => {
    try {
      console.log('🔄 Loading fallback data from separate APIs...');
      
        const endpoints = [
          'https://enqlygo.com/api/salons/addresses',
          'https://enqlygo.com/api/salons/categories',
          'https://enqlygo.com/api/salons'
        ];
        
        const responses = await Promise.allSettled(
          endpoints.map(url => fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
          signal: controller.signal
          }))
        );
        
        const [addressesRes, categoriesRes, salonsRes] = responses;
      
      // تهيئة المتغيرات للـ fallback
      let uniqueCities = [];
      let processedCategories = [];
      let processedSalons = [];
      let uniqueDoctors = [];
      let uniqueRatings = [];
        
        // معالجة العناوين/المدن
        if (addressesRes.status === 'fulfilled' && addressesRes.value.ok) {
          const addressesData = await addressesRes.value.json();
          const addressesArray = addressesData.data || addressesData || [];
          
          const extractedCities = addressesArray.map(addr => {
            const address = addr.city_name || addr.city || addr.address || addr;
            
            if (typeof address === 'string') {
              if (address.includes(' - ')) {
                const parts = address.split(' - ');
                return parts[0].trim();
              }
              else if (address.includes('،')) {
                const parts = address.split('،');
                return parts[0].trim();
              }
              else if (address.includes(',')) {
                const parts = address.split(',');
                return parts[0].trim();
              }
              else {
                return address.trim();
              }
            }
            return address;
          }).filter(Boolean);
          
        uniqueCities = [...new Set(extractedCities)];
          setCities(uniqueCities);
        setCitiesLoading(false);
        console.log('✅ Cities from fallback API:', uniqueCities);
        } else {
          setCities([]);
        setCitiesLoading(false);
        console.warn('⚠️ Cities fallback API failed');
        }
        
        // معالجة الفئات
        if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
          const categoriesData = await categoriesRes.value.json();
        processedCategories = categoriesData.data || categoriesData || [];
          setCategories(processedCategories);
        setCategoriesLoading(false);
        console.log('✅ Categories from fallback API:', processedCategories.length);
        } else {
          setCategories([]);
        setCategoriesLoading(false);
        console.warn('⚠️ Categories fallback API failed');
        }
        
        // معالجة الصالونات
        if (salonsRes.status === 'fulfilled' && salonsRes.value.ok) {
          const salonsData = await salonsRes.value.json();
        processedSalons = salonsData.data || salonsData || [];
          
          setSalons(processedSalons.map(salon => salon.salon_name || salon.name).filter(Boolean));
        setSalonsLoading(false);
          
        uniqueDoctors = [...new Set(processedSalons.map(salon => salon.owner_name).filter(Boolean))];
          setDoctors(uniqueDoctors);
        setDoctorsLoading(false);
          
          const ratings = processedSalons
            .map(salon => salon.rating)
            .filter(rating => rating && rating > 0)
          .sort((a, b) => b - a);
          
        uniqueRatings = [...new Set(ratings)];
          setAvailableRatings(uniqueRatings);
        setRatingsLoading(false);
        
        console.log('✅ Salons from fallback API:', processedSalons.length);
        
        // حفظ بيانات الـ fallback في الـ cache
        const fallbackCacheData = {
          cities: uniqueCities || [],
          categories: processedCategories || [],
          salons: processedSalons.map(salon => salon.salon_name || salon.name).filter(Boolean),
          doctors: uniqueDoctors || [],
          ratings: uniqueRatings || []
        };
        
        try {
          localStorage.setItem('filter_data_cache', JSON.stringify(fallbackCacheData));
          localStorage.setItem('filter_data_cache_timestamp', Date.now().toString());
          console.log('💾 Fallback data cached successfully');
        } catch (cacheError) {
          console.warn('⚠️ Failed to cache fallback data:', cacheError);
        }
        
        setApiStatus('success');
        console.log('🎉 Fallback data loaded successfully!');
        
        } else {
          setSalons([]);
          setAvailableRatings([]);
        setSalonsLoading(false);
        setDoctorsLoading(false);
        setRatingsLoading(false);
        console.warn('⚠️ Salons fallback API failed');
      }
      
    } catch (error) {
      console.error('❌ Fallback APIs error:', error);
      setCities([]);
      setCategories([]);
      setSalons([]);
      setDoctors([]);
      setAvailableRatings([]);
      
      setCitiesLoading(false);
      setCategoriesLoading(false);
      setSalonsLoading(false);
      setDoctorsLoading(false);
      setRatingsLoading(false);
      
      // إيقاف التحميل العام
      setIsLoading(false);
      setApiStatus('error');
    }
  };

  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [salons, setSalons] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableRatings, setAvailableRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('loading');
  
  // Loading states لكل فلتر منفصل
  const [citiesLoading, setCitiesLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [salonsLoading, setSalonsLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  
  // جلب التخصصات من API
  const fetchCategories = useCallback(async () => {
    try {
      console.log('🔄 Fetching categories from API...');
      const response = await fetch('https://enqlygo.com/api/salons/categories');
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setCategories(data.data);
          console.log('✅ Categories loaded from API:', data.data);
        } else {
          console.log('⚠️ Categories API returned no data');
          setCategories([]);
        }
      } else {
        console.log('❌ Categories API failed with status:', response.status);
        setCategories([]);
      }
    } catch (err) {
      console.error('❌ Categories API error:', err);
      setCategories([]);
    }
  }, []);

  // مراقبة تغييرات البيانات في الـ FilterContext
  useEffect(() => {
    if (allData && allData.length > 0) {
      console.log('📊 Data changed in FilterContext, updating sidebar filters:', allData.length, 'items');
      extractFilterDataFromContext(allData);
    }
  }, [allData]);

  // جلب التخصصات عند تحميل المكون
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // جلب البيانات من APIs - محسن للأداء
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 Starting filter data loading...');
        setIsLoading(true);
        setApiStatus('loading');
        
        // تحسين: استخدام cache للبيانات المتكررة
        const cacheKey = 'filter_data_cache';
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
        const now = Date.now();
        const cacheExpiry = 5 * 60 * 1000; // 5 دقائق
        
        // التحقق من صحة الـ cache
        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < cacheExpiry) {
          console.log('📦 Using cached filter data');
          const parsedData = JSON.parse(cachedData);
          setCities(parsedData.cities || []);
          setCategories(parsedData.categories || []);
          setSalons(parsedData.salons || []);
          setDoctors(parsedData.doctors || []);
          setAvailableRatings(parsedData.ratings || []);
          
          // إيقاف جميع loading states
          setCitiesLoading(false);
          setCategoriesLoading(false);
          setSalonsLoading(false);
          setDoctorsLoading(false);
          setRatingsLoading(false);
          setApiStatus('success');
          setIsLoading(false);
          return;
        }
        
        // تحسين: محاولة جلب البيانات من الـ FilterContext أولاً
        if (allData && allData.length > 0) {
          console.log('📊 Using data from FilterContext:', allData.length, 'items');
          extractFilterDataFromContext(allData);
          setApiStatus('success');
          setIsLoading(false);
          return;
        }
        
        console.log('🔄 Loading fresh filter data from APIs...');
        console.log('📡 Primary API Endpoint: https://enqlygo.com/api/salons');
        
        // تحسين: استخدام AbortController للتحكم في الطلبات
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // تحسين: جلب البيانات من API واحد فقط (salons) واستخراج كل شيء منه
        const salonsResponse = await fetch('https://enqlygo.com/api/salons', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // تهيئة المتغيرات خارج النطاق
        let uniqueCities = [];
        let categories = [];
        let salonNames = [];
        let uniqueDoctors = [];
        let uniqueRatings = [];
        
        // معالجة البيانات من API الصالونات
        if (salonsResponse.ok) {
          const salonsData = await salonsResponse.json();
          const salons = salonsData.data || salonsData || [];
          console.log('✅ Salons data loaded:', salons.length, 'salons');
          console.log('📊 Data source: https://enqlygo.com/api/salons');
          
          // استخراج المدن من عناوين الصالونات
          const extractedCities = salons.map(salon => {
            const address = salon.salon_address || salon.address || '';
            
            if (typeof address === 'string' && address.trim()) {
              // استخراج المدينة من العنوان
              if (address.includes(' - ')) {
                const parts = address.split(' - ');
                return parts[0].trim();
              }
              else if (address.includes('،')) {
                const parts = address.split('،');
                return parts[0].trim();
              }
              else if (address.includes(',')) {
                const parts = address.split(',');
                return parts[0].trim();
              }
              else {
                return address.trim();
              }
            }
            return null;
          }).filter(Boolean);
          
          // إزالة المدن المكررة
          uniqueCities = [...new Set(extractedCities)];
          setCities(uniqueCities);
          setCitiesLoading(false);
          console.log('✅ Cities extracted from salons:', uniqueCities);
          
          // استخراج التخصصات من الصالونات
          const categoryIds = new Set();
          salons.forEach(salon => {
            if (salon.salon_categories) {
              // salon_categories قد يكون string مثل "1,2" أو array
              if (typeof salon.salon_categories === 'string') {
                salon.salon_categories.split(',').forEach(id => {
                  if (id.trim()) categoryIds.add(parseInt(id.trim()));
                });
              } else if (Array.isArray(salon.salon_categories)) {
                salon.salon_categories.forEach(id => {
                  if (id) categoryIds.add(parseInt(id));
                });
              } else if (typeof salon.salon_categories === 'number') {
                categoryIds.add(salon.salon_categories);
              }
            }
          });
          
          // إنشاء قائمة التخصصات من الـ IDs
          categories = Array.from(categoryIds).map(id => ({
            id: id,
            title_ar: getCategoryNameById(id),
            title_en: getCategoryNameById(id, 'en')
          }));
          
          setCategories(categories);
          setCategoriesLoading(false);
          console.log('✅ Categories extracted from salons:', categories);
          
          // استخراج أسماء الصالونات
          salonNames = salons.map(salon => salon.salon_name || salon.name).filter(Boolean);
          setSalons(salonNames);
          setSalonsLoading(false);
          
          // استخراج أسماء الأطباء
          uniqueDoctors = [...new Set(salons.map(salon => salon.owner_name).filter(Boolean))];
          setDoctors(uniqueDoctors);
          setDoctorsLoading(false);
          
          // استخراج التقييمات المتاحة
          const ratings = salons
            .map(salon => salon.rating)
            .filter(rating => rating && rating > 0)
            .sort((a, b) => b - a);
          
          uniqueRatings = [...new Set(ratings)];
          setAvailableRatings(uniqueRatings);
          setRatingsLoading(false);
          
          console.log('✅ All data extracted from salons API:', {
            cities: uniqueCities.length,
            categories: categories.length,
            salons: salonNames.length,
            doctors: uniqueDoctors.length,
            ratings: uniqueRatings.length
          });
          
        } else {
          console.warn('⚠️ Salons API failed, trying fallback APIs');
          // Fallback إلى APIs منفصلة إذا فشل API الصالونات
          await loadFallbackData(controller);
          // إعادة تهيئة المتغيرات بعد الـ fallback
          uniqueCities = [];
          categories = [];
          salonNames = [];
          uniqueDoctors = [];
          uniqueRatings = [];
        }
        
        // حفظ البيانات في الـ cache لتحسين الأداء (فقط إذا نجح API الصالونات)
        if (salonsResponse.ok && uniqueCities && uniqueCities.length > 0) {
          const cacheData = {
            cities: uniqueCities,
            categories: categories,
            salons: salonNames,
            doctors: uniqueDoctors,
            ratings: uniqueRatings
          };
          
          try {
            localStorage.setItem(cacheKey, JSON.stringify(cacheData));
            localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
            console.log('💾 Filter data cached successfully');
          } catch (cacheError) {
            console.warn('⚠️ Failed to cache filter data:', cacheError);
        }
        
        setApiStatus('success');
        console.log('🎉 All sidebar data loaded from APIs successfully!');
        console.log('📋 Final data summary:', {
            cities: uniqueCities.length,
          categories: categories.length,
            salons: salonNames.length,
            doctors: uniqueDoctors.length,
            ratings: uniqueRatings.length
          });
        } else if (salonsResponse.ok) {
          // إذا نجح API لكن لم تكن هناك بيانات
          setApiStatus('success');
          console.log('✅ API succeeded but no data available');
        }
        
      } catch (error) {
        console.error('❌ Error loading filter data:', error);
        setApiStatus('error');
        
        // تحسين: محاولة استخدام البيانات المحفوظة في الـ cache حتى لو انتهت صلاحيتها
        const fallbackCache = localStorage.getItem('filter_data_cache');
        if (fallbackCache) {
          try {
            console.log('🔄 Using expired cache as fallback');
            const parsedData = JSON.parse(fallbackCache);
            setCities(parsedData.cities || []);
            setCategories(parsedData.categories || []);
            setSalons(parsedData.salons || []);
            setDoctors(parsedData.doctors || []);
            setAvailableRatings(parsedData.ratings || []);
            setApiStatus('success');
          } catch (parseError) {
            console.warn('⚠️ Failed to parse fallback cache:', parseError);
            // تعيين قوائم فارغة عند فشل جميع المحاولات
            setCities([]);
            setCategories([]);
            setSalons([]);
            setDoctors([]);
            setAvailableRatings([]);
          }
        } else {
          // تعيين قوائم فارغة عند فشل جميع APIs
        console.log('❌ All APIs failed, no filter data available');
        setCities([]);
        setCategories([]);
        setSalons([]);
        setDoctors([]);
        setAvailableRatings([]);
        }
        
        // إيقاف جميع loading states
        setCitiesLoading(false);
        setCategoriesLoading(false);
        setSalonsLoading(false);
        setDoctorsLoading(false);
        setRatingsLoading(false);
        
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Timeout إضافي لضمان عدم استمرار loading للأبد
    const timeoutId = setTimeout(() => {
      if (apiStatus === 'loading') {
        console.log('⏰ Filter loading timeout reached');
        setApiStatus('error');
        setIsLoading(false);
      }
    }, 5000); // 5 seconds total timeout
    
    return () => clearTimeout(timeoutId);
  }, []);

  // تطبيق الفلاتر
  const handleChange = (key, value) => {
    console.log('🔍 Filter change requested:', key, value);
    console.log('📊 Current allData length:', allData.length);
    console.log('📊 Current filters before change:', filters);
    
    // إنشاء الفلاتر الجديدة
    const newFilters = { ...filters, [key]: value };
    console.log('🔍 New filters object:', newFilters);
    
    // تطبيق الفلتر مباشرة
    updateFilters(newFilters);
    
    // debug خاص للتخصص
    if (key === 'salon_categories') {
      console.log('🏷️ Category filter changed:', {
        categoryId: value,
        categoryName: categories.find(cat => cat.id == value)?.title_ar || 'غير محدد',
        allDataLength: allData.length,
        sampleItems: allData.slice(0, 3).map(item => ({
          id: item.id,
          name: item.salon_name || item.owner_name,
          category: item.salon_categories || item.category_id
        }))
      });
      
      // تحقق من أن الفلتر تم تطبيقه
      setTimeout(() => {
        console.log('🔍 After filter application - checking results...');
        console.log('📊 Current filteredData length:', filteredData.length);
        console.log('📊 Current isFiltered:', isFiltered);
      }, 100);
    }
    
    // لا نحتاج setTimeout هنا لأن updateFilters تطبق الفلتر مباشرة
    console.log('✅ Filter applied directly via updateFilters');
  };

  // تطبيق البحث المتقدم عبر API - محسن للأداء
  const applyAdvancedFilter = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Applying advanced filters...', filters);
      
      // تحسين: التحقق من الـ cache للنتائج المفلترة
      const filterCacheKey = `filter_results_${JSON.stringify(filters)}`;
      const cachedResults = localStorage.getItem(filterCacheKey);
      const cacheTimestamp = localStorage.getItem(`${filterCacheKey}_timestamp`);
      const now = Date.now();
      const filterCacheExpiry = 2 * 60 * 1000; // 2 دقيقة للنتائج المفلترة
      
      if (cachedResults && cacheTimestamp && (now - parseInt(cacheTimestamp)) < filterCacheExpiry) {
        console.log('📦 Using cached filter results');
        const parsedResults = JSON.parse(cachedResults);
        if (typeof updateAllData === 'function') {
          updateAllData(parsedResults);
        }
        setApiStatus('success');
        setIsLoading(false);
        return;
      }
      
      // بناء URL المعاملات
      const params = new URLSearchParams();

      if (filters.owner_name) params.append('owner_name', filters.owner_name);
      if (filters.salon_name) params.append('salon_name', filters.salon_name);
      if (filters.salon_categories) {
        params.append('salon_categories', filters.salon_categories);
        console.log('🏷️ Category filter applied:', filters.salon_categories);
      }
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.city) params.append('city', filters.city);
      
      const apiUrl = `https://enqlygo.com/api/salons?${params.toString()}`;
      console.log('🔍 API URL:', apiUrl);
      
      // تحسين: استخدام AbortController للتحكم في الطلبات
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Advanced filter results:', data);
        
        const filteredData = data.data || data || [];
        
        // debug خاص للتخصص
        if (filters.salon_categories) {
          console.log('🏷️ Category filter results:', {
            categoryId: filters.salon_categories,
            categoryName: categories.find(cat => cat.id == filters.salon_categories)?.title_ar,
            resultsCount: filteredData.length,
            results: filteredData.map(item => ({
              id: item.id,
              name: item.salon_name || item.owner_name,
              category: item.salon_categories || item.category_id
            }))
          });
        }
        
        // حفظ النتائج المفلترة في الـ cache
        try {
          localStorage.setItem(filterCacheKey, JSON.stringify(filteredData));
          localStorage.setItem(`${filterCacheKey}_timestamp`, now.toString());
          console.log('💾 Filter results cached successfully');
        } catch (cacheError) {
          console.warn('⚠️ Failed to cache filter results:', cacheError);
        }
        
        // تحديث البيانات في الـ FilterContext
        if (typeof updateAllData === 'function') {
          updateAllData(filteredData);
        }
        
        setApiStatus('success');
      } else {
        console.warn('⚠️ Advanced filter API failed, using local filter');
        applyLocalFilter();
      }
      
    } catch (error) {
      console.error('❌ Advanced filter error:', error);
      console.warn('🔄 Falling back to local filter...');
      applyLocalFilter();
    } finally {
      setIsLoading(false);
    }
  };

  // تطبيق الفلترة المحلية
  const applyLocalFilter = () => {
    console.log('🔄 Applying local filter...', filters);
    
    // استخدام الـ FilterContext للفلترة المحلية
    if (typeof updateFilters === 'function') {
      updateFilters(filters);
    }
    
    // إضافة معلومات debug
    console.log('📊 Local filter applied:', {
      filters: filters,
      allDataCount: allData?.length || 0,
      filteredDataCount: 'Will be calculated by FilterContext'
    });
  };

  const handleApplyFilters = () => {
    console.log('🎯 Applying filters manually...', filters);
    
    // تطبيق الفلتر مباشرة باستخدام updateFilters
    updateFilters(filters);
    
    console.log('✅ Filters applied manually');
  };

  // Loading state للفلاتر - يظهر loading افتراضي حتى تيجي الداتا من API
  if (isLoading || apiStatus === 'loading') {
    return (
      <aside className="col-lg-3 col-md-4 col-sm-8 col-10 mx-auto">
        <div
          className="p-5 bg-white"
          style={{
            borderRadius: "15px",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
          }}
        >
          {/* صورة الـ sidebar */}
          <div className="text-center mb-3">
            <div 
              className="mx-auto mb-3"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#0171BD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FontAwesomeIcon 
                icon={faFilter} 
                size="2x" 
                className="text-white"
              />
            </div>
          </div>
          
          <h5 className="fw-bold mb-3 main-color text-center">تصفية النتائج</h5>
          
          <div className="d-flex flex-column align-items-center justify-content-center py-5">
            {/* Filters Loading Animation */}
            <div className="filters-loading">
              <div className="filters-spinner mb-3">
                <div className="filter-ring"></div>
                <div className="filter-ring"></div>
                <div className="filter-ring"></div>
              </div>
              
              <h6 className="text-center mb-3" style={{ color: "#0171BD", fontWeight: "500" }}>
                جاري تحميل الفلاتر...
              </h6>
              
              <p className="text-muted text-center mb-3" style={{ fontSize: "0.9rem" }}>
                نحضر لك جميع خيارات البحث المتاحة
              </p>
              
              <div className="filter-loading-dots">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              
              {/* زر إعادة تحميل البيانات */}
              <div className="mt-4">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => {
                    console.log('🔄 Manual filter reload triggered');
                    // مسح الـ cache قبل إعادة التحميل
                    localStorage.removeItem('filter_data_cache');
                    localStorage.removeItem('filter_data_cache_timestamp');
                    setApiStatus('loading');
                    setIsLoading(true);
                    // إعادة تحميل البيانات
                    window.location.reload();
                  }}
                  style={{
                    borderColor: '#0171BD',
                    color: '#0171BD',
                    borderRadius: '20px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0171BD';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#0171BD';
                  }}
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="me-2" />
                  إعادة تحميل الفلاتر
                </button>
              </div>
            </div>
            
            <style>{`
              .filters-loading {
                animation: fadeIn 0.6s ease-out;
              }
              
              .filters-spinner {
                position: relative;
                width: 60px;
                height: 60px;
                margin: 0 auto;
              }
              
              .filter-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 2px solid transparent;
                border-top: 2px solid #0171BD;
                border-radius: 50%;
                animation: spin 1.5s linear infinite;
              }
              
              .filter-ring:nth-child(2) {
                width: 75%;
                height: 75%;
                top: 12.5%;
                left: 12.5%;
                border-top-color: #0171BD;
                animation-duration: 2s;
                animation-direction: reverse;
              }
              
              .filter-ring:nth-child(3) {
                width: 50%;
                height: 50%;
                top: 25%;
                left: 25%;
                border-top-color: #0171BD;
                animation-duration: 1s;
              }
              
              .filter-loading-dots {
                display: flex;
                justify-content: center;
                gap: 6px;
                margin-top: 20px;
              }
              
              .filter-loading-dots span {
                width: 8px;
                height: 8px;
                background-color: #0171BD;
                border-radius: 50%;
                animation: bounce 1.4s ease-in-out infinite both;
              }
              
              .filter-loading-dots span:nth-child(1) { animation-delay: -0.32s; }
              .filter-loading-dots span:nth-child(2) { animation-delay: -0.16s; }
              .filter-loading-dots span:nth-child(3) { animation-delay: 0s; }
              .filter-loading-dots span:nth-child(4) { animation-delay: 0.16s; }
              
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              @keyframes bounce {
                0%, 80%, 100% {
                  transform: scale(0);
                  opacity: 0.5;
                }
                40% {
                  transform: scale(1);
                  opacity: 1;
                }
              }
              
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="col-lg-3 col-md-4 col-sm-8 col-10 mx-auto" style={{ marginTop: '1.5rem' }}>
      <style>{`
        @media (min-width: 992px) {
          .sidebar-filters {
            min-height: 700px !important;
            height: 100% !important;
          }
        }
        
        .sidebar-filters .btn-outline-primary:hover,
        .sidebar-filters .btn-outline-secondary:hover {
          background-color: #0171BD !important;
          border-color: #0171BD !important;
          color: white !important;
        }
        
        .sidebar-filters .btn-primary:hover {
          background-color: #0171BD !important;
          border-color: #0171BD !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2) !important;
        }
        
        .sidebar-filters .btn {
          transition: all 0.3s ease !important;
        }
        
        /* تخصيص مظهر الـ form-select في الـ sidebar */
        .sidebar-filters .form-select {
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        .sidebar-filters .form-select option {
          color: #0171BD !important;
          background-color: white !important;
          font-weight: 500 !important;
        }
        
        .sidebar-filters .form-select option:hover,
        .sidebar-filters .form-select option:focus,
        .sidebar-filters .form-select option:active {
          background-color: #0171BD !important;
          color: white !important;
          background: #0171BD !important;
          background-image: none !important;
        }
        
        /* تجاوز أقوى للـ hover */
        .sidebar-filters .form-select option:hover {
          background: #0171BD !important;
          background-color: #0171BD !important;
          color: white !important;
        }
        
        .sidebar-filters .form-select option:checked,
        .sidebar-filters .form-select option[selected] {
          background-color: #0171BD !important;
          color: white !important;
          background: #0171BD !important;
        }
        
        .sidebar-filters .form-select option:checked:hover,
        .sidebar-filters .form-select option[selected]:hover {
          background-color: #0171BD !important;
          color: white !important;
          background: #0171BD !important;
        }
        
        /* تجاوز ألوان المتصفح الافتراضية */
        .sidebar-filters .form-select option::-moz-selection {
          background-color: #0171BD !important;
          color: white !important;
        }
        
        .sidebar-filters .form-select option::selection {
          background-color: #0171BD !important;
          color: white !important;
        }
        
        /* تجاوز أقوى للمتصفحات المختلفة */
        .sidebar-filters .form-select option:hover {
          background: #0171BD !important;
          background-color: #0171BD !important;
          color: white !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        /* تجاوز خاص لـ Chrome و Safari */
        .sidebar-filters .form-select option:hover::-webkit-option {
          background: #0171BD !important;
          color: white !important;
        }
        
        /* تجاوز خاص لـ Firefox */
        .sidebar-filters .form-select option:hover::-moz-option {
          background: #0171BD !important;
          color: white !important;
        }
      `}</style>
      <div
        className="p-4 bg-white sidebar-filters"
        style={{
          borderRadius: "15px",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          paddingBottom: '5rem',
          minHeight: '700px'
        }}
      >
        {/* صورة الـ sidebar */}
        <div className="text-center mb-3">
          <div 
            className="mx-auto mb-3"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#0171BD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FontAwesomeIcon 
              icon={faFilter} 
              size="2x" 
              className="text-white"
            />
          </div>
        </div>
        
        <h5 className="fw-bold mb-3 main-color text-center">تصفية النتائج</h5>
        
      {/* حالة التحميل والتحذيرات */}
      {isLoading && (
        <div className="alert alert-info mb-3">
          <div className="d-flex align-items-center">
            <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '1rem', height: '1rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <span>جاري تحميل خيارات الفلتر...</span>
          </div>
          {/* شريط التقدم */}
          <div className="progress mt-2" style={{ height: '4px' }}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: '100%' }}
              aria-valuenow="100" 
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
          </div>
        )}
        
      
      {apiStatus === 'success' && cities.length === 0 && categories.length === 0 && salons.length === 0 && (
        <div className="alert alert-info mb-3">
          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
          <small>لا توجد بيانات متاحة للفلترة حالياً. جرب البحث عن أطباء أو عيادات أولاً.</small>
        </div>
      )}
      
      {/* معلومات البيانات المتاحة */}

        {/* City Filter */}
        <div className="form-group mb-3">
          <label className="form-label d-flex align-items-center mb-2 main-color">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
            المدينة
            {citiesLoading && (
              <FontAwesomeIcon icon={faSpinner} className="fa-spin ms-2" style={{ fontSize: '0.8rem', color: '#0171BD' }} />
            )}
          </label>
          {citiesLoading ? (
            <div className="form-select rounded-pill border-0 bg-light d-flex align-items-center justify-content-center position-relative" style={{ height: '38px' }}>
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '1rem', height: '1rem', color: '#0171BD' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>جاري تحميل المدن...</span>
              </div>
            </div>
          ) : (
            <select 
              className="form-select rounded-pill border-0 bg-light"
              value={filters.city || ''}
              onChange={(e) => handleChange('city', e.target.value)}
              disabled={cities.length === 0}
            >
              <option value="">
                {cities.length === 0 ? 'لا توجد مدن متاحة' : 'الكل'}
              </option>
              {cities.map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </select>
          )}
        </div>

      {/* Medical Center Filter */}
        <div className="form-group mb-3">
          <label className="form-label main-color d-flex align-items-center mb-2">
            <FontAwesomeIcon icon={faHospital} className="me-2" />
            المركز الطبي
            {salonsLoading && (
              <FontAwesomeIcon icon={faSpinner} className="fa-spin ms-2" style={{ fontSize: '0.8rem', color: '#0171BD' }} />
            )}
          </label>
          {salonsLoading ? (
            <div className="form-select rounded-pill border-0 bg-light d-flex align-items-center justify-content-center" style={{ height: '38px' }}>
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '1rem', height: '1rem', color: '#0171BD' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>جاري تحميل المراكز...</span>
              </div>
            </div>
          ) : (
            <select 
              className="form-select rounded-pill border-0 bg-light"
              value={filters.salon_name || ''}
              onChange={(e) => handleChange('salon_name', e.target.value)}
              disabled={salons.length === 0}
            >
              <option value="">
                {salons.length === 0 ? 'لا توجد صالونات متاحة' : 'الكل'}
              </option>
              {salons.map((salon, index) => (
                <option key={index} value={salon}>{salon}</option>
              ))}
            </select>
          )}
        </div>

      {/* Specialty Filter */}
        <div className="form-group mb-3">
          <label className="form-label d-flex main-color align-items-center mb-2">
            <FontAwesomeIcon icon={faStethoscope} className="me-2" />
            التخصص
            {categoriesLoading && (
              <FontAwesomeIcon icon={faSpinner} className="fa-spin ms-2" style={{ fontSize: '0.8rem', color: '#0171BD' }} />
            )}
          </label>
          {categoriesLoading ? (
            <div className="form-select rounded-pill border-0 bg-light d-flex align-items-center justify-content-center" style={{ height: '38px' }}>
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '1rem', height: '1rem', color: '#0171BD' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>جاري تحميل التخصصات...</span>
              </div>
            </div>
          ) : (
            <select 
              className="form-select rounded-pill border-0 bg-light"
              value={filters.salon_categories || ''}
              onChange={(e) => handleChange('salon_categories', e.target.value)}
              disabled={categories.length === 0}
            >
              <option value="">
                {categories.length === 0 ? 'لا توجد فئات متاحة' : 'الكل'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title_ar || category.title}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Doctor Filter */}
        <div className="form-group mb-3">
          <label className="form-label main-color d-flex align-items-center mb-2">
            <FontAwesomeIcon icon={faUserMd} className="me-2" />
            الطبيب
            {doctorsLoading && (
              <FontAwesomeIcon icon={faSpinner} className="fa-spin ms-2" style={{ fontSize: '0.8rem', color: '#0171BD' }} />
            )}
          </label>
          {doctorsLoading ? (
            <div className="form-select rounded-pill border-0 bg-light d-flex align-items-center justify-content-center" style={{ height: '38px' }}>
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '1rem', height: '1rem', color: '#0171BD' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>جاري تحميل الأطباء...</span>
              </div>
            </div>
          ) : (
            <select
              className="form-select rounded-pill border-0 bg-light"
              value={filters.owner_name || ''}
              onChange={(e) => handleChange('owner_name', e.target.value)}
              disabled={doctors.length === 0}
            >
              <option value="">
                {doctors.length === 0 ? 'لا توجد أطباء متاحة' : 'الكل'}
              </option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>{doctor}</option>
              ))}
            </select>
          )}
        </div>

        {/* Rating Filter */}
        <div className="form-group mb-3">
          <label className="form-label main-color d-flex align-items-center mb-2">
            <FontAwesomeIcon icon={faStar} className="me-2" />
            التصنيف
            {ratingsLoading && (
              <FontAwesomeIcon icon={faSpinner} className="fa-spin ms-2" style={{ fontSize: '0.8rem', color: '#0171BD' }} />
            )}
          </label>
          {ratingsLoading ? (
            <div className="form-select rounded-pill border-0 bg-light d-flex align-items-center justify-content-center" style={{ height: '38px' }}>
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status" style={{ width: '1rem', height: '1rem', color: '#0171BD' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>جاري تحميل التقييمات...</span>
              </div>
            </div>
          ) : (
            <select 
              className="form-select rounded-pill border-0 bg-light"
              value={filters.rating || ''}
              onChange={(e) => handleChange('rating', e.target.value)}
              disabled={availableRatings.length === 0}
            >
              <option value="">
                {availableRatings.length === 0 ? 'لا توجد تقييمات متاحة' : 'الكل'}
              </option>
              {availableRatings.map((rating) => (
                <option key={rating} value={rating}>
                  {rating} {rating === 1 ? 'نجمة' : rating === 2 ? 'نجمتان' : 'نجوم'} فأكثر
                </option>
              ))}
              {/* خيارات إضافية للتقييمات الجزئية */}
              {availableRatings.length > 0 && (
                <>
                  {availableRatings.filter(r => r >= 4).length > 0 && !availableRatings.includes(4) && (
                    <option value="4">4 نجوم فأكثر</option>
                  )}
                  {availableRatings.filter(r => r >= 3).length > 0 && !availableRatings.includes(3) && (
                    <option value="3">3 نجوم فأكثر</option>
                  )}
                  {availableRatings.filter(r => r >= 2).length > 0 && !availableRatings.includes(2) && (
                    <option value="2">نجمتان فأكثر</option>
                  )}
                  {availableRatings.filter(r => r >= 1).length > 0 && !availableRatings.includes(1) && (
                    <option value="1">نجمة واحدة فأكثر</option>
                  )}
                </>
              )}
            </select>
          )}
        </div>

        {/* Date Filter */}
        <div className="form-group mb-3">
          <label className="form-label main-color d-flex align-items-center mb-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
            التاريخ
          </label>
          <input
            type="date"
            className="form-control rounded-pill border-0 bg-light"
            value={filters.start_date || ''}
            onChange={(e) => handleChange('start_date', e.target.value)}
            min={new Date().toISOString().split('T')[0]} // لا يسمح بالتواريخ السابقة
            placeholder="اختر التاريخ"
          />
          {/* خيارات سريعة للتاريخ */}
          <div className="mt-2">
            <div className="d-flex flex-wrap gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  handleChange('start_date', today);
                }}
                style={{ fontSize: '0.75rem' }}
              >
                اليوم
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  handleChange('start_date', tomorrow.toISOString().split('T')[0]);
                }}
                style={{ fontSize: '0.75rem' }}
              >
                غداً
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  handleChange('start_date', nextWeek.toISOString().split('T')[0]);
                }}
                style={{ fontSize: '0.75rem' }}
              >
                الأسبوع القادم
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleChange('start_date', '')}
                style={{ fontSize: '0.75rem' }}
              >
                إزالة
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => handleChange('price_range', '')}
                style={{ fontSize: '0.75rem' }}
              >
                إزالة السعر
              </button>
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="form-group mb-2">
          <label className="form-label main-color d-flex align-items-center mb-3">
            <FontAwesomeIcon icon={faMoneyBillWave} className="me-5" />
            نطاق السعر
          </label>
          <div className="d-flex flex-column gap-2">
            <div className="form-check d-flex align-items-center gap-5">
      <input 
        type="radio" 
        name="priceRange" 
        id="price1" 
        className="form-check-input" 
        checked={filters.price_range === 'less_than_100'}
        onChange={() => handleChange('price_range', 'less_than_100')}
      />
      <label htmlFor="price1" className="form-check-label mb-0">أقل من 100 <SARIcon size="0.9em" /></label>
            </div>
            <div className="form-check d-flex align-items-center gap-5">
      <input 
        type="radio" 
        name="priceRange" 
        id="price2" 
        className="form-check-input" 
        checked={filters.price_range === '100_300'}
        onChange={() => handleChange('price_range', '100_300')}
      />
      <label htmlFor="price2" className="form-check-label mb-0">100 - 300 <SARIcon size="0.9em" /></label>
            </div>
            <div className="form-check d-flex align-items-center gap-5">
      <input 
        type="radio" 
        name="priceRange" 
        id="price3" 
        className="form-check-input" 
        checked={filters.price_range === '300_500'}
        onChange={() => handleChange('price_range', '300_500')}
      />
      <label htmlFor="price3" className="form-check-label mb-0">300 - 500 <SARIcon size="0.9em" /></label>
            </div>
            <div className="form-check d-flex align-items-center gap-5">
      <input 
        type="radio" 
        name="priceRange" 
        id="price4" 
        className="form-check-input" 
        checked={filters.price_range === 'more_than_500'}
        onChange={() => handleChange('price_range', 'more_than_500')}
      />
      <label htmlFor="price4" className="form-check-label mb-0">أكثر من 500 <SARIcon size="0.9em" /></label>
            </div>
          </div>
        </div>

        {/* زر إعادة تعيين الفلاتر */}
        {isFiltered && (
    <div className="mt-3">
          <button
              className="btn btn-outline-secondary w-100"
              onClick={resetFilters}
            style={{
                borderColor: '#0171BD',
                color: '#0171BD',
                borderRadius: '25px',
                height: '50px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0171BD';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#0171BD';
              }}
            >
              <FontAwesomeIcon icon={faRotateLeft} className="me-2" />
              إعادة تعيين الفلاتر
            </button>
    </div>
        )}
    
    {/* معلومات الفلتر النشط */}
    {(filters.owner_name || filters.salon_name || filters.salon_categories || filters.rating || filters.start_date || filters.city) && (
      <div className="mt-3">
        <div className="alert alert-info">
          <h6 className="mb-2">الفلاتر النشطة:</h6>
          <div className="d-flex flex-wrap gap-1">
            {filters.city && (
              <span className="badge bg-primary">المدينة: {filters.city}</span>
            )}
            {filters.salon_name && (
              <span className="badge bg-success">المركز: {filters.salon_name}</span>
            )}
            {filters.salon_categories && (
              <span className="badge bg-warning">التخصص: {categories.find(c => c.id == filters.salon_categories)?.title_ar}</span>
            )}
            {filters.owner_name && (
              <span className="badge bg-info">الطبيب: {filters.owner_name}</span>
            )}
            {filters.rating && (
              <span className="badge bg-secondary">
                التقييم: {filters.rating} {filters.rating === 1 ? 'نجمة' : filters.rating === 2 ? 'نجمتان' : 'نجوم'}+
              </span>
            )}
            {filters.start_date && (
              <span className="badge bg-dark">
                التاريخ: {new Date(filters.start_date).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            )}
          </div>
        </div>
      </div>
    )}
      </div>
    </aside>
  );
}