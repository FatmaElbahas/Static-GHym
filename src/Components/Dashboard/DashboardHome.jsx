import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faStethoscope, 
  faUserMd, 
  faClock,
  faChartLine,
  faUsers,
  faHospital,
  faCheckCircle,
  faExclamationTriangle,
  faPlus,
  faUser,
  faSpinner,
  faKey,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const DashboardHome = () => {
  const [stats, setStats] = useState([
    {
      title: 'إجمالي الحجوزات',
      value: '0',
      icon: faCalendarAlt,
      color: 'primary',
      change: '+0%',
      changeType: 'positive'
    },
    {
      title: 'الحجوزات المؤكدة',
      value: '0',
      icon: faCheckCircle,
      color: 'success',
      change: '+0%',
      changeType: 'positive'
    },
    {
      title: 'الحجوزات المعلقة',
      value: '0',
      icon: faExclamationTriangle,
      color: 'warning',
      change: '+0%',
      changeType: 'positive'
    },
    {
      title: 'الخدمات المتاحة',
      value: '0',
      icon: faStethoscope,
      color: 'info',
      change: '+0%',
      changeType: 'positive'
    }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [otpModal, setOtpModal] = useState(null);
  const [otpValue, setOtpValue] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  const BOOKINGS_URL = 'https://enqlygo.com/api/user/bookings';
  const SALONS_URL = 'https://enqlygo.com/api/salons';
  const COMPLETE_BOOKING_URL = 'https://enqlygo.com/api/user/bookings/complete';

  // جلب بيانات الحجوزات
  useEffect(() => {
    const loadBookingsData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.log('No token found');
          setIsLoading(false);
          return;
        }

        const response = await fetch(BOOKINGS_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        console.log('📊 Bookings data:', data);

        // استخراج البيانات من الاستجابة
        let bookingsList = [];
        let statsData = { count: 0, completed: 0, pending: 0, service_count: 0 };

        if (Array.isArray(data)) {
          bookingsList = data;
        } else if (Array.isArray(data?.data?.bookings)) {
          bookingsList = data.data.bookings;
          statsData = data.data.stats || statsData;
        } else if (Array.isArray(data?.data)) {
          bookingsList = data.data;
        }

        // تحديث الإحصائيات
        setStats([
          {
            title: 'إجمالي الحجوزات',
            value: statsData.count?.toString() || bookingsList.length.toString(),
            icon: faCalendarAlt,
            color: 'primary',
            change: '+0%',
            changeType: 'positive'
          },
          {
            title: 'الحجوزات المؤكدة',
            value: statsData.completed?.toString() || '0',
            icon: faCheckCircle,
            color: 'success',
            change: '+0%',
            changeType: 'positive'
          },
          {
            title: 'الحجوزات المعلقة',
            value: statsData.pending?.toString() || '0',
            icon: faExclamationTriangle,
            color: 'warning',
            change: '+0%',
            changeType: 'positive'
          },
          {
            title: 'الخدمات المتاحة',
            value: statsData.service_count?.toString() || '0',
            icon: faStethoscope,
            color: 'info',
            change: '+0%',
            changeType: 'positive'
          }
        ]);

        // جلب أسماء الأطباء للحجوزات الأخيرة
        const recentBookingsList = bookingsList.slice(0, 3);
        const uniqueSalonIds = [...new Set(recentBookingsList.map(b => b.salon_id))];
        const uniqueStaffIds = [...new Set(recentBookingsList.map(b => b.staff_id))];

        // جلب بيانات الصالونات (تحتوي على staff data)
        const salonsMap = new Map();
        const staffByIdMap = new Map();

        // جلب بيانات الصالونات
        await Promise.all(uniqueSalonIds.map(async (sid) => {
          try {
            const sr = await fetch(`${SALONS_URL}/${sid}`, { 
              headers: { 'Accept': 'application/json' } 
            });
            if (sr.ok) {
              const sj = await sr.json();
              const salonData = sj?.data || {};
              salonsMap.set(sid, salonData);
              
              // استخراج بيانات الأطباء من staff array
              if (Array.isArray(salonData.staff)) {
                salonData.staff.forEach(staff => {
                  if (staff.id && staff.name) {
                    staffByIdMap.set(String(staff.id), staff);
                  }
                });
              }
            }
          } catch (error) {
            console.log('Salon fetch error:', error.message);
          }
        }));

        // تحديث الحجوزات الأخيرة مع أسماء الأطباء
        const recentBookingsData = recentBookingsList.map(booking => {
          const salon = salonsMap.get(booking.salon_id) || {};
          const staffList = Array.isArray(salon.staff) ? salon.staff : [];
          const doctorFromSalon = staffList.find(d => String(d.id) === String(booking.staff_id));
          const doctorFromAPI = staffByIdMap.get(String(booking.staff_id));

          // تحديد اسم الطبيب من staff data
          let doctorName = `د. طبيب #${booking.staff_id}`;
          
          // الأولوية لـ staff من الصالون
          if (doctorFromSalon && doctorFromSalon.name) {
            doctorName = doctorFromSalon.name;
          } 
          // ثم من staffByIdMap (الذي تم ملؤه من staff array)
          else if (doctorFromAPI && typeof doctorFromAPI === 'object' && doctorFromAPI.name) {
            doctorName = doctorFromAPI.name;
          }
          // ثم اسم صاحب الصالون كبديل
          else if (salon.owner_name) {
            doctorName = salon.owner_name;
          }

          return {
            id: booking.id,
            service: booking.services || 'خدمة غير محددة',
            doctor: doctorName,
            date: booking.date || 'غير محدد',
            time: booking.time ? `${booking.time.slice(0,2)}:${booking.time.slice(2)}` : 'غير محدد',
            status: booking.status === 0 ? 'معلق' : booking.status === 1 ? 'مؤكد' : 'مكتمل',
            statusColor: booking.status === 0 ? 'warning' : booking.status === 1 ? 'success' : 'info'
          };
        });

        setRecentBookings(recentBookingsData);

      } catch (error) {
        console.error('Error loading bookings data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingsData();
  }, []);

  // وظيفة تأكيد الحجز
  const handleCompleteBooking = async () => {
    if (!otpModal || !otpValue.trim()) {
      alert('يرجى إدخال رمز التأكيد');
      return;
    }

    try {
      setIsCompleting(true);
      const token = localStorage.getItem('token');
      
      const requestBody = {
        booking_id: parseInt(otpModal.booking_id),
        otp: otpValue.trim()
      };
      
      console.log('Sending complete booking request:', requestBody);
      console.log('OTP Modal data:', otpModal);
      
      const response = await fetch(COMPLETE_BOOKING_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Complete booking response:', data);

      if (response.ok && (data.status === 'success' || data.success === true)) {
        alert('تم تأكيد الحجز بنجاح!');
        setOtpModal(null);
        setOtpValue('');
        // إعادة تحميل البيانات
        window.location.reload();
      } else {
        alert(data.message || 'حدث خطأ في تأكيد الحجز');
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      alert('حدث خطأ في تأكيد الحجز');
    } finally {
      setIsCompleting(false);
    }
  };


  const upcomingAppointments = [
    {
      service: 'فحص دوري',
      doctor: 'د. سارة أحمد',
      date: '2024-01-25',
      time: '9:00 ص'
    },
    {
      service: 'استشارة نفسية',
      doctor: 'د. محمد حسن',
      date: '2024-01-28',
      time: '3:00 م'
    }
  ];

  return (
    <div className="dashboard-home">
      <div className="section-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="section-title mb-2">
              <FontAwesomeIcon icon={faChartLine} className="me-2 text-primary" />
              لوحة التحكم الرئيسية
            </h2>
          </div>
        </div>
        
        {/* Last Update Info */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="bg-gradient bg-opacity-10 rounded-3 p-3 border border-primary border-opacity-25">
              <div className="d-flex align-items-center justify-content-center">
                <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
                <span className="text-muted small me-2">آخر تحديث:</span>
                <span className="fw-medium text-primary">
                  {new Date().toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'numeric', 
                    day: 'numeric',
                    calendar: 'islamic'
                  })} هـ
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row g-2 g-md-4 mb-4">
        {isLoading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">جاري التحميل...</span>
            </div>
            <p className="mt-3 text-muted fs-5">جاري تحميل البيانات...</p>
          </div>
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="col-6 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100 hover-lift">
                <div className="card-body p-2 p-md-4">
                  <div className="d-flex align-items-center">
                    <div className="me-2 me-md-3">
                      <FontAwesomeIcon 
                        icon={stat.icon} 
                        className="text-primary" 
                        style={{ fontSize: window.innerWidth < 768 ? '1.2rem' : '1.5rem' }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h3 className="stat-value mb-1 fw-bold" style={{ fontSize: window.innerWidth < 768 ? '1.1rem' : '1.5rem' }}>
                        {stat.value}
                      </h3>
                      <p className="stat-title mb-1 text-muted" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.9rem', lineHeight: '1.2' }}>
                        {stat.title}
                      </p>
                      <span className={`text-${stat.color} fw-medium`} style={{ fontSize: window.innerWidth < 768 ? '0.65rem' : '0.8rem' }}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="row">
        {/* Recent Bookings */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0 py-2 py-md-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0" style={{ fontSize: window.innerWidth < 768 ? '1rem' : '1.25rem' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-2 text-primary" />
                  الحجوزات الأخيرة
                </h5>
                <span className="text-primary fw-medium" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>
                  {recentBookings.length} حجز
                </span>
              </div>
            </div>
            <div className="card-body p-0">
              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                  </div>
                  <p className="mt-3 text-muted">جاري تحميل الحجوزات...</p>
                </div>
              ) : recentBookings.length > 0 ? (
                <div 
                  className="table-responsive"
                  style={{
                    maxHeight: window.innerWidth < 768 ? '400px' : 'none',
                    overflowY: window.innerWidth < 768 ? 'auto' : 'visible'
                  }}
                >
                  <table className="table table-hover mb-0">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th className="border-0 py-2 py-md-3" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>الخدمة</th>
                        <th className="border-0 py-2 py-md-3 d-none d-md-table-cell" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>الطبيب</th>
                        <th className="border-0 py-2 py-md-3" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>التاريخ</th>
                        <th className="border-0 py-2 py-md-3 d-none d-md-table-cell" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>الوقت</th>
                        <th className="border-0 py-2 py-md-3 d-none d-md-table-cell" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>الحالة</th>
                        <th className="border-0 py-2 py-md-3 text-center" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="align-middle">
                          <td className="py-2 py-md-3">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon 
                                icon={faStethoscope} 
                                className="text-primary me-2" 
                                style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}
                              />
                              <span className="fw-medium" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>
                                {booking.service}
                              </span>
                            </div>
                          </td>
                          <td className="py-2 py-md-3 d-none d-md-table-cell">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon icon={faUserMd} className="text-primary me-2" />
                              <span>{booking.doctor}</span>
                            </div>
                          </td>
                          <td className="py-2 py-md-3">
                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon 
                                icon={faCalendarAlt} 
                                className="text-primary me-2" 
                                style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}
                              />
                              <span style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>
                                {booking.date}
                              </span>
                            </div>
                            {window.innerWidth < 768 && (
                              <div className="d-flex align-items-center mt-1">
                                <FontAwesomeIcon 
                                  icon={faClock} 
                                  className="text-primary me-2" 
                                  style={{ fontSize: '0.7rem' }}
                                />
                                <span style={{ fontSize: '0.7rem' }}>{booking.time}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-2 py-md-3 d-none d-md-table-cell">
                            <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
                            {booking.time}
                          </td>
                          <td className="py-2 py-md-3 d-none d-md-table-cell">
                            <span className={`text-${booking.statusColor} fw-medium`} style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-2 py-md-3 text-center">
                            {booking.status === 'معلق' && (
                              <button 
                                className="btn btn-sm btn-success rounded-pill"
                                style={{ 
                                  fontSize: window.innerWidth < 768 ? '0.7rem' : '0.8rem',
                                  padding: window.innerWidth < 768 ? '0.25rem 0.5rem' : '0.375rem 0.75rem'
                                }}
                                onClick={() => {
                                  console.log('Booking data for OTP:', booking);
                                  setOtpModal({
                                    booking_id: booking.booking_id || booking.id,
                                    service: booking.service,
                                    doctor: booking.doctor,
                                    date: booking.date,
                                    time: booking.time
                                  });
                                }}
                              >
                                <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                                {window.innerWidth < 768 ? 'تأكيد' : 'تأكيد'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faCalendarAlt} size="3x" className="text-muted mb-3 opacity-50" />
                  <h6 className="text-muted">لا توجد حجوزات حالياً</h6>
                  <p className="text-muted small">ستظهر حجوزاتك هنا عند إنشائها</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 py-3">
              <h5 className="card-title mb-0">
                <FontAwesomeIcon icon={faClock} className="me-2 text-warning" />
                المواعيد القادمة
              </h5>
            </div>
            <div className="card-body p-3">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="appointment-item p-3 mb-3 bg-light rounded-3 border-start border-warning border-3">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-warning" />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1 fw-semibold">{appointment.service}</h6>
                          <small className="text-muted">{appointment.date}</small>
                        </div>
                        <p className="text-muted mb-2 small">
                          <FontAwesomeIcon icon={faUserMd} className="me-1" />
                          {appointment.doctor}
                        </p>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon icon={faClock} className="text-warning me-1 small" />
                          <span className="text-warning fw-medium small">{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faClock} size="2x" className="text-muted mb-3 opacity-50" />
                  <h6 className="text-muted">لا توجد مواعيد قادمة</h6>
                  <p className="text-muted small">ستظهر مواعيدك القادمة هنا</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* OTP Modal */}
      {otpModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-primary text-white border-0">
                <h5 className="modal-title">
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                  تأكيد الحجز
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setOtpModal(null);
                    setOtpValue('');
                  }}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <h6 className="text-primary mb-3">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    تفاصيل الحجز
                  </h6>
                  <div className="bg-light rounded-3 p-3">
                    <div className="row g-2">
                      <div className="col-6">
                        <small className="text-muted">الخدمة</small>
                        <div className="fw-semibold">{otpModal.service}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">الطبيب</small>
                        <div className="fw-semibold">{otpModal.doctor}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">التاريخ</small>
                        <div className="fw-semibold">{otpModal.date}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">الوقت</small>
                        <div className="fw-semibold">{otpModal.time}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="otpInput" className="form-label fw-semibold">
                    <FontAwesomeIcon icon={faKey} className="me-2 text-warning" />
                    رمز التأكيد (OTP)
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg text-center"
                    id="otpInput"
                    placeholder="000000"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    maxLength="6"
                    style={{ letterSpacing: '0.5em', fontSize: '1.2rem' }}
                  />
                  <div className="form-text text-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
                    أدخل الرمز المكون من 6 أرقام
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary px-4" 
                  onClick={() => {
                    setOtpModal(null);
                    setOtpValue('');
                  }}
                  disabled={isCompleting}
                >
                  إلغاء
                </button>
                <button 
                  type="button" 
                  className="btn btn-success px-4" 
                  onClick={handleCompleteBooking}
                  disabled={isCompleting || !otpValue.trim()}
                >
                  {isCompleting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                      جاري التأكيد...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                      تأكيد الحجز
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
