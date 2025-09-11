import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faMapMarkerAlt, 
  faUserMd, 
  faEye,
  faTimes,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

const Bookings = () => {
  const [bookings] = useState([
    {
      id: 1,
      service: 'استشارة طبية عامة',
      doctor: 'د. أحمد محمد',
      date: '2024-01-15',
      time: '10:00 ص',
      status: 'مؤكد',
      location: 'مستشفى بلسمي - الرياض',
      notes: 'موعد دوري للفحص العام'
    },
    {
      id: 2,
      service: 'فحص القلب',
      doctor: 'د. فاطمة علي',
      date: '2024-01-20',
      time: '2:00 م',
      status: 'في الانتظار',
      location: 'عيادة القلب - جدة',
      notes: 'فحص دوري للقلب'
    },
    {
      id: 3,
      service: 'استشارة أسنان',
      doctor: 'د. خالد السعد',
      date: '2024-01-10',
      time: '11:30 ص',
      status: 'مكتمل',
      location: 'عيادة الأسنان - الدمام',
      notes: 'تنظيف الأسنان والفحص'
    }
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'مؤكد':
        return 'success';
      case 'في الانتظار':
        return 'warning';
      case 'مكتمل':
        return 'info';
      case 'ملغي':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'مؤكد':
        return faCheckCircle;
      case 'في الانتظار':
        return faExclamationCircle;
      case 'مكتمل':
        return faCheckCircle;
      case 'ملغي':
        return faTimes;
      default:
        return faExclamationCircle;
    }
  };

  return (
    <div className="bookings-section">
      <div className="section-header">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
          حجوزاتي
        </h3>
      </div>

      <div className="bookings-content">
        <div className="row">
          {bookings.map((booking) => (
            <div key={booking.id} className="col-md-6 col-lg-4 mb-4">
              <div className="booking-card">
                <div className="booking-header">
                  <h5 className="booking-service">{booking.service}</h5>
                  <span className={`status-badge badge bg-${getStatusColor(booking.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(booking.status)} className="me-1" />
                    {booking.status}
                  </span>
                </div>
                
                <div className="booking-details">
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faUserMd} className="me-2" />
                    <span>{booking.doctor}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    <span>{booking.date}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faClock} className="me-2" />
                    <span>{booking.time}</span>
                  </div>
                  
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                    <span>{booking.location}</span>
                  </div>
                  
                  {booking.notes && (
                    <div className="detail-item">
                      <small className="text-muted">{booking.notes}</small>
                    </div>
                  )}
                </div>
                
                <div className="booking-actions">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <FontAwesomeIcon icon={faEye} className="me-1" />
                    عرض التفاصيل
                  </button>
                  
                  {booking.status === 'في الانتظار' && (
                    <button className="btn btn-outline-danger btn-sm ms-2">
                      <FontAwesomeIcon icon={faTimes} className="me-1" />
                      إلغاء الحجز
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                    <p>{selectedBooking.service}</p>
                  </div>
                  <div className="col-6">
                    <strong>الطبيب:</strong>
                    <p>{selectedBooking.doctor}</p>
                  </div>
                  <div className="col-6">
                    <strong>التاريخ:</strong>
                    <p>{selectedBooking.date}</p>
                  </div>
                  <div className="col-6">
                    <strong>الوقت:</strong>
                    <p>{selectedBooking.time}</p>
                  </div>
                  <div className="col-12">
                    <strong>الموقع:</strong>
                    <p>{selectedBooking.location}</p>
                  </div>
                  <div className="col-12">
                    <strong>ملاحظات:</strong>
                    <p>{selectedBooking.notes}</p>
                  </div>
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
