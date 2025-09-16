import React, { useState, useCallback } from 'react';
import SidebarFilter from '../Filter/SidebarFilter';
import EnhancedSalonList from '../SalonList/EnhancedSalonList';

/**
 * لوحة تحكم كاملة للعيادات مع فلتر جانبي متكامل
 */
const CompleteSalonDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  // تبديل حالة الفلتر الجانبي
  const handleSidebarToggle = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // إحصائيات سريعة
  const getFilterSummary = useCallback(() => {
    const filters = [];
    if (searchTerm) filters.push(`البحث: "${searchTerm}"`);
    if (selectedCategory) filters.push(`التخصص: ${selectedCategory}`);
    if (selectedLocation) filters.push(`المدينة: ${selectedLocation}`);
    return filters.length > 0 ? filters.join(' • ') : 'لا توجد فلاتر نشطة';
  }, [searchTerm, selectedCategory, selectedLocation]);

  return (
    <div className="complete-salon-dashboard">
      {/* Header */}
      <div className="dashboard-header bg-primary text-white py-4 shadow">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="mb-0">
                <i className="fas fa-hospital me-3"></i>
                العيادات والمراكز الطبية
              </h1>
              <p className="mb-0 mt-2 opacity-75">
                اكتشف أفضل العيادات والمراكز الطبية في منطقتك
              </p>
            </div>
            <div className="col-md-4 text-end">
              <div className="header-actions">
                <button 
                  className="btn btn-outline-light me-2"
                  onClick={handleSidebarToggle}
                  style={{ borderRadius: '25px' }}
                >
                  <i className={`fas ${isSidebarOpen ? 'fa-eye-slash' : 'fa-filter'} me-2`}></i>
                  {isSidebarOpen ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="filter-summary bg-light border-bottom py-2">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-8">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                {getFilterSummary()}
              </small>
            </div>
            <div className="col-md-4 text-end">
              {(searchTerm || selectedCategory || selectedLocation) && (
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory(null);
                    setSelectedLocation(null);
                  }}
                  style={{ borderRadius: '15px' }}
                >
                  <i className="fas fa-times me-1"></i>
                  إعادة تعيين
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar Filter */}
            <div className={`sidebar-column ${isSidebarOpen ? 'col-lg-3 col-md-4' : 'col-0'}`}>
              {isSidebarOpen && (
                <div className="sidebar-wrapper">
                  <SidebarFilter
                    onSearchChange={handleSearchChange}
                    onCategoryChange={handleCategoryChange}
                    onLocationChange={handleLocationChange}
                    onToggle={handleSidebarToggle}
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    selectedLocation={selectedLocation}
                    isOpen={isSidebarOpen}
                  />
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className={`main-content-column ${isSidebarOpen ? 'col-lg-9 col-md-8' : 'col-12'}`}>
              <div className="content-wrapper">
                <EnhancedSalonList
                  searchTerm={searchTerm}
                  selectedCategory={selectedCategory}
                  selectedLocation={selectedLocation}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="d-md-none">
        <button 
          className="btn btn-primary floating-filter-btn"
          onClick={handleSidebarToggle}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1001,
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            animation: 'pulse 2s infinite'
          }}
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-filter'}`}></i>
        </button>
      </div>

      {/* CSS محسن */}
      <style jsx>{`
        .complete-salon-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .dashboard-header {
          background: linear-gradient(135deg, var(--bs-primary) 0%, #0d6efd 100%);
          position: relative;
          overflow: hidden;
        }

        .dashboard-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .dashboard-header .container-fluid {
          position: relative;
          z-index: 2;
        }

        .sidebar-column {
          transition: all 0.3s ease;
        }

        .sidebar-wrapper {
          position: sticky;
          top: 0;
          height: calc(100vh - 120px);
        }

        .main-content-column {
          transition: all 0.3s ease;
        }

        .content-wrapper {
          padding: '20px 0';
          min-height: calc(100vh - 200px);
        }

        .filter-summary {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }

        .floating-filter-btn:hover {
          transform: scale(1.1);
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(13, 110, 253, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(13, 110, 253, 0);
          }
        }

        /* تحسينات للشاشات الصغيرة */
        @media (max-width: 768px) {
          .sidebar-column {
            position: fixed;
            top: 0;
            right: 0;
            height: 100vh;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
          }

          .sidebar-column.col-lg-3 {
            transform: translateX(0);
          }

          .main-content-column {
            width: 100% !important;
            flex: 0 0 100% !important;
            max-width: 100% !important;
          }
        }

        /* تحسينات الأداء */
        .complete-salon-dashboard * {
          box-sizing: border-box;
        }

        .dashboard-content {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default CompleteSalonDashboard;
