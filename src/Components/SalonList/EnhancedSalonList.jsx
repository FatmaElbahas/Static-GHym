import React, { useState, useEffect, useCallback, useMemo } from 'react';
import DoctorCard from '../DoctorCard/DoctorCard';

/**
 * قائمة عيادات محسنة مع بيانات احتياطية
 */
const EnhancedSalonList = ({ 
  searchTerm = '', 
  selectedCategory = null,
  selectedLocation = null
}) => {
  const [salons, setSalons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // بيانات احتياطية
  const fallbackSalons = [
    {
      id: 1,
      owner_name: "د. أحمد محمد",
      salon_name: "عيادة الأسنان الذهبية",
      salon_address: "شارع الملك فهد - الرياض",
      salon_phone: "+966 112345678",
      rating: 4.5,
      reviews_avg_rating: 4.8,
      total_completed_bookings: 150,
      salon_categories: "1,2",
      created_at: "2025-01-01T00:00:00.000000Z",
      updated_at: "2025-01-01T00:00:00.000000Z"
    },
    {
      id: 2,
      owner_name: "د. سارة أحمد",
      salon_name: "مركز طب الأسنان المتقدم",
      salon_address: "طريق الملك عبدالعزيز - جدة",
      salon_phone: "+966 123456789",
      rating: 4.2,
      reviews_avg_rating: 4.6,
      total_completed_bookings: 89,
      salon_categories: "1,3",
      created_at: "2025-01-02T00:00:00.000000Z",
      updated_at: "2025-01-02T00:00:00.000000Z"
    },
    {
      id: 3,
      owner_name: "د. محمد علي",
      salon_name: "عيادة الأسنان المتميزة",
      salon_address: "شارع البحر - المدينة المنورة",
      salon_phone: "+966 145678901",
      rating: 4.8,
      reviews_avg_rating: 4.9,
      total_completed_bookings: 200,
      salon_categories: "2,4",
      created_at: "2025-01-03T00:00:00.000000Z",
      updated_at: "2025-01-03T00:00:00.000000Z"
    }
  ];

  // جلب بيانات العيادات
  const fetchSalons = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching salons data...');
      const response = await fetch('https://enqlygo.com/api/salons');
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 API Response:', data);
        
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
      
      // استخدام البيانات الاحتياطية
      console.log('🔄 Using fallback data');
      setSalons(fallbackSalons);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalons();
  }, [fetchSalons]);

  // تصفية العيادات حسب البحث والفئة والموقع
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

      // تصفية حسب الموقع (استخراج المدينة من العنوان)
      const matchesLocation = !selectedLocation || 
        salon.salon_address?.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });

    // ترتيب حسب التقييم (الأعلى أولاً)
    return filtered.sort((a, b) => {
      const ratingA = a.reviews_avg_rating || a.rating || 0;
      const ratingB = b.reviews_avg_rating || b.rating || 0;
      return ratingB - ratingA;
    });
  }, [salons, searchTerm, selectedCategory, selectedLocation]);

  // معالجة الأخطاء
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
                {searchTerm || selectedCategory || selectedLocation
                  ? 'لم يتم العثور على عيادات تطابق معايير البحث'
                  : 'لا توجد عيادات متاحة حالياً'
                }
              </p>
              {(searchTerm || selectedCategory || selectedLocation) && (
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => window.location.reload()}
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
      {/* رسالة التحذير إذا كان هناك خطأ */}
      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>تحذير:</strong> فشل الاتصال بالخادم. يتم عرض بيانات تجريبية.
              <button 
                className="btn btn-sm btn-outline-primary ms-3"
                onClick={fetchSalons}
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      )}

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
            <DoctorCard salonData={salon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedSalonList;
