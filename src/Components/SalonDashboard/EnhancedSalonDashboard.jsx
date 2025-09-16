import React, { useState, useCallback } from 'react';
import EnhancedSalonFilters from '../SalonFilters/EnhancedSalonFilters';
import EnhancedSalonList from '../SalonList/EnhancedSalonList';

/**
 * لوحة تحكم محسنة للعيادات مع بيانات احتياطية
 */
const EnhancedSalonDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // معالجة تغيير البحث
  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // معالجة تغيير الفئة
  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // معالجة تغيير الموقع
  const handleLocationChange = useCallback((locationId) => {
    setSelectedLocation(locationId);
  }, []);

  // تبديل حالة الفلاتر (للشاشات الصغيرة)
  const handleFilterToggle = useCallback(() => {
    setIsFiltersOpen(prev => !prev);
  }, []);

  return (
    <div className="salon-dashboard">
      {/* عنوان الصفحة */}
      <div className="page-header bg-primary text-white py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="mb-0">
                <i className="fas fa-hospital me-3"></i>
                العيادات المتاحة
              </h1>
              <p className="mb-0 mt-2 opacity-75">
                اكتشف أفضل العيادات والمراكز الطبية في منطقتك
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">عيادة</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">تخصص</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">متاح</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* فلاتر البحث */}
      <EnhancedSalonFilters
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onLocationChange={handleLocationChange}
        onFilterToggle={handleFilterToggle}
        isFiltersOpen={isFiltersOpen}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
      />

      {/* قائمة العيادات */}
      <EnhancedSalonList
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        selectedLocation={selectedLocation}
      />

      {/* CSS محسن */}
      <style jsx>{`
        .salon-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .page-header {
          background: linear-gradient(135deg, var(--bs-primary) 0%, #0d6efd 100%);
          position: relative;
          overflow: hidden;
        }

        .page-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .page-header .container-fluid {
          position: relative;
          z-index: 2;
        }

        .stats-summary {
          display: flex;
          gap: 2rem;
          justify-content: flex-end;
        }

        .stat-item {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
          margin-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .stats-summary {
            gap: 1rem;
            margin-top: 1rem;
            justify-content: center;
          }
          
          .stat-number {
            font-size: 1.25rem;
          }
          
          .stat-label {
            font-size: 0.75rem;
          }
        }

        /* تحسينات إضافية للأداء */
        .salon-dashboard * {
          box-sizing: border-box;
        }

        /* تحسين التمرير */
        .salon-dashboard {
          scroll-behavior: smooth;
        }

        /* تحسين الظلال */
        .page-header {
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default EnhancedSalonDashboard;
