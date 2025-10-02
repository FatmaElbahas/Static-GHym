import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faTimes, 
  faRotateLeft,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import Stats from '../../Components/Stats/Stats';
import Services from '../../Components/Services/Services';
import DoctorCard from '../../Components/DoctorCard/DoctorCard.jsx';
import Logo from '../../assets/images/Logo.png';
import HeroBg from '../../assets/images/روتت.avif';
import HeroBg2 from '../../assets/images/attractive hero.png';
import SidebarFilters from '../../Components/Filter/SidebarFilters.jsx';
import ReactPaginate from 'react-paginate';
import { FilterProvider, useFilter } from '../../context/FilterContext';

// مكون النتائج الذي يستخدم الفلتر
function SearchResults() {
  const { getDisplayData, isFiltered, filters, filteredData, allData } = useFilter();
  const [page, setPage] = useState(1);
  const doctorsPerPage = 6;
  
  // الحصول على البيانات من الفلتر
  const displayData = getDisplayData();
  
  // إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setPage(1);
    console.log('🔄 Page reset due to filter change');
    console.log('🔄 New filters:', filters);
    console.log('🔄 Display data length after filter change:', displayData.length);
  }, [filters, displayData.length]);
  
  // Debug: طباعة البيانات
  console.log('🔍 SearchResults Debug:', {
    isFiltered: isFiltered,
    allDataLength: allData.length,
    filteredDataLength: filteredData.length,
    displayDataLength: displayData.length,
    currentFilters: filters,
    firstItem: displayData[0] ? {
      id: displayData[0].id,
      name: displayData[0].salon_name || displayData[0].owner_name,
      category: displayData[0].salon_categories || displayData[0].category_id
    } : null
  });
  
  const totalPages = Math.ceil(displayData.length / doctorsPerPage);
  
  // تقطيع الكروت حسب الصفحة
  const currentDoctors = displayData.slice(
    (page - 1) * doctorsPerPage,
    page * doctorsPerPage
  );
  
  // دالة تغيير الصفحة
  const handlePageChange = useCallback(({ selected }) => {
    setPage(selected + 1);
  }, []);
  
  return (
    <>
      {/* عرض النتائج */}
      {currentDoctors.length > 0 ? (
        <div className="row g-4">
          {currentDoctors.map((doctor, index) => (
            <div key={doctor.id || index} className="col-lg-4 col-md-6">
              <DoctorCard salonData={doctor} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-3">
            <FontAwesomeIcon 
              icon={faSearch} 
              size="3x" 
              className="text-muted"
            />
          </div>
          <div className="h5 text-muted">
            {isFiltered ? 
              "لم يتم العثور على نتائج للفلاتر المحددة" :
              "ابحث عن طبيب أو عيادة للبدء"
            }
          </div>
          <div className="mt-3">
            <p className="text-muted">
              {isFiltered ? 
                "جرب تغيير الفلاتر أو إعادة تعيينها" :
                "استخدم مربع البحث أعلاه للعثور على الأطباء والعيادات المتاحة"
              }
            </p>
          </div>
        </div>
      )}

      {/* Pagination */}
      {displayData.length > 0 && totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4" style={{ marginTop: '4rem !important' }}>
          <ReactPaginate
            pageCount={totalPages}
            onPageChange={handlePageChange}
            forcePage={page - 1}
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
    </>
  );
}

// مكون الصفحة الداخلية الذي يستخدم الفلتر
function BookContent() {
  const { updateAllData, filters, updateFilters, resetFilters } = useFilter();
  const [activeTab, setActiveTab] = useState("doctor");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCity, setSelectedCity] = useState("الكل");
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoadedRef = useRef(false);

  // جلب المدن من API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setCitiesLoading(true);
        console.log('🔄 Fetching cities from API...');
        
        const response = await fetch('https://enqlygo.com/api/salons');
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
          console.log('✅ Salons data loaded for cities extraction:', data.data.length);
          
          // استخراج المدن من العناوين
          const extractedCities = data.data.map(item => {
            const address = item.salon_address || item.address || '';
            if (typeof address === 'string' && address.trim()) {
                      // قائمة المدن المعروفة للبحث (عربي + إنجليزي)
                      const knownCities = [
                        'الرياض', 'Riyadh',
                        'جدة', 'Jeddah', 
                        'الدمام', 'Dammam',
                        'المدينة المنورة', 'Medina',
                        'الطائف', 'Taif',
                        'الخبر', 'Khobar',
                        'الظهران', 'Dhahran',
                        'القاهرة', 'Cairo',
                        'الفيوم', 'Fayoum',
                        'مصر الجديدة', 'New Cairo', 'Heliopolis',
                        'الإسكندرية', 'Alexandria'
                      ];
              
              // البحث عن المدينة في العنوان
              for (const city of knownCities) {
                if (address.includes(city)) {
                  return city;
                }
              }
              
              // إذا لم توجد مدينة معروفة، نأخذ أول جزء من العنوان
              if (address.includes(' - ')) {
                return address.split(' - ')[0].trim();
              } else if (address.includes('،')) {
                return address.split('،')[0].trim();
              } else if (address.includes(',')) {
                return address.split(',')[0].trim();
              } else {
                return address.trim();
              }
            }
            return null;
          }).filter(Boolean);
          
          const uniqueCities = [...new Set(extractedCities)];
          console.log('🏙️ Extracted cities:', uniqueCities);
          setCities(uniqueCities);
          
          // تعيين أول مدينة كقيمة افتراضية
          if (uniqueCities.length > 0) {
            setSelectedCity("الكل");
          }
        }
      } catch (error) {
        console.error('❌ Error fetching cities:', error);
        // استخدام مدن افتراضية في حالة الخطأ
        setCities(['الرياض', 'جدة', 'الدمام']);
      } finally {
        setCitiesLoading(false);
      }
    };

    fetchCities();
  }, []);

  // دالة البحث باستخدام API
  const handleSearch = useCallback(async () => {
    // السماح بالبحث بالمدينة فقط أو مع النص أو بدونهما
    setIsSearching(true);
    setIsLoading(true);
    try {
      // البحث حسب النص أو المدينة أو كليهما
      let apiUrl = "https://enqlygo.com/api/salons?";
      
      if (searchQuery.trim()) {
        // البحث في اسم الطبيب واسم العيادة معاً
        const encodedQuery = encodeURIComponent(searchQuery);
        apiUrl += `owner_name=${encodedQuery}&salon_name=${encodedQuery}`;
      }
      
      // إضافة المدينة للبحث إذا لم تكن "الكل"
      if (selectedCity && selectedCity !== "الكل") {
        if (searchQuery.trim()) {
          apiUrl += `&city=${encodeURIComponent(selectedCity)}`;
        } else {
          apiUrl += `city=${encodeURIComponent(selectedCity)}`;
        }
      }

      console.log('🔍 Searching with URL:', apiUrl);
      const response = await fetch(apiUrl);
      const result = await response.json();
      
      if (result.status === "success" && result.data && result.data.length > 0) {
        let finalResults = result.data;
        
        // فلترة محلية بالمدينة كـ fallback
        if (selectedCity && selectedCity !== "الكل") {
          finalResults = finalResults.filter(item => {
            const address = item.salon_address || item.address || '';
            return address.toLowerCase().includes(selectedCity.toLowerCase());
          });
        }
        
        console.log('✅ API Search results count:', finalResults.length);
        console.log('📊 API Search results sample:', finalResults.slice(0, 2).map(item => ({
          id: item.id,
          name: item.salon_name || item.owner_name,
          category: item.salon_categories || item.category_id
        })));
        
        if (finalResults.length > 0) {
          setSearchResults(finalResults);
          updateAllData(finalResults);
        } else {
          // إذا لم توجد نتائج بعد الفلترة، جرب البحث المحلي
          throw new Error('No results after filtering');
        }
        
        // تطبيق فلاتر إضافية من الـ form
        const newFilte
         = {
          ...filters,
          // البحث في النص إذا كان موجود
          owner_name: searchQuery.trim() ? searchQuery : '',
          salon_name: searchQuery.trim() ? searchQuery : '',
          city: selectedCity && selectedCity !== 'الكل' ? selectedCity : ''
        };
        console.log('🔍 Applying form filters:', newFilters);
        updateFilters(newFilters);
      } else {
        // إذا لم توجد نتائج، جرب البحث المحلي كـ fallback
        if (searchQuery.trim()) {
          try {
            console.log('🔄 Trying fallback search...');
            const fallbackResponse = await fetch("https://enqlygo.com/api/salons");
            const fallbackResult = await fallbackResponse.json();
            
            if (fallbackResult.status === "success" && fallbackResult.data?.length > 0) {
              const searchTerm = searchQuery.trim().toLowerCase();
              console.log('🔍 Searching for:', searchTerm);
              
              const filteredResults = fallbackResult.data.filter(item => {
                const ownerName = (item.owner_name || '').toLowerCase();
                const salonName = (item.salon_name || '').toLowerCase();
                const doctorName = (item.doctor_name || '').toLowerCase();
                const name = (item.name || '').toLowerCase();
                
                const matches = ownerName.includes(searchTerm) || 
                               salonName.includes(searchTerm) || 
                               doctorName.includes(searchTerm) || 
                               name.includes(searchTerm);
                
                if (matches) {
                  console.log('✅ Found match:', {
                    id: item.id,
                    owner_name: item.owner_name,
                    salon_name: item.salon_name,
                    doctor_name: item.doctor_name
                  });
                }
                
                return matches;
              });
              
              console.log('📊 Fallback search results:', filteredResults.length);
              
              if (filteredResults.length > 0) {
                setSearchResults(filteredResults);
                updateAllData(filteredResults);
                
                const newFilters = {
                  ...filters,
                  owner_name: searchQuery.trim() ? searchQuery : '',
                  salon_name: searchQuery.trim() ? searchQuery : '',
                  city: selectedCity && selectedCity !== 'الكل' ? selectedCity : ''
                };
                updateFilters(newFilters);
                return;
              }
            }
          } catch (fallbackError) {
            console.error("Fallback search failed:", fallbackError);
          }
        }
        
        console.log('❌ No search results found');
        setSearchResults([]);
        updateAllData([]);
      }
    } catch (error) {
      console.error("❌ خطأ في البحث:", error);
      
      // إذا كان الخطأ بسبب عدم وجود نتائج، جرب البحث المحلي
      if (searchQuery.trim() && (error.message === 'No results after filtering' || error.message.includes('No results'))) {
        try {
          console.log('🔄 Trying fallback search due to no results...');
          const fallbackResponse = await fetch("https://enqlygo.com/api/salons");
          const fallbackResult = await fallbackResponse.json();
          
          if (fallbackResult.status === "success" && fallbackResult.data?.length > 0) {
            const searchTerm = searchQuery.trim().toLowerCase();
            console.log('🔍 Fallback searching for:', searchTerm);
            
            const filteredResults = fallbackResult.data.filter(item => {
              const ownerName = (item.owner_name || '').toLowerCase();
              const salonName = (item.salon_name || '').toLowerCase();
              const doctorName = (item.doctor_name || '').toLowerCase();
              const name = (item.name || '').toLowerCase();
              
              const matches = ownerName.includes(searchTerm) || 
                             salonName.includes(searchTerm) || 
                             doctorName.includes(searchTerm) || 
                             name.includes(searchTerm);
              
              if (matches) {
                console.log('✅ Fallback found match:', {
                  id: item.id,
                  owner_name: item.owner_name,
                  salon_name: item.salon_name,
                  doctor_name: item.doctor_name
                });
              }
              
              return matches;
            });
            
            console.log('📊 Fallback search results:', filteredResults.length);
            
            if (filteredResults.length > 0) {
              setSearchResults(filteredResults);
              updateAllData(filteredResults);
              
              const newFilters = {
                ...filters,
                owner_name: searchQuery.trim() ? searchQuery : '',
                salon_name: searchQuery.trim() ? searchQuery : '',
                city: selectedCity && selectedCity !== 'الكل' ? selectedCity : ''
              };
              updateFilters(newFilters);
              return;
            }
          }
        } catch (fallbackError) {
          console.error("Fallback search failed:", fallbackError);
        }
      }
      
      console.error("حدث خطأ أثناء البحث");
    } finally {
      setIsSearching(false);
      setIsLoading(false);
    }
  }, [searchQuery, activeTab, selectedCity, filters, updateAllData, updateFilters]);

  // دالة جلب جميع الأطباء من API
  const fetchAllDoctors = useCallback(async () => {
    if (hasLoadedRef.current) {
      console.log('⏭️ Skipping fetchAllDoctors - already loaded');
      return; // تجنب الاستدعاء المتكرر
    }
    
    try {
      hasLoadedRef.current = true;
      setIsInitialLoad(true);
      setIsLoading(true);
      
      console.log('🔄 Fetching all doctors from API...');
      const response = await fetch("https://enqlygo.com/api/salons");
      const result = await response.json();
      
      if (result.status === "success" && result.data && result.data.length > 0) {
        console.log('✅ All doctors count:', result.data.length);
        console.log('📊 All doctors sample:', result.data.slice(0, 2).map(item => ({
          id: item.id,
          name: item.salon_name || item.owner_name,
          category: item.salon_categories || item.category_id
        })));
        
        setSearchResults(result.data);
        // تحديث البيانات في الفلتر
        updateAllData(result.data);
      } else {
        console.log('❌ No doctors found in API response');
      }
    } catch (error) {
      console.error("❌ خطأ في جلب الأطباء:", error);
      hasLoadedRef.current = false; // إعادة تعيين في حالة الخطأ
    } finally {
      setIsInitialLoad(false);
      setIsLoading(false);
    }
  }, [updateAllData]);

  // دالة إعادة تعيين البحث - تمسح الـ inputs وترجع كل البيانات
  const resetSearch = useCallback(async () => {
    console.log('🔄 Resetting search and loading all data...');
    
    // مسح الـ inputs أولاً
    setSearchQuery("");
    setSelectedCity("الكل");
    setSearchResults([]);
    hasLoadedRef.current = false;
    
    try {
      setIsLoading(true);
      console.log('🔄 Fetching all doctors from API...');
      const response = await fetch("https://enqlygo.com/api/salons");
      const result = await response.json();
      
      if (result.status === "success" && result.data && result.data.length > 0) {
        console.log('✅ All doctors loaded - count:', result.data.length);
        setSearchResults(result.data);
        updateAllData(result.data);
        
        // إعادة تعيين جميع الفلاتر
        resetFilters();
        
        hasLoadedRef.current = true;
      } else {
        console.log('❌ No doctors found');
        setSearchResults([]);
        updateAllData([]);
      }
    } catch (error) {
      console.error('❌ Error resetting and loading doctors:', error);
    } finally {
      setIsLoading(false);
    }
  }, [updateAllData, resetFilters]);

  // جلب الأطباء من API عند تحميل الصفحة (مرة واحدة فقط)
  useEffect(() => {
    console.log('🔄 useEffect triggered - checking if need to fetch doctors');
    console.log('📊 hasLoadedRef.current:', hasLoadedRef.current);
    if (!hasLoadedRef.current) {
      console.log('✅ Calling fetchAllDoctors...');
      fetchAllDoctors();
    } else {
      console.log('⏭️ Skipping fetchAllDoctors - already loaded');
    }
  }, []); // dependency array فارغ لضمان التنفيذ مرة واحدة فقط
  
  return (
    <>
      <Helmet>
        <title>غيم | ghaim</title>
        <meta name="description" content="مركز غيم الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة. احجز موعدك الآن واستفد من خدماتنا المتميزة" />
        <meta name="keywords" content="مركز طبي, خدمات جلدية, علاجات طبية, حجز موعد, غيم, صحة" />
        <meta property="og:title" content="غيم | ghaim" />
        <meta property="og:description" content="مركز غيم الطبي يقدم خدمات طبية متطورة وعلاجات جلدية متخصصة" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="book-page position-relative">
      <section className="hero-section position-relative mb-0" style={{height: '60vh', width: '100vw', marginTop: '160px', transition: 'margin-top 0.3s ease', padding: 0, marginLeft: 0, marginRight: 0, left: 0, right: 0}} dir="rtl">
          <div 
            id="heroCarousel" 
            className="carousel slide h-100" 
            data-bs-ride="carousel" 
            data-bs-interval="5000"
            style={{ margin: 0, padding: 0, width: '100%' }}
            onMouseEnter={(e) => {
              const prevBtn = e.currentTarget.querySelector('.carousel-control-prev');
              const nextBtn = e.currentTarget.querySelector('.carousel-control-next');
              if (prevBtn) prevBtn.style.opacity = '1';
              if (nextBtn) nextBtn.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              const prevBtn = e.currentTarget.querySelector('.carousel-control-prev');
              const nextBtn = e.currentTarget.querySelector('.carousel-control-next');
              if (prevBtn) prevBtn.style.opacity = '0';
              if (nextBtn) nextBtn.style.opacity = '0';
            }}
          >
            <div className="carousel-inner h-100" style={{ margin: 0, padding: 0 }}>

              {/* Slide 1 */}
              <div className="carousel-item active h-100">
              <div
  className="hero-background position-absolute top-0 start-0 w-100 h-100"
  style={{ 
    backgroundImage: 'url("https://media.zid.store/cdn-cgi/image/q=85,f=auto/https://media.zid.store/69733e3a-6328-43ea-90ee-cd02df32c66d/cd450c71-bf69-4fee-baf2-e7720296929c.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    opacity: 1,
    margin: 0,
    padding: 0
  }}
>

  

                  {/* <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end" >
                    <div className="hero-text" style={{ paddingTop: '8%', paddingRight:'15%' }}>
                      <h1 className="brand-name fw-bold mb-3" style={{ 
                        fontSize: window.innerWidth < 768 ? '2rem' : '3.5rem', 
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)', 
                        color: '#ffffff',
                        lineHeight: '1.2'
                      }}>
                        احجز موعدك بسهولة
                      </h1>
                      <p className="text-light fs-5 fw-medium pe-0" style={{ 
                        maxWidth: '500px',
                        fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem'
                      }}>
                        فريقنا الطبي المتخصص في خدمتك على مدار الساعة
                      </p>
                    </div>
                  </div> */}
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
                  {/* <div className="hero-overlay position-relative h-100 d-flex align-items-start justify-content-end">
                    <div className="hero-text" style={{ paddingTop: '8%', paddingRight:'15%' }}>
                      <h1 className="brand-name fw-bold mb-3" style={{ 
                        fontSize: window.innerWidth < 768 ? '2rem' : '3.5rem', 
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)', 
                        color: '#ffffff',
                        lineHeight: '1.2'
                      }}>
                        الرعاية الطبية التي تستحقها
                      </h1>
                      <p className="text-light fs-5 fw-medium pe-0" style={{ 
                        maxWidth: '500px',
                        fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem'
                      }}>
                        احصلي على أفضل رعاية صحية مع أحدث الأجهزة الطبية والخبرة الممتازة
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>

            </div>

           

            {/* Navigation Arrows */}
            <button 
              className="carousel-control-prev position-absolute top-50 translate-middle-y" 
              type="button" 
              data-bs-target="#heroCarousel" 
              data-bs-slide="prev"
              style={{
                opacity: 0.7,
                transition: 'all 0.3s ease',
                zIndex: 10,
                width: '45px',
                height: '45px',
                backgroundColor: '#0171BD',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 4px 12px rgba(1, 113, 189, 0.4)',
                left: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <span 
                className="carousel-control-prev-icon" 
                aria-hidden="true"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e")`,
                  width: '20px',
                  height: '20px'
                }}
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            
            <button 
              className="carousel-control-next position-absolute top-50 translate-middle-y" 
              type="button" 
              data-bs-target="#heroCarousel" 
              data-bs-slide="next"
              style={{
                opacity: 0.7,
                transition: 'all 0.3s ease',
                zIndex: 10,
                width: '45px',
                height: '45px',
                backgroundColor: '#0171BD',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 4px 12px rgba(1, 113, 189, 0.4)',
                right: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
              }}
            >
              <span 
                className="carousel-control-next-icon" 
                aria-hidden="true"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23ffffff'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e")`,
                  width: '20px',
                  height: '20px'
                }}
              ></span>
              <span className="visually-hidden">Next</span>
            </button>

            {/* Indicators */}
            <div className="carousel-indicators position-absolute bottom-0 start-50 translate-middle-x" style={{ marginBottom: '0.2rem' }}>
              <button 
                type="button" 
                data-bs-target="#heroCarousel" 
                data-bs-slide-to="0" 
                className="active" 
                aria-current="true" 
                aria-label="Slide 1"
                style={{
                  width: '18px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#0171BD',
                  border: 'none',
                  margin: '0 5px'
                }}
              ></button>
              <button 
                type="button" 
                data-bs-target="#heroCarousel" 
                data-bs-slide-to="1" 
                aria-label="Slide 2"
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  border: 'none',
                  margin: '0 5px'
                }}
              ></button>
            </div>
          </div>
        
        </section>

        <section className="booking-form-section w-full py-1">
      <div className="container">
      <div className="row justify-content-center">
        <div className="col-12" style={{ maxWidth: '100%' }}>
            <div className="booking-form-card bg-white h-full rounded-pill shadow-lg p-4 w-full" 
                 style={{ 
                   marginTop: "-330px", 
                   position: "relative", 
                   zIndex: "10",
                   border: '1px solid rgba(0,0,0,0.05)',
                   backdropFilter: 'blur(10px)',
                   background: 'rgba(255, 255, 255, 0.95)',
                   borderRadius: '60px',
                   boxShadow: '0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.07)'
                 }}
               dir="rtl">

            {/* All Elements in One Row */}
            <div className="row g-0 align-items-center" style={{minHeight: '50px'}}>
              {/* Doctor Name / Specialty */}
              <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center" style={{paddingRight: '8px'}}>
                <input
                  type="text"
                  className="form-control w-100"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم أو اختر المدينة أو كليهما..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{ 
                    height: '50px', 
                    padding: '15px 25px',
                    fontSize: '1rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#0d78c0';
                    e.target.style.boxShadow = '0 3px 8px rgba(3, 143, 173, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                  }}
                />
              </div>

              {/* City Select */}
              <div className="col-lg-2 col-md-2 col-sm-6 d-flex align-items-center" style={{paddingRight: '8px'}}>
                <div className="position-relative w-100">
                  <select 
                    className="form-select w-100"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    disabled={citiesLoading}
                    style={{ 
                      height: '50px', 
                      padding: '15px 25px',
                      fontSize: '1rem',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.3s ease',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%23038fad' d='m4.427 9.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 9H4.604a.25.25 0 0 0-.177.427Z'/%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 5px center',
                      backgroundSize: '24px 20px',
                      paddingRight: '55px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#0d78c0';
                      e.target.style.boxShadow = '0 3px 8px rgba(3, 143, 173, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.08)';
                    }}
                  >
                    {citiesLoading ? (
                      <option value="" disabled>جاري تحميل المدن...</option>
                    ) : (
                      <>
                        <option value="الكل" style={{color: '#0d78c0'}}>جميع المدن</option>
                        {cities.map((city, index) => (
                          <option key={index} value={city} style={{color: '#0d78c0'}}>
                            {city}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Buttons Section */}
              <div className="col-lg-4 col-md-4 col-sm-12 d-flex justify-content-center align-items-center" style={{padding: '2px 8px'}}>
                <div className="d-flex align-items-center gap-2">
              {/* Search Button */}
                <button 
                    className="btn btn-primary bg-main border-0"
                  onClick={handleSearch}
                  disabled={isSearching || isLoading}
                    title="بحث"
                  style={{ 
                      height: '45px', 
                      fontSize: '0.9rem',
                    fontWeight: '500',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      transition: 'all 0.3s ease',
                      padding: '0 30px',
                      minWidth: '140px',
                      backgroundColor: '#0171BD',
                      borderColor: '#0171BD'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#0171BD';
                      e.target.style.color = '#0171BD';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 5px 15px rgba(1, 113, 189, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#0171BD';
                      e.target.style.borderColor = '#0171BD';
                      e.target.style.color = 'white';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
                  }}
                >
                  {isSearching || isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      جاري البحث...
                    </>
                  ) : (
                    <>
                        <FontAwesomeIcon icon={faSearch} className="me-1" />
                      بحث
                    </>
                  )}
                </button>
                  
                  {/* Reset Search Button - يمسح الـ inputs ويرجع كل البيانات */}
                  <button 
                    className="btn btn-outline-primary"
                    onClick={resetSearch}
                    disabled={isLoading}
                    title="إعادة تعيين ورجوع لكل الأطباء"
                    style={{ 
                      width: '50px',
                      height: '50px', 
                      fontSize: '1rem',
                      fontWeight: '500',
                      boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                      borderRadius: '50%',
                      borderColor: '#0171BD',
                      color: '#0171BD',
                      backgroundColor: 'transparent',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0171BD';
                      e.target.style.color = 'white';
                      e.target.style.borderColor = '#0171BD';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#0171BD';
                      e.target.style.borderColor = '#0171BD';
                    }}
                  >
                    {isLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <FontAwesomeIcon icon={faRotateLeft} />
                    )}
                  </button>
                </div>
              </div>
            </div>
                
                {/* مسافة بعد الأزرار */}
                <div className="mt-3"></div>
              </div>
          </div>
        </div>
      </div>
        </section>
      </div>

      {/* Booking Form Section */}
      <div className="book-page container-fluid" style={{paddingBlock:'50px', marginTop: '80px' }} dir="rtl">
        <style>{`
          .btn-outline-primary:hover,
          .btn-outline-secondary:hover {
            background: #0171BD !important;
            border-color: #0171BD !important;
            color: white !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(1, 113, 189, 0.4) !important;
          }
          
          .btn-primary:hover {
            background: white !important;
            color: #0171BD !important;
            border: 2px solid #0171BD !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(1, 113, 189, 0.3) !important;
          }
          
          .btn {
            transition: all 0.3s ease !important;
            backdrop-filter: blur(5px) !important;
          }
          
          .btn-primary {
            background: #0d78c0 !important;
            border: none !important;
            box-shadow: 0 4px 12px rgba(3, 143, 173, 0.3) !important;
          }
          
          .btn-outline-primary,
          .btn-outline-secondary {
            background: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(5px) !important;
            border: 1px solid rgba(3, 143, 173, 0.3) !important;
            box-shadow: 0 2px 8px rgba(3, 143, 173, 0.1) !important;
          }
          
          /* تخصيص أيقونة الـ select */
          .form-select {
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
          }
          
          /* توحيد مظهر الـ inputs */
          .form-control,
          .form-select {
            height: 50px !important;
            border-radius: 8px !important;
            border: 1px solid #e8e8e8 !important;
            transition: all 0.3s ease !important;
            background-color: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(5px) !important;
            padding: 15px 25px !important;
            font-size: 1rem !important;
            line-height: 1.5 !important;
            box-sizing: border-box !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08) !important;
          }
          
          .form-control:focus,
          .form-select:focus {
            border-color: #0d78c0 !important;
            box-shadow: 0 0 0 0.2rem rgba(3, 143, 173, 0.15) !important;
            background-color: rgba(255, 255, 255, 1) !important;
          }
          
          .form-control:hover,
          .form-select:hover {
            border-color: #0d78c0 !important;
            box-shadow: 0 3px 8px rgba(3, 143, 173, 0.15) !important;
          }
          
          /* تحسين التخطيط للشاشات الصغيرة */
          @media (max-width: 768px) {
            .booking-form-card .row {
              margin: 0;
            }
            
            .booking-form-card .col-sm-12,
            .booking-form-card .col-sm-6,
            .booking-form-card .col-sm-3 {
              margin-bottom: 10px;
              padding-right: 8px !important;
            }
          }
          
          /* تحسين التخطيط للشاشات المتوسطة */
          @media (max-width: 992px) {
            .booking-form-card .col-md-3,
            .booking-form-card .col-md-4,
            .booking-form-card .col-md-5 {
              padding-right: 8px !important;
            }
          }
          
          /* تحسين التخطيط للشاشات الكبيرة */
          @media (min-width: 992px) {
            .booking-form-card .col-lg-4,
            .booking-form-card .col-lg-5 {
              padding-right: 8px !important;
            }
          }
          
          /* تحسين مظهر الـ form */
          .booking-form-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95)) !important;
            border: 1px solid rgba(3, 143, 173, 0.1) !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 8px 16px rgba(3, 143, 173, 0.1) !important;
            border-radius: 60px !important;
          }
          
          /* تحسين النصوص */
          .form-control::placeholder {
            color: #94a3b8 !important;
            font-weight: 400 !important;
          }
          
          .form-select {
            color: #334155 !important;
            font-weight: 500 !important;
          }
          
          /* تخصيص مظهر الـ options */
          .form-select option {
            color: #0d78c0 !important;
            background-color: white !important;
            font-weight: 500 !important;
          }
          
          .form-select option:hover,
          .form-select option:focus,
          .form-select option:active {
            background-color: #0d78c0 !important;
            color: white !important;
            background: #0d78c0 !important;
            background-image: none !important;
          }
          
          /* تجاوز أقوى للـ hover */
          .form-select option:hover {
            background: #0d78c0 !important;
            background-color: #0d78c0 !important;
            color: white !important;
          }
          
          .form-select option:checked,
          .form-select option[selected] {
            background-color: #0d78c0 !important;
            color: white !important;
            background: #0d78c0 !important;
          }
          
          .form-select option:checked:hover,
          .form-select option[selected]:hover {
            background-color: #0d78c0 !important;
            color: white !important;
            background: #0d78c0 !important;
          }
          
          /* تجاوز ألوان المتصفح الافتراضية */
          .form-select option::-moz-selection {
            background-color: #0d78c0 !important;
            color: white !important;
          }
          
          .form-select option::selection {
            background-color: #0d78c0 !important;
            color: white !important;
          }
          
          /* تجاوز أقوى للمتصفحات المختلفة */
          .form-select option:hover {
            background: #0d78c0 !important;
            background-color: #0d78c0 !important;
            color: white !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
          }
          
          /* تجاوز خاص لـ Chrome و Safari */
          .form-select option:hover::-webkit-option {
            background: #0d78c0 !important;
            color: white !important;
          }
          
          /* تجاوز خاص لـ Firefox */
          .form-select option:hover::-moz-option {
            background: #0d78c0 !important;
            color: white !important;
          }
          
          /* محاذاة الـ sidebar والـ cards في الشاشات الكبيرة */
          @media (min-width: 992px) {
            .sidebar-filters {
              height: fit-content;
              min-height: 100%;
            }
            
            .sidebar-filters .bg-white {
              height: 100%;
              min-height: 100vh;
            }
          }
        `}</style>
        <div className="row align-items-start">
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
        ) : !isLoading && !isInitialLoad ? (
          // استخدام مكون النتائج الجديد
          <SearchResults key={`search-results-${JSON.stringify(filters)}`} />
        ) : null}
      </div>

          </main>
        </div>
      </div>
    </>
  );
}

// المكون الرئيسي الذي يحتوي على FilterProvider
export default function Book() {
  return (
    <FilterProvider>
      <BookContent />
    </FilterProvider>
  );
}
