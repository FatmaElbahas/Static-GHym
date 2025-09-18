import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStethoscope, 
  faHeartbeat, 
  faTooth, 
  faEye, 
  faBrain,
  faCalendarPlus,
  faStar,
  faMapMarkerAlt,
  faClock,
  faMoneyBillWave,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState(['الكل']);
  const [reloadKey, setReloadKey] = useState(0);

  const SERVICES_URL = 'https://enqlygo.com/api/salons/services';
  const CATEGORIES_URL = 'https://enqlygo.com/api/salons/categories';

  // Load services and categories from API
  useEffect(() => {
    const controller = new AbortController();
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [servicesRes, categoriesRes] = await Promise.all([
          fetch(SERVICES_URL, { signal: controller.signal }),
          fetch(CATEGORIES_URL, { signal: controller.signal })
        ]);

        if (!servicesRes.ok) {
          // حاول قراءة رسالة السيرفر إن وُجدت
          let msg = `Services API error: HTTP ${servicesRes.status}`;
          try {
            const txt = await servicesRes.text();
            console.log('Services API raw error:', txt);
            try { const j = JSON.parse(txt); if (j?.message) msg = j.message; } catch {}
          } catch {}
          throw new Error(msg);
        }
        if (!categoriesRes.ok) {
          let msg = `Categories API error: HTTP ${categoriesRes.status}`;
          try {
            const txt = await categoriesRes.text();
            console.log('Categories API raw error:', txt);
            try { const j = JSON.parse(txt); if (j?.message) msg = j.message; } catch {}
          } catch {}
          throw new Error(msg);
        }

        const [servicesJson, categoriesJson] = await Promise.all([
          servicesRes.json(),
          categoriesRes.json()
        ]);

        if (servicesJson?.status === 'error') {
          throw new Error(servicesJson?.message || 'حدث خطأ في جلب الخدمات');
        }
        if (categoriesJson?.status === 'error') {
          throw new Error(categoriesJson?.message || 'حدث خطأ في جلب التصنيفات');
        }

        // Process services
        const servicesList = Array.isArray(servicesJson?.data) ? servicesJson.data : [];
        const formattedServices = servicesList.map((service) => ({
          id: service.id,
          name: service.title_ar || service.title || service.title_en,
          description: service.about_ar || service.about || service.about_en,
          icon: getServiceIcon(service.category_id),
          price: `${service.price} ريال`,
          duration: `${service.service_time} دقيقة`,
          location: `عيادة ${service.salon_id || 'متخصصة'}`,
          rating: 4.5, // Default rating since not provided in API
          available: service.status === 1,
          category: getCategoryName(service.category_id, categoriesJson.data),
          discount: service.discount,
          originalPrice: service.price,
          images: service.images || []
        }));
        setServices(formattedServices);

        // Process categories
        const categoriesList = Array.isArray(categoriesJson?.data) ? categoriesJson.data : [];
        const categoryNames = ['الكل', ...categoriesList.map(cat => cat.title_ar || cat.title)];
        setCategories(categoryNames);

      } catch (e) {
        if (e.name !== 'AbortError') {
          console.error('Services load error:', e);
          setError(e.message || 'حدث خطأ أثناء جلب البيانات');
        }
      } finally {
        // امنح وقتاً بسيطاً لضمان تجربة مرئية سلسة وحتى لا تختفي شاشة التحميل قبل ظهور البطاقات
        setTimeout(() => setLoading(false), 600);
      }
    };

    loadData();
    return () => controller.abort();
  }, [reloadKey]);

  // Helper function to get service icon based on category
  const getServiceIcon = (categoryId) => {
    switch (categoryId) {
      case 1: return faTooth;
      case 2: return faTooth;
      default: return faStethoscope;
    }
  };

  // Helper function to get category name
  const getCategoryName = (categoryId, categoriesList) => {
    if (!categoriesList) return 'عام';
    const category = categoriesList.find(cat => cat.id === categoryId);
    return category ? (category.title_ar || category.title) : 'عام';
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'الكل' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="services-section">
      <div className="section-header">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faStethoscope} className="me-2" />
          الخدمات المتاحة
        </h3>
      </div>

      {/* Filters */}
      {!loading && (
        <div className="services-filters mb-4">
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="البحث في الخدمات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="d-flex align-items-center justify-content-center py-5">
          <div className="text-center p-4 rounded-3 shadow-sm" style={{ background:'#fff', minWidth:'280px' }}>
            <FontAwesomeIcon icon={faSpinner} spin size="3x" style={{ color:'var(--color-main)' }} />
            <div className="mt-3 fw-semibold" style={{ color:'var(--color-main)' }}>جاري تحميل الخدمات...</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-light" onClick={() => setReloadKey(k => k + 1)}>
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Services Grid */}
      {!loading && !error && (
        <div className="services-content">
          <div className="row">
            {filteredServices.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4 mb-4">
              <div className={`service-card ${!service.available ? 'unavailable' : ''}`}>
                <div className="service-header">
                  <div className="service-icon">
                    <FontAwesomeIcon icon={service.icon} />
                  </div>
                  <div className="service-info">
                    <h5 className="service-name">{service.name}</h5>
                    <span className="service-category">{service.category}</span>
                  </div>
                  {!service.available && (
                    <span className="unavailable-badge">غير متاح</span>
                  )}
                </div>
                
                <div className="service-body">
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-details">
                    <div className="detail-row">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                      <span>
                        {service.discount ? (
                          <>
                            <span className="text-decoration-line-through text-muted me-2">
                              {service.originalPrice} ريال
                            </span>
                            <span className="text-success fw-bold">
                              {service.price} (خصم {service.discount}%)
                            </span>
                          </>
                        ) : (
                          service.price
                        )}
                      </span>
                    </div>
                    <div className="detail-row">
                      <FontAwesomeIcon icon={faClock} className="me-2" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="detail-row">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      <span>{service.location}</span>
                    </div>
                    <div className="detail-row">
                      <FontAwesomeIcon icon={faStar} className="me-2" />
                      <span>{service.rating} ⭐</span>
                    </div>
                  </div>
                </div>
                
                <div className="service-footer">
                  {service.available ? (
                    <button className="btn btn-primary w-100">
                      <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
                      حجز الخدمة
                    </button>
                  ) : (
                    <button className="btn btn-secondary w-100" disabled>
                      غير متاح حالياً
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-5">
            <FontAwesomeIcon icon={faStethoscope} size="3x" className="text-muted mb-3" />
            <h5 className="text-muted">لا توجد خدمات متطابقة مع البحث</h5>
            <p className="text-muted">جرب تغيير معايير البحث</p>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default Services;
