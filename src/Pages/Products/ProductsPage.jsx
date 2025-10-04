import React, { useState, useEffect, useMemo } from 'react';
import useOffersData from '../../hooks/useOffersData';
import placeholderImg from '../../assets/images/الاسنان.png';

// Image component with loading state
const ProductImage = ({ src, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', height: '380px' }}>
      {/* Placeholder - shown while loading or on error */}
      {(!imageLoaded || imageError) && (
        <img
          src={placeholderImg}
          alt="loading"
          className="img-fluid w-100 shadow d-block"
          style={{
            width: '100%',
            height: '380px',
            objectFit: 'contain',
            backgroundColor: '#f8f9fa',
            position: imageLoaded && !imageError ? 'absolute' : 'relative',
            opacity: imageError ? 1 : 0.5
          }}
        />
      )}
      
      {/* Actual image from API */}
      <img
        src={src}
        alt={alt}
        className="img-fluid w-100 shadow d-block"
        style={{
          width: '100%',
          height: '380px',
          objectFit: 'cover',
          display: imageLoaded && !imageError ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          setImageError(true);
          setImageLoaded(true);
        }}
      />
    </div>
  );
};

const ProductsPage = () => {
  const [sortBy, setSortBy] = useState('الافتراضي');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [showDiscountsOnly, setShowDiscountsOnly] = useState(false);

  // Fetch offers data from API
  const { data: apiProducts, loading, error } = useOffersData();

  const sortOptions = [
    'الافتراضي',
    'الأحدث',
    'الأكثر شعبية',
    'الأقل سعر',
    'الأعلى سعر'
  ];

  // إغلاق الـ dropdown عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showSortDropdown && !e.target.closest('.sort-dropdown-container')) {
        setShowSortDropdown(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showSortDropdown]);
  
  // Filter and sort products
  const products = useMemo(() => {
    if (!apiProducts || apiProducts.length === 0) {
      return [];
    }

    let filtered = [...apiProducts];

    // Filter by price range
    if (priceFrom) {
      filtered = filtered.filter(p => p.price >= Number(priceFrom));
    }
    if (priceTo) {
      filtered = filtered.filter(p => p.price <= Number(priceTo));
    }

    // Filter discounts only
    if (showDiscountsOnly) {
      filtered = filtered.filter(p => p.discount && p.discount > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'الأحدث':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'الأقل سعر':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'الأعلى سعر':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'الأكثر شعبية':
        // يمكن إضافة sorting حسب bookings_count لاحقاً
        break;
      default:
        break;
    }

    return filtered;
  }, [apiProducts, priceFrom, priceTo, showDiscountsOnly, sortBy]);

  return (
    <>
      {/* Filter Modal */}
      {showFilterModal && (
        <>
          {/* Overlay */}
          <div 
            onClick={() => setShowFilterModal(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9998,
              display: showFilterModal ? 'block' : 'none'
            }}
          />
          
          {/* Modal */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            padding: '2.5rem',
            width: '95%',
            maxWidth: '600px',
            zIndex: 9999,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowFilterModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                border: '1px solid #ddd',
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#484848'
              }}
            >
              ✕
            </button>

            {/* السعر */}
            <div className="mb-4">
              <h3 style={{
                color: '#0171BD',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '1.5rem',
                textAlign: 'right'
              }}>
                السعر
              </h3>

              {/* Price Inputs */}
              <div className="d-flex gap-3 mb-3">
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    textAlign: 'right', 
                    marginBottom: '0.5rem',
                    color: '#6c757d',
                    fontSize: '14px'
                  }}>
                    من
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={priceFrom}
                      onChange={(e) => setPriceFrom(e.target.value)}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        paddingLeft: '50px',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '16px',
                        textAlign: 'right',
                        color: '#484848'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      SAR
                    </span>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    textAlign: 'right', 
                    marginBottom: '0.5rem',
                    color: '#6c757d',
                    fontSize: '14px'
                  }}>
                    إلى
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      value={priceTo}
                      onChange={(e) => setPriceTo(e.target.value)}
                      placeholder="10000"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        paddingLeft: '50px',
                        border: '1px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '16px',
                        textAlign: 'right',
                        color: '#484848'
                      }}
                    />
                    <span style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6c757d',
                      fontSize: '14px'
                    }}>
                      SAR
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Range Slider */}
              <div style={{ 
                padding: '0.5rem 0',
                marginBottom: '1.5rem'
              }}>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceTo || 10000}
                  onChange={(e) => setPriceTo(e.target.value)}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '5px',
                    outline: 'none',
                    background: `linear-gradient(to left, #0171BD 0%, #0171BD ${((priceTo || 10000) / 10000) * 100}%, #e9ecef ${((priceTo || 10000) / 10000) * 100}%, #e9ecef 100%)`,
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                  className="price-range-slider"
                />
              </div>

              {/* عرض التخفيضات فقط */}
              <div 
                onClick={() => setShowDiscountsOnly(!showDiscountsOnly)}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: showDiscountsOnly ? '2px solid #0171BD' : '1px solid #e9ecef',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  color: '#484848',
                  fontSize: '16px',
                  fontWeight: '500'
                }}>
                  عرض التخفيضات فقط
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-3">
              <button
                onClick={() => setShowFilterModal(false)}
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  backgroundColor: '#0171BD',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C5B34E'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0171BD'}
              >
                مسح
              </button>
              
              <button
                onClick={() => setShowFilterModal(false)}
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  color: '#484848',
                  fontSize: '16px',
                  fontWeight: '400',
                  cursor: 'pointer'
                }}
              >
                تطبيق
              </button>
            </div>
          </div>
        </>
      )}

    <div className="mt-5 products-page-container" style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '40px' }}>
      <div className="container py-4" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* العنوان الرئيسي */}
        <div className="text-end mb-4" style={{
          backgroundColor: '#F9F9F9',
          padding: '1.5rem 2rem',
          borderRadius: '12px',
          width: '100%'
        }}>
          <h1 style={{ 
            color: '#484848', 
            fontWeight: '700', 
            fontSize: 'clamp(24px, 5vw, 32px)',
            marginBottom: '0'
          }}>
            جميع المنتجات
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* شريط الفلترة والترتيب */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
              {/* عدد النتائج */}
              <div style={{ 
                color: '#6c757d', 
                fontSize: '18px',
                fontWeight: '700',
                order: 3,
                paddingRight: '2rem'
              }} className="order-lg-1">
                تم إيجاد <span style={{ color: '#000000' }}>{products.length}</span> منتجات
              </div>

          {/* الفلترة والترتيب */}
          <div className="d-flex gap-3 flex-wrap order-1 order-lg-2 products-filter-buttons">
            {/* تصفية النتائج */}
            <button 
              onClick={() => setShowFilterModal(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                color: '#484848',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              تصفية النتائج
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5C3 4.22386 3.22386 4 3.5 4H20.5C20.7761 4 21 4.22386 21 4.5V7.5C21 7.63261 20.9473 7.75979 20.8536 7.85355L14.5 14.2071V20.5C14.5 20.6326 14.4473 20.7598 14.3536 20.8536L11.3536 23.8536C11.1583 24.0488 10.8417 24.0488 10.6464 23.8536C10.5527 23.7598 10.5 23.6326 10.5 23.5V14.2071L4.14645 7.85355C4.05268 7.75979 4 7.63261 4 7.5V4.5C4 4.22386 4.22386 4 4.5 4H3.5C3.22386 4 3 4.22386 3 4.5Z" fill="#484848" stroke="#484848" strokeWidth="2"/>
              </svg>
            </button>

            {/* ترتيب حسب */}
            <button 
              style={{
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                color: '#0171BD',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ترتيب حسب
            </button>

            {/* الأكثر مبيعاً - Dropdown */}
            <div className="sort-dropdown-container" style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e9ecef',
                  borderRadius: '6px',
                  color: '#484848',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {sortBy}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5L12 15M12 5L9 8M12 5L15 8" stroke="#484848" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 10L17 20M17 20L14 17M17 20L20 17" stroke="#484848" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showSortDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minWidth: '180px',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  {sortOptions.map((option, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      style={{
                        padding: '0.8rem 1rem',
                        cursor: 'pointer',
                        textAlign: 'right',
                        backgroundColor: sortBy === option ? '#f8f9fa' : '#ffffff',
                        borderBottom: idx !== sortOptions.length - 1 ? '1px solid #f0f0f0' : 'none',
                        color: '#484848',
                        fontSize: '14px',
                        fontWeight: sortBy === option ? '500' : '400',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = sortBy === option ? '#f8f9fa' : '#ffffff'}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Line */}
        <hr style={{ 
          width: '95%', 
          border: 'none', 
          borderTop: '2px solid #e0e0e0',
          margin: '0 auto 2rem auto'
        }} />

            {/* المنتجات Grid */}
            <div className="row g-4">
              {products.length === 0 ? (
                <div className="col-12 text-center py-5">
                  <p style={{ color: '#6c757d', fontSize: '18px' }}>لا توجد منتجات</p>
                </div>
              ) : (
                products.map((product) => {
                  // Get product image
                  const productImage = product.images && product.images.length > 0 
                    ? product.images[0].image 
                    : null;

                  // Skip products without images
                  if (!productImage) {
                    return null;
                  }

                  return (
                    <div key={product.id} className="col-12 col-lg-3">
                      <div className="h-100">
                        <div className="card w-100 h-100 border-0 position-relative product-offer-card" style={{ 
                          maxWidth: '100%',
                          borderRadius: '10px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          background: 'white',
                          transition: 'all 0.3s ease'
                        }}>
                          {/* Product Image */}
                          <ProductImage 
                            src={productImage}
                            alt={product.title_ar}
                          />

                          {/* Product Info */}
                          <div className="card-body py-2" style={{ 
                            paddingTop: '8px', 
                            paddingBottom: '8px',
                            paddingLeft: '12px',
                            paddingRight: '12px'
                          }}>
                            {/* Service Name */}
                            <h5 className="card-title fw-semibold text-end mb-2" style={{ 
                              color: '#484848',
                              fontSize: '18px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              minHeight: '50px'
                            }}>
                              {product.title_ar}
                            </h5>
                            
                            {/* Price */}
                            <div className="d-flex align-items-center justify-content-center mt-2" style={{ gap: '6px' }}>
                              <span className="fw-bold" style={{ color: '#0171BD', fontSize: '22px', lineHeight: 1 }}>
                                {product.price > 0 ? product.price : 'اتصل للسعر'}
                              </span>
                              {product.price > 0 && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 1124.14 1256.39"
                                  width="12"
                                  height="13"
                                  style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 2px' }}
                                  aria-label="Saudi Riyal"
                                  title="Saudi Riyal"
                                >
                                  <path fill="#231f20" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"></path>
                                  <path fill="#231f20" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
                                </svg>
                              )}
                            </div>
                          </div>

                          {/* Quick View Button */}
                          <button
                            type="button"
                            className="product-quick-view-btn"
                            aria-label="عرض سريع"
                          >
                            عرض سريع
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

      </div>

      <style>{`
        /* Product Card Hover Effects - نفس Services */
        .product-offer-card { 
          position: relative; 
        }
        
        .product-offer-card .product-quick-view-btn {
          position: absolute;
          left: 50%;
          transform: translate(-50%, 100%);
          bottom: 18%;
          width: 85%;
          height: 44px;
          background: #0171BD;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          transition: transform 0.35s ease, opacity 0.35s ease;
          opacity: 0;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          z-index: 3;
          cursor: pointer;
        }
        
        .product-offer-card:hover .product-quick-view-btn { 
          transform: translate(-50%, 0); 
          opacity: 1; 
        }
        
        .product-offer-card .product-quick-view-btn:hover { 
          filter: brightness(0.95); 
        }
        
        .product-offer-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        /* Price Range Slider Styles */
        .price-range-slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #ffffff;
          border: 3px solid #0171BD;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .price-range-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #ffffff;
          border: 3px solid #0171BD;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        @media (max-width: 576px) {
          .product-offer-card img {
            height: 250px !important;
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default ProductsPage;
