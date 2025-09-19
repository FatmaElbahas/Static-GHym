import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faMapMarkerAlt, 
  faUserMd, 
  faEye,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
  faSpinner,
  faArrowRight,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingBookingId, setDeletingBookingId] = useState(null);

  const BOOKINGS_URL = 'https://enqlygo.com/api/user/bookings';
  const SALONS_URL = 'https://enqlygo.com/api/salons';
  const SALON_DOCTORS_URL = 'https://enqlygo.com/api/salons/doctors';
  const CATEGORIES_URL = 'https://enqlygo.com/api/salons/categories';
  const ADDRESSES_URL = 'https://enqlygo.com/api/user/addresses';

  // دالة تحميل الحجوزات
  const loadBookings = useCallback(async (showLoading = true) => {
    try {
      console.log('🔄 Starting to load bookings...');
      if (showLoading) {
        setIsLoading(true);
      }
      setError(null);

      const userToken = localStorage.getItem('token');
      console.log('🔑 User token exists:', !!userToken);
      console.log('🔑 Token value:', userToken ? `${userToken.substring(0, 20)}...` : 'No token');
      
      if (!userToken) {
        console.log('❌ No token found, redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      console.log('🌐 Fetching bookings from:', BOOKINGS_URL);
      const res = await fetch(BOOKINGS_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
      });

      console.log('📡 Bookings response status:', res.status);
      console.log('📡 Bookings response ok:', res.ok);

      if (!res.ok) {
        const errorData = await res.json();
        console.log('❌ Bookings fetch error:', errorData);
        if (errorData.message && errorData.message.includes('سجل الدخول ثم حاول مره اخري')) {
          console.log('🔐 Session expired, redirecting to login...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        } else throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      console.log('📋 Bookings API Response:', json);
      console.log('📋 Response structure:', {
        status: json.status,
        hasData: !!json.data,
        dataType: typeof json.data,
        hasBookings: !!json.data?.bookings,
        bookingsType: typeof json.data?.bookings,
        bookingsLength: json.data?.bookings?.length,
        stats: json.data?.stats
      });

      let bookingsData = [];
      if (Array.isArray(json)) {
        bookingsData = json;
        console.log('📊 Using json as array');
      } else if (Array.isArray(json?.data)) {
        bookingsData = json.data;
        console.log('📊 Using json.data as array');
      } else if (Array.isArray(json?.data?.data)) {
        bookingsData = json.data.data;
        console.log('📊 Using json.data.data as array');
      } else if (Array.isArray(json?.data?.bookings)) {
        bookingsData = json.data.bookings;
        console.log('📊 Using json.data.bookings as array');
      } else if (Array.isArray(json?.data?.bookings?.data)) {
        bookingsData = json.data.bookings.data;
        console.log('📊 Using json.data.bookings.data as array');
      } else {
        console.log('⚠ No valid bookings array found in response');
        console.log('⚠ Available keys in json.data:', json.data ? Object.keys(json.data) : 'No data');
      }
      
      console.log('📊 Extracted bookings data:', bookingsData);
      console.log('📊 Number of bookings found:', bookingsData.length);
      console.log('📊 Stats from API:', json.data?.stats);
      
      // تفاصيل إضافية للتأكد من البيانات
      if (bookingsData.length > 0) {
        console.log('🔍 First booking details:', {
          id: bookingsData[0].id,
          booking_id: bookingsData[0].booking_id,
          salon_id: bookingsData[0].salon_id,
          staff_id: bookingsData[0].staff_id,
          services: bookingsData[0].services,
          date: bookingsData[0].date,
          time: bookingsData[0].time
        });
      }

      // معالجة خاصة للحالة الفارغة
      if (bookingsData.length === 0) {
        console.log('📭 No bookings found - setting empty array');
        setBookings([]);
        setIsLoading(false);
        return;
      }

      const uniqueSalonIds = [...new Set(bookingsData.map(b => b.salon_id).filter(Boolean))];
      const uniqueStaffIds = [...new Set(bookingsData.map(b => b.staff_id).filter(v => v != null))];
      
      console.log('🏥 Unique salon IDs:', uniqueSalonIds);
      console.log('👨‍⚕ Unique staff IDs:', uniqueStaffIds);

      const addressesPromise = (async () => {
        try {
          console.log('🌐 Fetching addresses from:', ADDRESSES_URL);
          const ar = await fetch(ADDRESSES_URL, {
            headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${userToken}` },
          });
          console.log('📡 Addresses response status:', ar.status);
          if (!ar.ok) {
            console.log('⚠ Addresses API failed:', ar.status, ar.statusText);
            return new Map();
          }
          const aj = await ar.json();
          const list = aj?.data || [];
          console.log('📍 Addresses loaded:', list.length);
          return new Map(list.map(a => [a.id, a]));
        } catch (error) {
          console.log('❌ Addresses fetch error:', error.message);
          return new Map();
        }
      })();

      const categoriesPromise = (async () => {
        try {
          const cr = await fetch(CATEGORIES_URL, { headers: { 'Accept': 'application/json' } });
          const cj = await cr.json();
          const list = cj?.data || [];
          return new Map(list.map(c => [c.id, c]));
        } catch {
          return new Map();
        }
      })();

      const salonsPromise = Promise.all(uniqueSalonIds.map(async (sid) => {
        try {
          console.log('🏥 Fetching salon:', sid);
          const sr = await fetch(`${SALONS_URL}/${sid}`, { headers: { 'Accept': 'application/json' } });
          console.log('📡 Salon response status:', sr.status);
          if (!sr.ok) {
            console.log('⚠ Salon API failed:', sr.status, sr.statusText);
            return [sid, {}];
          }
          const sj = await sr.json();
          return [sid, sj?.data || {}];
        } catch (error) {
          console.log('❌ Salon fetch error:', error.message);
          return [sid, {}];
        }
      })).then(items => new Map(items));

      const doctorsPromise = Promise.all(uniqueSalonIds.map(async (sid) => {
        try {
          const dr = await fetch(`${SALON_DOCTORS_URL}?salon_id=${sid}`, { headers: { 'Accept': 'application/json' } });
          const dj = await dr.json();
          const list = dj?.data || [];
          return [sid, list];
        } catch {
          return [sid, []];
        }
      })).then(items => new Map(items));

      const staffByIdPromise = Promise.all(uniqueStaffIds.map(async (stid) => {
        try {
          const r = await fetch(`${SALON_DOCTORS_URL}?staff_id=${stid}`, { headers: { 'Accept': 'application/json' } });
          const j = await r.json();
          const data = j?.data;
          if (typeof data === 'string') {
            return [String(stid), data];
          }
          const list = Array.isArray(data) ? data : (data ? [data] : []);
          // Prefer exact id match across common keys, with string/number safety
          const found = list.find(d => typeof d === 'object' && (
            String(d.id ?? '') === String(stid) ||
            String(d.staff_id ?? '') === String(stid) ||
            String(d.user_id ?? '') === String(stid) ||
            String(d.employee_id ?? '') === String(stid)
          )) || null;
          // Only return a value if we confidently matched by id
          return [String(stid), found];
        } catch {
          return [String(stid), null];
        }
      })).then(items => new Map(items));

      const [addressesMap, categoriesMap, salonsMap, doctorsMap, staffByIdMap] = await Promise.all([
        addressesPromise,
        categoriesPromise,
        salonsPromise,
        doctorsPromise,
        staffByIdPromise,
      ]);

      const formatTime = (t) => {
        if (!t) return '';
        const s = String(t).padStart(4, '0');
        return `${s.slice(0,2)}:${s.slice(2)}`;
      };

      const augmented = bookingsData.map(b => {
        const salon = salonsMap.get(b.salon_id) || {};
        const salonName = salon.salon_name || salon.name || `عيادة #${b.salon_id}`;

        // Prefer mapping from salon staff list, then owner_name, then other sources
        const staffList = Array.isArray(salon.staff) ? salon.staff : [];
        const doctorFromSalon = staffList.find(d => String(d.id) === String(b.staff_id)) || null;

        // Fallback: doctors endpoint maps
        const doctors = doctorsMap.get(b.salon_id) || [];
        let doctor = doctorFromSalon || null;
        if (!doctor) {
          if (Array.isArray(doctors) && doctors.length && typeof doctors[0] === 'object') {
            doctor = doctors.find(d => String(d.id) === String(b.staff_id)) || null;
          }
        }
        if (!doctor) doctor = staffByIdMap.get(String(b.staff_id)) || null;

        // Resolve doctor name with requested priority: salon.staff -> salon.owner_name -> others
        let doctorName = '—';
        if (doctorFromSalon) {
          doctorName = doctorFromSalon.name || '—';
        } else if (salon.owner_name) {
          doctorName = salon.owner_name;
        } else if (typeof doctor === 'string') {
          doctorName = doctor;
        } else if (doctor && typeof doctor === 'object') {
          doctorName = (
            doctor.name ||
            doctor.staff_name ||
            doctor.full_name ||
            doctor.username ||
            doctor.display_name ||
            (doctor.user && (doctor.user.name || doctor.user.full_name)) ||
            '—'
          );
        } else {
          doctorName = b.staff_name || b.doctor_name || '—';
        }

        // Resolve specialty safely using doctor object if available - prioritize Arabic
        let specialtyTitle = '—';
        const doctorForSpecialty = (doctorFromSalon && typeof doctorFromSalon === 'object') ? doctorFromSalon : (doctor && typeof doctor === 'object' ? doctor : null);
        if (doctorForSpecialty) {
          specialtyTitle = (
            doctorForSpecialty.specialty_ar ||
            doctorForSpecialty.specialty_title_ar ||
            doctorForSpecialty.specialty ||
            doctorForSpecialty.specialty_title ||
            (doctorForSpecialty.category && (doctorForSpecialty.category.title_ar || doctorForSpecialty.category.title_en || doctorForSpecialty.category.title)) ||
            '—'
          );
          if (!specialtyTitle || specialtyTitle === '—') {
            const possibleCategoryId = doctorForSpecialty.category_id ?? doctorForSpecialty.specialty_id ?? doctorForSpecialty.category_id_fk ?? doctorForSpecialty.specialty_id_fk ?? null;
            if (possibleCategoryId != null) {
              const cat = categoriesMap.get(Number(possibleCategoryId)) || categoriesMap.get(String(possibleCategoryId));
              if (cat) {
                specialtyTitle = cat.title_ar || cat.title_en || cat.title || '—';
              }
            }
          }
        }
        if (!specialtyTitle || specialtyTitle === '—') {
          specialtyTitle = b.specialty_ar || b.specialty_title_ar || b.specialty || b.specialty_title || b.category_title || '—';
        }

        const addr = addressesMap.get(b.address_id) || {};
        const userAddress = (addr.address || addr.title || `عنوان #${b.address_id || ''}`).trim();

        let serviceName = null;
        if (typeof b.services === 'string' && b.services.trim().length > 0) serviceName = b.services.trim();
        else if (Array.isArray(b.services) && b.services.length > 0) {
          serviceName = b.services.map(s => s?.name || s?.title || '').filter(Boolean).join(', ');
        } else if (b.service_name) serviceName = b.service_name;
        else serviceName = '—';

        return {
          ...b,
          salon_name: salonName,
          doctor_name: doctorName,
          specialty_title: specialtyTitle,
          user_address: userAddress,
          time_display: formatTime(b.time),
          service_display: serviceName,
        };
      });

      console.log('✅ Final augmented bookings:', augmented);
      
      // تفاصيل إضافية للبيانات المعالجة
      if (augmented.length > 0) {
        console.log('🎯 First processed booking:', {
          id: augmented[0].id,
          booking_id: augmented[0].booking_id,
          salon_name: augmented[0].salon_name,
          doctor_name: augmented[0].doctor_name,
          service_display: augmented[0].service_display,
          date: augmented[0].date,
          time_display: augmented[0].time_display,
          user_address: augmented[0].user_address
        });
      }
      
      // إزالة الحجوزات المكررة بناءً على ID
      const uniqueBookings = augmented.filter((booking, index, self) => 
        index === self.findIndex(b => (b.booking_id || b.id) === (booking.booking_id || booking.id))
      );
      
      console.log('🔍 Removed duplicates:', augmented.length - uniqueBookings.length);
      setBookings(uniqueBookings);

    } catch (e) {
      setError(e.message || 'حدث خطأ أثناء جلب الحجوزات');
    } finally {
      // لا تُخفي شاشة التحميل حتى تكتمل معالجة البيانات وتعيينها
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    // فحص الـ token قبل تحميل الحجوزات
    const userToken = localStorage.getItem('token');
    if (!userToken) {
      console.log('❌ No token found on component mount, redirecting to login...');
      window.location.href = '/login';
      return;
    }
    
    loadBookings();
  }, []); // إزالة loadBookings من dependencies لتجنب إعادة التشغيل المستمرة

  // إعادة تحميل فوري عند فتح الصفحة (فقط عند التركيز الأول)
  useEffect(() => {
    let hasFocused = false;
    
    const handleFocus = () => {
      if (!hasFocused) {
        hasFocused = true;
        console.log('🔄 Page focused for first time, refreshing bookings...');
        loadBookings(false); // لا تظهر loading عند التركيز
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []); // إزالة loadBookings من dependencies

  // إعادة تحميل تلقائي كل دقيقتين بدلاً من 30 ثانية لتقليل الاستهلاك
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        console.log('🔄 Auto-refreshing bookings...');
        loadBookings(false); // لا تظهر loading عند التحديث التلقائي
      }
    }, 120000); // دقيقتان بدلاً من 30 ثانية

    return () => clearInterval(interval);
  }, [isLoading]); // إزالة loadBookings من dependencies

  // دالة حذف الحجز
  const deleteBooking = useCallback(async (booking) => {
    const bookingId = booking.booking_id || booking.id; // ✅ استخدم booking_id لو موجود
    
    if (!bookingId) {
      setError('رقم الحجز غير صحيح');
      return;
    }

    if (!window.confirm('هل أنت متأكد من حذف هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    setDeletingBookingId(bookingId);
    setError(null);

    // تحديث فوري للواجهة
    setBookings(prev => prev.filter(b => (b.booking_id || b.id) !== bookingId));
    if (selectedBooking && (selectedBooking.booking_id || selectedBooking.id) === bookingId) {
      setSelectedBooking(null);
    }

    try {
      const userToken = localStorage.getItem('token');
      if (!userToken) {
        console.log('❌ No token found for deletion');
        alert('يجب تسجيل الدخول أولاً');
        window.location.href = '/login';
        return;
      }

      const deleteUrl = `${BOOKINGS_URL}/${bookingId}`;
      console.log('🗑 Delete URL:', deleteUrl);
      console.log('🗑 Booking ID to delete:', bookingId);

      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${userToken}`,
          'Accept': 'application/json'
        }
      });

      console.log('📡 Delete response status:', res.status);
      console.log('📡 Delete response ok:', res.ok);

      const result = await res.json();
      console.log('🗑 Delete response:', result);

      if (!res.ok) {
        if (res.status === 404) {
          console.log('⚠ Booking not found (404)');
          alert('الحجز غير موجود في قاعدة البيانات');
          await loadBookings(); // رجّع البيانات من السيرفر
          return;
        }
        throw new Error(result.message || `فشل الحذف - HTTP ${res.status}`);
      }

      if (result.status !== 'success') {
        throw new Error(result.message || 'فشل الحذف');
      }

      // refetch بعد الحذف للتأكد من السيرفر
      await loadBookings(false); // لا تظهر loading عند إعادة التحميل بعد الحذف
      alert('تم حذف الحجز بنجاح');

    } catch (e) {
      console.error('❌ Delete error:', e);
      alert(`فشل الحذف: ${e.message}`);
      await loadBookings(false); // رجّع البيانات من السيرفر بدون loading
    } finally {
      setDeletingBookingId(null);
    }
  }, [selectedBooking]); // إزالة loadBookings من dependencies

  // تحسين الأداء: معالجة البيانات مرة واحدة فقط
  const processedBookings = useMemo(() => {
    if (!Array.isArray(bookings)) return [];
    
    return bookings.map(booking => ({
      ...booking,
      // إضافة معلومات إضافية للعرض
      displayId: booking.booking_id || booking.id,
      shortServiceName: booking.service_display?.length > 30 
        ? booking.service_display.substring(0, 30) + '...' 
        : booking.service_display
    }));
  }, [bookings]);

  return (
    <div className="bookings-section container mt-5" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="section-title m-0">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> حجوزاتي
        </h3>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary d-flex align-items-center gap-2" 
            onClick={() => loadBookings(true)}
            style={{
              borderColor: '#6c757d',
              color: '#6c757d',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#6c757d';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6c757d';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FontAwesomeIcon icon={faSpinner} />
            تحديث
          </button>
          <button 
            className="btn btn-outline-primary d-flex align-items-center gap-2" 
            onClick={() => navigate('/book')}
            style={{
              borderColor: 'var(--color-main)',
              color: 'var(--color-main)',
              transition: 'all 0.3s ease',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'var(--color-main)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(3, 143, 173, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = 'var(--color-main)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
            البحث عن أطباء
          </button>
        </div>
      </div>


      {/* Error State */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Bookings at bottom of page */}
      {!error && (
        <div className="bookings-summary mt-5">
          {isLoading && (
            <div className="d-flex align-items-center justify-content-center py-5">
              <div className="text-center p-5 rounded-4 shadow-sm border-0" style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                minWidth: '320px',
                borderRadius: '16px'
              }}>
                <div className="mb-4">
                  <FontAwesomeIcon icon={faSpinner} spin size="2x" style={{ color:'var(--color-main)' }} />
                </div>
                <h5 className="fw-bold mb-2" style={{ color:'var(--color-main)' }}>جاري تحميل الحجوزات...</h5>
                <p className="text-muted mb-0">يرجى الانتظار قليلاً</p>
              </div>
            </div>
          )}
          {processedBookings.length > 0 ? (
            <div className="row g-3">
              {processedBookings.map(booking => (
                <div key={booking.displayId} className="col-12">
                  <div className="card shadow-sm border-0" style={{ 
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                  }}>
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center mb-2">
                            <div className="me-3">
                              <FontAwesomeIcon 
                                icon={faUserMd} 
                                className="text-primary" 
                                style={{ fontSize: '1.2rem' }}
                              />
                            </div>
                            <div>
                              <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '1rem' }}>
                                {booking.salon_name}
                              </h6>
                              <p className="mb-0 text-muted small" title={booking.service_display}>
                                {booking.shortServiceName}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-3">
                          <div className="d-flex align-items-center mb-2">
                            <FontAwesomeIcon 
                              icon={faCalendarAlt} 
                              className="text-success me-2" 
                              style={{ fontSize: '0.9rem' }}
                            />
                            <div>
                              <div className="fw-semibold text-dark small">{booking.date}</div>
                              <div className="text-muted small">
                                <FontAwesomeIcon icon={faClock} className="me-1" />
                                {booking.time_display}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-3">
                          <div className="d-flex gap-2 justify-content-end">
                            <button 
                              className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1" 
                              onClick={() => setSelectedBooking(booking)}
                              style={{
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                padding: '6px 12px',
                                borderWidth: '1.5px',
                                fontWeight: '500'
                              }}
                            >
                              <FontAwesomeIcon icon={faEye} style={{ fontSize: '0.8rem' }} />
                              عرض
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" 
                              onClick={() => deleteBooking(booking)}
                              disabled={deletingBookingId === booking.displayId}
                              style={{
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                padding: '6px 12px',
                                borderWidth: '1.5px',
                                fontWeight: '500'
                              }}
                            >
                              {deletingBookingId === booking.displayId ? (
                                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '0.8rem' }} />
                              ) : (
                                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.8rem' }} />
                              )}
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             (!isLoading && processedBookings.length === 0 ? (
               <div className="text-center py-5">
                 <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '500px', borderRadius: '16px' }}>
                   <div className="card-body p-5">
                     <div className="mb-4">
                       <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light" 
                            style={{ width: '80px', height: '80px' }}>
                         <FontAwesomeIcon icon={faCalendarAlt} size="2x" className="text-muted" />
                       </div>
                     </div>
                     <h4 className="fw-bold text-dark mb-3">لا توجد حجوزات حالياً</h4>
                     <p className="text-muted mb-4">
                       يمكنك إضافة حجز جديد من خلال البحث عن الأطباء المتاحين
                     </p>
                     <div className="alert alert-info border-0 mb-4" style={{ 
                       background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                       borderRadius: '12px'
                     }}>
                       <small className="d-flex align-items-center">
                         <FontAwesomeIcon icon={faSpinner} className="me-2 text-primary" />
                         إذا كنت قد أضفت حجزاً جديداً، قد يحتاج بضع دقائق ليظهر هنا
                       </small>
                     </div>
                     <div className="d-flex gap-3 justify-content-center">
                       <button 
                         className="btn btn-outline-secondary d-flex align-items-center gap-2"
                         onClick={() => loadBookings(true)}
                         style={{
                           borderRadius: '10px',
                           padding: '10px 20px',
                           fontWeight: '500'
                         }}
                       >
                         <FontAwesomeIcon icon={faSpinner} />
                         تحديث
                       </button>
                       <button 
                         className="btn btn-primary d-flex align-items-center gap-2"
                         onClick={() => navigate('/book')}
                         style={{
                           borderRadius: '10px',
                           padding: '10px 20px',
                           fontWeight: '500',
                           background: 'var(--color-main)',
                           border: 'none'
                         }}
                       >
                         <FontAwesomeIcon icon={faArrowRight} />
                         البحث عن أطباء
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             ) : null)
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">تفاصيل الحجز</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedBooking(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-6">
                    <strong>الخدمة:</strong>
                    <p>{selectedBooking.service_display}</p>
                  </div>
                  <div className="col-6">
                    <strong>الطبيب:</strong>
                    <p>{selectedBooking.doctor_name} • {selectedBooking.specialty_title}</p>
                  </div>
                  <div className="col-12">
                    <strong>العيادة:</strong>
                    <p>{selectedBooking.salon_name}</p>
                  </div>
                  <div className="col-6">
                    <strong>التاريخ:</strong>
                    <p>{selectedBooking.date}</p>
                  </div>
                  <div className="col-6">
                    <strong>الوقت:</strong>
                    <p>{selectedBooking.time_display}</p>
                  </div>
                  <div className="col-12">
                    <strong>الموقع:</strong>
                    <p>{selectedBooking.user_address}</p>
                  </div>
                  {selectedBooking.notes && (
                    <div className="col-12">
                      <strong>ملاحظات:</strong>
                      <p>{selectedBooking.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                 <button 
                   type="button" 
                   className="btn btn-outline-danger"
                   onClick={() => {
                     deleteBooking(selectedBooking);
                     setSelectedBooking(null);
                   }}
                   disabled={deletingBookingId === (selectedBooking.booking_id || selectedBooking.id)}
                 >
                   {deletingBookingId === (selectedBooking.booking_id || selectedBooking.id) ? (
                     <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                   ) : (
                     <FontAwesomeIcon icon={faTrash} className="me-2" />
                   )}
                   حذف الحجز
                 </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setSelectedBooking(null)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;