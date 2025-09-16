import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCategories } from '../../hooks/useCategories';

/**
 * مكون محسن للفلاتر مع ربط API الفئات
 * يحسن تجربة المستخدم مع فلاتر متقدمة وبحث سريع
 */
const SalonFilters = React.memo(({ 
  onSearchChange, 
  onCategoryChange, 
  onFilterToggle,
  isFiltersOpen = false,
  searchTerm = '',
  selectedCategory = null 
}) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // فئات محسنة للعرض
  const categoryOptions = useMemo(() => {
    if (!categories.length) return [];
    
    return [
      { id: null, title_ar: 'جميع التخصصات', title_en: 'All Categories' },
      ...categories
    ];
  }, [categories]);

  // معالجة تغيير البحث مع debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    // تطبيق البحث بعد 300ms من توقف الكتابة
    setTimeout(() => {
      if (onSearchChange) {
        onSearchChange(value);
      }
    }, 300);
  };

  // معالجة تغيير الفئة
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value === '' ? null : parseInt(e.target.value);
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };

  // إعادة تعيين الفلاتر
  const handleResetFilters = () => {
    setLocalSearchTerm('');
    if (onSearchChange) onSearchChange('');
    if (onCategoryChange) onCategoryChange(null);
  };

  // التحقق من وجود فلاتر نشطة
  const hasActiveFilters = localSearchTerm || selectedCategory;

  return (
    <div className="salon-filters bg-white shadow-sm border-bottom">
      <div className="container-fluid py-3">
        {/* شريط البحث الرئيسي */}
        <div className="row align-items-center">
          <div className="col-md-8">
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
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-main)';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(3, 143, 173, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.boxShadow = 'none';
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

          <div className="col-md-4 text-end">
            <div className="d-flex align-items-center justify-content-end gap-2">
              {/* زر الفلاتر */}
              <button
                className="btn btn-outline-primary d-md-none"
                onClick={onFilterToggle}
                style={{ borderRadius: '20px' }}
              >
                <FontAwesomeIcon icon={faFilter} className="me-2" />
                فلاتر
              </button>

              {/* إعادة تعيين الفلاتر */}
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

              {/* عداد النتائج */}
              <span className="text-muted small">
                {hasActiveFilters ? 'فلاتر نشطة' : 'جميع النتائج'}
              </span>
            </div>
          </div>
        </div>

        {/* فلاتر الفئات - مرئية على الشاشات الكبيرة */}
        <div className="row mt-3 d-none d-md-block">
          <div className="col-12">
            <div className="categories-filter">
              <div className="d-flex flex-wrap gap-2">
                {categoryOptions.map((category) => (
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
                    disabled={categoriesLoading}
                  >
                    {category.title_ar}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* فلاتر الفئات - للشاشات الصغيرة */}
        {isFiltersOpen && (
          <div className="row mt-3 d-md-none">
            <div className="col-12">
              <div className="mobile-filters bg-light p-3 rounded">
                <h6 className="mb-3">التخصصات</h6>
                <div className="row">
                  {categoryOptions.map((category) => (
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
                        disabled={categoriesLoading}
                      >
                        {category.title_ar}
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

        .search-input {
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: var(--color-main) !important;
          box-shadow: 0 0 0 0.2rem rgba(3, 143, 173, 0.25) !important;
        }

        .category-btn {
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .category-btn:hover {
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
});

SalonFilters.displayName = 'SalonFilters';

export default SalonFilters;
