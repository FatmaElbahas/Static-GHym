import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons";

const logo1 = "https://cdn.salla.sa/axjgg/fniOf3POWAeIz8DXX8oPcxjNgjUHvLeqHDdhtDAK.png";

export default function Footer() {
  return (
    <footer className="py-5 mt-4 text-white" style={{ backgroundColor: '#1F2937' }}>
      <div className="container">
        {/* التصميم الجديد مثل الصورة */}
        <div className="row">
          {/* العمود الأول - MediCare Branding & Socials */}
          <div className="col-md-3 mb-4">
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="bg-white rounded p-2 me-4" style={{ width: '40px', height: '40px' }}>
                <img src={logo1} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <h3 className="fw-bold mb-0" style={{ fontSize: '2.2rem', color: 'var(--color-main)' }}>غيم</h3>
            </div>
            <p className="text-white-50 mb-3" style={{ fontSize: '1rem', lineHeight: '1.4' }}>
              نقدم خدمات رعاية صحية استثنائية بالرحمة والخبرة.
            </p>
            <div className="d-flex gap-3">
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <FontAwesomeIcon icon={faFacebookF} style={{ color: '#1976D2' }} />
              </div>
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <FontAwesomeIcon icon={faTwitter} style={{ color: '#1976D2' }} />
              </div>
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <FontAwesomeIcon icon={faInstagram} style={{ color: '#1976D2' }} />
              </div>
            </div>
          </div>

          {/* العمود الثاني - الروابط السريعة */}
          <div className="col-md-3 mb-4 align-items-center">
            <h5 className="fw-bold text-white mb-3" style={{ fontSize: '1.2rem' }}>الروابط السريعة</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: '1.1rem' }}>الرئيسية</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: '1.1rem' }}>الخدمات</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: '1.1rem' }}>الأطباء</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: '1.1rem' }}>من نحن</a></li>
            </ul>
          </div>

          {/* العمود الثالث - الخدمات */}
          <div className="col-md-3 mb-4 text-center">
            <h5 className="fw-bold text-white mb-3" style={{ fontSize: '1.2rem' }}>الخدمات</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: '1.1rem' }}>طب القلب</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: '1.1rem' }}>طب الأعصاب</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: '1.1rem' }}>طب الأطفال</a></li>
              <li className="mb-2"><a href="#" className="text-white-50 text-decoration-none" style={{ fontSize: '1.1rem' }}>المختبر</a></li>
            </ul>
          </div>

          {/* العمود الرابع - معلومات الاتصال */}
          <div className="col-md-3 mb-4 text-center">
            <h5 className="fw-bold text-white mb-3" style={{ fontSize: '1.2rem' }}>معلومات الاتصال</h5>
            <ul className="list-unstyled ">
              <li className="mb-2 text-white-50" style={{ fontSize: '1.1rem' }}>شارع الملك فهد، حي الملز</li>
              <li className="mb-2 text-white-50" style={{ fontSize: '1.1rem' }}>الرياض، المملكة العربية السعودية</li>
              <li className="mb-2 text-white-50" style={{ fontSize: '1.1rem' }}>+966 11 123 4567</li>
              <li className="mb-2 text-white-50" style={{ fontSize: '1.1rem' }}>info@blsmy-medical.com</li>
            </ul>
          </div>
        </div>

        {/* خط فاصل */}
        <hr className="border-secondary my-4" />

        {/* حقوق النشر */}
        <div className="text-center">
          <p className="text-white-50 mb-0" style={{ fontSize: '1rem' }}>© 2024 مركز غيم الطبي. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}