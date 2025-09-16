import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DoctorCard from '../DoctorCard/DoctorCard';
import { useCategories } from '../../hooks/useCategories';

/**
 * مكون محسن لعرض قائمة العيادات مع ربط الفئات
 * يحسن الأداء بتجميع استدعاءات API وتقليل إعادة التحميل
 */
const SalonList = React.memo(({ 
  searchTerm = '', 
  selectedCategory = null, 
  onSalonSelect = null 
}) => {
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { categories, getCategoryName } = useCategories();

  // جلب بيانات العيادات من API
  const fetchSalons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching salons data...');
      const response = await fetch('https://enqlygo.com/api/salons');
      
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success' && data.data) {
          setSalons(data.data);
          console.log('✅ Salons loaded successfully:', data.data.length);
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error('❌ Salons API error:', err.message);
      setError(err.message);
      setSalons([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

  // تصفية العيادات حسب البحث والفئة
  const filteredSalons = useMemo(() => {
    if (!salons.length) return [];

    let filtered = salons.filter(salon => {
      // تصفية حسب النص البحثي
      const matchesSearch = !searchTerm || 
        salon.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.salon_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.salon_address?.toLowerCase().includes(searchTerm.toLowerCase());

      // تصفية حسب الفئة
      const matchesCategory = !selectedCategory || 
        salon.salon_categories?.includes(selectedCategory.toString());

      return matchesSearch && matchesCategory;
    });

    // ترتيب حسب التقييم (الأعلى أولاً)
    return filtered.sort((a, b) => {
      const ratingA = a.reviews_avg_rating || a.rating || 0;
      const ratingB = b.reviews_avg_rating || b.rating || 0;
      return ratingB - ratingA;
    });
  }, [salons, searchTerm, selectedCategory]);

  // معالجة الأخطاء
  if (error) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="alert alert-danger text-center" role="alert">
              <h4 className="alert-heading">خطأ في تحميل البيانات</h4>
              <p>{error}</p>
              <hr />
              <button 
                className="btn btn-outline-danger"
                onClick={fetchSalons}
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <h5 className="mt-3">جاري تحميل العيادات...</h5>
          </div>
        </div>
      </div>
    );
  }

  // لا توجد نتائج
  if (!filteredSalons.length) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="text-center">
              <div className="mb-4">
                <i className="fas fa-search fa-3x text-muted"></i>
              </div>
              <h4>لا توجد عيادات</h4>
              <p className="text-muted">
                {searchTerm || selectedCategory 
                  ? 'لم يتم العثور على عيادات تطابق معايير البحث'
                  : 'لا توجد عيادات متاحة حالياً'
                }
              </p>
              {(searchTerm || selectedCategory) && (
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => {
                    // إعادة تعيين الفلاتر
                    window.location.reload();
                  }}
                >
                  إعادة تعيين الفلاتر
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* إحصائيات سريعة */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 bg-light">
            <div className="card-body py-3">
              <div className="row text-center">
                <div className="col-md-3">
                  <h5 className="text-primary mb-1">{filteredSalons.length}</h5>
                  <small className="text-muted">إجمالي العيادات</small>
                </div>
                <div className="col-md-3">
                  <h5 className="text-success mb-1">
                    {filteredSalons.filter(s => (s.reviews_avg_rating || s.rating || 0) >= 4).length}
                  </h5>
                  <small className="text-muted">عيادات متميزة</small>
                </div>
                <div className="col-md-3">
                  <h5 className="text-info mb-1">
                    {filteredSalons.filter(s => s.services && s.services.length > 0).length}
                  </h5>
                  <small className="text-muted">عيادات بخدمات</small>
                </div>
                <div className="col-md-3">
                  <h5 className="text-warning mb-1">
                    {filteredSalons.filter(s => s.staff && s.staff.length > 0).length}
                  </h5>
                  <small className="text-muted">عيادات بطاقم طبي</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* قائمة العيادات */}
      <div className="row">
        {filteredSalons.map((salon) => (
          <div key={salon.id} className="col-lg-4 col-md-6 mb-4">
            <DoctorCard 
              salonData={salon}
              onClick={() => onSalonSelect && onSalonSelect(salon)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

SalonList.displayName = 'SalonList';

export default SalonList;
