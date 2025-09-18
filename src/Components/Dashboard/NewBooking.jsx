import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import './NewBooking.css';

const NewBooking = () => {
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
          name: s.title_ar || s.title,
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
          // Try multiple ways to resolve specialty
          let specialty = 'طبيب عام';
          // 1) category_id numeric/string
          const possibleCategoryId = d.category_id ?? d.specialty_id ?? d.categoryId ?? d.salon_category_id ?? (d.category && d.category.id) ?? null;
          if (possibleCategoryId != null) {
            const cat = catById.get(String(possibleCategoryId));
            if (cat) specialty = cat.title_ar || cat.title || specialty;
          }
          // 2) Direct specialty text from doctor
          if ((!specialty || specialty === 'طبيب عام') && d.specialty) {
            // If specialty exactly matches a category title, prefer category title_ar
            const catByTitle = (categories || []).find(c => c.title_ar === d.specialty || c.title === d.specialty || c.title_en === d.specialty);
            specialty = catByTitle ? (catByTitle.title_ar || catByTitle.title) : d.specialty;
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
      } catch {
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
    if (!formData.date || !formData.doctor || !formData.salon_id) return;
    const loadTimes = async () => {
      try {
        setTimesLoading(true);
        const res = await fetch(`${AVAILABLE_TIMES_URL}/${formData.salon_id}?staff_id=${formData.doctor}&date=${formData.date}`);
        const json = await res.json();
        setAvailableTimes(json?.data || {});
      } catch {
        setAvailableTimes({});
      } finally {
        setTimesLoading(false);
      }
    };
    loadTimes();
  }, [formData.date, formData.doctor, formData.salon_id]);

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

  const getMonthMatrix = useCallback((refDate) => {
    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7; // make Monday=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    while (days.length % 7 !== 0) days.push(null);
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
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

      const formattedTime = formData.time.replace(/[^\d]/g, '');
      const bookingData = {
        salon_id: parseInt(formData.salon_id),
        staff_id: parseInt(formData.doctor),
        service_id: parseInt(formData.service),
        address_id: parseInt(formData.address),
        date: formData.date,
        time: formattedTime
      };

      const res = await fetch(BOOKING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      });

      const result = await res.json();
      if (res.ok && result.status === 'success') {
        const bookedSalonId = result.data?.salon_id;
        const bookedStaffId = result.data?.staff_id;

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
  }, []);

  return (
    <div className="new-booking-section">
      <h3><FontAwesomeIcon icon={faCalendarPlus} /> حجز موعد جديد</h3>
      
      {/* Error Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>خطأ:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Steps indicator */}
      <div className="mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <small className="text-muted">الخطوة {step} من 6</small>
          <div className="d-flex gap-2">
            {[1,2,3,4,5,6].map(n => {
              const isActive = step === n;
              return (
                <span
                  key={n}
                  className={`rounded-pill px-3 py-1 border`}
                  style={{
                    borderColor: isActive ? 'var(--color-main)' : '#e9ecef',
                    color: isActive ? '#fff' : '#6c757d',
                    background: isActive ? 'var(--color-main)' : '#f8f9fa',
                    fontWeight: 600
                  }}
                  title={
                    n === 1 ? 'اختيار العيادة' :
                    n === 2 ? 'اختيار الخدمة' :
                    n === 3 ? 'اختيار الطبيب' :
                    n === 4 ? 'اختيار العنوان' :
                    n === 5 ? 'اختيار التاريخ والوقت' :
                    'تأكيد الحجز'
                  }
                >
                  {n}
                </span>
              );
            })}
          </div>
        </div>
        <div className="progress rounded-pill" role="progressbar" aria-label="Progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={(step/6)*100} style={{height:'10px', background:'#eef2f4'}}>
          <div className="progress-bar" style={{ width: `${(step/6)*100}%`, background: 'var(--color-main)'}}></div>
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
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="me-3" style={{ color: 'var(--color-main)' }} />
                            <div>
                              <div className="fw-semibold">{s.salon_name}</div>
                              {s.salon_address && <div className="text-muted small">{s.salon_address}</div>}
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
                            <FontAwesomeIcon icon={faStethoscope} className="me-3" style={{ color: 'var(--color-main)' }} />
                            <div>
                              <div className="fw-semibold">{s.name}</div>
                              <div className="text-muted small">{s.price} • {s.duration}</div>
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
                            <FontAwesomeIcon icon={faUserMd} className="me-3" style={{ color: 'var(--color-main)' }} />
                            <div>
                              <div className="fw-semibold">{d.name}</div>
                              {!d.available && <small className="text-danger">غير متاح حالياً</small>}
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
                          <div className="d-flex align-items-start">
                            <span className="badge bg-primary me-3" style={{minWidth: '36px'}}>
                              <FontAwesomeIcon icon={faMapMarkerAlt} />
                            </span>
                            <div>
                              <div className="fw-semibold">{a.address}</div>
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
            <h5 className="mb-3">اختر التاريخ والوقت</h5>
            <div className="row g-4 align-items-stretch">
              <div className="col-lg-7 col-md-12">
                <div className="card shadow-sm p-3 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <button type="button" className="btn btn-sm" style={{color:'var(--color-main)'}} onClick={handlePrevMonth}>‹</button>
                    <div className="fw-semibold" style={{color:'var(--color-main)'}}>
                      {calendarRefDate.toLocaleString('ar', { month: 'long', year: 'numeric' })}
                    </div>
                    <button type="button" className="btn btn-sm" style={{color:'var(--color-main)'}} onClick={handleNextMonth}>›</button>
                </div>
                  <div className="table-responsive">
                    <table className="table table-borderless mb-0" style={{userSelect:'none'}}>
                      <thead>
                        <tr className="text-muted">
                          {['الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'].map(h => (
                            <th key={h} className="text-center small">{h}</th>
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
                              return (
                                <td key={di} className="text-center p-1">
                                  {day ? (
                                    <button
                                      type="button"
                                      className={`btn w-100 ${isSelected ? 'btn-primary' : 'btn-outline-light'}`}
                                      style={{ color: isSelected ? '#fff' : 'var(--color-main)', borderColor: 'var(--color-main)' }}
                                      onClick={() => !isPast && handleDateSelect(day)}
                                      disabled={!!isPast}
                                    >
                                      <span style={{fontWeight: isToday ? 700 : 500}}>{day.getDate()}</span>
                                    </button>
                                  ) : (
                                    <span className="d-inline-block" style={{width:'100%', height:'38px'}}></span>
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
                  <h6 className="mb-2" style={{color:'var(--color-main)'}}><FontAwesomeIcon icon={faClock} className="me-2" />المواعيد المتاحة</h6>
                  {timesLoading ? (
                    <p className="text-muted">جاري تحميل المواعيد...</p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2 mt-1" style={{maxHeight:'320px', overflowY:'auto'}}>
                      {timeSlots.length > 0 ? (
                        timeSlots.map(t => (
                          <button
                            key={t.value}
                            type="button"
                            className={`btn ${formData.time === t.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={formData.time === t.value ? {} : { color: 'var(--color-main)', borderColor:'var(--color-main)' }}
                            onClick={() => handleTimeSelect(t.value)}
                          >
                            {t.display}
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <FontAwesomeIcon icon={faClock} className="text-muted mb-2" size="2x" />
                          <p className="text-muted mb-2">لا توجد مواعيد متاحة</p>
                          <small className="text-muted">
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
                className="btn rounded-pill px-4 py-3"
                style={{
                  color: 'var(--color-main)',
                  borderColor: 'var(--color-main)',
                  background: '#fff',
                  borderWidth: '2px'
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
                className="btn rounded-pill px-4 py-3"
                style={{
                  background: 'var(--color-main)',
                  borderColor: 'var(--color-main)',
                  color: '#fff',
                  borderWidth: '2px'
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
                className="btn rounded-pill px-4 py-3"
                style={{
                  background: 'var(--color-main)',
                  borderColor: 'var(--color-main)',
                  color: '#fff',
                  borderWidth: '2px'
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