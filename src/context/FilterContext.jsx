import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    owner_name: '',
    salon_name: '',
    salon_categories: '',
    rating: '',
    start_date: '',
    city: '',
    price_range: ''
  });
  
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);

  // تطبيق الفلاتر على البيانات
  const applyFilters = (data, newFilters) => {
    let filtered = [...data];
    
    // فلترة حسب المدينة
    if (newFilters.city && newFilters.city !== 'الكل') {
      console.log('🏙️ Filtering by city:', newFilters.city);
      filtered = filtered.filter(item => {
        // البحث في العنوان أو المدينة
        const address = item.salon_address || item.address || item.city || '';
        const cityName = newFilters.city.toLowerCase();
        
        console.log('🔍 Checking item:', {
          id: item.id,
          address: address,
          filterCity: cityName,
          match: address.toLowerCase().includes(cityName)
        });
        
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
        
        // إذا كان اسم المدينة في العنوان
        if (address.toLowerCase().includes(cityName)) {
          console.log('✅ City match found:', item.id);
          return true;
        }
        
        // البحث في قائمة المدن المعروفة
        for (const city of cities) {
          if (city.toLowerCase() === cityName && address.toLowerCase().includes(city.toLowerCase())) {
            console.log('✅ City match found via cities list:', item.id);
            return true;
          }
        }
        
        console.log('❌ No city match for item:', item.id);
        return false;
      });
      
      console.log('🏙️ City filter result:', filtered.length, 'items remaining');
    }
    
    // فلترة حسب اسم الصالون أو اسم الطبيب (بحث شامل)
    if ((newFilters.salon_name && newFilters.salon_name !== 'الكل') || 
        (newFilters.owner_name && newFilters.owner_name !== 'الكل')) {
      
      const searchTerm = newFilters.salon_name || newFilters.owner_name;
      console.log('🔍 Searching in names with term:', searchTerm);
      
      filtered = filtered.filter(item => {
        const salonName = item.salon_name ? item.salon_name.toLowerCase() : '';
        const ownerName = item.owner_name ? item.owner_name.toLowerCase() : '';
        const searchLower = searchTerm.toLowerCase();
        
        const salonMatch = salonName.includes(searchLower);
        const ownerMatch = ownerName.includes(searchLower);
        
        console.log('🔍 Name search check:', {
          id: item.id,
          salonName: item.salon_name,
          ownerName: item.owner_name,
          searchTerm: searchTerm,
          salonMatch: salonMatch,
          ownerMatch: ownerMatch,
          totalMatch: salonMatch || ownerMatch
        });
        
        return salonMatch || ownerMatch;
      });
      
      console.log('🔍 Name filter result:', filtered.length, 'items remaining');
    }
    
    // فلترة حسب التقييم
    if (newFilters.rating && newFilters.rating !== 'الكل') {
      filtered = filtered.filter(item => 
        item.rating && parseFloat(item.rating) >= parseFloat(newFilters.rating)
      );
    }
    
    // فلترة حسب التاريخ
    if (newFilters.start_date) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.created_at || item.start_date);
        const filterDate = new Date(newFilters.start_date);
        return itemDate >= filterDate;
      });
    }
    
    // فلترة حسب الفئة
    if (newFilters.salon_categories && newFilters.salon_categories !== 'الكل' && newFilters.salon_categories !== '') {
      filtered = filtered.filter(item => {
        // البحث في جميع المفاتيح المحتملة للتخصص
        const categoryId = item.category_id || item.cat_id || item.categoryid || item.salon_categories || 
                          item.category || item.specialty || item.specialty_id || item.type_id;
        
        if (!categoryId) {
          return false;
        }
        
        // معالجة salon_categories إذا كان string مثل "1,2"
        if (typeof categoryId === 'string' && categoryId.includes(',')) {
          const categoryIds = categoryId.split(',').map(id => id.trim());
          return categoryIds.includes(newFilters.salon_categories.toString());
        }
        
        // معالجة salon_categories إذا كان array
        if (Array.isArray(categoryId)) {
          return categoryId.includes(parseInt(newFilters.salon_categories));
        }
        
        // معالجة salon_categories إذا كان number أو string واحد
        return categoryId.toString() === newFilters.salon_categories.toString();
      });
    }
    
    // فلترة حسب نطاق السعر - نسخة مبسطة
    if (newFilters.price_range && newFilters.price_range !== 'الكل') {
      console.log('💰 Filtering by price range:', newFilters.price_range);
      
      // فلترة مبسطة بناءً على تقدير السعر
      filtered = filtered.filter(item => {
        // تقدير السعر بناءً على نوع العيادة أو التقييم
        let estimatedPrice = 250; // سعر افتراضي
        
        // إذا كانت العيادة متميزة، السعر أعلى
        if (item.top_rated === 1) {
          estimatedPrice = 400;
        } else if (item.rating && item.rating > 4) {
          estimatedPrice = 350;
        } else if (item.rating && item.rating < 3) {
          estimatedPrice = 150;
        }
        
        let matchesPriceRange = false;
        
        switch (newFilters.price_range) {
          case 'less_than_100':
            matchesPriceRange = estimatedPrice < 100;
            break;
          case '100_300':
            matchesPriceRange = estimatedPrice >= 100 && estimatedPrice <= 300;
            break;
          case '300_500':
            matchesPriceRange = estimatedPrice >= 300 && estimatedPrice <= 500;
            break;
          case 'more_than_500':
            matchesPriceRange = estimatedPrice > 500;
            break;
          default:
            matchesPriceRange = true;
        }
        
        console.log('💰 Price filter check:', {
          id: item.id,
          estimatedPrice: estimatedPrice,
          priceRange: newFilters.price_range,
          matches: matchesPriceRange
        });
        
        return matchesPriceRange;
      });
      
      console.log('💰 Price filter result:', filtered.length, 'items remaining');
    }
    
    return filtered;
  };

  // تحديث الفلاتر
  const updateFilters = (newFilters) => {
    setFilters(newFilters);
    const filtered = applyFilters(allData, newFilters);
    setFilteredData(filtered);
    setIsFiltered(true);
  };

  // تحديث البيانات الأساسية
  const updateAllData = (data) => {
    setAllData(data);
    if (!isFiltered) {
      setFilteredData(data);
    }
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilters({
      owner_name: '',
      salon_name: '',
      salon_categories: '',
      rating: '',
      start_date: '',
      city: '',
      price_range: ''
    });
    setFilteredData(allData);
    setIsFiltered(false);
  };

  // الحصول على البيانات المعروضة
  const getDisplayData = () => {
    const data = isFiltered ? filteredData : allData;
    return data;
  };

  const value = {
    filters,
    filteredData,
    allData,
    isFiltered,
    updateFilters,
    updateAllData,
    resetFilters,
    getDisplayData,
    applyFilters
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;