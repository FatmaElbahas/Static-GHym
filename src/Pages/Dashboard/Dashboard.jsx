import React, { useState } from 'react';
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
import Bookings from '../../Components/Dashboard/Bookings';
import Services from '../../Components/Dashboard/Services';
import NewBooking from '../../Components/Dashboard/NewBooking';
import DashboardHome from '../../Components/Dashboard/DashboardHome';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-link d-md-none me-3 text-white"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
              <h4 className="mb-0 text-white">لوحة التحكم</h4>
            </div>
            <div className="d-flex align-items-center gap-3">
              <a href="/" className="btn btn-outline-light btn-sm">
                <FontAwesomeIcon icon={faHome} className="me-2" />
                الرئيسية
              </a>
              <button className="btn btn-outline-light btn-sm">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-body">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
              <div className="sidebar-header">
                <button 
                  className="btn btn-link d-md-none"
                  onClick={() => setSidebarOpen(false)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <nav className="sidebar-nav">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} className="me-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
              <div className="dashboard-content">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
