import React from 'react';
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
  faUser
} from '@fortawesome/free-solid-svg-icons';

const DashboardHome = () => {
  const stats = [
    {
      title: 'إجمالي الحجوزات',
      value: '24',
      icon: faCalendarAlt,
      color: 'primary',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'الحجوزات المؤكدة',
      value: '18',
      icon: faCheckCircle,
      color: 'success',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'الحجوزات المعلقة',
      value: '6',
      icon: faExclamationTriangle,
      color: 'warning',
      change: '-2%',
      changeType: 'negative'
    },
    {
      title: 'الخدمات المتاحة',
      value: '12',
      icon: faStethoscope,
      color: 'info',
      change: '+3%',
      changeType: 'positive'
    }
  ];

  const recentBookings = [
    {
      id: 1,
      service: 'استشارة طبية عامة',
      doctor: 'د. أحمد محمد',
      date: '2024-01-15',
      time: '10:00 ص',
      status: 'مؤكد',
      statusColor: 'success'
    },
    {
      id: 2,
      service: 'فحص القلب',
      doctor: 'د. فاطمة علي',
      date: '2024-01-20',
      time: '2:00 م',
      status: 'في الانتظار',
      statusColor: 'warning'
    },
    {
      id: 3,
      service: 'استشارة أسنان',
      doctor: 'د. خالد السعد',
      date: '2024-01-10',
      time: '11:30 ص',
      status: 'مكتمل',
      statusColor: 'info'
    }
  ];

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
      <div className="section-header">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faChartLine} className="me-2" />
          لوحة التحكم الرئيسية
        </h3>
        <p className="text-muted mb-0">مرحباً بك في لوحة التحكم</p>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-6 col-lg-3 mb-3">
            <div className={`stat-card stat-card-${stat.color}`}>
              <div className="stat-icon">
                <FontAwesomeIcon icon={stat.icon} />
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
                <span className={`stat-change ${stat.changeType}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        {/* Recent Bookings */}
        <div className="col-lg-8 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                الحجوزات الأخيرة
              </h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>الخدمة</th>
                      <th>الطبيب</th>
                      <th>التاريخ</th>
                      <th>الوقت</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.service}</td>
                        <td>{booking.doctor}</td>
                        <td>{booking.date}</td>
                        <td>{booking.time}</td>
                        <td>
                          <span className={`badge bg-${booking.statusColor}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="col-lg-4 mb-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <FontAwesomeIcon icon={faClock} className="me-2" />
                المواعيد القادمة
              </h5>
            </div>
            <div className="card-body">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="appointment-item">
                  <div className="appointment-date">
                    <span className="date">{appointment.date}</span>
                    <span className="time">{appointment.time}</span>
                  </div>
                  <div className="appointment-details">
                    <h6>{appointment.service}</h6>
                    <p className="text-muted mb-0">{appointment.doctor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card">
            <div className="card-header">
              <h5 className="card-title">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                الإجراءات السريعة
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button className="btn btn-primary w-100">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    حجز موعد جديد
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-primary w-100">
                    <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                    عرض جميع الحجوزات
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-primary w-100">
                    <FontAwesomeIcon icon={faStethoscope} className="me-2" />
                    استعراض الخدمات
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-primary w-100">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    تحديث البروفايل
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
