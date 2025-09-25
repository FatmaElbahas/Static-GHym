import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarPlus, 
  faStethoscope, 
  faUserMd, 
  faCalendarAlt,
  faClock,
  faMapMarkerAlt,
  faCheckCircle,
  faArrowLeft,
  faArrowRight,
  faEye,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import './NewBooking.css';

const NewBooking = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Track screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const [formData, setFormData] = useState({
    salon_id: '',
    service: '',
    doctor: '',
    date: '',
    time: '',
    address: '',
    notes: ''
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [conflictModal, setConflictModal] = useState(null); // { date, timeDisplay }
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [salons, setSalons] = useState([]);
  const [salonsLoading, setSalonsLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState({});
  const [timesLoading, setTimesLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [doctorName, setDoctorName] = useState('');

  const BOOKING_URL = 'https://enqlygo.com/api/user/bookings';
  const SALONS_URL = 'https://enqlygo.com/api/salons';
  const ADDRESSES_URL = 'https://enqlygo.com/api/user/addresses';
  const CATEGORIES_URL = 'https://enqlygo.com/api/salons/categories';
  const AVAILABLE_TIMES_URL = 'https://enqlygo.com/api/salons/available_times';
  const USER_BOOKINGS_URL = 'https://enqlygo.com/api/user/bookings';

  // Load salons
  useEffect(() => {
    const loadSalons = async () => {
      try {
        setSalonsLoading(true);
        const res = await fetch(SALONS_URL);
        const json = await res.json();
        setSalons(Array.isArray(json?.data) ? json.data : []);
      } catch {
        setSalons([]);
      } finally {
        setSalonsLoading(false);
      }
    };
    loadSalons();
  }, []);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(CATEGORIES_URL);
        const json = await res.json();
        const list = Array.isArray(json?.data)
          ? json.data
          : (Array.isArray(json?.salon_categories) ? json.salon_categories : []);
        setCategories(list);
      } catch {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Load services for selected salon
  useEffect(() => {
    if (!formData.salon_id) return setServices([]);
    const loadServices = async () => {
      try {
        setServicesLoading(true);
        const res = await fetch(`${SALONS_URL}/${formData.salon_id}`);
        const json = await res.json();
        const salonData = json?.data || {};
        const formatted = (salonData.services || []).map(s => ({
          id: s.id,
          name: s.title_ar || s.title || s.name || 'خدمة غير محددة',
          price: `${s.price} ريال`,
          duration: `${s.service_time} دقيقة`
        }));
        setServices(formatted);
      } catch {
        setServices([]);
      } finally {
        setServicesLoading(false);
      }
    };
    loadServices();
  }, [formData.salon_id]);

  // Load doctors
  useEffect(() => {
    if (!formData.salon_id) return setDoctors([]);
    const loadDoctors = async () => {
      try {
        setDoctorsLoading(true);
        const res = await fetch(`${SALONS_URL}/${formData.salon_id}`);
        const json = await res.json();
        const salonData = json?.data || {};
        const catById = new Map((categories || []).map(c => [String(c.id), c]));
        const formatted = (salonData.staff || []).map((d, index) => {
          // Try multiple ways to resolve specialty - prioritize Arabic
          let specialty = 'طبيب عام';
          
          // 1) category_id numeric/string
          const possibleCategoryId = d.category_id ?? d.specialty_id ?? d.categoryId ?? d.salon_category_id ?? (d.category && d.category.id) ?? null;
          if (possibleCategoryId != null) {
            const cat = catById.get(String(possibleCategoryId));
            if (cat) {
              specialty = cat.title_ar || cat.title || cat.title_en || specialty;
            }
          }
          
          // 2) Direct specialty text from doctor
          if ((!specialty || specialty === 'طبيب عام') && d.specialty) {
            // If specialty exactly matches a category title, prefer category title_ar
            const catByTitle = (categories || []).find(c => 
              c.title_ar === d.specialty || c.title === d.specialty || c.title_en === d.specialty
            );
            if (catByTitle) {
              specialty = catByTitle.title_ar || catByTitle.title || catByTitle.title_en;
            } else {
              specialty = d.specialty;
            }
          }
          
          // 3) Embedded category object with title fields
          if ((!specialty || specialty === 'طبيب عام') && d.category && (d.category.title_ar || d.category.title || d.category.title_en)) {
            specialty = d.category.title_ar || d.category.title || d.category.title_en;
          }
          
          return {
            id: d.id,
            name: d.name,
            specialty: specialty || 'طبيب عام',
            available: d.available !== false
          };
        });
        setDoctors(formatted);
      } catch (error) {
        console.error('Error loading doctors:', error);
        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };
    loadDoctors();
  }, [formData.salon_id, categories]);

  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setAddressesLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(ADDRESSES_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        const list = Array.isArray(json?.data) ? json.data : [];
        setAddresses(list);
      } catch {
        setAddresses([]);
      } finally {
        setAddressesLoading(false);
      }
    };
    loadAddresses();
  }, []);

  // Load available times
  useEffect(() => {
    if (!formData.date || !formData.doctor || !formData.salon_id || !formData.service) return;
    const loadTimes = async () => {
      try {
        setTimesLoading(true);
        // Convert date to different formats for API compatibility
        const dateObj = new Date(formData.date);
        const dateFormatted = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
        const params = new URLSearchParams({
          staff_id: String(formData.doctor),
          date: dateFormatted,
          service_id: String(formData.service)
        });
        const url = `${AVAILABLE_TIMES_URL}/${formData.salon_id}?${params.toString()}`;
        console.log('Loading times with URL:', url);
        console.log('Form data:', { date: formData.date, doctor: formData.doctor, salon_id: formData.salon_id, service_id: formData.service });
        const res = await fetch(url);
        const json = await res.json();
        console.log('API Response:', json);
        setAvailableTimes(json?.data || {});
      } catch (error) {
        console.error('Error loading times:', error);
        setAvailableTimes({});
      } finally {
        setTimesLoading(false);
      }
    };
    loadTimes();
  }, [formData.date, formData.doctor, formData.salon_id, formData.service]);

  const timeSlots = useMemo(() => {
    if (!availableTimes || Object.keys(availableTimes).length === 0) return [];
    return Object.keys(availableTimes).map(t => {
      const [h, m] = t.split(':').map(Number);
      const hour = h > 12 ? h - 12 : h;
      const period = h < 12 ? 'ص' : 'م';
      return {
        value: t,
        display: `${hour}:${m.toString().padStart(2,'0')} ${period}`
      };
    });
  }, [availableTimes]);

  // Inline calendar state/helpers
  const [calendarRefDate, setCalendarRefDate] = useState(() => {
    const base = formData.date ? new Date(formData.date) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  // Simple and reliable calendar matrix generation with Friday-first week order
  const getMonthMatrix = useCallback((refDate) => {
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Map JavaScript getDay() to Friday-first week order: Friday=0, Thursday=1, Wednesday=2, etc.
    // JavaScript: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
    // Our order: Friday=0, Thursday=1, Wednesday=2, Tuesday=3, Monday=4, Sunday=5, Saturday=6
    const fridayFirstMapping = [5, 4, 3, 2, 1, 0, 6]; // Sunday=0->5, Monday=1->4, etc.
    const startDayOfWeek = fridayFirstMapping[firstDay.getDay()];
    const daysInMonth = lastDay.getDate();
    
    // Create calendar grid
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(year, month, day));
      
      // If we have 7 days in the current week, start a new week
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Add remaining empty cells to complete the last week
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push(null);
    }
    
    // Add the last week if it has any days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, []);

  const fmt = useCallback((d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`, []);

  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleNext = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);

  const handlePrevious = useCallback(() => {
    setStep(prev => prev - 1);
  }, []);


  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('يجب تسجيل الدخول أولاً');

      // Validate required fields
      const requiredFields = ['salon_id', 'doctor', 'service', 'address', 'date', 'time'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError('يرجى ملء جميع الحقول المطلوبة');
        setStep(5);
        return;
      }

      // لا تسمح بالتاريخ الأقدم من اليوم
      const today = new Date().toISOString().split('T')[0];
      if (formData.date < today) {
        setError('لا يمكن اختيار تاريخ قبل اليوم');
        setStep(5);
        return;
      }

      // Validate time slot is available
      const slotValid = Array.isArray(timeSlots) && timeSlots.some(t => String(t.value) === String(formData.time));
      if (!slotValid) {
        setError('الوقت المختار غير متاح. يرجى اختيار موعد آخر من المواعيد المتاحة.');
        setStep(5);
        return;
      }

      // تحقق من وجود حجز سابق بنفس التاريخ والوقت
      try {
        const bookingsRes = await fetch(USER_BOOKINGS_URL, {
          headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
        });
        if (bookingsRes.ok) {
          const bookingsJson = await bookingsRes.json();
          let bookingsList = [];
          if (Array.isArray(bookingsJson)) bookingsList = bookingsJson;
          else if (Array.isArray(bookingsJson?.data?.bookings?.data)) bookingsList = bookingsJson.data.bookings.data;
          else if (Array.isArray(bookingsJson?.data?.bookings)) bookingsList = bookingsJson.data.bookings;
          else if (Array.isArray(bookingsJson?.data)) bookingsList = bookingsJson.data;

          const timeDigits = String(formData.time).replace(/[^\d]/g, '');
          const hasConflict = bookingsList.some(b => {
            const bDate = b.date || b.booking_date || '';
            const bTimeDigits = String(b.time || b.booking_time || '').replace(/[^\d]/g, '');
            return String(bDate) === String(formData.date) && bTimeDigits === timeDigits;
          });

          if (hasConflict) {
            const [h, m] = [timeDigits.slice(0,2), timeDigits.slice(2)];
            const timeDisplay = `${h}:${m}`;
            setConflictModal({ date: formData.date, timeDisplay });
            setIsSubmitting(false);
            return;
          }
        }
      } catch (confErr) {
        console.warn('Failed to check conflicts:', confErr);
      }

      const formattedTime = formData.time.replace(/[^\d]/g, '');
      const bookingData = {
        salon_id: parseInt(formData.salon_id),
        staff_id: parseInt(formData.doctor),
        service_id: parseInt(formData.service),
        address_id: parseInt(formData.address),
        date: formData.date,
        time: formattedTime
      };
      
      console.log('📤 Sending booking data:', bookingData);

      const res = await fetch(BOOKING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await res.json();
      console.log('📋 Booking API Response:', result);
      
      if (res.ok && result.status === 'success') {
        const bookedSalonId = result.data?.salon_id;
        const bookedStaffId = result.data?.staff_id;
        
        console.log('✅ Booking successful:', {
          salon_id: bookedSalonId,
          staff_id: bookedStaffId,
          booking_id: result.data.id, // ✅ تخزين booking ID
          booking_data: result.data
        });
        
        // تخزين booking ID في localStorage للرجوع إليه لاحقاً
        if (result.data.id) {
          localStorage.setItem('lastBookingId', result.data.id);
          console.log('💾 Booking ID saved to localStorage:', result.data.id);
        }

        // استدعاء API للحصول على اسم الدكتور
        try {
          const doctorRes = await fetch(`${SALONS_URL}/${bookedSalonId}`);
          const doctorJson = await doctorRes.json();
          const staffList = Array.isArray(doctorJson?.data?.staff) ? doctorJson.data.staff : [];
          const doctor = staffList.find(d => String(d.id) === String(bookedStaffId));
          setDoctorName(doctor ? doctor.name : doctorJson?.data?.owner_name || 'غير معروف');
        } catch {
          setDoctorName('غير معروف');
        }

        setSuccess(true);
        setStep(6);
      } else {
        setError(result.message || 'فشل الحجز');
      }
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إرسال الحجز');
    } finally {
    setIsSubmitting(false);
    }
  }, [formData, timeSlots]);

  const handleAddressSelect = useCallback((id) => {
    setFormData(prev => ({ ...prev, address: id }));
  }, []);

  const handlePrevMonth = useCallback(() => {
    setCalendarRefDate(d => new Date(d.getFullYear(), d.getMonth()-1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCalendarRefDate(d => new Date(d.getFullYear(), d.getMonth()+1, 1));
  }, []);

  const handleDateSelect = useCallback((date) => {
    setFormData(prev => ({ ...prev, date: fmt(date) }));
  }, [fmt]);

  const handleTimeSelect = useCallback((time) => {
    setFormData(prev => ({ ...prev, time }));
    if (conflictModal) setConflictModal(null);
  }, [conflictModal]);

  return (
    <div className="new-booking-section">
      <h3><FontAwesomeIcon icon={faCalendarPlus} /> حجز موعد جديد</h3>
      
      {/* Error Display */}
      {error && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered mx-auto" style={{ maxWidth: window.innerWidth < 768 ? '90%' : '500px' }}>
            <div className="modal-content" style={{
              border: 'none',
              borderRadius: window.innerWidth < 768 ? '15px' : '20px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden'
            }}>
              <div className="modal-header" style={{
                backgroundColor: '#fff5f5',
                border: 'none',
                padding: window.innerWidth < 768 ? '1rem 1.5rem 0.5rem 1.5rem' : '1.5rem 2rem 1rem 2rem'
              }}>
                <div className="d-flex align-items-center w-100">
                  <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{
                    width: window.innerWidth < 768 ? '40px' : '50px',
                    height: window.innerWidth < 768 ? '40px' : '50px',
                    backgroundColor: '#fecaca'
                  }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#dc2626', fontSize: window.innerWidth < 768 ? '1.2rem' : '1.5rem' }} />
                  </div>
                  <div>
                    <h5 className="modal-title mb-0" style={{ color: 'var(--color-main)', fontSize: window.innerWidth < 768 ? '1rem' : '1.2rem', fontWeight: '600' }}>
                      تنبيه مهم
                    </h5>
                  </div>
                </div>
              </div>
              <div className="modal-body" style={{ padding: window.innerWidth < 768 ? '0.5rem 1.5rem 1rem 1.5rem' : '1rem 2rem 2rem 2rem' }}>
                <p className="mb-0" style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem', lineHeight: '1.6', color: '#374151' }}>
                  {error}
                </p>
              </div>
              <div className="modal-footer" style={{
                border: 'none',
                padding: window.innerWidth < 768 ? '0 1.5rem 1.5rem 1.5rem' : '0 2rem 2rem 2rem',
                justifyContent: 'center'
              }}>
          <button 
            type="button" 
                  className="btn rounded-pill px-4 py-2"
            onClick={() => setError(null)}
                  style={{
                    backgroundColor: 'var(--color-main)',
                    color: '#fff',
                    border: 'none',
                    fontSize: window.innerWidth < 768 ? '0.8rem' : '0.9rem',
                    fontWeight: '500',
                    minWidth: window.innerWidth < 768 ? '100px' : '120px',
                    padding: window.innerWidth < 768 ? '0.5rem 1rem' : '0.5rem 1.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.color = 'var(--color-main)';
                    e.target.style.borderColor = 'var(--color-main)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--color-main)';
                    e.target.style.color = '#fff';
                    e.target.style.borderColor = 'var(--color-main)';
                  }}
                >
                  فهمت
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conflict Modal */}
      {conflictModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">تعارض في الموعد</h5>
                <button type="button" className="btn-close" onClick={() => setConflictModal(null)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-2">لديك حجز سابق في نفس التاريخ والوقت:</p>
                <ul className="mb-0">
                  <li><strong>التاريخ:</strong> {conflictModal.date}</li>
                  <li><strong>الوقت:</strong> {conflictModal.timeDisplay}</li>
                </ul>
                <p className="mt-3 mb-0 text-danger">يرجى اختيار موعد مختلف لإكمال الحجز.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setConflictModal(null)}>حسناً</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Steps indicator */}
      <div className="mb-5">
        <div className="bg-gradient bg-opacity-5 rounded-4 p-3 p-md-4 border border-primary border-opacity-10">
          {/* Header */}
          <div className="text-center mb-3 mb-md-4">
            <h5 className="fw-bold text-dark mb-2 fs-6 fs-md-5">
              <FontAwesomeIcon icon={faCalendarPlus} className="text-primary me-2" />
              تقدم الحجز
            </h5>
            <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2 gap-sm-3">
              <span className="badge bg-primary bg-opacity-10 text-white px-3 py-2 rounded-pill small">
                الخطوة {step} من 6
              </span>
              <span className="text-muted small">
                {Math.round((step/6)*100)}% مكتمل
              </span>
            </div>
          </div>

          {/* Steps */}
          <div className="position-relative">
            {/* Progress Line - Hidden on mobile */}
            <div 
              className="position-absolute top-50 start-0 w-100 h-2 rounded-pill d-none d-md-block"
              style={{
                background: 'linear-gradient(90deg, #e9ecef 0%, #e9ecef 100%)',
                transform: 'translateY(-50%)',
                zIndex: 1
              }}
            />
            <div 
              className="position-absolute top-50 start-0 h-2 rounded-pill d-none d-md-block"
              style={{
                width: `${((step-1)/5)*100}%`,
                background: 'linear-gradient(90deg, var(--color-main) 0%, #007bff 100%)',
                transform: 'translateY(-50%)',
                zIndex: 2,
                transition: 'width 0.5s ease'
              }}
            />

            {/* Step Circles */}
            <div className="d-flex justify-content-between align-items-center position-relative" style={{ 
              zIndex: 3,
              gap: isMobile ? '0.5rem' : '0.25rem'
            }}>
              {[1,2,3,4,5,6].map(n => {
                const isActive = step === n;
                const isCompleted = step > n;
                const stepNames = [
                  'العيادة', 'الخدمة', 'الطبيب', 'العنوان', 'الموعد', 'التأكيد'
                ];
                const stepIcons = [
                  faStethoscope, faStethoscope, faUserMd, faMapMarkerAlt, faCalendarAlt, faCheckCircle
                ];
                
                return (
                  <div key={n} className="d-flex flex-column align-items-center">
                    {/* Step Circle */}
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm`}
                      style={{
                        width: isMobile ? '24px' : '55px',
                        height: isMobile ? '24px' : '55px',
                        background: isActive 
                          ? 'linear-gradient(135deg, var(--color-main) 0%, #007bff 100%)' 
                          : isCompleted 
                            ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                            : '#fff',
                        border: `2px solid ${isActive ? 'var(--color-main)' : isCompleted ? '#28a745' : '#e9ecef'}`,
                        color: isActive || isCompleted ? '#fff' : '#6c757d',
                        fontWeight: 600,
                        fontSize: window.innerWidth < 768 ? '12px' : '18px',
                        transition: 'all 0.3s ease',
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: '50%'
                      }}
                      title={stepNames[n-1]}
                    >
                      {isCompleted ? (
                        <FontAwesomeIcon 
                          icon={faCheckCircle} 
                          style={{ 
                            fontSize: isMobile ? '14px' : '32px',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                            transition: 'all 0.3s ease'
                          }} 
                        />
                      ) : (
                        <FontAwesomeIcon 
                          icon={stepIcons[n-1]} 
                          style={{ 
                            fontSize: isMobile ? '12px' : '30px',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                            transition: 'all 0.3s ease'
                          }} 
                        />
                      )}
                    </div>
                    
                    {/* Step Name - Hidden on small screens */}
                    <small 
                      className={`mt-2 text-center fw-medium d-none d-md-block ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted'}`}
                      style={{ 
                        fontSize: '12px', 
                        maxWidth: '70px',
                        lineHeight: '1.2'
                      }}
                    >
                      {stepNames[n-1]}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

        <form onSubmit={handleSubmit}>
        {/* Step 1: Salon */}
          {step === 1 && (
            <div className="step-content">
            <h5>اختر العيادة</h5>
            {salonsLoading ? <p>جاري التحميل...</p> :
            salons.length > 0 ? (
              <div className="row">
                {salons.map(s => {
                  const isSelected = String(formData.salon_id) === String(s.id);
                  return (
                    <div key={s.id} className="col-md-6 mb-3">
                      <div className={`card shadow-sm p-3 border-2 ${isSelected ? 'border-primary' : 'border-light'}`}>
                            <label htmlFor={`salon-${s.id}`} className="d-flex align-items-start justify-content-between w-100" style={{cursor:'pointer'}}>
                          <div className="d-flex align-items-start">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-3" style={{ color: 'var(--color-main)', backgroundColor: 'transparent !important', background: 'none !important', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.9rem' }} />
                            <div>
                              <div className="fw-semibold text-nowrap" style={{fontSize: window.innerWidth < 768 ? '0.6rem' : '0.8rem'}}>
                                {s.salon_name.split(' ').slice(0, 3).join(' ')}
                              </div>
                              {s.salon_address && <div className="text-muted small text-nowrap" style={{fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem'}}>
                                {window.innerWidth < 768 ? s.salon_address.split(' ').slice(0, 2).join(' ') : s.salon_address.length > 30 ? `${s.salon_address.substring(0, 30)}...` : s.salon_address}
                              </div>}
                  </div>
                </div>
                          <div className="form-check">
                        <input
                              id={`salon-${s.id}`}
                              className="form-check-input"
                          type="radio"
                          name="salon_id"
                              value={s.id}
                              checked={isSelected}
                          onChange={handleInputChange}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
                </div>
            ) : <p>لا توجد عيادات متاحة</p>}
            </div>
          )}

        {/* Step 2: Service */}
          {step === 2 && (
            <div className="step-content">
            <h5>اختر الخدمة</h5>
            {servicesLoading ? (
              <div className="card border-0 shadow-sm p-3 mb-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="spinner-border me-2" role="status" style={{ width: '2rem', height: '2rem', color: 'var(--color-main)' }}></div>
                  <strong style={{ color: 'var(--color-main)' }}>جاري تحميل الخدمات...</strong>
                </div>
                {[1,2,3,4].map(i => (
                  <div key={i} className="placeholder-glow mb-2">
                    <span className="placeholder col-5" style={{ display:'inline-block', height:'12px', backgroundColor:'rgba(3,130,151,0.15)', borderRadius:'6px' }}></span>
                    <span className="placeholder col-3 ms-2" style={{ display:'inline-block', height:'12px', backgroundColor:'rgba(3,130,151,0.1)', borderRadius:'6px' }}></span>
                    <span className="placeholder col-2 ms-2" style={{ display:'inline-block', height:'12px', backgroundColor:'rgba(3,130,151,0.08)', borderRadius:'6px' }}></span>
                  </div>
                ))}
              </div>
            ) :
            services.length > 0 ? (
              <div className="row g-3">
                {services.map(s => {
                  const isSelected = String(formData.service) === String(s.id);
                  return (
                    <div key={s.id} className="col-md-6">
                      <div className={`card shadow-sm p-3 border-2 ${isSelected ? 'border-primary' : 'border-light'}`}>
                        <label htmlFor={`service-${s.id}`} className="d-flex align-items-start justify-content-between w-100" style={{cursor:'pointer'}}>
                          <div className="d-flex align-items-start">
                            <FontAwesomeIcon icon={faStethoscope} className="me-3" style={{ color: 'var(--color-main)', backgroundColor: 'transparent !important', background: 'none !important' }} />
                            <div>
                              <div className="fw-semibold text-nowrap" style={{fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem'}}>{s.name}</div>
                              <div className="text-muted small text-nowrap" style={{fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem'}}>{s.price} • {s.duration}</div>
                  </div>
                </div>
                          <div className="form-check">
                      <input
                              className="form-check-input"
                        type="radio"
                              id={`service-${s.id}`}
                        name="service"
                              value={s.id}
                              checked={isSelected}
                        onChange={handleInputChange}
                            />
                        </div>
                      </label>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : <p>لا توجد خدمات</p>}
            </div>
          )}

        {/* Step 3: Doctor */}
          {step === 3 && (
            <div className="step-content">
            <h5>اختر الطبيب</h5>
            {doctorsLoading ? (
              <div className="card border-0 shadow-sm p-3 mb-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="spinner-border me-2" role="status" style={{ width: '2rem', height: '2rem', color: 'var(--color-main)' }}></div>
                  <strong style={{ color: 'var(--color-main)' }}>جاري تحميل الأطباء...</strong>
                </div>
                {[1,2,3,4].map(i => (
                  <div key={i} className="placeholder-glow mb-2">
                    <span className="placeholder col-4" style={{ display:'inline-block', height:'12px', backgroundColor:'rgba(3,130,151,0.15)', borderRadius:'6px' }}></span>
                    <span className="placeholder col-2 ms-2" style={{ display:'inline-block', height:'12px', backgroundColor:'rgba(3,130,151,0.1)', borderRadius:'6px' }}></span>
                    <span className="placeholder col-2 ms-2" style={{ display:'inline-block', height:'12px', backgroundColor:'rgba(3,130,151,0.08)', borderRadius:'6px' }}></span>
                  </div>
                ))}
              </div>
            ) :
            doctors.length > 0 ? (
              <div className="row g-3">
                {doctors.map(d => {
                  const isSelected = String(formData.doctor) === String(d.id);
                  return (
                    <div key={d.id} className="col-md-6">
                      <div className={`card shadow-sm p-3 border-2 ${isSelected ? 'border-primary' : 'border-light'} ${!d.available ? 'opacity-75' : ''}`}>
                        <label htmlFor={`doctor-${d.id}`} className="d-flex align-items-start justify-content-between w-100" style={{cursor:'pointer'}}>
                          <div className="d-flex align-items-start">
                            <FontAwesomeIcon icon={faUserMd} className="me-3" style={{ color: 'var(--color-main)', backgroundColor: 'transparent !important', background: 'none !important' }} />
                            <div>
                              <div className="fw-semibold text-nowrap" style={{fontSize: window.innerWidth < 768 ? '0.7rem' : '1rem'}}>{d.name}</div>
                              {!d.available && <small className="text-danger text-nowrap" style={{fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem'}}>غير متاح حالياً</small>}
                  </div>
                </div>
                          <div className="form-check">
                      <input
                              className="form-check-input"
                        type="radio"
                              id={`doctor-${d.id}`}
                        name="doctor"
                              value={d.id}
                              checked={isSelected}
                        onChange={handleInputChange}
                              disabled={!d.available}
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <p>لا يوجد أطباء</p>}
          </div>
        )}

        {/* Step 4: Address */}
        {step === 4 && (
          <div className="step-content">
            <h5>اختر العنوان</h5>
            {addressesLoading ? (
              <div className="card border-0 shadow-sm p-3 mb-3">
                <div className="d-flex align-items-center mb-3">
                  <div className="spinner-border me-2" role="status" style={{ width: '2rem', height: '2rem', color: 'var(--color-main)' }}></div>
                  <strong style={{ color: 'var(--color-main)' }}>جاري تحميل العناوين...</strong>
                </div>
                {[1,2].map(i => (
                  <div key={i} className="placeholder-glow mb-2">
                    <span className="placeholder col-7" style={{ display:'inline-block', height:'12px', backgroundColor:'rgba(3,130,151,0.15)', borderRadius:'6px' }}></span>
                    <span className="placeholder col-3 ms-2" style={{ display:'inline-block', height:'12px', backgroundColor:'rgba(3,130,151,0.1)', borderRadius:'6px' }}></span>
                  </div>
                ))}
              </div>
            ) : addresses.length > 0 ? (
              <div className="row g-3">
                {addresses.map(a => {
                  const isSelected = String(formData.address) === String(a.id);
                  return (
                    <div key={a.id} className="col-12">
                      <div className={`card shadow-sm p-3 border-2 ${isSelected ? 'border-primary' : 'border-light'}`}>
                        <label htmlFor={`address-${a.id}`} className="d-flex align-items-start justify-content-between w-100" style={{cursor:'pointer'}}>
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'var(--color-main)', backgroundColor: 'transparent !important', background: 'none !important', fontSize: window.innerWidth < 768 ? '0.7rem' : '0.9rem' }} />
                            <div>
                              <div className="fw-semibold text-nowrap" style={{fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem'}}>
                                {window.innerWidth < 768 ? a.address.split(' ').slice(0, 2).join(' ') : a.address.length > 30 ? `${a.address.substring(0, 30)}...` : a.address}
                              </div>
                            </div>
                          </div>
                          <div className="form-check">
                            <input
                              id={`address-${a.id}`}
                              className="form-check-input"
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleAddressSelect(e.target.checked ? a.id : '')}
                            />
                        </div>
                      </label>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-muted">لا توجد عناوين</p>
              )}
            </div>
          )}

        {/* Step 5: Date & Time */}
        {step === 5 && (
            <div className="step-content">
            <h5 className="mb-2" style={{
              fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem'
            }}>اختر التاريخ والوقت</h5>
            <div className="row g-4 align-items-stretch">
              <div className="col-lg-7 col-md-12">
                <div className="card shadow-sm p-3 h-100">
                  <div className="d-flex align-items-center justify-content-between" style={{
                    marginBottom: window.innerWidth < 768 ? '0.5rem' : '1rem'
                  }}>
                    <button type="button" className="btn btn-sm" style={{color:'var(--color-main)'}} onClick={handlePrevMonth}>‹</button>
                    <div className="fw-semibold text-nowrap" style={{
                      color:'var(--color-main)',
                      fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem'
                    }}>
                      {calendarRefDate.toLocaleString('ar', { month: 'long', year: 'numeric' })}
                    </div>
                    <button type="button" className="btn btn-sm" style={{color:'var(--color-main)'}} onClick={handleNextMonth}>›</button>
                </div>
                  <div className="table-responsive" style={{
                    fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                    width: '100%',
                    maxWidth: window.innerWidth < 768 ? '100%' : 'auto'
                  }}>
                    <table className="table table-borderless mb-0" style={{
                      userSelect:'none', 
                      width: '100%',
                      tableLayout: 'fixed'
                    }}>
                      <thead>
                        <tr className="text-muted">
                            {['Fr','Th','We','Tu','Mo','Su','Sa'].map((h, index) => (
                              <th key={h} className="text-center" style={{ 
                                fontSize: window.innerWidth < 768 ? '0.65rem' : '0.875rem',
                                color: '#555',
                                fontWeight: 600,
                                padding: window.innerWidth < 768 ? '0.4rem 0.1rem' : '0.5rem 0',
                                backgroundColor: 'rgba(3, 130, 151, 0.08)',
                                borderBottom: '2px solid rgba(3, 130, 151, 0.15)',
                                width: window.innerWidth < 768 ? '14.28%' : 'auto',
                                minWidth: window.innerWidth < 768 ? '40px' : 'auto'
                              }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getMonthMatrix(calendarRefDate).map((week, wi) => (
                          <tr key={wi}>
                            {week.map((day, di) => {
                              const isToday = day && fmt(day) === fmt(new Date());
                              const isSelected = day && formData.date && fmt(day) === formData.date;
                              const isPast = day && fmt(day) < new Date().toISOString().split('T')[0];
                              const isCurrentMonth = day && day.getMonth() === calendarRefDate.getMonth();
                              return (
                                <td key={di} className="text-center" style={{
                                  padding: window.innerWidth < 768 ? '0.15rem 0.05rem' : '0.5rem',
                                  width: window.innerWidth < 768 ? '14.28%' : 'auto',
                                  minWidth: window.innerWidth < 768 ? '40px' : 'auto'
                                }}>
                                  {day ? (
                                    <button
                                      type="button"
                                      className="btn rounded-circle"
                                      style={{ 
                                        color: isSelected ? '#fff' : (isCurrentMonth ? '#333' : '#999'), 
                                        width: window.innerWidth < 768 ? '1.3rem' : '2.5rem',
                                        height: window.innerWidth < 768 ? '1.3rem' : '2.5rem',
                                        fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem',
                                        fontWeight: isToday ? 700 : 600,
                                        backgroundColor: isSelected ? 'var(--color-main)' : (isToday ? 'rgba(3, 130, 151, 0.15)' : 'transparent'),
                                        border: isToday && !isSelected ? '2px solid var(--color-main)' : '1px solid transparent',
                                        padding: 0,
                                        lineHeight: 1,
                                        opacity: isPast ? 0.4 : 1,
                                        transition: 'all 0.2s ease',
                                        boxShadow: isSelected ? '0 2px 8px rgba(3, 130, 151, 0.3)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto'
                                      }}
                                      onClick={() => !isPast && handleDateSelect(day)}
                                      disabled={!!isPast}
                                      onMouseEnter={(e) => {
                                        if (!isPast && !isSelected) {
                                          e.target.style.backgroundColor = 'rgba(3, 130, 151, 0.1)';
                                          e.target.style.transform = 'scale(1.05)';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isPast && !isSelected) {
                                          e.target.style.backgroundColor = isToday ? 'rgba(3, 130, 151, 0.15)' : 'transparent';
                                          e.target.style.transform = 'scale(1)';
                                        }
                                      }}
                                    >
                                      {day.getDate()}
                                    </button>
                                  ) : (
                                    <span className="d-inline-block" style={{
                                      width: window.innerWidth < 768 ? '1.3rem' : '2.5rem', 
                                      height: window.innerWidth < 768 ? '1.3rem' : '2.5rem'
                                    }}></span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
                </div>
              </div>

              <div className="col-lg-5 col-md-12">
                <div className="card shadow-sm p-3 h-100">
                  <h6 className="mb-2 text-nowrap" style={{color:'var(--color-main)', fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem'}}>
                    <FontAwesomeIcon icon={faClock} className="me-2" style={{fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem'}} />
                    المواعيد المتاحة
                  </h6>
                  {timesLoading ? (
                    <p className="text-muted">جاري تحميل المواعيد...</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2 mt-1" style={{maxHeight:'320px', overflowY:'auto', marginRight: window.innerWidth < 768 ? '1rem' : '0'}}>
                      {timeSlots.length > 0 ? (
                        timeSlots.map(t => {
                          const isAvailable = availableTimes[t.value] && availableTimes[t.value] > 0;
                          return (
                          <button
                            key={t.value}
                            type="button"
                            className={`btn ${formData.time === t.value ? 'btn-primary' : isAvailable ? 'btn-outline-secondary' : 'btn-outline-secondary'}`}
                              style={{
                                ...(formData.time === t.value ? {} : isAvailable ? { color: 'var(--color-main)', borderColor:'var(--color-main)' } : { 
                                  color: '#999', 
                                  borderColor: '#ddd',
                                  backgroundColor: '#f8f9fa'
                                }),
                                opacity: isAvailable ? 1 : 0.4,
                                cursor: isAvailable ? 'pointer' : 'not-allowed',
                                fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem',
                                padding: window.innerWidth < 768 ? '0.25rem 0.5rem' : '0.375rem 0.75rem'
                              }}
                              onClick={() => isAvailable && handleTimeSelect(t.value)}
                              disabled={!isAvailable}
                          >
                            {t.display}
                          </button>
                          );
                        })
                      ) : (
                        <div className="text-center py-4">
                          <FontAwesomeIcon icon={faClock} className="text-muted mb-2" size="2x" />
                          <p className="text-muted mb-2 text-nowrap" style={{
                            fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem'
                          }}>لا توجد مواعيد متاحة</p>
                          <small className="text-muted text-nowrap" style={{
                            fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem'
                          }}>
                            {!formData.date ? 'يرجى اختيار تاريخ أولاً' : 
                             !formData.doctor ? 'يرجى اختيار طبيب أولاً' :
                             'لا توجد مواعيد متاحة في هذا التاريخ للطبيب المحدد'}
                          </small>
                        </div>
                      )}
            </div>
          )}
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Step 6: Confirmation */}
        {step === 6 && success && (
          <div className="step-content text-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-success" size="2x" />
            <h4>تم الحجز بنجاح!</h4>
            {doctorName && <p>مع {doctorName}</p>}
            
            {/* عرض Booking ID */}
            {localStorage.getItem('lastBookingId') && (
              <div className="mt-3 p-3 bg-primary bg-opacity-10 rounded">
                <p className="mb-1 fw-bold text-white">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  رقم الحجز: #{localStorage.getItem('lastBookingId')}
                </p>
              </div>
            )}
            
            </div>
          )}

        {/* Navigation */}
        {step < 6 && (
          <div className="mt-4 d-flex justify-content-between align-items-center" style={{ gap: '0.75rem' }}>
            {/* السابق على اليسار */}
            {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                className="btn rounded-pill"
                style={{
                  color: 'var(--color-main)',
                  borderColor: 'var(--color-main)',
                  background: '#fff',
                  borderWidth: '2px',
                  padding: window.innerWidth < 768 ? '0.3rem 0.6rem' : '0.75rem 1.5rem',
                  fontSize: window.innerWidth < 768 ? '0.7rem' : '1rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-main)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(3,130,151,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-main)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <FontAwesomeIcon icon={faArrowRight} className="ms-2" /> السابق
                </button>
            ) : (
              <span></span>
            )}
                
            {/* التالي على اليمين */}
            {step < 5 && (
                  <button
                    type="button"
                    onClick={handleNext}
                className="btn rounded-pill"
                style={{
                  background: 'var(--color-main)',
                  borderColor: 'var(--color-main)',
                  color: '#fff',
                  borderWidth: '2px',
                  padding: window.innerWidth < 768 ? '0.3rem 0.6rem' : '0.75rem 1.5rem',
                  fontSize: window.innerWidth < 768 ? '0.7rem' : '1rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-main)'; e.currentTarget.style.borderColor = 'var(--color-main)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(3,130,151,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-main)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--color-main)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                التالي <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  </button>
            )}

            {/* تأكيد الحجز على اليمين في الخطوة الأخيرة */}
            {step === 5 && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                className="btn rounded-pill"
                style={{
                  background: 'var(--color-main)',
                  borderColor: 'var(--color-main)',
                  color: '#fff',
                  borderWidth: '2px',
                  padding: window.innerWidth < 768 ? '0.3rem 0.6rem' : '0.75rem 1.5rem',
                  fontSize: window.innerWidth < 768 ? '0.7rem' : '1rem'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-main)'; e.currentTarget.style.borderColor = 'var(--color-main)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(3,130,151,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-main)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--color-main)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                تأكيد الحجز <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  </button>
                )}
            </div>
          )}
        </form>
    </div>
  );
};

export default NewBooking;