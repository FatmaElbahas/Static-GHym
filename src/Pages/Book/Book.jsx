import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Stats from '../../Components/Stats/Stats';
import Services from '../../Components/Services/Services';
import SearchResultCard from '../../Components/SearchResultCard/SearchResultCard.jsx';
import ImageSwiper from '../../Components/ImageSwiper/ImageSwiper';
import Logo from '../../assets/images/Logo.png';
import HeroBg from '../../assets/images/hero-bg.ab3138f8.webp';
import HeroBg2 from '../../assets/images/hero2.jpg';
import SidebarFilters from '../../Components/Filter/SidebarFilters.jsx';
import ReactPaginate from 'react-paginate';

export default function Book() {
  const [activeTab, setActiveTab] = useState("doctor");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCity, setSelectedCity] = useState("الرياض");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  // دالة البحث باستخدام API
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      alert("يرجى إدخال كلمة البحث");
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    try {
      let apiUrl = "https://enqlygo.com/api/salons?";
      
      if (activeTab === "doctor") {
        apiUrl += `owner_name=${encodeURIComponent(searchQuery)}`;
      } else if (activeTab === "clinic") {
        apiUrl += `salon_name=${encodeURIComponent(searchQuery)}`;
      } else {
        // البحث العام
        apiUrl += `owner_name=${encodeURIComponent(searchQuery)}&salon_name=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(apiUrl);
      const result = await response.json();
      
      if (result.status === "success" && result.data && result.data.length > 0) {
        console.log('Search results count:', result.data.length);
        setSearchResults(result.data);
        setPage(1);
      } else {
        console.log('No search results found');
        setSearchResults([]);
        alert("لم يتم العثور على نتائج");
      }
    } catch (error) {
      console.error("خطأ في البحث:", error);
      alert("حدث خطأ أثناء البحث");
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  }, [searchQuery, activeTab]);

  // دالة جلب جميع الأطباء من API
  const fetchAllDoctors = useCallback(async () => {
    if (hasLoadedRef.current) {
      return; // تجنب الاستدعاء المتكرر
    }
    
    try {
      hasLoadedRef.current = true;
      setIsInitialLoad(true);
      setIsLoading(true);
      
      const response = await fetch("https://enqlygo.com/api/salons");
      const result = await response.json();
      
      if (result.status === "success" && result.data && result.data.length > 0) {
        console.log('All doctors count:', result.data.length);
        setSearchResults(result.data);
        setPage(1);
      }
    } catch (error) {
      console.error("خطأ في جلب الأطباء:", error);
      hasLoadedRef.current = false; // إعادة تعيين في حالة الخطأ
    } finally {
      setIsInitialLoad(false);
      setIsLoading(false);
    }
  }, []);

  // دالة إعادة تعيين البحث
  const resetSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setPage(1);
    hasLoadedRef.current = false; // إعادة تعيين للسماح بالتحميل مرة أخرى
  }, []);

  const [page, setPage] = useState(1);
  const doctorsPerPage = 6; // عدد الكروت في الصفحة
  
  // تحديد البيانات المعروضة (من API فقط)
  const displayData = useMemo(() => {
    return searchResults;
  }, [searchResults]);

  const totalPages = useMemo(() => {
    const pages = Math.ceil(searchResults.length / doctorsPerPage);
    console.log('Total results:', searchResults.length, 'Pages:', pages, 'Per page:', doctorsPerPage);
    return pages;
  }, [searchResults.length, doctorsPerPage]);

  // تقطيع الكروت حسب الصفحة - للبيانات من API فقط
  const currentDoctors = useMemo(() => {
    return displayData.slice(
      (page - 1) * doctorsPerPage,
      page * doctorsPerPage
    );
  }, [displayData, page, doctorsPerPage]);

  // دالة تغيير الصفحة
  const handlePageChange = useCallback(({ selected }) => {
    setPage(selected + 1);
  }, []);

  // جلب الأطباء من API عند تحميل الصفحة (مرة واحدة فقط)
  useEffect(() => {
    if (!hasLoadedRef.current) {
      fetchAllDoctors();
    }
  }, []); // dependency array فارغ لضمان التنفيذ مرة واحدة فقط
  return (
    <>
      <Helmet>
        <title>بلسمي | blsmy</title>
        <meta name="description" content="مركز بلسمي الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة. احجز موعدك الآن واستفد من خدماتنا المتميزة" />
        <meta name="keywords" content="مركز طبي, خدمات جلدية, علاجات طبية, حجز موعد, بلسمي, صحة" />
        <meta property="og:title" content="بلسمي | blsmy" />
        <meta property="og:description" content="مركز بلسمي الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="book-page position-relative ">
      <section className="hero-section position-relative mb-0" style={{height: '60vh'}} dir="rtl">
  <div id="heroCarousel" className="carousel slide h-100" data-bs-ride="carousel" data-bs-interval="5000">
    <div className="carousel-inner h-100">

      {/* Slide 1 */}
      <div className="carousel-item active h-100">
        <div
          className="hero-background position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${HeroBg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        >
          <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end">
            <div className="hero-text " style={{ paddingTop: '15%', paddingRight:'15%' }}>
              <h1 className="brand-name color-main fw-bold mb-3" style={{ fontSize: '3.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                احجز موعدك بسهولة
              </h1>
              <p className="text-white fs-5 fw-medium pe-0" style={{ maxWidth: '500px' }}>
                فريقنا الطبي المتخصص في خدمتك على مدار الساعة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Slide 2 */}
      <div className="carousel-item h-100">
        <div
          className="hero-background position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${HeroBg})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }}
        >
          <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end">
            <div className="hero-text " style={{ paddingTop: '15%',  paddingRight:'15%'  }}>
              <h1 className="brand-name color-main fw-bold mb-3" style={{ fontSize: '3.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                دكاتره متميزة ورائدة
              </h1>
              <p className="text-white fs-5 fw-medium pe-0" style={{ maxWidth: '500px' }}>
                احصلي على أفضل رعاية صحية مع أحدث الأجهزة الطبية والخبرة الممتازة
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

    {/* Navigation */}
    <button className="carousel-control-prev " type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
      <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
      <span className="visually-hidden"  >السابق</span>
    </button>
    <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
      <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
      <span className="visually-hidden">التالي</span>
    </button>

    {/* Indicators */}
    <div className="carousel-indicators position-absolute bottom-0 start-50 translate-middle-x mb-3">
      <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active bg-main" aria-current="true" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
    </div>
  </div>
  <section className="booking-form-section w-full   py-1">
  <div className="mx-auto"style={{width: '50%'}}>
    <div className="row justify-content-center">
      <div className="col-12 col-lg-12">
        <div className="booking-form-card bg-white h-full rounded-5  shadow-lg p-4 w-full"  >
        <div
      className="p-3 rounded shadow-sm bg-white"
      style={{ borderRadius: "20px" }}
      dir="rtl"
    >
      {/* Tabs */}
      <ul className="nav nav-tabs border-0 mb-2">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "doctor" ? "active main-color fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("doctor")}
          >
            دكتور
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "clinic" ? "active main-color fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("clinic")}
          >
            عيادة
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "general" ? "active main-color fw-bold" : "text-muted"}`}
            onClick={() => setActiveTab("general")}
          >
            عام
          </button>
        </li>
      </ul>

      {/* Search Inputs */}
      <div className="row g-2 align-items-center">
        {/* Doctor Name / Specialty */}
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "doctor"
                ? "اسم الدكتور أو التخصص"
                : activeTab === "clinic"
                ? "اسم العيادة"
                : "كلمة البحث"
            }
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        {/* City Select */}
        <div className="col-md-3">
          <select 
            className="form-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="الرياض">الرياض</option>
            <option value="جدة">جدة</option>
            <option value="الدمام">الدمام</option>
          </select>
        </div>

        {/* Search Button */}
        <div className="col-md-3">
          <button 
            className="btn btn-primary bg-main border-0 w-100"
            onClick={handleSearch}
            disabled={isSearching || isLoading}
          >
            {isSearching || isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                جاري البحث...
              </>
            ) : (
              <>
                <i className="fas fa-search ms-2"></i>
                بحث
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Action Buttons */}
      {!isLoading && !isInitialLoad && (
        <div className="row mt-3">
          <div className="col-12 text-center">
            {searchResults.length > 0 ? (
              <button 
                className="btn btn-outline-secondary me-2"
                onClick={resetSearch}
                disabled={isLoading}
              >
                <i className="fas fa-times me-2"></i>
                إعادة تعيين البحث
              </button>
            ) : (
              <button 
                className="btn btn-outline-primary"
                onClick={() => {
                  hasLoadedRef.current = false;
                  fetchAllDoctors();
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    جاري التحميل...
                  </>
                ) : (
                  <>
                    <i className="fas fa-users me-2"></i>
                    عرض جميع الأطباء
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  </div>

</section>
</section>

{/* Booking Form Section */}
<div className="book-page container-fluid  " style={{paddingBlock:'50px', marginTop: '170px' }} dir="rtl">
        <div className="row">
          {/* Sidebar */}
          <SidebarFilters />
{/* Doctor List */}
<main className="col-lg-9 col-md-8">
      {/* Search Results Message - Hidden */}
      {false && !isLoading && !isInitialLoad && searchResults.length > 0 && (
        <div className="alert alert-info mb-4" role="alert">
          <i className="fas fa-info-circle me-2"></i>
          {searchQuery ? 
            `تم العثور على ${searchResults.length} نتيجة للبحث عن: "${searchQuery}"` :
            `عرض ${searchResults.length} طبيب وعيادة من قاعدة البيانات`
          }
        </div>
      )}
      
      <div className="row g-4">
        {isLoading || isInitialLoad ? (
          // Loading state شامل
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status" style={{width: '3rem', height: '3rem'}}>
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <h5 className="text-muted mb-2">
              {isInitialLoad ? 'جاري تحميل الأطباء...' : 'جاري البحث...'}
            </h5>
            <p className="text-muted">
              {isInitialLoad ? 'يرجى الانتظار قليلاً' : 'نبحث عن أفضل النتائج لك'}
            </p>
          </div>
        ) : searchResults.length > 0 ? (
          // عرض نتائج البحث من API
          currentDoctors.map((result, index) => (
            <div key={`${result.id || index}-${result.salon_number || index}`} className="col-12 col-md-6 col-lg-4">
              <SearchResultCard result={result} />
            </div>
          ))
        ) : !isLoading && !isInitialLoad ? (
          // رسالة عدم وجود نتائج
          <div className="col-12 text-center py-5">
            <div className="alert alert-info" role="alert">
              <i className="fas fa-info-circle me-2"></i>
              {searchQuery ? 
                `لم يتم العثور على نتائج للبحث عن: "${searchQuery}"` :
                "ابحث عن طبيب أو عيادة للبدء"
              }
            </div>
            <div className="mt-3">
              <p className="text-muted">
                استخدم مربع البحث أعلاه للعثور على الأطباء والعيادات المتاحة
              </p>
            </div>
          </div>
        ) : null}
      </div>

     {/* Pagination - للبيانات من API */}
{(() => {
  const shouldShowPagination = !isLoading && !isInitialLoad && searchResults.length > 0 && totalPages > 1;
  console.log('Pagination conditions:', {
    isLoading,
    isInitialLoad,
    searchResultsLength: searchResults.length,
    totalPages,
    shouldShowPagination
  });
  return shouldShowPagination;
})() && (
  <div className="d-flex justify-content-center mt-5">
    <ReactPaginate
      pageCount={totalPages}                     // عدد الصفحات الكلي
      onPageChange={handlePageChange} // عشان يغير الصفحة
      forcePage={page - 1}                       // نخلي الباجينيشن متزامن مع state
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      previousLabel="السابق"
      nextLabel="التالي"
      breakLabel="..."
      containerClassName="pagination"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      nextClassName="page-item"
      activeClassName="active"
      disabledClassName="disabled"
    />
  </div>
)}
    </main>
      </div>
      </div>
      </div>
    </>
  );
}