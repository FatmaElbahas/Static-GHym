import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding, faMapMarkerAlt, faStar, faPhone, faCalendarCheck, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

// Cache للتخصصات لتجنب استدعاءات API متكررة
const categoriesCache = new Map();
let categoriesPromise = null;

const SearchResultCard = React.memo(({ result }) => {
  const [salonData, setSalonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [categoryName, setCategoryName] = useState(null);

  // جلب بيانات العيادة من API - محسن لمعالجة الأخطاء
  const fetchSalonData = useCallback(async (salonId) => {
    if (!salonId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`https://enqlygo.com/api/salons/${salonId}`, {
        timeout: 10000, // timeout 10 ثواني
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setSalonData(data.data);
        } else {
          setError('No data found');
        }
      } else {
        setError(`HTTP ${response.status}`);
      }
    } catch (err) {
      console.error('Error fetching salon data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // جلب اسم التخصص من API - محسن مع cache
  const fetchCategoryName = useCallback(async (categoryId) => {
    if (!categoryId) return;
    
    // التحقق من الـ cache أولاً
    if (categoriesCache.has(categoryId)) {
      setCategoryName(categoriesCache.get(categoryId));
      return;
    }
    
    // إذا كان هناك promise قيد التنفيذ، انتظر النتيجة
    if (categoriesPromise) {
      try {
        const result = await categoriesPromise;
        if (result && result[categoryId]) {
          setCategoryName(result[categoryId]);
        }
      } catch (err) {
        console.error('Error waiting for categories promise:', err);
      }
      return;
    }
    
    try {
      // إنشاء promise جديد
      categoriesPromise = fetch('https://enqlygo.com/api/salons/categories')
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`HTTP ${response.status}`);
        })
        .then(data => {
          if (data.status === 'success' && data.data) {
            const categoriesMap = {};
            data.data.forEach(category => {
              categoriesMap[category.id] = category.title_ar || category.name;
              categoriesCache.set(category.id, category.title_ar || category.name);
            });
            return categoriesMap;
          }
          throw new Error('No categories data');
        });
      
      const categoriesMap = await categoriesPromise;
      if (categoriesMap && categoriesMap[categoryId]) {
        setCategoryName(categoriesMap[categoryId]);
      }
    } catch (err) {
      console.error('Error fetching category name:', err);
      // fallback للتخصصات الافتراضية
      const defaultCategories = {
        1: 'علاج الأسنان',
        2: 'تقويم الأسنان',
        3: 'طب الأطفال',
        4: 'طب العيون',
        5: 'الجلدية',
        6: 'القلب والأوعية الدموية',
        7: 'العظام',
        8: 'النساء والولادة',
        9: 'الأنف والأذن والحنجرة',
        10: 'الطب النفسي'
      };
      
      if (defaultCategories[categoryId]) {
        setCategoryName(defaultCategories[categoryId]);
        categoriesCache.set(categoryId, defaultCategories[categoryId]);
      }
    } finally {
      categoriesPromise = null;
    }
  }, []);

  // جلب اسم التخصص من البيانات المحلية
  const getSpecialtyDisplay = useCallback(() => {
    if (!result) return 'غير محدد';
    
    // البحث في جميع المفاتيح المحتملة للتخصص
    const categoryId = result.category_id || result.cat_id || result.categoryid || result.salon_categories || 
                      result.category || result.specialty || result.specialty_id || result.type_id;
    
    if (!categoryId) {
      return 'غير محدد';
    }
    
    // إذا كان لدينا اسم التخصص من API
    if (categoryName) {
      return categoryName;
    }
    
    // معالجة salon_categories إذا كان string مثل "1,2"
    if (typeof categoryId === 'string' && categoryId.includes(',')) {
      const firstCategoryId = categoryId.split(',')[0].trim();
      fetchCategoryName(firstCategoryId);
      return `التخصص ${firstCategoryId}`;
    }
    
    // معالجة salon_categories إذا كان array
    if (Array.isArray(categoryId)) {
      if (categoryId.length > 0) {
        fetchCategoryName(categoryId[0]);
        return `التخصص ${categoryId[0]}`;
      }
      return 'غير محدد';
    }
    
    // معالجة salon_categories إذا كان number أو string واحد
    const numCategoryId = parseInt(categoryId);
    if (!isNaN(numCategoryId)) {
      fetchCategoryName(numCategoryId);
      return `التخصص ${numCategoryId}`;
    }
    
    return 'غير محدد';
  }, [result, categoryName, fetchCategoryName]);

  // جلب بيانات العيادة عند تحميل المكون
  useEffect(() => {
    if (result && result.id) {
      fetchSalonData(result.id);
    }
  }, [result, fetchSalonData]);

  // جلب اسم التخصص عند تحميل المكون
  useEffect(() => {
    if (result) {
      const categoryId = result.category_id || result.cat_id || result.categoryid || result.salon_categories || 
                        result.category || result.specialty || result.specialty_id || result.type_id;
      
      if (categoryId) {
        if (typeof categoryId === 'string' && categoryId.includes(',')) {
          const firstCategoryId = categoryId.split(',')[0].trim();
          fetchCategoryName(firstCategoryId);
        } else if (Array.isArray(categoryId)) {
          if (categoryId.length > 0) {
            fetchCategoryName(categoryId[0]);
          }
        } else {
          const numCategoryId = parseInt(categoryId);
          if (!isNaN(numCategoryId)) {
            fetchCategoryName(numCategoryId);
          }
        }
      }
    }
  }, [result, fetchCategoryName]);

  if (!result) {
    return (
      <div className="card h-100">
        <div className="card-body text-center">
          <p className="text-muted">لا توجد بيانات</p>
        </div>
      </div>
    );
  }

  const displayData = salonData || result;
  const specialty = getSpecialtyDisplay();
  const rating = displayData.rating || displayData.total_completed_bookings || 0;
  const imageUrl = displayData.image || displayData.photo || displayData.avatar;

  return (
    <div className="card h-100 transition">
      {/* صورة العيادة */}
      <div className="position-relative">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={displayData.salon_name || displayData.owner_name || 'صورة العيادة'}
            className="card-img-top"
            style={{ height: '200px', objectFit: 'cover' }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div 
            className="card-img-top d-flex align-items-center justify-content-center bg-light"
            style={{ height: '200px' }}
          >
            <FontAwesomeIcon icon={faBuilding} size="3x" className="text-muted" />
          </div>
        )}
        
        {/* شارة التقييم */}
        {rating > 0 && (
          <div className="position-absolute top-0 end-0 m-2">
            <span className="badge bg-warning text-dark">
              <FontAwesomeIcon icon={faStar} className="me-1" />
              {rating}
            </span>
          </div>
        )}
      </div>

      <div className="card-body d-flex flex-column">
        {/* اسم العيادة/الطبيب */}
        <h5 className="card-title text-primary mb-2">
          {displayData.salon_name || displayData.owner_name || 'غير محدد'}
        </h5>

        {/* التخصص */}
        <div className="mb-2">
          <small className="text-muted">
            <FontAwesomeIcon icon={faUser} className="me-1" />
            التخصص:
          </small>
          <p className="mb-0 fw-bold text-dark">{specialty}</p>
        </div>

        {/* الموقع */}
        {displayData.city && (
          <div className="mb-2">
            <small className="text-muted">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
              الموقع:
            </small>
            <p className="mb-0">{displayData.city}</p>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mt-auto">
          {/* التقييم */}
          {rating > 0 && (
            <div className="mb-2">
              <small className="text-muted">
                <FontAwesomeIcon icon={faStar} className="me-1" />
                التقييم:
              </small>
              <div className="d-flex align-items-center">
                <span className="text-warning me-2">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon 
                      key={i} 
                      icon={faStar} 
                      className={i < Math.floor(rating) ? 'text-warning' : 'text-muted'} 
                    />
                  ))}
                </span>
                <span className="fw-bold">{rating}</span>
              </div>
            </div>
          )}

          {/* حالة التحميل */}
          {isLoading && (
            <div className="text-center mb-3">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
              <small className="text-muted ms-2">جاري تحميل التفاصيل...</small>
            </div>
          )}

          {/* رسالة الخطأ */}
          {error && (
            <div className="alert alert-warning alert-sm mb-3">
              <small>خطأ في تحميل التفاصيل: {error}</small>
            </div>
          )}

          {/* أزرار الإجراءات */}
          <div className="d-grid gap-2">
            <button className="btn btn-primary btn-sm">
              <FontAwesomeIcon icon={faCalendarCheck} className="me-1" />
              احجز موعد
            </button>
            
            {displayData.phone && (
              <button className="btn btn-outline-primary btn-sm">
                <FontAwesomeIcon icon={faPhone} className="me-1" />
                اتصل بنا
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SearchResultCard.displayName = 'SearchResultCard';

export default SearchResultCard;