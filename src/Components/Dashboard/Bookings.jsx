import React, { useState, useEffect } from 'react';
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
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const BOOKINGS_URL = 'https://enqlygo.com/api/user/bookings';
  const SALONS_URL = 'https://enqlygo.com/api/salons';
  const SALON_DOCTORS_URL = 'https://enqlygo.com/api/salons/doctors';
  const CATEGORIES_URL = 'https://enqlygo.com/api/salons/categories';
  const ADDRESSES_URL = 'https://enqlygo.com/api/user/addresses';

  useEffect(() => {
    const controller = new AbortController();
    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userToken = localStorage.getItem('token');
        if (!userToken) throw new Error('Token is missing');

        const res = await fetch(BOOKINGS_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (errorData.message && errorData.message.includes('سجل الدخول ثم حاول مره اخري')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            throw new Error('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
        } else throw new Error(`HTTP ${res.status}`);
        }

        const json = await res.json();

        let bookingsData = [];
        if (Array.isArray(json)) bookingsData = json;
        else if (Array.isArray(json?.data)) bookingsData = json.data;
        else if (Array.isArray(json?.data?.data)) bookingsData = json.data.data;
        else if (Array.isArray(json?.data?.bookings)) bookingsData = json.data.bookings;
        else if (Array.isArray(json?.data?.bookings?.data)) bookingsData = json.data.bookings.data;

        const uniqueSalonIds = [...new Set(bookingsData.map(b => b.salon_id).filter(Boolean))];
        const uniqueStaffIds = [...new Set(bookingsData.map(b => b.staff_id).filter(v => v != null))];

        const addressesPromise = (async () => {
          try {
            const ar = await fetch(ADDRESSES_URL, {
              headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${userToken}` },
            });
            const aj = await ar.json();
            const list = aj?.data || [];
            return new Map(list.map(a => [a.id, a]));
          } catch {
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
            const sr = await fetch(`${SALONS_URL}/${sid}`, { headers: { 'Accept': 'application/json' } });
            const sj = await sr.json();
            return [sid, sj?.data || {}];
          } catch {
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

          // Resolve specialty safely using doctor object if available
          let specialtyTitle = '—';
          const doctorForSpecialty = (doctorFromSalon && typeof doctorFromSalon === 'object') ? doctorFromSalon : (doctor && typeof doctor === 'object' ? doctor : null);
          if (doctorForSpecialty) {
            specialtyTitle = (
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
            specialtyTitle = b.specialty || b.specialty_title || b.category_title || '—';
          }

          const addr = addressesMap.get(b.address_id) || {};
          const userAddress = addr.address || addr.title || `عنوان #${b.address_id || ''}`.trim();

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

        setBookings(augmented);

      } catch (e) {
        if (e.name !== 'AbortError') setError(e.message || 'حدث خطأ أثناء جلب الحجوزات');
      } finally {
        // لا تُخفي شاشة التحميل حتى تكتمل معالجة البيانات وتعيينها
        setIsLoading(false);
      }
    };

    loadBookings();
    return () => controller.abort();
  }, []);

  return (
    <div className="bookings-section container mt-5" style={{ position: 'relative' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="section-title m-0">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" /> حجوزاتي
        </h3>
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

      {/* Loading State */}
      {isLoading && (
        <div className="py-5">
          <div className="text-center mb-3">
            <div className="spinner-border" role="status" style={{ width: '3rem', height: '3rem', color: 'var(--color-main)' }}></div>
            <p className="text-muted mt-3">جاري تحميل الحجوزات...</p>
          </div>
          <div className="mt-4">
            {[1,2,3].map(i => (
              <div key={i} className="d-flex justify-content-between align-items-center border p-2 mb-2 rounded" style={{ opacity: 0.6 }}>
                <span style={{ width: '40%', height: '14px', background: '#eee' }}></span>
                <span style={{ width: '20%', height: '14px', background: '#eee' }}></span>
                <span style={{ width: '120px', height: '32px', background: '#f1f1f1', borderRadius: '6px' }}></span>
              </div>
            ))}
          </div>
        </div>
      )}

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
          {(isLoading || !Array.isArray(bookings)) && (
            <div className="d-flex align-items-center justify-content-center py-4">
              <div className="text-center p-4 rounded-3 shadow-sm" style={{ background:'#fff', minWidth:'280px' }}>
                <FontAwesomeIcon icon={faSpinner} spin size="3x" style={{ color:'var(--color-main)' }} />
                <div className="mt-3 fw-semibold" style={{ color:'var(--color-main)' }}>جاري تحميل الحجوزات...</div>
              </div>
            </div>
          )}
          {Array.isArray(bookings) && bookings.length > 0 ? (
            bookings.map(booking => (
              <div key={booking.id} className="d-flex justify-content-between align-items-center border p-2 mb-2 rounded">
                <span>{booking.salon_name} • {booking.service_display}</span>
                <span>{booking.date} {booking.time_display}</span>
                <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedBooking(booking)}>
                  <FontAwesomeIcon icon={faEye} className="me-1" /> عرض التفاصيل
                </button>
              </div>
            ))
          ) : (
            (Array.isArray(bookings) && bookings.length === 0 && !isLoading ? (
              <div className="text-muted">لا توجد حجوزات حالياً</div>
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