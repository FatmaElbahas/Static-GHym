import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowRight,
  faArrowLeft,
  faCalendarAlt, 
  faClock, 
  faMapMarkerAlt,
  faCheckCircle,
  faUserMd,
  faStar,
  faMoneyBillWave,
  faHospital
} from '@fortawesome/free-solid-svg-icons';

// Base path for images
const IMAGE_BASE_PATH = 'https://enqlygo.com/storage/app/public';

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [service, setService] = useState(null);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Details, 2: Select Doctor, 3: Select Date/Time, 4: Confirm
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState({});
  const [timesLoading, setTimesLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const AVAILABLE_TIMES_URL = 'https://enqlygo.com/api/salons/available_times';
  const BOOKING_URL = 'https://enqlygo.com/api/user/bookings';
  const ADDRESSES_URL = 'https://enqlygo.com/api/user/addresses';
  
  // All possible times (same as dashboard)
  const allPossibleTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30', '21:00', '21:30', '22:00'
  ];

  // Fetch service details
  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://enqlygo.com/api/salons/services`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          const foundService = result.data.find(s => s.id === Number(serviceId));
          
          if (foundService) {
            setService(foundService);
            
            // Fetch salon details
            const salonResponse = await fetch(`https://enqlygo.com/api/salons/${foundService.salon_id}`);
            const salonResult = await salonResponse.json();
            
            if (salonResult.status === 'success' && salonResult.data) {
              setSalon(salonResult.data);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching service details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(ADDRESSES_URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const json = await res.json();
        setAddresses(Array.isArray(json?.data) ? json.data : []);
      } catch {
        setAddresses([]);
      }
    };
    loadAddresses();
  }, []);

  // Load available times when doctor and date are selected
  useEffect(() => {
    if (!selectedDoctor || !selectedDate || !service) return;

    const loadAvailableTimes = async () => {
      try {
        setTimesLoading(true);
        // Format date as YYYY-MM-DD
        const dateFormatted = selectedDate;
        const params = new URLSearchParams({
          staff_id: String(selectedDoctor.id),
          date: dateFormatted,
          service_id: String(service.id)
        });
        
        // Same endpoint structure as dashboard
        const url = `${AVAILABLE_TIMES_URL}/${service.salon_id}?${params.toString()}`;
        console.log('=== Loading Available Times ===');
        console.log('URL:', url);
        
        const res = await fetch(url);
        const json = await res.json();
        
        console.log('API Response:', json);
        console.log('Available times object:', json?.data);
        
        // The API returns an object like { "08:00": 5, "09:00": 3, ... }
        // where the number is count of available slots
        setAvailableTimes(json?.data || {});
      } catch (error) {
        console.error('Error loading times:', error);
        setAvailableTimes({});
      } finally {
        setTimesLoading(false);
      }
    };

    loadAvailableTimes();
  }, [selectedDoctor, selectedDate, service]);

  // Handle booking submission
  const handleBooking = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('يجب تسجيل الدخول أولاً');
        navigate('/login');
        return;
      }
      
      // Format time: remove non-digits (08:00 -> 0800)
      const formattedTime = selectedTime.replace(/[^\d]/g, '');
      
      const bookingData = {
        salon_id: parseInt(service.salon_id),
        service_id: parseInt(service.id),
        staff_id: parseInt(selectedDoctor.id),
        address_id: parseInt(selectedAddress),
        date: selectedDate,
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
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        alert(result.message || 'حدث خطأ أثناء الحجز');
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert('حدث خطأ أثناء الحجز');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-5 text-center">
        <h3>الخدمة غير موجودة</h3>
        <button onClick={() => navigate('/products')} className="btn btn-primary mt-3">
          العودة للخدمات
        </button>
      </div>
    );
  }

  // Get service image
  let serviceImage = 'https://placehold.co/800x400/f8f9fa/0171BD?text=No+Image';
  if (salon?.owner_photo) {
    serviceImage = salon.owner_photo.startsWith('http') 
      ? salon.owner_photo 
      : `${IMAGE_BASE_PATH}/${salon.owner_photo}`;
  } else if (salon?.images && salon.images.length > 0) {
    const img = salon.images[0].image;
    serviceImage = img.startsWith('http') ? img : `${IMAGE_BASE_PATH}/${img}`;
  }

  return (
    <div className="service-details-page" style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '100px', paddingBottom: '40px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="btn btn-link text-decoration-none mb-3"
          style={{ color: '#0171BD', fontSize: '16px', padding: '0' }}
        >
          <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
          العودة للخدمات
        </button>

        {/* Success Message */}
        {success && (
          <div className="alert alert-success border-0 shadow-sm text-center mb-4" role="alert" style={{
            background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '32px', color: '#28a745' }} className="mb-2" />
            <h4 className="mb-2" style={{ color: '#155724' }}>تم الحجز بنجاح!</h4>
            <p className="mb-0" style={{ color: '#155724' }}>جاري التحويل إلى لوحة التحكم...</p>
          </div>
        )}

        {/* Service Header - Compact Design */}
        <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: '15px', overflow: 'hidden' }}>
          <div className="row g-0">
            <div className="col-md-4">
              <div style={{ position: 'relative', height: '100%', minHeight: '250px', padding: '15px' }}>
                <img 
                  src={serviceImage} 
                  alt={service.title_ar} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    minHeight: '220px',
                    borderRadius: '12px'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '25px',
                  left: '25px',
                  right: '25px'
                }}>
                  <span className="badge" style={{ 
                    backgroundColor: '#0171BD', 
                    fontSize: '11px', 
                    padding: '6px 12px',
                    borderRadius: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                  }}>
                    <FontAwesomeIcon icon={faHospital} className="ms-1" />
                    {salon?.salon_name}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card-body p-4">
                <h1 className="mb-3 text-end" style={{ 
                  color: '#484848', 
                  fontSize: '24px', 
                  fontWeight: '800',
                  lineHeight: '1.3'
                }}>
                  {service.title_ar}
                </h1>

                {service.about_ar && (
                  <div className="mb-3 p-2" style={{ 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '10px',
                    borderRight: '3px solid #0171BD'
                  }}>
                    <p className="mb-0 text-end" style={{ 
                      fontSize: '14px', 
                      lineHeight: '1.6',
                      color: '#6c757d'
                    }}>
                      {service.about_ar}
                    </p>
                  </div>
                )}

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <div className="text-center p-2" style={{ 
                      backgroundColor: '#E8F4FD', 
                      borderRadius: '10px'
                    }}>
                      <FontAwesomeIcon icon={faMoneyBillWave} style={{ fontSize: '20px', color: '#0171BD', marginBottom: '4px' }} />
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '2px' }}>السعر</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0171BD' }}>
                        {service.price} <span style={{ fontSize: '14px' }}>ر.س</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center p-2" style={{ 
                      backgroundColor: '#E8F4FD', 
                      borderRadius: '10px'
                    }}>
                      <FontAwesomeIcon icon={faClock} style={{ fontSize: '20px', color: '#0171BD', marginBottom: '4px' }} />
                      <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '2px' }}>المدة</div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0171BD' }}>
                        {service.service_time} <span style={{ fontSize: '14px' }}>دقيقة</span>
                      </div>
                    </div>
                  </div>
                </div>

                {step === 1 && (
                  <button 
                    className="btn w-100"
                    onClick={() => setStep(2)}
                    style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      padding: '12px',
                      backgroundColor: '#0171BD',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(1, 113, 189, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    احجز الآن
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Booking Steps */}
        {step > 1 && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
            <div className="card-body p-3">
              
              {/* Progress Indicator - Compact */}
              <div className="mb-3">
                <div className="d-flex justify-content-between text-center" style={{ position: 'relative' }}>
                  <div style={{ flex: 1, zIndex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: step >= 2 ? '#0171BD' : '#e9ecef',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}>
                      {step > 2 ? <FontAwesomeIcon icon={faCheckCircle} /> : '1'}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '6px', color: step >= 2 ? '#0171BD' : '#6c757d', fontWeight: step >= 2 ? 'bold' : 'normal' }}>
                      الطبيب
                    </div>
                  </div>
                  
                  <div style={{ flex: 1, zIndex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: step >= 3 ? '#0171BD' : '#e9ecef',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}>
                      {step > 3 ? <FontAwesomeIcon icon={faCheckCircle} /> : '2'}
                    </div>
                    <div style={{ fontSize: '12px', marginTop: '6px', color: step >= 3 ? '#0171BD' : '#6c757d', fontWeight: step >= 3 ? 'bold' : 'normal' }}>
                      التاريخ والوقت
                    </div>
                  </div>
                  
                  {/* Connecting Line */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '25%',
                    right: '25%',
                    height: '2px',
                    backgroundColor: '#e9ecef',
                    zIndex: 0
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: '#0171BD',
                      width: step >= 3 ? '100%' : '0%',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              </div>

              <hr className="my-3" />
              
              {/* Step 2: Select Doctor */}
              {step === 2 && (
                <>
                  <h4 className="mb-3 text-end" style={{ color: '#484848', fontWeight: 'bold', fontSize: '20px' }}>
                    <FontAwesomeIcon icon={faUserMd} className="ms-2" style={{ color: '#0171BD' }} />
                    اختر الطبيب
                  </h4>
                  <div className="row g-2 mb-3">
                    {salon?.staff?.map((doctor) => (
                      <div key={doctor.id} className="col-md-6">
                        <div 
                          className={`card h-100`}
                          style={{ 
                            cursor: 'pointer',
                            borderRadius: '10px',
                            border: selectedDoctor?.id === doctor.id ? '2px solid #0171BD' : '1px solid #e9ecef',
                            backgroundColor: selectedDoctor?.id === doctor.id ? '#E8F4FD' : 'white',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => setSelectedDoctor(doctor)}
                          onMouseEnter={(e) => {
                            if (selectedDoctor?.id !== doctor.id) {
                              e.currentTarget.style.transform = 'translateY(-3px)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedDoctor?.id !== doctor.id) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                            }
                          }}
                        >
                          <div className="card-body p-3 text-end">
                            <div className="d-flex justify-content-end align-items-center gap-2">
                              {selectedDoctor?.id === doctor.id && (
                                <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#0171BD', fontSize: '16px' }} />
                              )}
                              <h6 className="mb-0" style={{ fontWeight: 'bold', color: '#484848', fontSize: '16px' }}>{doctor.name}</h6>
                            </div>
                            <p className="text-muted mb-0 mt-1" style={{ fontSize: '13px' }}>
                              {doctor.specialty || 'طبيب عام'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="d-flex gap-2 mt-3">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setStep(1)}
                      style={{
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                      رجوع
                    </button>
                    <button 
                      className="btn flex-grow-1"
                      onClick={() => setStep(3)}
                      disabled={!selectedDoctor}
                      style={{
                        backgroundColor: selectedDoctor ? '#0171BD' : '#e9ecef',
                        color: selectedDoctor ? 'white' : '#6c757d',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}
                    >
                      التالي
                      <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Select Date and Time */}
              {step === 3 && (
                <>
                  <h4 className="mb-3 text-end" style={{ color: '#484848', fontWeight: 'bold', fontSize: '20px' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} className="ms-2" style={{ color: '#0171BD' }} />
                    التاريخ والوقت
                  </h4>
                  
                  {/* Selected Doctor Info - Compact */}
                  <div className="mb-3 p-2" style={{ 
                    backgroundColor: '#E8F4FD', 
                    borderRadius: '10px',
                    borderRight: '3px solid #0171BD'
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-end">
                        <div style={{ fontSize: '12px', color: '#6c757d' }}>الطبيب</div>
                        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#484848' }}>
                          {selectedDoctor?.name}
                        </div>
                      </div>
                      <FontAwesomeIcon icon={faUserMd} style={{ fontSize: '24px', color: '#0171BD' }} />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-end d-block mb-2" style={{ fontWeight: 'bold', fontSize: '14px', color: '#484848' }}>
                      <FontAwesomeIcon icon={faCalendarAlt} className="ms-1" style={{ color: '#0171BD', fontSize: '14px' }} />
                      التاريخ
                    </label>
                    <input 
                      type="date" 
                      className="form-control"
                      style={{
                        padding: '10px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                      }}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#0171BD';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(1, 113, 189, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e9ecef';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {selectedDate && (
                    <div className="mb-3">
                      <label className="form-label text-end d-block mb-2" style={{ fontWeight: 'bold', fontSize: '14px', color: '#484848' }}>
                        <FontAwesomeIcon icon={faClock} className="ms-1" style={{ color: '#0171BD', fontSize: '14px' }} />
                        الأوقات المتاحة
                      </label>
                      {timesLoading ? (
                        <div className="text-center py-3">
                          <div className="spinner-border spinner-border-sm" style={{ color: '#0171BD' }} role="status"></div>
                          <p className="mt-2 mb-0 text-muted" style={{ fontSize: '13px' }}>جاري التحميل...</p>
                        </div>
                      ) : (
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                          {allPossibleTimes.map((time, idx) => {
                            // Check if time exists in availableTimes object and has slots > 0
                            const isAvailable = availableTimes[time] && availableTimes[time] > 0;
                            const isSelected = selectedTime === time;
                            
                            return (
                              <button
                                key={idx}
                                className="btn"
                                onClick={() => isAvailable && setSelectedTime(time)}
                                disabled={!isAvailable}
                                style={{
                                  minWidth: '100px',
                                  padding: '8px 14px',
                                  fontSize: '14px',
                                  fontWeight: isAvailable ? 'bold' : 'normal',
                                  borderRadius: '8px',
                                  border: isSelected ? '2px solid #0171BD' : '1px solid #e9ecef',
                                  backgroundColor: isSelected ? '#0171BD' : isAvailable ? 'white' : '#f8f9fa',
                                  color: isSelected ? 'white' : isAvailable ? '#484848' : '#adb5bd',
                                  opacity: isAvailable ? 1 : 0.4,
                                  cursor: isAvailable ? 'pointer' : 'not-allowed',
                                  textDecoration: !isAvailable ? 'line-through' : 'none',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label text-end d-block mb-2" style={{ fontWeight: 'bold', fontSize: '14px', color: '#484848' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="ms-1" style={{ color: '#0171BD', fontSize: '14px' }} />
                      العنوان
                    </label>
                    <select 
                      className="form-select"
                      style={{
                        padding: '10px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                      }}
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#0171BD';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(1, 113, 189, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e9ecef';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">اختر العنوان</option>
                      {addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.address}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label text-end d-block mb-2" style={{ fontWeight: 'bold', fontSize: '14px', color: '#484848' }}>
                      ملاحظات (اختياري)
                    </label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      style={{
                        padding: '10px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef'
                      }}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أضف أي ملاحظات..."
                    ></textarea>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => setStep(2)}
                      style={{
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                      رجوع
                    </button>
                    <button 
                      className="btn flex-grow-1"
                      onClick={handleBooking}
                      disabled={!selectedDate || !selectedTime || !selectedAddress || isSubmitting}
                      style={{
                        backgroundColor: (!selectedDate || !selectedTime || !selectedAddress || isSubmitting) ? '#e9ecef' : '#28a745',
                        color: (!selectedDate || !selectedTime || !selectedAddress || isSubmitting) ? '#6c757d' : 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontWeight: 'bold',
                        fontSize: '16px'
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm ms-1" role="status"></span>
                          جاري الحجز...
                        </>
                      ) : (
                        <>
                          تأكيد الحجز
                          <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ServiceDetails;
