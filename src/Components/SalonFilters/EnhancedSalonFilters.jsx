import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

/**
 * فلتر محسن للعيادات مع بيانات احتياطية
 */
const EnhancedSalonFilters = ({ 
  onSearchChange, 
  onCategoryChange, 
  onLocationChange,
  searchTerm = '',
  selectedCategory = null,
  selectedLocation = null
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // فئات احتياطية
  const categories = [
    { id: null, title_ar: 'جميع التخصصات' },
    { id: 1, title_ar: 'علاج الأسنان' },
    { id: 2, title_ar: 'تقويم الأسنان' },
    { id: 3, title_ar: 'طب الأطفال' },
    { id: 4, title_ar: 'طب العيون' },
    { id: 5, title_ar: 'الجلدية' }
  ];

  // مدن احتياطية
  const locations = [
    { id: null, name: 'جميع المدن' },
    { id: 'riyadh', name: 'الرياض' },
    { id: 'jeddah', name: 'جدة' },
    { id: 'dammam', name: 'الدمام' },
    { id: 'medina', name: 'المدينة المنورة' },
    { id: 'taif', name: 'الطائف' }
  ];

  // معالجة تغيير البحث مع debounce
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // تطبيق البحث بعد 300ms من توقف الكتابة
    setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, 300);
  }, [onSearchChange]);

  // معالجة تغيير الفئة
  const handleCategoryChange = useCallback((e) => {
    const categoryId = e.target.value === '' ? null : parseInt(e.target.value);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  }, [onCategoryChange]);

  // معالجة تغيير الموقع
  const handleLocationChange = useCallback((e) => {
    const locationId = e.target.value === '' ? null : e.target.value;
    if (onLocationChange) {
      onLocationChange(locationId);
    }
  }, [onLocationChange]);

  // إعادة تعيين الفلاتر
  const handleResetFilters = useCallback(() => {
    setLocalSearchTerm('');
    if (onSearchChange) onSearchChange('');
    if (onCategoryChange) onCategoryChange(null);
    if (onLocationChange) onLocationChange(null);
  }, [onSearchChange, onCategoryChange, onLocationChange]);

  // التحقق من وجود فلاتر نشطة
  const hasActiveFilters = localSearchTerm || selectedCategory || selectedLocation;

  return (
    <div className="salon-filters bg-white shadow-sm border-bottom sticky-top">
      <div className="container-fluid py-3">
        {/* شريط البحث الرئيسي */}
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="search-container position-relative">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="search-icon text-muted"
              />
              <input
                type="text"
                className="form-control search-input ps-5"
                placeholder="ابحث عن طبيب أو عيادة أو عنوان..."
                value={localSearchTerm}
                onChange={handleSearchChange}
                style={{
                  borderRadius: '25px',
                  border: '2px solid #e9ecef',
                  padding: '12px 20px 12px 45px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
              />
              {localSearchTerm && (
                <button
                  className="btn btn-sm btn-outline-secondary clear-search"
                  onClick={() => {
                    setLocalSearchTerm('');
                    onSearchChange('');
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    padding: '0'
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} size="xs" />
                </button>
              )}
            </div>
          </div>

          <div className="col-md-6 text-end">
            <div className="d-flex align-items-center justify-content-end gap-2">
              <button
                className="btn btn-outline-primary d-md-none"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                style={{ borderRadius: '20px' }}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                فلاتر
              </button>

              {hasActiveFilters && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={handleResetFilters}
                  style={{ borderRadius: '20px' }}
                >
                  <FontAwesomeIcon icon={faTimes} className="me-1" />
                  إعادة تعيين
                </button>
              )}
            </div>
          </div>
        </div>

        {/* فلاتر الفئات والمواقع - مرئية على الشاشات الكبيرة */}
        <div className="row mt-3 d-none d-md-block">
          <div className="col-12">
            <div className="row">
              <div className="col-md-6">
                <div className="categories-filter">
                  <div className="d-flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id || 'all'}
                        className={`btn btn-sm category-btn ${
                          selectedCategory === category.id 
                            ? 'btn-primary' 
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleCategoryChange({ 
                          target: { value: category.id || '' } 
                        })}
                        style={{ borderRadius: '20px' }}
                      >
                        {category.title_ar}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="locations-filter">
                  <div className="d-flex flex-wrap gap-2">
                    {locations.map((location) => (
                      <button
                        key={location.id || 'all'}
                        className={`btn btn-sm location-btn ${
                          selectedLocation === location.id 
                            ? 'btn-success' 
                            : 'btn-outline-success'
                        }`}
                        onClick={() => handleLocationChange({ 
                          target: { value: location.id || '' } 
                        })}
                        style={{ borderRadius: '20px' }}
                      >
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                        {location.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* فلاتر للشاشات الصغيرة */}
        {isFiltersOpen && (
          <div className="row mt-3 d-md-none">
            <div className="col-12">
              <div className="mobile-filters bg-light p-3 rounded">
                <h6 className="mb-3">التخصصات</h6>
                <div className="row mb-3">
                  {categories.map((category) => (
                    <div key={category.id || 'all'} className="col-6 mb-2">
                      <button
                        className={`btn btn-sm w-100 ${
                          selectedCategory === category.id 
                            ? 'btn-primary' 
                            : 'btn-outline-primary'
                        }`}
                        onClick={() => handleCategoryChange({ 
                          target: { value: category.id || '' } 
                        })}
                        style={{ borderRadius: '15px' }}
                      >
                        {category.title_ar}
                      </button>
                    </div>
                  ))}
                </div>
                
                <h6 className="mb-3">المدن</h6>
                <div className="row">
                  {locations.map((location) => (
                    <div key={location.id || 'all'} className="col-6 mb-2">
                      <button
                        className={`btn btn-sm w-100 ${
                          selectedLocation === location.id 
                            ? 'btn-success' 
                            : 'btn-outline-success'
                        }`}
                        onClick={() => handleLocationChange({ 
                          target: { value: location.id || '' } 
                        })}
                        style={{ borderRadius: '15px' }}
                      >
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                        {location.name}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS محسن */}
      <style jsx>{`
        .salon-filters {
          position: sticky;
          top: 0;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        .search-container {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
        }

        .search-input:focus {
          border-color: var(--bs-primary) !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }

        .category-btn, .location-btn {
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .category-btn:hover, .location-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .mobile-filters {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EnhancedSalonFilters;
