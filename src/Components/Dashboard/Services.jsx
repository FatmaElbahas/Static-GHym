import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStethoscope, 
  faHeartbeat, 
  faTooth, 
  faEye, 
  faBrain,
  faCalendarPlus,
  faStar,
  faMapMarkerAlt,
  faClock,
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';

const Services = () => {
  const [services] = useState([
    {
      id: 1,
      name: 'استشارة طبية عامة',
      description: 'استشارة شاملة مع طبيب عام متخصص في التشخيص والعلاج',
      icon: faStethoscope,
      price: '150 ريال',
      duration: '30 دقيقة',
      location: 'مستشفى بلسمي - الرياض',
      rating: 4.8,
      available: true,
      category: 'الطب العام'
    },
    {
      id: 2,
      name: 'فحص القلب',
      description: 'فحص شامل للقلب والأوعية الدموية مع تخطيط القلب',
      icon: faHeartbeat,
      price: '300 ريال',
      duration: '45 دقيقة',
      location: 'عيادة القلب - جدة',
      rating: 4.9,
      available: true,
      category: 'أمراض القلب'
    },
    {
      id: 3,
      name: 'علاج الأسنان',
      description: 'علاج شامل للأسنان واللثة مع أحدث التقنيات',
      icon: faTooth,
      price: '200 ريال',
      duration: '60 دقيقة',
      location: 'عيادة الأسنان - الدمام',
      rating: 4.7,
      available: true,
      category: 'طب الأسنان'
    },
    {
      id: 4,
      name: 'فحص العيون',
      description: 'فحص شامل للعيون مع قياس النظر وفحص الشبكية',
      icon: faEye,
      price: '250 ريال',
      duration: '40 دقيقة',
      location: 'عيادة العيون - الرياض',
      rating: 4.6,
      available: false,
      category: 'طب العيون'
    },
    {
      id: 5,
      name: 'استشارة نفسية',
      description: 'استشارة نفسية متخصصة مع طبيب نفسي معتمد',
      icon: faBrain,
      price: '400 ريال',
      duration: '50 دقيقة',
      location: 'عيادة الصحة النفسية - جدة',
      rating: 4.9,
      available: true,
      category: 'الصحة النفسية'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['الكل', 'الطب العام', 'أمراض القلب', 'طب الأسنان', 'طب العيون', 'الصحة النفسية'];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'الكل' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="services-section">
      <div className="section-header">
        <h3 className="section-title">
          <FontAwesomeIcon icon={faStethoscope} className="me-2" />
          الخدمات المتاحة
        </h3>
      </div>

      {/* Filters */}
      <div className="services-filters mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="البحث في الخدمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-6 mb-3">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="services-content">
        <div className="row">
          {filteredServices.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4 mb-4">
              <div className={`service-card ${!service.available ? 'unavailable' : ''}`}>
                <div className="service-header">
                  <div className="service-icon">
                    <FontAwesomeIcon icon={service.icon} />
                  </div>
                  <div className="service-info">
                    <h5 className="service-name">{service.name}</h5>
                    <span className="service-category">{service.category}</span>
                  </div>
                  {!service.available && (
                    <span className="unavailable-badge">غير متاح</span>
                  )}
                </div>
                
                <div className="service-body">
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-details">
                    <div className="detail-row">
                      <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                      <span>{service.price}</span>
                    </div>
                    <div className="detail-row">
                      <FontAwesomeIcon icon={faClock} className="me-2" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="detail-row">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                      <span>{service.location}</span>
                    </div>
                    <div className="detail-row">
                      <FontAwesomeIcon icon={faStar} className="me-2" />
                      <span>{service.rating} ⭐</span>
                    </div>
                  </div>
                </div>
                
                <div className="service-footer">
                  {service.available ? (
                    <button className="btn btn-primary w-100">
                      <FontAwesomeIcon icon={faCalendarPlus} className="me-2" />
                      حجز الخدمة
                    </button>
                  ) : (
                    <button className="btn btn-secondary w-100" disabled>
                      غير متاح حالياً
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredServices.length === 0 && (
          <div className="text-center py-5">
            <FontAwesomeIcon icon={faStethoscope} size="3x" className="text-muted mb-3" />
            <h5 className="text-muted">لا توجد خدمات متطابقة مع البحث</h5>
            <p className="text-muted">جرب تغيير معايير البحث</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
