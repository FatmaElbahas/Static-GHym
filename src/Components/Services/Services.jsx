import React from 'react';

// Import service images
import bookReservations from '../../assets/images/bookReservations.svg';
import ratingsSystem from '../../assets/images/ratingsSystem.jpg';
import تسجيلDخولDاتي from '../../assets/images/تسجيل دخول داتي.png';
import الربطالبرمجي from '../../assets/images/الربط البرمجي.png';
import notifySystem from '../../assets/images/notifySystem.svg';
import eStore from '../../assets/images/e-store.png';
import موقعتعريفي from '../../assets/images/موقع تعريفي.png';
import promoCode from '../../assets/images/promoCode.svg';
import نطاقالحجوزات from '../../assets/images/نطاق الحجوزات.png';
import الوصوللعملاءاكتر from '../../assets/images/الوصول لعملاء اكتر.svg';
import تطبيقجوالالخاص from '../../assets/images/تطبيق جوال خاص.png';
import homeVisits from '../../assets/images/homeVisits.svg';
import استشاراتعنبعد from '../../assets/images/استشارات عن بعد.svg';
import دعمفنيمتقدم from '../../assets/images/دعم فني متقدم.png';
import نقاطالولاء from '../../assets/images/نقاط الولاء.png';
import جهازالخدمةالذاتية from '../../assets/images/جهاز الخدمه الداتيه.png';
import joinBlsmyApp from '../../assets/images/joinBlsmyApp.png';
import jobsSystem from '../../assets/images/jobsSystem.png';
import labResults from '../../assets/images/labResults.svg';
import medInsurance from '../../assets/images/medInsurance.svg';

const allFeatures = [
  // First row (ordered as requested): حجز، تقييم، خدمة ذاتية، جوال
  { image: bookReservations, title: 'حجز المواعيد', desc: 'نظام حجز مواعيد متطور لتسهيل إدارة مواعيد عملائك وتنظيمها بخطوات بسيطة ودقيقة' },
  { image: ratingsSystem, title: 'نظام التقييمات', desc: 'إمكانية تقييم الخدمة بعد كل حجز لمعرفة نقاط القوة والتحسينات' },
  { image: جهازالخدمةالذاتية, title: 'جهاز الخدمة الذاتية', desc: 'حلول خدمة ذاتية متقدمة لتسريع الإجراءات وتحسين تجربة العملاء' },
  { image: تطبيقجوالالخاص, title: 'تطبيق جوال خاص', desc: 'تطبيق جوال لإدارة وحجز المواعيد بسهولة' },

  // Rest - second row desired order (7 items)
  { image: تسجيلDخولDاتي, title: 'تسجيل الدخول الذاتي', desc: 'دخول ذاتي آمن وسريع لعملائك' },
  { image: الربطالبرمجي, title: 'الربط البرمجي', desc: 'تكامل مرن مع أنظمتك الحالية' },
  { image: eStore, title: 'السداد الإلكتروني', desc: 'مدفوعات إلكترونية آمنة وسلسة' },
  { image: notifySystem, title: 'نظام التذكيرات', desc: 'تذكيرات آلية عبر قنوات متعددة' },
  { image: موقعتعريفي, title: 'موقع تعريفي', desc: 'موقع احترافي لتعريف خدماتك' },
  { image: eStore, title: 'متجر الكتروني', desc: 'حل متجر إلكتروني لعرض وبيع المنتجات' },
  { image: promoCode, title: 'الأكواد الترويجية', desc: 'أكواد خصم وعروض مخصصة' },

  // Rest - third row desired order (7 items)
  { image: homeVisits, title: 'الزيارات المنزلية', desc: 'دعم زيارات منزلية آمنة' },
  { image: joinBlsmyApp, title: 'الانضمام لتطبيق غنيم', desc: 'انضم إلى تطبيق غنيم لزيادة وصولك' },
  { image: jobsSystem, title: 'نظام التوظيف', desc: 'إدارة عمليات التوظيف بكل سهولة' },
  { image: الوصوللعملاءاكتر, title: 'الوصول إلى عملاء أكثر', desc: 'نشر أوسع وجذب عملاء جدد' },
  { image: نطاقالحجوزات, title: 'نطاق الحجوزات', desc: 'إدارة الفروع والمواقع' },
  { image: labResults, title: 'نتائج المختبر و الوصفات و تقارير الأشعة', desc: 'إدارة نتائج التحاليل والتقارير الطبية' },
  { image: medInsurance, title: 'التأمين الطبي', desc: 'دعم التأمين الطبي للعملاء' },

  // Remaining
  { image: دعمفنيمتقدم, title: 'دعم فني 24/7', desc: 'دعم متواصل على مدار الساعة' },
  { image: نقاطالولاء, title: 'نقاط الولاء والمكافآت', desc: 'بناء ولاء مع عملائك عبر نقاط ومكافآت' },
  { image: استشاراتعنبعد, title: 'استشارات عن بعد', desc: 'تقديم الاستشارات الطبية عن بُعد بسهولة وأمان' }
];

const featured = allFeatures.slice(0, 4);
const rest = allFeatures.slice(4);

export default function Services() {
  return (
    <section className="services-section py-5">
      <div className="container">
        <div className="section-title-divider my-3">
          <hr />
          <span className="title-pill">خدمات غنيم</span>
        </div>
        <div className="services-container mx-auto">
          {/* الصف الأول: 4 عناصر باستخدام صف Bootstrap */}
          <div className="row g-4 justify-content-center mb-2">
            {featured.map((f, idx) => (
              <div key={`f-${idx}`} className="col-6 col-md-6 col-lg-3 col-xl-3">
                <div className="d-flex flex-column align-items-center text-center px-2">
                  <div className="mb-5" style={{ padding: 0 }}>
                    <img
                      src={f.image}
                      alt={f.title}
                      style={{ width: '79px', height: '79px', objectFit: 'contain' }}
                    />
                  </div>
                  <h5 className="mt-1 mb-2" style={{ fontSize: '20px', fontWeight: 600 }}>{f.title}</h5>
                  <p className="text-muted mt-1 mb-0" style={{ fontSize: '16px', fontWeight: 600 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* باقي العناصر كلها في شبكة واحدة مرنة */}
          <div className="services-grid-7 g-4">
            {rest.map((f, idx) => (
              <div key={`r-${idx}`} className="services-grid-item text-center">
                <div className="d-flex flex-column align-items-center text-center px-2">
                  <div className="mb-4" style={{ padding: 0 }}>
                    <img
                      src={f.image}
                      alt={f.title}
                      style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                    />
                  </div>
                  <p className="mt-1 mb-0" style={{ fontSize: '14px' }}>{f.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


