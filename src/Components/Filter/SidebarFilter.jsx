import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faFilter, 
  faTimes, 
  faMapMarkerAlt, 
  faStethoscope,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { useCategories } from '../../hooks/useCategories';

/**
 * فلتر جانبي للعيادات مع تكامل كامل مع API الفئات
 */
const SidebarFilter = ({ 
  onSearchChange, 
  onCategoryChange, 
  onLocationChange,
  searchTerm = '',
  selectedCategory = null,
  selectedLocation = null,
  isOpen = true,
  onToggle
}) => {
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    rating: false
  });

  // مدن احتياطية
  const locations = [
    { id: null, name: 'جميع المدن' },
    { id: 'riyadh', name: 'الرياض' },
    { id: 'jeddah', name: 'جدة' },
    { id: 'dammam', name: 'الدمام' },
    { id: 'medina', name: 'المدينة المنورة' },
    { id: 'taif', name: 'الطائف' },
    { id: 'khobar', name: 'الخبر' },
    { id: 'dhahran', name: 'الظهران' }
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
  const handleCategoryChange = useCallback((categoryId) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  }, [onCategoryChange]);

  // معالجة تغيير الموقع
  const handleLocationChange = useCallback((locationId) => {
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

  // تبديل توسيع القسم
  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // التحقق من وجود فلاتر نشطة
  const hasActiveFilters = localSearchTerm || selectedCategory || selectedLocation;

  if (!isOpen) {
    return (
      <div className="sidebar-filter-closed">
        <button 
          className="btn btn-primary filter-toggle-btn"
          onClick={onToggle}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            borderRadius: '50px',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          <FontAwesomeIcon icon={faFilter} size="lg" />
        </button>
      </div>
    );
  }

  return (
    <div className="sidebar-filter bg-white shadow-lg h-100" style={{ minWidth: '320px' }}>
      {/* Header */}
      <div className="filter-header bg-primary text-white p-3">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faFilter} className="me-2" />
            فلاتر البحث
          </h5>
          <button 
            className="btn btn-sm btn-outline-light"
            onClick={onToggle}
            style={{ borderRadius: '50%', width: '30px', height: '30px', padding: '0' }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="filter-content p-3">
        {/* البحث */}
        <div className="search-section mb-4">
          <div className="position-relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="search-icon text-muted"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2
              }}
            />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="ابحث عن طبيب أو عيادة..."
              value={localSearchTerm}
              onChange={handleSearchChange}
              style={{
                borderRadius: '25px',
                border: '2px solid #e9ecef',
                padding: '10px 15px 10px 40px',
                fontSize: '0.9rem'
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
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  padding: '0'
                }}
              >
                <FontAwesomeIcon icon={faTimes} size="xs" />
              </button>
            )}
          </div>
        </div>

        {/* التخصصات */}
        <div className="categories-section mb-4">
          <div 
            className="section-header d-flex align-items-center justify-content-between cursor-pointer"
            onClick={() => toggleSection('categories')}
            style={{ cursor: 'pointer' }}
          >
            <h6 className="mb-0">
              <FontAwesomeIcon icon={faStethoscope} className="me-2 text-primary" />
              التخصصات
            </h6>
            <FontAwesomeIcon 
              icon={expandedSections.categories ? faChevronUp : faChevronDown} 
              className="text-muted"
            />
          </div>
          
          {expandedSections.categories && (
            <div className="section-content mt-3">
              {categoriesLoading ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                  </div>
                  <small className="text-muted ms-2">جاري تحميل التخصصات...</small>
                </div>
              ) : categoriesError ? (
                <div className="alert alert-warning alert-sm">
                  <small>فشل تحميل التخصصات</small>
                </div>
              ) : (
                <div className="categories-list">
                  {/* جميع التخصصات */}
                  <div 
                    className={`category-item p-2 mb-2 rounded cursor-pointer ${
                      selectedCategory === null ? 'bg-primary text-white' : 'bg-light'
                    }`}
                    onClick={() => handleCategoryChange(null)}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    <small className="fw-bold">جميع التخصصات</small>
                  </div>
                  
                  {/* قائمة التخصصات */}
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className={`category-item p-2 mb-2 rounded cursor-pointer ${
                        selectedCategory === category.id ? 'bg-primary text-white' : 'bg-light'
                      }`}
                      onClick={() => handleCategoryChange(category.id)}
                      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    >
                      <div className="d-flex align-items-center">
                        {category.icon_url && (
                          <img 
                            src={category.icon_url} 
                            alt={category.title_ar}
                            style={{ width: '20px', height: '20px', marginLeft: '8px' }}
                          />
                        )}
                        <div>
                          <small className="fw-bold d-block">{category.title_ar}</small>
                          {category.about_ar && (
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {category.about_ar}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* المدن */}
        <div className="locations-section mb-4">
          <div 
            className="section-header d-flex align-items-center justify-content-between cursor-pointer"
            onClick={() => toggleSection('location')}
            style={{ cursor: 'pointer' }}
          >
            <h6 className="mb-0">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-success" />
              المدن
            </h6>
            <FontAwesomeIcon 
              icon={expandedSections.location ? faChevronUp : faChevronDown} 
              className="text-muted"
            />
          </div>
          
          {expandedSections.location && (
            <div className="section-content mt-3">
              <div className="locations-list">
                {locations.map((location) => (
                  <div 
                    key={location.id || 'all'}
                    className={`location-item p-2 mb-2 rounded cursor-pointer ${
                      selectedLocation === location.id ? 'bg-success text-white' : 'bg-light'
                    }`}
                    onClick={() => handleLocationChange(location.id)}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  >
                    <small className="fw-bold">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1" />
                      {location.name}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* إعادة تعيين الفلاتر */}
        {hasActiveFilters && (
          <div className="reset-section">
            <button 
              className="btn btn-outline-danger w-100"
              onClick={handleResetFilters}
              style={{ borderRadius: '25px' }}
            >
              <FontAwesomeIcon icon={faTimes} className="me-2" />
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </div>

      {/* CSS محسن */}
      <style jsx>{`
        .sidebar-filter {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        .sidebar-filter-closed {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          z-index: 1000;
        }

        .filter-toggle-btn:hover {
          transform: scale(1.1);
        }

        .category-item:hover, .location-item:hover {
          transform: translateX(-5px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .section-header:hover {
          background-color: rgba(0,0,0,0.05);
          border-radius: 8px;
          padding: 8px;
          margin: -8px;
        }

        .filter-content {
          max-height: calc(100vh - 120px);
          overflow-y: auto;
        }

        /* تحسين التمرير */
        .filter-content::-webkit-scrollbar {
          width: 6px;
        }

        .filter-content::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .filter-content::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .filter-content::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default SidebarFilter;
