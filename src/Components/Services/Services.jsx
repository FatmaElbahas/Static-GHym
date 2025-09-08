import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faStar, faIdCard, faLink, faBell, faCreditCard, faGlobe, faTags, faMapMarkedAlt, faUserShield, faMobileAlt, faHome, faHeart, faAward } from '@fortawesome/free-solid-svg-icons';

const features = [
  { icon: faCalendarAlt, title: 'حجز المواعيد', desc: 'نظام حجز مواعيد متطور لتسهيل إدارة مواعيد عملائك وتنظيمها بخطوات بسيطة ودقيقة' },
  { icon: faStar, title: 'نظام التقييمات', desc: 'إمكانية تقييم الخدمة بعد كل حجز لمعرفة نقاط القوة والتحسينات' },
  { icon: faIdCard, title: 'تسجيل الدخول الذاتي', desc: 'دخول ذاتي آمن وسريع لعملائك' },
  { icon: faLink, title: 'الربط البرمجي', desc: 'تكامل مرن مع أنظمتك الحالية' },
  { icon: faBell, title: 'نظام التذكيرات', desc: 'تذكيرات آلية عبر قنوات متعددة' },
  { icon: faCreditCard, title: 'السداد الإلكتروني', desc: 'مدفوعات إلكترونية آمنة وسلسة' },
  { icon: faGlobe, title: 'موقع تعريفي', desc: 'موقع احترافي لتعريف خدماتك' },
  { icon: faTags, title: 'الأكواد الترويجية', desc: 'أكواد خصم وعروض مخصصة' },
  { icon: faMapMarkedAlt, title: 'نطاق الحجوزات', desc: 'إدارة الفروع والمواقع' },
  { icon: faUserShield, title: 'الوصول إلى عملاء أكثر', desc: 'نشر أوسع وجذب عملاء جدد' },
  { icon: faMobileAlt, title: 'تطبيق جوال خاص', desc: 'تطبيق جوال لإدارة وحجز المواعيد بسهولة' },
  { icon: faHome, title: 'الزيارات المنزلية', desc: 'دعم زيارات منزلية آمنة' },
  { icon: faHeart, title: 'دعم فني 24/7', desc: 'دعم متواصل على مدار الساعة' },
  { icon: faAward, title: 'نقاط الولاء والمكافآت', desc: 'بناء ولاء مع عملائك عبر نقاط ومكافآت' }
];

export default function Services() {
  return (
    <section className="services-section py-5">
      <div className="container">
        <div className="section-title-divider my-3">
          <hr />
          <span className="title-pill">خدمات بلسمي</span>
        </div>
        <div className="services-container mx-auto">
          <div className="row g-4 justify-content-center">
            {features.map((f, idx) => (
              <div key={idx} className="col-6 col-md-4 col-lg-3 col-xl-2">
                <div className="d-flex flex-column align-items-center text-center px-2">
                  <div className="service-icon mb-3">
                    <FontAwesomeIcon icon={f.icon} className="text-center" style={{ color: '#008a91', fontSize: '1.9rem' }} />
                  </div>
                  <h5 className="fw-bold fs-6 mb-1">{f.title}</h5>
                  <p className="text-muted small mb-0">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


