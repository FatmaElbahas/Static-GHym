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
  faInfoCircle,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import OTPVerification from '../OTPVerification/OTPVerification';

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
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [otpModal, setOtpModal] = useState({ isVisible: false, bookingId: null });

  const BOOKINGS_URL = 'https://enqlygo.com/api/user/bookings';
  const UPCOMING_BOOKINGS_URL = 'https://enqlygo.com/api/user/bookings/close';
  const SALONS_URL = 'https://enqlygo.com/api/salons';

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

        // جلب المواعيد القادمة المؤكدة
        await loadUpcomingBookings(token, salonsMap, staffByIdMap);

      } catch (error) {
        console.error('Error loading bookings data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookingsData();
  }, []);

  // دالة جلب المواعيد القادمة المؤكدة
  const loadUpcomingBookings = async (token, salonsMap, staffByIdMap) => {
    try {
      console.log('🔄 Loading upcoming bookings...');
      
      const response = await fetch(UPCOMING_BOOKINGS_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.log('⚠ Upcoming bookings API failed:', response.status);
        return;
      }

      const data = await response.json();
      console.log('📅 Upcoming bookings data:', data);

      // استخراج البيانات من الاستجابة
      let upcomingList = [];
      if (Array.isArray(data)) {
        upcomingList = data;
      } else if (Array.isArray(data?.data)) {
        upcomingList = data.data;
      } else if (Array.isArray(data?.data?.bookings)) {
        upcomingList = data.data.bookings;
      }

      // تصفية المواعيد المؤكدة فقط (status = 1) والمواعيد القادمة
      const today = new Date().toISOString().split('T')[0];
      const confirmedBookings = upcomingList.filter(booking => {
        const isConfirmed = booking.status === 1;
        const isUpcoming = booking.date >= today;
        return isConfirmed && isUpcoming;
      });
      console.log('✅ Confirmed upcoming bookings:', confirmedBookings);

      // معالجة البيانات مع أسماء الأطباء
      const upcomingBookingsData = confirmedBookings.map(booking => {
        const salon = salonsMap.get(booking.salon_id) || {};
        const staffList = Array.isArray(salon.staff) ? salon.staff : [];
        const doctorFromSalon = staffList.find(d => String(d.id) === String(booking.staff_id));
        const doctorFromAPI = staffByIdMap.get(String(booking.staff_id));

        // تحديد اسم الطبيب
        let doctorName = `د. طبيب #${booking.staff_id}`;
        
        if (doctorFromSalon && doctorFromSalon.name) {
          doctorName = doctorFromSalon.name;
        } else if (doctorFromAPI && typeof doctorFromAPI === 'object' && doctorFromAPI.name) {
          doctorName = doctorFromAPI.name;
        } else if (salon.owner_name) {
          doctorName = salon.owner_name;
        }

        return {
          id: booking.id,
          service: booking.services || 'خدمة غير محددة',
          doctor: doctorName,
          date: booking.date || 'غير محدد',
          time: booking.time ? `${booking.time.slice(0,2)}:${booking.time.slice(2)}` : 'غير محدد',
          status: 'مؤكد',
          statusColor: 'success'
        };
      });

      // ترتيب المواعيد حسب التاريخ (الأقرب أولاً)
      const sortedBookings = upcomingBookingsData.sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time);
        }
        return a.date.localeCompare(b.date);
      });

      setUpcomingBookings(sortedBookings);
      console.log('📅 Processed upcoming bookings:', sortedBookings);

    } catch (error) {
      console.error('❌ Error loading upcoming bookings:', error);
    }
  };

  // دالة فتح نافذة OTP
  const handleOTPVerification = (booking) => {
    const bookingId = booking.booking_id || booking.id;
    if (bookingId) {
      setOtpModal({ isVisible: true, bookingId });
    }
  };

  // دالة إغلاق نافذة OTP
  const handleOTPCancel = () => {
    setOtpModal({ isVisible: false, bookingId: null });
  };

  // دالة نجاح التحقق
  const handleOTPSuccess = (result) => {
    setOtpModal({ isVisible: false, bookingId: null });
    alert('تم التحقق من الحجز بنجاح!');
    // إعادة تحميل البيانات
    window.location.reload();
  };

  // دالة إعادة تحميل المواعيد القادمة
  const refreshUpcomingBookings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // جلب بيانات الصالونات والأطباء
      const salonsMap = new Map();
      const staffByIdMap = new Map();
      
      // جلب بيانات الصالونات
      const uniqueSalonIds = [...new Set(upcomingBookings.map(b => b.salon_id))];
      await Promise.all(uniqueSalonIds.map(async (sid) => {
        try {
          const sr = await fetch(`${SALONS_URL}/${sid}`, { 
            headers: { 'Accept': 'application/json' } 
          });
          if (sr.ok) {
            const sj = await sr.json();
            const salonData = sj?.data || {};
            salonsMap.set(sid, salonData);
            
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

      await loadUpcomingBookings(token, salonsMap, staffByIdMap);
    } catch (error) {
      console.error('Error refreshing upcoming bookings:', error);
    }
  };



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
                            <div className="d-flex align-items-center text-nowrap">
                              <FontAwesomeIcon 
                                icon={faStethoscope} 
                                className="text-primary me-1" 
                                style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '1rem' }}
                              />
                              <span className="fw-medium" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '1rem' }}>
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
                            <div className="d-flex align-items-center text-nowrap">
                              <FontAwesomeIcon 
                                icon={faCalendarAlt} 
                                className="text-primary me-1"
                                style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '1rem' }}
                              />
                              <span 
                                style={{ 
                                  fontSize: window.innerWidth < 768 ? '0.65rem' : '1rem',
                                  lineHeight: '1.2'
                                }}
                              >
                                {booking.date}
                              </span>
                            </div>
                            {window.innerWidth < 768 && (
                              <div className="d-flex align-items-center mt-1">
                                <FontAwesomeIcon 
                                  icon={faClock} 
                                  className="text-primary me-1" 
                                  style={{ fontSize: '0.6rem' }}
                                />
                                <span 
                                  className="text-nowrap"
                                  style={{ fontSize: '0.6rem' }}
                                >
                                  {booking.time}
                                </span>
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
                                  fontSize: window.innerWidth < 768 ? '0.6rem' : '0.8rem',
                                  padding: window.innerWidth < 768 ? '0.2rem 0.4rem' : '0.375rem 0.75rem'
                                }}
                                onClick={() => handleOTPVerification(booking)}
                              >
                                <FontAwesomeIcon icon={faShieldAlt} className="me-1" />
                                {window.innerWidth < 768 ? 'تحقق' : 'تحقق'}
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
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <FontAwesomeIcon icon={faClock} className="me-2 text-success" />
                  المواعيد المؤكدة القادمة
                </h5>
                <button 
                  className="btn btn-outline-success btn-sm"
                  onClick={refreshUpcomingBookings}
                  style={{ 
                    fontSize: window.innerWidth < 768 ? '0.6rem' : '0.75rem',
                    padding: window.innerWidth < 768 ? '0.2rem 0.4rem' : '0.375rem 0.75rem'
                  }}
                >
                  <FontAwesomeIcon icon={faSpinner} className="me-1" />
                  تحديث
                </button>
              </div>
            </div>
            <div className="card-body p-3">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" style={{ width: '2rem', height: '2rem' }}>
                    <span className="visually-hidden">جاري التحميل...</span>
                  </div>
                  <p className="mt-3 text-muted small">جاري تحميل المواعيد...</p>
                </div>
              ) : upcomingBookings.length > 0 ? (
                upcomingBookings.map((appointment, index) => (
                  <div key={appointment.id || index} className="appointment-item p-3 mb-3 bg-light rounded-3 border-start border-success border-3">
                    <div className="d-flex align-items-start">
                      <div className="me-3">
                        <FontAwesomeIcon icon={faCalendarAlt} className="text-success" />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-1 fw-semibold" style={{ fontSize: window.innerWidth < 768 ? '0.8rem' : '1rem' }}>
                            {appointment.service}
                          </h6>
                          <small className="text-muted" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>
                            {appointment.date}
                          </small>
                        </div>
                        <p className="text-muted mb-2 small" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>
                          <FontAwesomeIcon icon={faUserMd} className="me-1" />
                          {appointment.doctor}
                        </p>
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faClock} className="text-success me-1 small" />
                            <span className="text-success fw-medium small" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>
                              {appointment.time}
                            </span>
                          </div>
                          <span className="badge bg-success bg-opacity-10 text-success px-2 py-1" style={{ fontSize: window.innerWidth < 768 ? '0.6rem' : '0.75rem' }}>
                            مؤكد
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faClock} size="2x" className="text-muted mb-3 opacity-50" />
                  <h6 className="text-muted" style={{ fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem' }}>
                    لا توجد مواعيد قادمة
                  </h6>
                  <p className="text-muted small" style={{ fontSize: window.innerWidth < 768 ? '0.7rem' : '0.875rem' }}>
                    ستظهر مواعيدك المؤكدة القادمة هنا
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* OTP Verification Modal */}
      <OTPVerification
        bookingId={otpModal.bookingId}
        isVisible={otpModal.isVisible}
        onSuccess={handleOTPSuccess}
        onCancel={handleOTPCancel}
      />
    </div>
  );
};

export default DashboardHome;
