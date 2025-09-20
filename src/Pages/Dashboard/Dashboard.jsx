import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faCalendarAlt, 
  faStethoscope, 
  faPlus,
  faBars,
  faTimes,
  faHome,
  faSignOutAlt,
  faChartLine,
  faUsers,
  faHospital
} from '@fortawesome/free-solid-svg-icons';
import Profile from '../../Components/Dashboard/Profile';
import Footer from '../../Components/Footer/Footer';
import Bookings from '../../Components/Dashboard/Bookings';
import Services from '../../Components/Dashboard/Services';
import NewBooking from '../../Components/Dashboard/NewBooking';
import DashboardHome from '../../Components/Dashboard/DashboardHome';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // التحقق من تسجيل الدخول
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (!user || !token) {
        // إذا لم يكن المستخدم مسجل دخول، إعادة توجيه إلى صفحة تسجيل الدخول
        navigate('/login');
        return;
      }
      
      setIsLoading(false);
      // تفعيل تبويب مفضل إذا تم ضبطه مسبقاً (مثل حجوزاتي بعد إنشاء حجز)
      const preferredTab = localStorage.getItem('dashboardActiveTab');
      if (preferredTab) {
        setActiveTab(preferredTab);
        localStorage.removeItem('dashboardActiveTab');
      }
    };

    checkAuth();
  }, [navigate]);

  // إذا كان يتم التحميل، عرض شاشة تحميل
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-3 text-muted">جاري التحقق من تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { id: 'home', label: 'الرئيسية', icon: faChartLine },
    { id: 'profile', label: 'البروفايل', icon: faUser },
    { id: 'bookings', label: 'حجوزاتي', icon: faCalendarAlt },
    { id: 'services', label: 'الخدمات', icon: faStethoscope },
    { id: 'new-booking', label: 'حجز جديد', icon: faPlus }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'profile':
        return <Profile />;
      case 'bookings':
        return <Bookings />;
      case 'services':
        return <Services />;
      case 'new-booking':
        return <NewBooking />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container-fluid px-1 px-md-4">
          <div className="d-flex justify-content-between align-items-center py-2">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-link d-md-none me-2 me-sm-3 text-white p-2"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{ fontSize: '18px' }}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <h4 className="mb-0 text-white d-none d-md-block fs-4">لوحة التحكم</h4>
              <h5 className="mb-0 text-white d-md-none fs-5">لوحة التحكم</h5>
            </div>
            <div className="d-flex align-items-center gap-2 gap-md-3">
              {/* Desktop Links */}
              <div className="d-none d-md-flex align-items-center gap-3">
                <a href="/" className="btn btn-outline-light btn-sm">
                  <FontAwesomeIcon icon={faHome} className="me-2" />
                  الرئيسية
                </a>
                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  تسجيل الخروج
                </button>
              </div>
              
              {/* Mobile Icons */}
              <div className="d-md-none d-flex align-items-center gap-2">
                <a 
                  href="/" 
                  className="btn btn-outline-light btn-sm p-2"
                  title="الرئيسية"
                  style={{ fontSize: '14px' }}
                >
                  <FontAwesomeIcon icon={faHome} />
                </a>
                <button 
                  className="btn btn-outline-light btn-sm p-2" 
                  onClick={handleLogout}
                  title="تسجيل الخروج"
                  style={{ fontSize: '14px' }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body" style={{ marginTop: '80px', marginBottom: '50px' }}>
        <div className="container-fluid px-1 px-md-4" style={{ maxWidth: '100%' }}>
          <div className="row g-0">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
              <div className="sidebar-header d-flex justify-content-between align-items-center p-4 d-md-none">
                <h6 className="mb-0 text-dark fw-bold">القائمة</h6>
                <button 
                  className="btn btn-link p-2"
                  onClick={() => setSidebarOpen(false)}
                  style={{ fontSize: '18px' }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <nav className="sidebar-nav p-4 p-md-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-item d-flex align-items-center w-100 text-end py-3 py-md-3 px-4 px-md-4 border-0 rounded-3 mb-2 transition-all ${
                      activeTab === item.id 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'bg-transparent text-dark hover-bg-light'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    style={{
                      fontSize: window.innerWidth < 768 ? '14px' : '16px',
                      fontWeight: activeTab === item.id ? '600' : '500',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className={`me-3 ${activeTab === item.id ? 'text-white' : 'text-primary'}`}
                      style={{ fontSize: window.innerWidth < 768 ? '16px' : '18px' }}
                    />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
              <div className="dashboard-content p-1 p-md-4">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
